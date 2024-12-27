import { AxiosRequestConfig } from 'axios';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Chip } from 'primereact/chip';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import { JSX, ReactNode, useEffect, useState } from 'react';
import { useDags } from 'src/api/local/airflow/hooks';
import DagRunEye from 'src/components/dag/DagRunEye';
import DagRunList from 'src/components/dag/DagRunList';
import RunDagButton from 'src/components/dag/RunDagButton';
import { CARD_GAP } from 'src/components/layout/constants';
import PageFrame from 'src/components/layout/PageFrame';
import TaskInstanceView from 'src/components/task/TaskInstanceView';
import { useDagRunsContext } from 'src/contexts/useDagsRuns';
import { useDebounceEffect } from 'src/hooks/useDebounceEffect';
import prisma from 'src/lib/prisma';
import { PATH } from 'src/routes';
import { AirflowDagsResponse, Dag } from 'src/types/airflow';
import { ConnectionData } from 'src/types/db';
import ConnectionSelector from '../../../components/ConnectionSelector';
import DagRunStat from 'src/components/dag/DagRunStat';

interface DagsServerProps {
  connection: ConnectionData
  connections: ConnectionData[]
  dags: AirflowDagsResponse;
  // dag_runs: AirflowDagRunsResponse
  runConfig: AxiosRequestConfig
}
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { connectionId } = params as { connectionId: string };

  const connections = await prisma.connection.findMany({
    where: {
      is_active: true,
    },
  });
  const connection = connections?.find(rec => rec.connection_id == connectionId)
  if (!connection || !connection.api_url || !connection.header) {
    return { notFound: true };
  }


  return {
    props: {
      connections,

    },
  };
};

