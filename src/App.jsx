import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import Interface from "./Components/Surface/Interface";
import theme from "./Theme/Theme";

// Axios CSRF security
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Interface />
          <hr />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
