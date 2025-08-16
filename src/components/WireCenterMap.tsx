import Box from "@mui/material/Box";
import { useContext } from "react";
// import WireCenterContext from "../state/WireCenterContext";
import Typography from "@mui/material/Typography";
import useWireCenterContext from "../state/WireCenterContext";

const WireCenterMap: React.FC = () => {
    const wireCenterContextData = useWireCenterContext();

    if (wireCenterContextData === undefined) {
        throw new Error();
    }

    return (
        <Box>
            <Typography>Map</Typography>
            {wireCenterContextData.wireCenterList.map((wireCenter) =>
                <Typography>
                    {wireCenter.clli}
                </Typography>
            )}
        </Box>
    );
};

export default WireCenterMap;