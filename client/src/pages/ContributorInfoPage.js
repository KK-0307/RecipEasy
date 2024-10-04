import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import RecipeCard from '../components/RecipeCard';
const config = require('../config.json');

/**
 * Component to display a list of recipes contributed by a specific contributor.
 * Utilizes useParams to extract contributor_id from the URL and fetches recipe data
 * associated with that contributor.
 */
function ContributorInfoPage() {
    const { contributor_id } = useParams();
    console.log(contributor_id)
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  // Fetches recipes by contributor ID upon component mount or when contributor_id changes
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/contributor/${contributor_id}`)
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => ({
            ...item,
            id: item.recipe_id // Standardizes data for the DataGrid component
          }));
        setRecipes(formattedData);
      })
      .catch(error => console.error('Failed to fetch recipes', error));
  }, [contributor_id]);

  // Column configuration for the DataGrid component
  const columns = [
    { field: 'name', headerName: 'Recipe Name', width: 200 , renderCell: (params) => (
      <Link onClick={() => setSelectedRecipeId(params.row.recipe_id)}>{params.row.name}</Link>
    )},
    { field: 'minutes', headerName: 'Minutes', width: 130 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'n_ingredients', headerName: 'Number of Ingredients', width: 200 },
    { field: 'calories', headerName: 'Calories', type: 'number', width: 130 },
  ];

  return (
    <Container>
      {selectedRecipeId && <RecipeCard recipeId={selectedRecipeId} handleClose={() => setSelectedRecipeId(null)} />}
      <Typography variant="h4" gutterBottom>
        Recipes by Contributor `{contributor_id}`
      </Typography>
      <Paper style={{ height: 400, width: '100%', marginTop: 20 }}>
        <DataGrid
          rows={recipes}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 15]}
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
      </Paper>
    </Container>
  );
}

export default ContributorInfoPage;