import { Button, Card, Chip, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import useWireCenterContext from "../state/WireCenterContext";
import { FilterWireCenterData } from "../types/WireCenter.types";
import { useState } from "react";

const FilterPanel: React.FC = () => {
  const [filterInput, setFilterInput] = useState<string>("");
  const wireCenterContextData = useWireCenterContext();

  if (wireCenterContextData === undefined) {
    throw new Error();
  }

  const remainingFilterOptions: FilterWireCenterData = {
    filterClliList:
      wireCenterContextData?.filterAvailableOptions.filterClliList.filter(
        (clli) =>
          !wireCenterContextData?.filterData.filterClliList.includes(clli)
      ),
    filterNpaList: wireCenterContextData?.filterAvailableOptions.filterNpaList.filter(
        (npa) =>
          !wireCenterContextData?.filterData.filterNpaList.includes(npa)
      ),
  };

  const handleAutocompleteChange = (event: any, selectedOption: string | null) => {
    if (selectedOption !== null) {
      const isNpa = /^\d{3}$/.test(selectedOption);
      wireCenterContextData.addFilter(selectedOption, !isNpa);
      setFilterInput("");
    }
  };

  const handleChipDelete = (filterToRemove: string) => {
    wireCenterContextData.removeFilter(filterToRemove);
  };

  return (
    <Card id="filter-panel-container">
      <Box id="filter-panel-filter-container">
        <Typography>Filter Wire Centers:</Typography>

        <Autocomplete
          disablePortal
          options={[
            ...remainingFilterOptions.filterClliList,
            ...remainingFilterOptions.filterNpaList,
          ]}
          onInputChange={(e, newInputValue) => setFilterInput(newInputValue)}
          onChange={handleAutocompleteChange}
          value={filterInput}
          renderInput={(params) => <TextField {...params} />}
          noOptionsText="No matching CLLIs or NPAs"
        />
      </Box>

      {wireCenterContextData.filterData.filterClliList.length +
        wireCenterContextData.filterData.filterNpaList.length > 0 &&
        <Box id="filter-panel-chips-container">
          <Button
            variant="contained"
            onClick={() => wireCenterContextData.clearAllFilters()}
          >
            Clear All
          </Button>

          <Box>
            {[...wireCenterContextData.filterData.filterClliList, ...wireCenterContextData.filterData.filterNpaList].map((filterValue) =>
              <Chip
                key={filterValue}
                label={filterValue}
                onDelete={() => handleChipDelete(filterValue)}
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      }
    </Card>
  );
};

export default FilterPanel;
