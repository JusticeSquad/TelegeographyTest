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
    }

    setFilterInput("");
  };

  const handleInputChange = (event: any, newInputValue: string) => {
    setFilterInput(newInputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const allOptions = [
        ...remainingFilterOptions.filterClliList,
        ...remainingFilterOptions.filterNpaList,
      ];
      
      const matchingOption = allOptions.find(option => 
        option.toLowerCase().includes(filterInput.toLowerCase())
      );
      
      if (matchingOption) {
        const isNpa = /^\d{3}$/.test(matchingOption);
        wireCenterContextData.addFilter(matchingOption, !isNpa);
        setFilterInput("");
        event.preventDefault();
      }
    }
  };

  const handleChipDelete = (filterToRemove: string) => {
    wireCenterContextData.removeFilter(filterToRemove);
  };

  return (
    <Card id="filter-panel-container">
      <Box id="filter-panel-filter-container">
        <Typography variant="h5">Filter Wire Centers:</Typography>

        <Autocomplete
          disablePortal
          options={[
            ...remainingFilterOptions.filterClliList,
            ...remainingFilterOptions.filterNpaList,
          ]}
          getOptionLabel={(option) => option}
          inputValue={filterInput}
          onInputChange={handleInputChange}
          onChange={handleAutocompleteChange}
          value={null}
          renderInput={(params) => <TextField {...params} onKeyDown={handleKeyDown} placeholder="Enter CLLI or NPA" />}
          noOptionsText="No matching CLLIs or NPAs"
          clearOnEscape
          forcePopupIcon={false}
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
