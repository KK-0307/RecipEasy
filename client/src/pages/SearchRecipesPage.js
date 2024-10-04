import { useEffect, useState } from 'react';
import { Container, Link, Button,  Grid, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { MuiChipsInput } from 'mui-chips-input'
import RecipeCard from '../components/RecipeCard';

const config = require('../config.json');

/**
 * Provides a comprehensive search interface for recipes including filters for name, ingredients, 
 * and nutritional information like calories, fat, sugar, and protein. Displays results in a data grid.
 */
export default function SearchRecipesPage() {
  const [recipeOfTheDay, setRecipeOfTheDay] = useState({});
  const [chips, setChips] = useState([]); // For handling chip input for ingredients
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]); // To hold search results
  const [name, setName] = useState('');
  const [calories, setCalories] = useState([0, 2000]);
  const [fat, setFat] = useState([0, 2000]);
  const [sugar, setSugar] = useState([0, 2000]);
  const [protein, setProtein] = useState([0, 2000]);
  const [imageUrl, setImageUrl] = useState('https://news.mit.edu/sites/default/files/styles/news_article__image_gallery/public/images/202312/MIT_Food-Diabetes-01_0.jpg?itok=Mp8FVJkC');
  
  // Fetch a random recipe for recipe of the day section
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => setRecipeOfTheDay(resJson));

  }, []);

  
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/`)
    .then(res => res.json())
    .then(resJson => {
      const recipesWithId = resJson.map((recipe) => ({ id: recipe.recipe_id, ...recipe }));
      setData(recipesWithId);
    });
  }, []);

  // Fetch recipes based on user-defined parameters
  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_recipes?name=${name}` +
      `&calories_low=${calories[0]}&calories_high=${calories[1]}` +
      `&fat_low=${fat[0]}&fat_high=${fat[1]}` +
      `&sugar_low=${sugar[0]}&sugar_high=${sugar[1]}` +
      `&protein_low=${protein[0]}&protein_high=${protein[1]}` +
      `&ingredients=${chips}`
    )
    .then(res => res.json())
    .then(resJson => {
      const recipesWithId = resJson.map((recipe) => ({ id: recipe.recipe_id, ...recipe }));
      setData(recipesWithId);
    });
  }

  const columns = [
    { field: 'name', headerName: 'Name', width: 300, renderCell: (params) => (
        <Link onClick={() => setSelectedRecipeId(params.row.recipe_id)}>{params.value}</Link>
    ) },
    { field: 'calories', headerName: 'Calories' },
    { field: 'fat', headerName: 'Fat' },
    { field: 'sugar', headerName: 'Sugar' },
    { field: 'protein', headerName: 'Protein' },
    { field: 'avg_rating', headerName: 'Rating' }
  ]

  const handleChange = (newChips) => {
    setChips(newChips);
  }

  return (
    <Container>
      {/* RecipeCard is a custom component that we made. selectedrecipeId && <RecipeCard .../> makes use of short-circuit logic to only render the RecipeCard if a non-null song is selected */}
      {selectedRecipeId && <RecipeCard recipeId={selectedRecipeId} handleClose={() => setSelectedRecipeId(null)} />}
      <h2 style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
        color: 'white',
        textShadow: '1px 1px 2px black'
      }}>We think you'll like:&nbsp;
        <Link onClick={() => setSelectedRecipeId(recipeOfTheDay.recipe_id)}>{recipeOfTheDay.name}</Link>
      </h2>

      {/* {selectedRecipeId && <RecipeCard recipeId={selectedRecipeId} handleClose={() => setSelectedRecipeId(null)} />} */}
      <h2>Search Recipes</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Name' value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={8}>
          <h3>Ingredients you'd like to use</h3>
          <MuiChipsInput label='Ingredients' value={chips} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <h3>Calories</h3>
          <Slider
            value={calories}
            min={0}
            max={2000}
            step={1}
            onChange={(e, newValue) => setCalories(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value / 1}</div>}
          />
        </Grid>
        <Grid item xs={6}>
          <h3>Fat</h3>
          <Slider
            value={fat}
            min={0}
            max={2000}
            step={1}
            onChange={(e, newValue) => setFat(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value / 1}</div>}
          />
        </Grid>
        <Grid item xs={6}>
          <h3>Sugar</h3>
          <Slider
            value={sugar}
            min={0}
            max={2000}
            step={1}
            onChange={(e, newValue) => setSugar(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value / 1}</div>}
          />
        </Grid>
        <Grid item xs={6}>
          <h3>Protein</h3>
          <Slider
            value={protein}
            min={0}
            max={2000}
            step={1}
            onChange={(e, newValue) => setProtein(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value / 1}</div>}
          />
        </Grid>

      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
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