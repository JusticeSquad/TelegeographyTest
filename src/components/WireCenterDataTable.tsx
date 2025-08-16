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
        <Box>
            {wireCenterContextData.wireCenterList.map((wireCenter) =>
                <Typography>
                    {wireCenter.clli}
                </Typography>
            )}
        </Box>
    );
};

export default WireCenterDataTable;
