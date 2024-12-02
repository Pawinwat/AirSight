import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { motion } from 'framer-motion'; // Import Framer Motion
import prisma from 'src/lib/prisma';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { getDags } from 'src/api/airflow';
import { AirflowDagsResponse, Dag } from 'src/types/airflow';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect, JSX } from 'react';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';

interface DashboardServerProps {
  connection: {
    connection_id: string;
    name: string;
    ui_url: string;
    header: string;
  };
  dags: Dag[];
  total_entries: number;
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const { connectionId } = params as { connectionId: string };
  const limit = parseInt((query.limit as string) || '10', 10); // Default 10 items per page
  const offset = parseInt((query.offset as string) || '0', 10); // Default 0 offset
  const { tags } = query
  const connection = await prisma.connection.findFirst({
    where: {
      connection_id: connectionId,
      is_active: true,
    },
  });

  if (!connection || !connection.api_url || !connection.header) {
    return { notFound: true };
  }

  const config: AxiosRequestConfig = {
    headers: connection.header as AxiosHeaders, // Ensure headers are parsed correctly if stored as JSON
    params: {
      limit,
      offset,
      tags: tags || null
    },
    baseURL: connection.api_url,
  };
  console.log(config)
  const data: AirflowDagsResponse = await getDags(config);

  return {
    props: {
      connection,
      dags: data?.dags || [],
      total_entries: data?.total_entries || 0,
    },
  };
};

export default function DashboardPage({ connection, dags, total_entries }: DashboardServerProps) {
  const router = useRouter();
  const { query } = router;

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
    ].filter((page) => page > 0 && page <= totalPages);

    const uniquePages = Array.from(new Set([...startPages, ...surroundingPages, ...endPages])).sort(
      (a, b) => a - b
    );

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
    updateQueryParams(newOffset, limit);
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    updateQueryParams(0, newLimit); // Reset to first page when rows per page change
  };

  const updateQueryParams = (newOffset: number, newLimit: number) => {
    setLoading(true);
    router.push({
      pathname: router.pathname,
      query: {
        ...query,
        offset: newOffset,
        limit: newLimit,
        tags: selectedTags?.join(',')
      },
    });
  };


  useEffect(() => {
    setLoading(false); // Stop loading once the component mounts or updates
  }, [dags]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };
  useEffect(() => {
    if (selectedTags.length > 0 || query.tags) {
      updateQueryParams(offset, limit); // Update query when tags change
    }
  }, [selectedTags]);



  const mainBodyTemplate = (rowData: Dag) => {
    return (
      <div className="flex flex-column gap-2" style={{gap:2}}>
        {loading ? (
          <Skeleton width="100%" style={{ margin: '0.5rem' }} />
        ) : (
          <span>{rowData.dag_id}</span>
        )}
        <div style={{ display: 'flex', gap: 2 }}>
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                width="4rem"
                height="1.5rem"
                style={{ marginTop: '0.5rem' }}
              />
            ))
            : rowData.tags?.map((t, index) => (
              <Tag
                key={index}
                value={t.name}
                style={{
                  marginRight: '0.5rem',
                  marginBottom: '0.2rem',
                  cursor: 'pointer'
                }}
                className={selectedTags.includes(t.name) ? 'p-tag-success' : 'p-tag-info'} // Highlight selected tags
                onClick={() => handleTagClick(t.name)}
              />
            ))}
        </div>
      </div>
    );
  };


  const loadingTemplate = (data: Dag, options: ColumnBodyOptions) => {
    return (loading ? <Skeleton width="100%"></Skeleton> : <>
      {data[options?.field as keyof Dag]}
    </>)
  }

  // Framer Motion animation variants
  const pageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <h1>Dashboard: {connection.name}</h1>
      <p>Total DAGs: {total_entries}</p>

      {
        // loading ? (
        //   <div style={{ textAlign: 'center', margin: '2rem' }}>
        //     <p>Loading...</p>
        //   </div>
        // ) :
        (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <Dropdown
                value={limit}
                options={rowsPerPageOptions.map((val) => ({ label: `${val} rows`, value: val }))}
                onChange={(e) => handleRowsPerPageChange(e.value)}
                placeholder="Rows per page"
              />
              <div className="card flex flex-wrap justify-content-center gap-2">
                {selectedTags.length > 0 && (
                  <>
                    <h4>Active Filters:</h4>
                    <div className="flex gap-2" style={{display:'flex',gap:5}}>
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
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                label="Previous"
              />
              {generatePageButtons()}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                label="Next"
              />
            </div>
          </>
        )}
    </motion.div>
  );
}
