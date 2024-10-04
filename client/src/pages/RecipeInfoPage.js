import { useEffect, useState } from 'react';
import { useParams, Link} from 'react-router-dom';
import { Container, Grid, Rating} from '@mui/material';

const config = require('../config.json');

/**
 * Displays detailed information about a specific recipe.
 * Includes ingredients, preparation steps, nutritional facts, and reviews.
 */
export default function RecipeInfoPage() {
  const { recipe_id } = useParams(); // Retrieves the recipe ID from the URL
  const [recipeData, setRecipeData] = useState({ reviews: [] });

  // Fetches recipe data from the server based on the recipe_id
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/recipes/${recipe_id}`)
      .then(res => res.json())
      .then(resJson => setRecipeData(resJson));
  }, [recipe_id]);

  // Splits steps into an array and maps them into a list
  const separatedSteps = recipeData.steps_joined?.split("@");
  const stepsList = separatedSteps?.map((step)=>{
    return <li>{step}</li>;
    });
  
  // Splits ingredients into an array and maps them into a list
  const separatedIngredients = recipeData.ingredients_joined?.split("@");
  const ingredientList = separatedIngredients?.map((ingredient)=>{
    return <li>{ingredient}</li>;
    });

  return (
    <Container>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}justifyContent="space-evenly">
            <Grid item xs={10}>
                <h1 style={{ fontSize: 64 }}>{recipeData.name}</h1>
            </Grid>
            <Grid alignSelf="center">
              <h2>Contributor:</h2>
                <Link to={`/contributor/${recipeData.contributor_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {recipeData.contributor_id ? `Contributor #${recipeData.contributor_id}` : 'Contributor info unavailable'}
                </Link>
            </Grid>
            <Grid item xs={6}>
                <h2>Description:</h2>
                <p>{recipeData.description}</p>
            </Grid>
            <Grid item xs={3}>
                {/* <Item>4</Item> */}
                <h2>Nutrition Facts:</h2>
                <p>Calories: {recipeData.calories}</p>
                <p>Fat: {recipeData.fat} g</p>
                <p>Sugar: {recipeData.sugar} g</p>
                <p>Protein: {recipeData.protein} g</p>
            </Grid>
            <Grid item xs={3}>
                <h2>Average Rating:</h2>
                {/* <p>{recipeData.avg_rating} / 5</p> */}
                <Rating name="read-only" value={Math.min(Math.round(recipeData.avg_rating * 4) / 4, 5)} readOnly precision={0.25}/>
                <h2>Total Time:</h2>
                <p>{recipeData.minutes} minutes</p>
            </Grid>  
        </Grid>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}justifyContent="space-evenly">
            <Grid item xs={6}> 
               <h2>Ingredients</h2>
               {/* <p>{recipeData.ingredients_joined}</p> */}
                <ul>{ingredientList}</ul> 
            </Grid>
            <Grid item xs={6}>
                <h2>Steps:</h2>
                <ol>{stepsList}</ol>
                {/* <p>{recipeData.steps_joined}</p> */}
            </Grid>
        </Grid>
        <Grid item xs={12}>
          <h2>Reviews</h2>
          {recipeData.reviews && recipeData.reviews.length > 0 ? (
              recipeData.reviews.map((review, index) => (
                  <div key={index}>
                      <Rating name="read-only" value={Math.min(Math.round(review.rating * 4) / 4, 5)} readOnly precision={0.25}/>
                      <p>Review: {review.review}</p> 
                  </div>
              ))
          ) : (
              <p>No reviews available.</p>
          )}
      </Grid>
    </Container>
  );
}