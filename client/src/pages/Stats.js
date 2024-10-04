import { useEffect, useState } from 'react';
import { Container, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import RecipeCard from '../components/RecipeCard';

const config = require('../config.json');

/**
 * Displays statistical data about recipes, including best ingredient pairs, recipes with rare ingredients,
 * and the most popular complex recipes.
 */
export default function StatsPage() {
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [mostPopularIngredientPairs, setMostPopularIngredientPairs] = useState([]);
    const [rareIngredients, setRareIngredients] = useState([]);
    const [bestComplexRecipes, setBestComplexRecipes] = useState([]);

    // Fetch various types of data when component mounts
    useEffect(() => {
      // Fetching best ingredient pairs
        fetch(`http://${config.server_host}:${config.server_port}/top_ingredient_pairs`)
        .then(res => res.json())
        .then(resJson => {
            setMostPopularIngredientPairs(resJson)});
        
        // Fetching recipes with rare ingredients
        fetch(`http://${config.server_host}:${config.server_port}/rare_ingredients`)
        .then(res => res.json())
        .then(resJson => {
            const recipesWithId = resJson.map((recipe) => ({ id: recipe.Recipe_ID, ...recipe }));
            setRareIngredients(recipesWithId)});
        
        // Fetching most popular complex recipes
        fetch(`http://${config.server_host}:${config.server_port}/data`)
        .then(res => res.json())
        .then(resJson => {
            const recipesWithId = resJson.map((recipe) => ({ id: recipe.Recipe_ID, ...recipe }));
            setBestComplexRecipes(recipesWithId)});
    },[]);

    // Define columns for DataGrids displaying rare ingredients and complex recipes
    const rare_recipe_columns = [
        { field: 'name', headerName: 'Name', width: 500, renderCell: (params) => (
            <Link onClick={() => setSelectedRecipeId(params.row.Recipe_ID)}>{params.row.Name}</Link>
        )},
        { field: 'UniqueIngredients', headerName: 'Number of Unique Ingredients', width: 300 }
    ];

    const complex_recipe_columns = [
        { field: 'name', headerName: 'Name', width: 300, renderCell: (params) => (
            <Link onClick={() => setSelectedRecipeId(params.row.Recipe_ID)}>{params.row.Name}</Link>
        )},
        { field: 'n_steps', headerName: 'Number of Steps', width: 300},
        { field: 'TotalReviews', headerName: 'Number of Reviews', width: 300},
        { field: 'AvgRating', headerName: 'Average Rating', width: 300}
    ];


    return (
        <Container>
            {selectedRecipeId && <RecipeCard recipeId={selectedRecipeId} handleClose={() => setSelectedRecipeId(null)} />}
        <h2>Best Ingredient Pairs</h2>
    <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell key='Ingredient One'>Ingredient One</TableCell>
              <TableCell key='Ingredient Two'>Ingredient Two</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mostPopularIngredientPairs.map(pair =>
              <TableRow>
                <TableCell key='Ingredient One'>
                <NavLink to={`/ingredients/${pair.FirstIngredient_id}`}>{pair.FirstIngredient}</NavLink>
                </TableCell>
                <TableCell key='Ingredient Two'>
                <NavLink to={`/ingredients/${pair.SecondIngredient_id}`}>{pair.SecondIngredient}</NavLink>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Recipes with the most rare Ingredients</h2>
      <DataGrid
        rows={rareIngredients}
        columns={rare_recipe_columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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

    <h2>Most popular complex recipes</h2>
    <DataGrid
        rows={bestComplexRecipes}
        columns={complex_recipe_columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
    };