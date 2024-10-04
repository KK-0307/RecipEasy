import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { amber, red } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import RecipeInfoPage from './pages/RecipeInfoPage';
import IngredientsPage from './pages/IngredientsPage';
import IngredientInfoPage from './pages/IngredientInfoPage';
import StatsPage from './pages/Stats';
import ContributorInfoPage from './pages/ContributorInfoPage';
import ContributorsPage from './pages/ContributorsPage';
import SearchRecipesPage from './pages/SearchRecipesPage'
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";


export const theme = createTheme({
  palette: {
    primary: red,
    secondary: amber,
  },
});


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          
            <Route path="/recipe/:recipe_id" element={<RecipeInfoPage />}/>
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/ingredients/:ingredient_id" element={<IngredientInfoPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/contributor/:contributor_id" element={<ContributorInfoPage />} />
            <Route path="/contributors" element={<ContributorsPage />} />
            <Route path="/search" element={<SearchRecipesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}