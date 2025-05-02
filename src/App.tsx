import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Global } from "@emotion/react";
import { muiTheme, globalStyles } from "./styles/globalStyles";
import MainLayout from "./components/layout";
import Test from "./components/Test";

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Global styles={globalStyles} />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Test />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
