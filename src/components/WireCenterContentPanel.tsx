import Box from "@mui/material/Box";
import WireCenterDataTable from "./WireCenterDataTable";
import WireCenterMap from "./WireCenterMap";

const WireCenterContentPanel: React.FC = () => {
    return (
        <Box>
            <WireCenterDataTable />
            <WireCenterMap />
        </Box>
    );
};

export default WireCenterContentPanel;