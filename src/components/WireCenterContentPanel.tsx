import Box from "@mui/material/Box";
import WireCenterDataTable from "./WireCenterDataTable";
import WireCenterMap from "./WireCenterMap";

const WireCenterContentPanel: React.FC = () => {
    return (
        <Box id="wire-center-content-panel">
            <WireCenterDataTable />
            <WireCenterMap />
        </Box>
    );
};

export default WireCenterContentPanel;