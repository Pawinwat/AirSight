import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { motion } from 'framer-motion'; // Import Framer Motion
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Chip } from 'primereact/chip';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';
import { Tag } from 'primereact/tag';
import { JSX, useEffect, useState } from 'react';
import { getDags } from 'src/api/airflow';
import prisma from 'src/lib/prisma';
import { PATH } from 'src/routes';
import { pageVariants } from 'src/transitions';
import { AirflowDagsResponse, Dag } from 'src/types/airflow';
import { ConnectionData } from 'src/types/db';
import ConnectionSelector from './components/ConnectionSelector';
interface DagsServerProps {
  connection: ConnectionData
  connections: ConnectionData[]
  dags: Dag[];
  total_entries: number;
}
export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const { connectionId } = params as { connectionId: string };
  const limit = parseInt((query.limit as string) || '10', 10); // Default 10 items per page
  const offset = parseInt((query.offset as string) || '0', 10); // Default 0 offset
  const { tags, only_active } = query;
  const connections = await prisma.connection.findMany({
    where: {
      is_active: true,
    },
  });
  const connection = connections?.find(rec => rec.connection_id == connectionId)
  if (!connection || !connection.api_url || !connection.header) {
    return { notFound: true };
  }
  const config: AxiosRequestConfig = {
    headers: connection.header as AxiosHeaders, // Ensure headers are parsed correctly if stored as JSON
    params: {
      limit,
      offset,
      tags: tags || null,
      only_active: only_active || null
    },
    baseURL: connection.api_url,
  };
  const data: AirflowDagsResponse = await getDags(config);
  return {
    props: {
      connection,
      connections,
      dags: data?.dags || [],
      total_entries: data?.total_entries || 0,
    },
  };
};

export default function DagsPage({ connection, dags, total_entries, connections }: DagsServerProps) {
  const router = useRouter();
  const { query } = router;
  const [onlyActive, setOnlyActive] = useState<boolean>(query.only_active === 'true'); // Initialize from query
  const [loading, setLoading] = useState(false);

  // Pagination variables
  const [limit, setLimit] = useState(parseInt((query.limit as string) || '10', 10));
  const offset = parseInt((query.offset as string) || '0', 10);

  const rowsPerPageOptions = [5, 10, 25, 50];
  const totalPages = Math.ceil(total_entries / limit);
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
    setLoading(true);
    router.push({
      pathname: router.pathname,
      query: {
        ...query,
        offset: newOffset,
        limit: newLimit,
        tags: tags.length > 0 ? tags.join(',') : undefined,
        only_active: onlyActive ? 'true' : undefined, // Include only_active only if true
      },
    });
  };

  useEffect(() => {
    setLoading(false); // Stop loading once the component mounts or updates
  }, [dags]);

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

  const handleViewDag = (dagId: string) => {
    router.push({
      pathname: PATH.mainDagId(connection.connection_id, dagId)
    }
    )

  }

  const mainBodyTemplate = (rowData: Dag) => {
    return (
      <div className="card flex flex-column gap-2" style={{ gap: 10 }}>
        {loading ? (
          <Skeleton width="100%" style={{ margin: '0.5rem' }} />
        ) : (
          <>
            <i className={`pi pi-circle-fill`} style={{ fontSize: '1rem', marginRight: '0.5rem', color: rowData?.is_paused ? 'gray' : 'var(--primary-color)' }}></i>
            {/* <span
              onClick={() => handleViewDag(rowData.dag_id)}
            > */}
            <Link
              href={PATH.mainDagId(connection.connection_id, rowData.dag_id)}
              style={{ textDecoration: 'none' }}
            >

              {rowData.dag_id}
            </Link>

            {/* </span> */}
            {rowData?.schedule_interval && (
              <Chip label={rowData?.schedule_interval?.value} style={{ height: '1.2rem', marginLeft: '0.5rem' }} />
            )}
            {/* <Chip label={rowData?.timetable_description} style={{ height: '1.2rem', marginLeft: '0.5rem' }} /> */}

          </>
        )}
        <div style={{ display: 'flex', gap: 2 }}>
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
              <div style={{ marginTop: 5, marginBottom: '0.2rem', marginRight: '0.5rem' }}>
                <Skeleton key={index} width="4rem" height="1.5rem" style={{ marginTop: '0.5rem' }} />
              </div>
            ))
            : rowData.tags?.map((t, index) => (
              <Tag
                key={index}
                value={t.name}
                style={{ marginRight: '0.5rem', marginBottom: '0.2rem', cursor: 'pointer' }}
                className={selectedTags.includes(t.name) ? 'p-tag-success' : 'p-tag-info'} // Highlight selected tags
                onClick={() => handleTagClick(t.name)}
              />
            ))}
        </div>
      </div>
    );
  };

  const loadingTemplate = (data: Dag, options: ColumnBodyOptions) => {
    return loading ? <Skeleton width="100%" /> : <>{data[options?.field as keyof Dag]}</>;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}

    >
      <div style={{ gap: 5, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ConnectionSelector connections={connections} />
          <p>Total DAGs: {total_entries}</p>
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
          {/* <MultiSelect value={selectedCities} onChange={(e) => setSelectedCities(e.value)} options={cities} optionLabel="name" display="chip"
            placeholder="Select Cities" maxSelectedLabels={3} className="w-full md:w-20rem" /> */}

          <div
            style={{
              // display: 'flex'
            }}
          >
            {selectedTags.length > 0 && (
              <>
                {/* <h4>Active Filters:</h4> */}
                <div style={{ display: 'flex', gap: 5 }}>
                  <Tag
                    value={'Filter:'}
                    style={{ cursor: 'pointer' }}
                  // className="p-tag-danger"

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

        <DataTable size="small" value={dags} className="p-datatable-gridlines">
          <Column field="dag_id" header="DAG ID" style={{ width: '50%' }} body={mainBodyTemplate} />
          <Column field="description" header="Description" style={{ width: '25%' }} body={loadingTemplate} />
          <Column field="last_parsed_time" header="Last Parsed Time" style={{ width: '25%' }} body={loadingTemplate} />
        </DataTable>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '5px' }}>
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} label="Previous" />
          {generatePageButtons()}
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} label="Next" />
        </div>

      </div>
    </motion.div>
  );
}
