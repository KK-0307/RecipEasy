import { useEffect, useState } from 'react';
import { Container, Divider } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

/**
 * Displays a list of top ingredients based on their frequency of use.
 * Each ingredient can be clicked to view detailed information about it.
 */
export default function IngredientsPage() {
  const [data, setData] = useState([]);

  // Fetches the list of top ingredients from the server upon component mount
  useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/top_ingredients`)
      .then(res => res.json())
      .then(resJson => {
          // Each ingredient is enhanced with a unique id for the DataGrid.
          const ingredientsWithId = resJson.map((ingredient) => ({id: ingredient.ingredient_id, ...ingredient}));
          setData(ingredientsWithId);
      });
  }, []);
  console.log(data[0]);
  
  // Configuration of columns for the DataGrid
  const ingredientColumns = [
    {
      field: "Ingredient",
      headerName: 'Ingredient',
      width: 300,
      renderCell: (params) => <NavLink to={`/ingredients/${params.row.ingredient_id}`}>{params.row.ingredient}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'Frequency',
      headerName: 'Frequency'
    }
  ];

  return (
    <Container>
      <Divider />
      <h2>Top Ingredients</h2>
      <DataGrid
        rows={data}
        columns={ingredientColumns}
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
      {/* <LazyTable route={`http://${config.server_host}:${config.server_port}/top_ingredients`} columns={ingredientColumns} /> */}
      <Divider />
    </Container>
  );
};