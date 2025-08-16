import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import AppHeader from "./components/AppHeader";
import FilterPanel from "./components/FilterPanel";
import WireCenterContext, { WireCenterContextType, WireCenterProvider } from "./state/WireCenterContext";
import WireCenterContentPanel from "./components/WireCenterContentPanel";
// import latLonData from "./data/clli-lat-lon.txt";
// import npaNxxData from "./data/clli-npa-nxx.txt";

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
