const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));


// Route 7: GET /
//Gets top 10 recipes by rating
const landing = async function(req, res) {
  connection.query(`
    SELECT R.*, AVG(RV.rating) AS avg_rating
    FROM Recipes R
    JOIN Reviews RV ON R.recipe_id = RV.recipe_id
    GROUP BY R.recipe_id, R.name
    ORDER BY avg_rating DESC
    LIMIT 10;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

//GET /random
const random = async function(req, res) {
  connection.query(`
    SELECT recipe_id, name
    FROM Recipes
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

//GET /recipes/:recipe_id
//Gets Recipe information based on passed in Recipe_ID
const recipe = async function(req, res) {
  connection.query(`
    SELECT Recipes.*, AVG(Reviews.rating) AS avg_rating
    FROM Recipes 
    LEFT JOIN Reviews ON Recipes.recipe_id = Reviews.recipe_id
    WHERE Recipes.recipe_id = ?
    GROUP BY Recipes.recipe_id
    LIMIT 1;
  `, [req.params.recipe_id], (err, recipeData) => {
    if (err || recipeData.length === 0) {
      console.log(err);
      res.json({});
    } else {
      // fetch reviews associated with recipe
      connection.query(`
        SELECT * FROM Reviews WHERE recipe_id = ?
      `, [req.params.recipe_id], (err, reviewData) => {
        if (err) {
          console.log(err);
          res.json({});
        } else {
          const data = {
            ...recipeData[0],
            reviews: reviewData // Attach reviews to the response
          };
          res.json(data);
        }
      });
    }
  });
}


// Route 1: GET /ingredient/:ingredient_id
// Gets ingredient name by ingredient_id
const ingredient_name = async function(req, res) {
  connection.query(`
  SELECT I.ingredient
  FROM Ingredients I
  WHERE I.ingredient_id = ?
  `, [req.params.ingredient_id], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 2: GET /ingredients/:ingredient_id
//Gets Recipe information based on passed in Ingredient_ID
const ingredient_recipes = async function(req, res) {
  connection.query(`
    SELECT Recipes.*
    FROM RecipeIngredients
    JOIN Recipes ON RecipeIngredients.recipe_id = Recipes.recipe_id
    WHERE RecipeIngredients.ingredient_id = ?
  `, [req.params.ingredient_id], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 3: GET /search_recipes
// Given the input range of nutrition, output the appropriate recipes
const search_recipes = async function(req, res) {
  const name = req.query.name ?? '';
  const caloriesLow = req.query.calories_low ?? 0;
  const caloriesHigh = req.query.calories_high ?? 2000;
  const fatLow = req.query.fat_low ?? 0;
  const fatHigh = req.query.fat_high ?? 2000;
  const sugarLow = req.query.sugar_low ?? 0;
  const sugarHigh = req.query.sugar_high ?? 2000;
  const proteinLow = req.query.protein_low ?? 2000;
  const proteinHigh = req.query.protein_high ?? 2000;
  const ingredientsString = req.query.ingredients ?? [];

  let ingredientQuery = "";
  if (ingredientsString.length > 0) {
    ingredients = ingredientsString.split(",");
    ingredientQuery += "AND r.ingredients_joined LIKE";
      for (i = 0; i < ingredients.length; i++) {
        ingredientQuery += " \'%" + ingredients[i].toLowerCase() + "%\' ";
        if (i < ingredients.length - 1) {
          ingredientQuery += "AND r.ingredients_joined LIKE";
        }
      }
  }

  connection.query(`
  SELECT r.*, AVG(re.rating) as avg_rating
    FROM Recipes r LEFT JOIN Reviews re on r.recipe_id = re.recipe_id
    WHERE r.name LIKE '%${name}%'
      AND r.calories BETWEEN ${caloriesLow} AND ${caloriesHigh}
      AND r.fat BETWEEN ${fatLow} AND ${fatHigh}
      AND r.sugar BETWEEN ${sugarLow} AND ${sugarHigh}
      AND r.protein BETWEEN ${proteinLow} AND ${proteinHigh}
      ${ingredientQuery}
    GROUP BY re.recipe_id
    ORDER BY avg_rating DESC;
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 4: GET /recipe_ingredients/:recipe_id
// returns all necessary ingredients given a recipe ID
const recipe_ingredients = async function(req, res) {
  connection.query(`
    SELECT *
    FROM Ingredients
      JOIN RecipeIngredients RI on Ingredients.ingredient_id = RI.ingredient_id
    WHERE RI.recipe_id = ?;
  `, [req.params.recipe_id], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 5: GET /easy
// Retrieves recipes where reviews contain the word "easy", along with the text of such reviews and their respective ratings.
const easy = async function(req, res) {
  connection.query(`
    SELECT DISTINCT Recipes.recipe_id, RV.review, RV.rating
    FROM Recipes
      JOIN Reviews RV on Recipes.recipe_id = RV.recipe_id
    WHERE RV.review LIKE '%easy%';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 6: GET /top_recipes
// Retrieves the top ten recipes with the highest average ratings from user reviews.
const top_recipes = async function(req, res) {
  connection.query(`
    SELECT R.recipe_id, R.name, AVG(RV.rating) AS avg_rating
    FROM Recipes R
      JOIN Reviews RV ON R.recipe_id = RV.recipe_id
    GROUP BY R.recipe_id, R.name
    ORDER BY avg_rating DESC
    LIMIT 10;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}
// Route 7: GET /top_ingredients
// Retrieves the most frequently used ingredients in recipes that have an average rating of 4.5 or higher.
const top_ingredients = async function(req, res) {
  connection.query(`
  SELECT Ing.Ingredient_ID AS ingredient_id, Ing.ingredient, COUNT(*) AS Frequency
  FROM Ingredients Ing
  JOIN RecipeIngredients RI ON Ing.Ingredient_ID = RI.Ingredient_ID
  JOIN (
     SELECT R.Recipe_ID
     FROM Recipes R
     JOIN Reviews Rev ON R.Recipe_ID = Rev.recipe_id
     GROUP BY R.Recipe_ID
     HAVING AVG(Rev.rating) >= 4.5
  ) AS TopRated ON RI.Recipe_ID = TopRated.Recipe_ID
  GROUP BY Ing.ingredient
  ORDER BY Frequency DESC;  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 8: GET /contributors
// returns the basic information on recipe contributor and their contributions
const contributors = async function(req, res) {
  connection.query(`
  WITH ContributorDiversity AS (
    SELECT
        R.Contributor_ID,
        COUNT(DISTINCT RI.Ingredient_ID) AS UniqueIngredients,
        COUNT(DISTINCT R.Recipe_ID) AS RecipeCount
    FROM Recipes R
    JOIN RecipeIngredients RI ON R.Recipe_ID = RI.Recipe_ID
    GROUP BY R.Contributor_ID
 ),
  ContributorRatings AS (
    SELECT
        R.Contributor_ID,
        AVG(Rev.rating) AS AvgRating
    FROM Recipes R
    JOIN Reviews Rev ON R.Recipe_ID = Rev.recipe_id
    GROUP BY R.Contributor_ID
 )
  SELECT
    CD.Contributor_ID,
    CD.UniqueIngredients,
    CD.RecipeCount,
    CR.AvgRating
  FROM ContributorDiversity CD
  JOIN ContributorRatings CR ON CD.Contributor_ID = CR.Contributor_ID
  ORDER BY CD.UniqueIngredients DESC, CR.AvgRating DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 9: GET /top_ingredient_pairs
// Retrieves the most frequent pairs of ingredients that are ranked first and second in high-rated recipes.
const top_ingredient_pairs = async function(req, res) {
  connection.query(`
  WITH RankedIngredients AS (
    SELECT
        RI.Recipe_ID,
        I.ingredient,
        I.Ingredient_ID,
        ROW_NUMBER() OVER (PARTITION BY RI.Recipe_ID ORDER BY RI.Ingredient_ID) AS IngredientRank
    FROM RecipeIngredients RI
    JOIN Ingredients I ON RI.Ingredient_ID = I.Ingredient_ID
    JOIN Recipes R ON RI.Recipe_ID = R.Recipe_ID
    JOIN Reviews Rev ON R.Recipe_ID = Rev.recipe_id
    WHERE Rev.rating >= 4
  )
  SELECT
    Ingredient1.ingredient AS FirstIngredient,
    Ingredient2.ingredient AS SecondIngredient,
    Ingredient1.Ingredient_ID AS FirstIngredient_id,
    Ingredient2.Ingredient_ID AS SecondIngredient_id,
    COUNT(*) AS Frequency
  FROM RankedIngredients Ingredient1
  JOIN RankedIngredients Ingredient2 ON Ingredient1.Recipe_ID = Ingredient2.Recipe_ID
    AND Ingredient1.IngredientRank = 1 AND Ingredient2.IngredientRank = 2
  GROUP BY Ingredient1.ingredient, Ingredient2.ingredient, Ingredient1.Ingredient_ID, Ingredient2.Ingredient_ID
  ORDER BY Frequency DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 10: GET /detailed_metrics
const detailed_metrics = async function(req, res) {
  connection.query(`
  WITH RecipeRatings AS (  
    SELECT
        recipe_id,
        AVG(rating) AS AvgRating,
        COUNT(rating) AS TotalRatings
    FROM Reviews
    GROUP BY recipe_id
 ),
 ContributorRecipeCount AS (
    SELECT
        Contributor_ID,
        COUNT(*) AS RecipesContributed
    FROM Recipes
    GROUP BY Contributor_ID
 )
 SELECT
    R.Recipe_ID,
    R.Name,
    (SELECT AVG(rating) FROM Reviews WHERE recipe_id = R.Recipe_ID) AS AvgRating,
    (SELECT COUNT(rating) FROM Reviews WHERE recipe_id = R.Recipe_ID) AS TotalRatings,
    CRC.RecipesContributed,
    (SELECT AVG(Calories) FROM Recipes WHERE Recipe_ID = R.Recipe_ID) AS AvgCalories,
    (SELECT AVG(Protein) FROM Recipes WHERE Recipe_ID = R.Recipe_ID) AS AvgProtein,
    (SELECT AVG(Fat) FROM Recipes WHERE Recipe_ID = R.Recipe_ID) AS AvgFat,
    (SELECT AVG(Sugar) FROM Recipes WHERE Recipe_ID = R.Recipe_ID) AS AvgSugar
 FROM Recipes R
 JOIN RecipeRatings RR ON R.Recipe_ID = RR.recipe_id
 JOIN ContributorRecipeCount CRC ON R.Contributor_ID = CRC.Contributor_ID
 WHERE (SELECT COUNT(rating) FROM Reviews WHERE recipe_id = R.Recipe_ID) > 10 AND CRC.RecipesContributed > 5
 ORDER BY RR.AvgRating DESC, RR.TotalRatings DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 11: /rare_ingredients
// Retrieves recipes that include ingredients used in three or fewer recipes, which are considered rare, along with a count of such unique ingredients in each recipe.
const rare_ingredients = async function(req, res) {
  connection.query(`
SELECT
    R.Recipe_ID,
    R.Name,
    COUNT(*) AS UniqueIngredients
FROM Recipes R
JOIN RecipeIngredients RI ON R.Recipe_ID = RI.Recipe_ID
JOIN RareIngredients RA ON RI.Ingredient_ID = RA.Ingredient_ID
GROUP BY R.Recipe_ID, R.Name
ORDER BY UniqueIngredients DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 12: GET /data
// returns basic information about recipes and their engagement data
const data = async function(req, res) {
  connection.query(`
  SELECT
    R.Recipe_ID,
    R.Name,
    R.n_steps,
    (SELECT COUNT(*) FROM Reviews WHERE recipe_id = R.Recipe_ID) AS TotalReviews,
    (SELECT AVG(rating) FROM Reviews WHERE recipe_id = R.Recipe_ID) AS AvgRating
FROM Recipes R
WHERE EXISTS (
    SELECT 1 FROM Reviews WHERE recipe_id = R.Recipe_ID
)
ORDER BY R.n_steps, (SELECT COUNT(*) FROM Reviews WHERE recipe_id = R.Recipe_ID) DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 13: GET /ingredients/:ingredient_id
//Gets Recipe information based on passed in Ingredient_ID
const contributordetails = async function(req, res) {
  connection.query(`
  SELECT DISTINCT r.recipe_id, r.name, r.minutes, r.description, r.n_ingredients, r.calories, rv.rating
  FROM Recipes r JOIN Reviews rv ON r.recipe_id = rv.recipe_id
  WHERE contributor_id = ?
  `, [req.params.contributor_id], (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


module.exports = {
  landing,
  random,
  ingredient_name,
  recipe,
  ingredient_recipes,
  search_recipes,
  recipe_ingredients,
  easy,
  top_recipes,
  top_ingredients,
  contributors,
  top_ingredient_pairs,
  detailed_metrics,
  rare_ingredients,
  data,
  contributordetails,
}