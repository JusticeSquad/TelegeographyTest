import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import AppHeader from "./components/AppHeader";
import FilterPanel from "./components/FilterPanel";
import { WireCenterProvider } from "./state/WireCenterContext";
import WireCenterContentPanel from "./components/WireCenterContentPanel";

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <WireCenterProvider>
        <main>
          <AppHeader />
          <FilterPanel />
          <WireCenterContentPanel />
        </main>
      </WireCenterProvider>
    </ThemeProvider>
  );
};

export default App;
