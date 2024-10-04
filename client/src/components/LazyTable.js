import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

/**
 * Renders a Material-UI table with pagination that fetches data only from the current page,
 * reducing data load and enhancing performance. This component uses server-side pagination.
 *
 * @param {Object} props - Component props.
 * @param {string} props.route - API endpoint to fetch data from.
 * @param {Array} props.columns - Column configuration for the table. Each object must include 'field' and 'headerName'.
 * @param {number} [props.defaultPageSize=10] - Default number of rows per page.
 * @param {Array} [props.rowsPerPageOptions=[5, 10, 25]] - Options for rows per page.
 */


export default function LazyTable({ route, columns, defaultPageSize = 10, rowsPerPageOptions = [5, 10, 25] }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1); // Page state is 1-indexed
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Fetch data when route, page, or pageSize changes
  useEffect(() => {
    fetch(`${route}?page=${page}&page_size=${pageSize}`)
      .then(res => res.json())
      .then(resJson => setData(resJson));
  }, [route, page, pageSize]);

  // Handle page change
  const handleChangePage = (e, newPage) => {
    if (newPage < page || data.length === pageSize) {
      setPage(newPage + 1);
    }
  }

  // Handle change in page size, reset page to 1
  const handleChangePageSize = (e) => {
    const newPageSize = e.target.value;
    setPageSize(newPageSize);
    setPage(1);
  }

  // Default cell rendering logic
  const defaultRenderCell = (col, row) => {
    return <div>{row[col.field]}</div>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => <TableCell key={col.headerName}>{col.headerName}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) =>
            <TableRow key={idx}>
              {
                columns.map((col) =>
                  <TableCell key={col.headerName}>
                    {col.renderCell ? col.renderCell(row) : defaultRenderCell(col, row)}
                  </TableCell>
                )
              }
            </TableRow>
          )}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions ?? [5, 10, 25]}
          count={-1}
          rowsPerPage={pageSize}
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangePageSize}
        />
      </Table>
    </TableContainer>
  )
}