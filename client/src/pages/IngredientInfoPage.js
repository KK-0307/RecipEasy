import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Divider, Link} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import RecipeCard from '../components/RecipeCard';
const config = require('../config.json');

/**
 * Component to display detailed information about an ingredient, including a list of recipes
 * that include this ingredient. Each recipe can be clicked to view more details.
 */
export default function IngredientInfoPage() {
  const { ingredient_id} = useParams();
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [ingredientName, setIngredientName] = useState("");

  // Fetches ingredient details and recipes containing the ingredient
  useEffect(() => {
    // Fetch basic ingredient information
    fetch(`http://${config.server_host}:${config.server_port}/ingredient/${ingredient_id}`)
    .then(res => res.json())
    .then(resJson => {
        setIngredientName(resJson[0].ingredient)});
    
    // Fetch recipes using this ingredient
    fetch(`http://${config.server_host}:${config.server_port}/ingredients/${ingredient_id}`)
    .then(res => res.json())
    .then(resJson => {
      const recipesWithId = resJson?.map((recipe) => ({ id: recipe.recipe_id, ...recipe }));
      setData(recipesWithId);
    });

  }, [ingredient_id]);

  // Columns configuration for the DataGrid
  const columns = [
    { field: 'name', headerName: 'Name', width: 300, renderCell: (params) => (
        <Link onClick={() => setSelectedRecipeId(params.row.recipe_id)}>{params.value}</Link>
    ) },
    { field: 'calories', headerName: 'Calories' },
    { field: 'fat', headerName: 'Fat' },
    { field: 'sugar', headerName: 'Sugar' },
    { field: 'protein', headerName: 'Protein' }
  ]

  return (
    <Container>
      {/* RecipeCard is a custom component that we made. selectedrecipeId && <RecipeCard .../> makes use of short-circuit logic to only render the RecipeCard if a non-null song is selected */}
      {selectedRecipeId && <RecipeCard recipeId={selectedRecipeId} handleClose={() => setSelectedRecipeId(null)} />}
      <h1>{ingredientName}</h1>
      {/* <LazyTable route={`http://${config.server_host}:${config.server_port}/ingredients/${ingredient_id}`} columns={columns} /> */}
      <Divider />
    
      <DataGrid
        rows={data}
        columns={columns}
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