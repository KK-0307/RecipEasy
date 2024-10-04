import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
const config = require('../config.json');

/**
 * Displays a list of contributors using a data grid.
 * Each row in the grid links to a detailed view of the contributor.
 */
export default function ContributorsPage() {
  const [contributors, setContributors] = useState([]);

  // Fetches contributors data from the server and processes it for display
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/contributors`)
      .then(res => res.json())
      .then(data => {
        // Ensures each contributor has a unique id key for the DataGrid 
        const processedData = data.map((item, index) => ({ ...item, id: item.Contributor_ID }));
        setContributors(processedData);
      })
      .catch(err => console.error('Failed to fetch contributors:', err));
  }, []);

  // Column definitions for DataGrid
  const columns = [
    { 
      field: 'Contributor_ID', 
      headerName: 'Contributor ID', 
      width: 150,
      renderCell: (params) => (
        // Use RouterLink to navigate to the contributor's detail page
        <Link to ={`/contributor/${params.value}`} color="primary">
          {params.value}
        </Link>
      ),
    },
    { field: 'UniqueIngredients', headerName: 'Unique Ingredients', width: 180 },
    { field: 'RecipeCount', headerName: 'Recipe Count', width: 130 },
    { field: 'AvgRating', headerName: 'Average Rating', width: 130, type: 'number' },
  ];

  return (
    <Container>
      <h1>Contributors</h1>
      <DataGrid
        rows={contributors}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        autoHeight
        sx={{
          boxShadow: 2,
          border: 4,
          borderColor: 'primary.light',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'primary.dark',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
        }}
      />
    </Container>
  );
}