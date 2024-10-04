import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Modal, Rating } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

/**
 * A modal component that displays detailed information about a recipe,
 * including nutritional facts and graphical representations of data.
 * The modal behavior is open or close.
 *
 * @param {string} recipeId - ID of the recipe to fetch details for.
 * @param {Function} handleClose - Function to call when the modal needs to be closed.
 */
export default function RecipeCard({ recipeId, handleClose }) {
  const [recipeData, setrecipeData] = useState({ reviews: [] });
  const [barRadar, setBarRadar] = useState(true);

  // Fetch recipe data whenever recipeId changes
  useEffect(() => {
     fetch(`http://${config.server_host}:${config.server_port}/recipes/${recipeId}`)
       .then(res => res.json())
       .then(resJson => {
         setrecipeData(resJson)
         })
  }, [recipeId]);

  // Prepare chart data based on recipe details
  const chartData = [
    { name: 'Fat', value: recipeData.fat },
    { name: 'Sugar', value: recipeData.sugar },
    { name: 'Protein', value: recipeData.protein },
  ];

  // Toggle between Bar and Radar chart views
  const handleGraphChange = () => {
    setBarRadar(!barRadar);
  };
  
  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #E5DDC5', width: 400 }}
      >
        <h1>{recipeData.title}</h1>
        <h2>Recipe:&nbsp;
          <NavLink to={`/recipe/${recipeData.recipe_id}`}>{recipeData.name}</NavLink>
        </h2>
        <Rating name="read-only" value={Math.min(Math.round(recipeData.avg_rating * 4) / 4, 5)} readOnly precision={0.25}/>
        <p>Calories: {recipeData.calories}</p>
        <p>Fat: {recipeData.fat} g</p>
        <p>Sugar: {recipeData.sugar} g</p>
        <p>Protein: {recipeData.protein} g</p>
        <ButtonGroup>
          <Button disabled={barRadar} onClick={handleGraphChange}>Bar</Button>
          <Button disabled={!barRadar} onClick={handleGraphChange}>Radar</Button>
        </ButtonGroup>
        <div style={{ margin: 20 }}>
          { // This ternary statement returns a BarChart if barRadar is true, and a RadarChart otherwise
            barRadar
              ? (
                <ResponsiveContainer height={250}>
                  <BarChart
                    data={chartData}
                    layout='vertical'
                    margin={{ left: 40 }}
                  >
                    <XAxis type='number' domain={[0, 1]} />
                    <YAxis type='category' dataKey='name' />
                    <Bar dataKey='value' stroke='#BACD92' fill='#BACD92' />
                  </BarChart>

                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer height={250}>
                  <RadarChart 
                      outerRadius={90} 
                      width={730} 
                      height={250} 
                      data={chartData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={90} domain={[0, 1]} />
                    <Radar name="Metric" dataKey="value" stroke="#75A47F" fill="#75A47F" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              )
          }
        </div>
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}