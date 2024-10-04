import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Button, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import RecipeCard from '../components/RecipeCard';
const config = require('../config.json');

/**
 * Displays a page with a list of today's popular recipes. Each recipe can be clicked to view more details.
 * A button is also provided to search for more recipes.
 */
export default function PopularRecipePage() {
  const [popularRecipe, setPopularRecipe] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  // Fetches popular recipes from the server upon component mount
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/detailed_metrics`)
      .then(res => res.json())
      .then(data => {
        // Maps incoming data to ensure each has a unique 'id' for the DataGrid
        setPopularRecipe(data.map((item, index) => ({ ...item, id: index })));
      })
      .catch(err => console.error('Failed to fetch popular recipes:', err));
  }, []);

  // Columns configuration for the DataGrid
  const columns = [
    { field: 'Name', headerName: 'Name', width: 370, renderCell: (params) => (
      <Link onClick={() => setSelectedRecipeId(params.row.Recipe_ID)}>{params.row.Name}</Link>
    )},
    { field: 'AvgRating', headerName: 'Average Rating', width: 130 },
    { field: 'TotalRatings', headerName: 'Total Ratings', width: 130 },
    { field: 'AvgCalories', headerName: 'Calories', width: 130 },
    { field: 'AvgProtein', headerName: 'Protein (g)', width: 130 },
    { field: 'AvgFat', headerName: 'Fat (g)', width: 130 },
    { field: 'AvgSugar', headerName: 'Sugar (g)', width: 130 }
  ];

  return (
    <Container maxWidth="lg">
      {selectedRecipeId && <RecipeCard recipeId={selectedRecipeId} handleClose={() => setSelectedRecipeId(null)} />}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={9}>
          <Typography variant="h4" gutterBottom className="title">
            Today's Popular Recipes
          </Typography>
        </Grid>
        <Grid item xs={3} container justifyContent="flex-end">
          <Button component={Link} to="/search" variant="contained" color="primary" className="button">
            Search More Recipes
          </Button>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            rows={popularRecipe}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
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
            className="dataGrid"
          />
        </Grid>
      </Grid>
    </Container>
  );
}