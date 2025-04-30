import { Global } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { muiTheme, globalStyles } from "./styles/globalStyles";

import Header from "./components/layout/Header";

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Global styles={globalStyles} />
      <Header />
    </ThemeProvider>
  );
}

export default App;
