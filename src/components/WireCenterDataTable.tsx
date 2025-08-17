import Box from "@mui/material/Box";
import { useContext } from "react";
// import WireCenterContext from "../state/WireCenterContext";
import Typography from "@mui/material/Typography";
import useWireCenterContext from "../state/WireCenterContext";

const WireCenterDataTable: React.FC = () => {
    // const wireCenterContextData = useContext(WireCenterContext);
    const wireCenterContextData = useWireCenterContext();

    if (wireCenterContextData === undefined) {
        throw new Error();
    }

    return (
        <Box id="wire-center-data-table-panel">
            {wireCenterContextData.wireCenterList.map((wc) =>
                <Typography key={wc.clli}>
                    {wc.clli} - {(typeof wc.globalPos.lon === "number" && typeof wc.globalPos.lat === "number") ? `${wc.globalPos.lon.toFixed(2)}, ${wc.globalPos.lat.toFixed(2)}` : "error"}
                </Typography>
            )}
        </Box>
    );
};

export default WireCenterDataTable;