export default function DagsPage({ connections }: DagsServerProps) {
  const router = useRouter();
  const { query } = router;
  const { connection, dagRuns, taskInstanceData, runStat } = useDagRunsContext()

  const [onlyActive, setOnlyActive] = useState<boolean>(query.only_active === 'true'); // Initialize from query
  // Pagination variables
  const [limit, setLimit] = useState(parseInt((query.limit as string) || '10', 10));
  const offset = parseInt((query.offset as string) || '0', 10);
  const tags = query?.tags || null
  const search = query?.search || null

  const dags = useDags(
    {
      params: {
        limit,
        offset,
        tags: tags || null,
        // only_active: (only_active == 'true') ? 'true' : null,
        dag_id_pattern: search || null
      }
    },
    connection?.connection_id as string,
  )
  const [dagsData, setDagsData] = useState<AirflowDagsResponse>()
  useEffect(() => {
    if (dags.isFetched) {
      setDagsData(dags?.data)
    }
  }, [dags?.isFetching])

  const isLoading = dags?.isLoading || dags?.isFetching

  const rowsPerPageOptions = [5, 10, 25, 50];
  const totalPages = Math.ceil((dagsData?.total_entries as number) / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const generatePageButtons = () => {
    const pageButtons: JSX.Element[] = [];
    const siblingCount = 1; // Number of pages around the current page
    const startPages = [1, 2, 3];
    const endPages = [totalPages - 2, totalPages - 1, totalPages];
    const surroundingPages = [
      currentPage - siblingCount,
      currentPage,
      currentPage + siblingCount,
    ].filter((page) => (page > 0) && (page <= totalPages));

    const uniquePages = Array.from(new Set([...startPages, ...surroundingPages, ...endPages])).sort(
      (a, b) => a - b
    ).filter((page) => (page > 0) && (page <= totalPages));
    let lastPage = 0;
    uniquePages.forEach((page) => {
      if (page - lastPage > 1) {
        pageButtons.push(
          <span key={`ellipsis-${lastPage}`} style={{ padding: '0 5px' }}>
            ...
          </span>
        );
      }
      pageButtons.push(
        <Button
          key={page}
          onClick={() => handlePageChange(page)}
          label={`${page}`}
          className={page === currentPage ? 'p-button-outlined p-button-secondary' : ''}
        />
      );

      lastPage = page;
    });
    return pageButtons;
  };
  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * limit;
    updateQueryParams(newOffset, limit, selectedTags, onlyActive);
  };
  const handleRowsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    updateQueryParams(0, newLimit, selectedTags, onlyActive); // Reset to first page when rows per page change
  };
  const updateQueryParams = (newOffset: number, newLimit: number, tags: string[], onlyActive: boolean) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...query,
        offset: newOffset,
        limit: newLimit,
        tags: tags.length > 0 ? tags.join(',') : undefined,
        only_active: onlyActive ? 'true' : undefined, // Include only_active only if true
        search: searchTerm || ''
      },
    });
  };



  const [selectedTags, setSelectedTags] = useState<string[]>(
    query.tags ? (query.tags as string).split(',') : []
  );
  const handleTagClick = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    updateQueryParams(0, limit, newTags, onlyActive); // Update query when tags change
  };
  const handleOnlyActiveChange = () => {
    setOnlyActive((prev) => {
      const newValue = !prev;
      updateQueryParams(0, limit, selectedTags, newValue); // Update query when checkbox changes
      return newValue;
    });
  };



  const mainBodyTemplate = (rowData: Dag) => {
    return (
      <div className="card flex flex-column gap-2" style={{ gap: 10 }}>
        {isLoading ? (
          <Skeleton width="100%" style={{ margin: '0.5rem' }} />
        ) : (
          <>
            <i className={rowData?.is_paused ? `pi pi-pause-circle` : `pi pi-circle-fill`} style={{ fontSize: '1rem', marginRight: '0.5rem', color: rowData?.is_paused ? 'gray' : 'var(--primary-color)' }}></i>
            {/* <span
              onClick={() => handleViewDag(rowData.dag_id)}
            > */}
            <Link
              href={PATH.mainDagId(connection?.connection_id as string, rowData.dag_id)}
              style={{ textDecoration: 'none' }}
            >
              {rowData.dag_id}
            </Link>

            {/* </span> */}
            {rowData?.schedule_interval && (
              <Chip label={rowData?.schedule_interval?.value} title={rowData?.timetable_description} style={{ height: '1.2rem', marginLeft: '0.5rem' }} />
            )}
          </>
        )}
        <div style={{ display: 'flex', gap: 2 }}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
              <div key={`sk-${index}`} style={{ marginTop: 5, marginBottom: '0.2rem', marginRight: '0.5rem' }}>
                <Skeleton key={index} width="4rem" height="1.5rem" style={{ marginTop: '0.5rem' }} />
              </div>
            ))
            : rowData.tags?.length > 0 ? (rowData.tags?.map((t, index) => (
              <Tag
                key={index}
                value={t.name}
                style={{ marginRight: '0.5rem', marginBottom: '0.2rem', cursor: 'pointer' }}
                className={selectedTags.includes(t.name) ? 'p-tag-success' : 'p-tag-info'} // Highlight selected tags
                onClick={() => handleTagClick(t.name)}
              />
            ))) : <Tag value={'No Tag'} />}
        </div>
      </div>
    );
  };

  const loadingTemplate = (data: Dag, options: ColumnBodyOptions) => {
    return isLoading ? <Skeleton width="100%" /> : <div>{data?.[options?.field as keyof Dag] as ReactNode}</div>;
  };
  const actionTemplate = (data: Dag) => {
    return <RunDagButton dagId={data?.dag_id} disabled={isLoading} />
  }
  const [searchTerm, setSearchTerm] = useState(query.search || '');
  useDebounceEffect(() => {
    updateQueryParams(0, limit, selectedTags, onlyActive); // Update query when checkbox changes

  }, [searchTerm], 300)


  return (
    <PageFrame>
      <div style={{ gap: 5, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ConnectionSelector connections={connections} />
          <p>Total DAGs: {dagsData?.total_entries}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <Dropdown
              value={limit}
              options={rowsPerPageOptions.map((val) => ({ label: `${val} rows`, value: val }))}
              onChange={(e) => handleRowsPerPageChange(e.value)}
              placeholder="Rows per page"
            />
            <div className="flex align-items-center gap-50">
              <Checkbox inputId="ingredient1" name="pizza" value="Cheese" onChange={handleOnlyActiveChange} checked={onlyActive} />
              <label htmlFor="ingredient1" className="ml-2">Only Active</label>
            </div>
          </div>
          <div
            style={{
              // display: 'flex'
            }}
          >
            <InputText
              size="small"
              value={searchTerm as string}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search DAGs"
            />

            {selectedTags.length > 0 && (
              <>
                <div style={{ display: 'flex', gap: 5 }}>
                  <Tag
                    value={'Filter:'}
                    style={{ cursor: 'pointer' }}
                  />
                  {selectedTags.map((tag, index) => (
                    <Tag
                      key={index}
                      value={tag}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleTagClick(tag)} // Remove tag on click
                      className="p-tag-danger"

                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <DataTable size="small" value={dagsData?.dags || []} className="p-datatable-gridlines">
          <Column field="dag_id" header="DAG ID" style={{ width: '50%' }} body={mainBodyTemplate} />
          <Column field="description" header="Description" style={{ width: '25%' }} body={loadingTemplate} />
          <Column field="last_parsed_time" header="Last Parsed Time" style={{ width: '25%' }} body={loadingTemplate} />
          <Column field="action" header="Run" style={{ width: '25%' }} body={actionTemplate} />
        </DataTable>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '5px' }}>
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} label="Previous" />
          {generatePageButtons()}
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} label="Next" />
        </div>

      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          gap: CARD_GAP,
          marginTop: CARD_GAP,
          maxHeight: '80vh'

        }}

      >

        <div
          style={{
            width: '40%'
          }}
        >
          <DagRunList
            connection={connection as ConnectionData}
          />

        </div>
        <div
          style={{
            width: '60%',
            height: '100%',
            overflowY: 'scroll'
          }}
        >
          {(taskInstanceData && taskInstanceData?.length > 0) ? <TaskInstanceView /> :
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <DagRunEye
                data={dagRuns?.data?.dag_runs || []}
                style={{
                  width: '100%',
                  height: '80vh'
                }}
              />
              <DagRunStat data={runStat || {}} />
            </div>

          }
        </div>
      </div>
    </PageFrame>
  );
}
