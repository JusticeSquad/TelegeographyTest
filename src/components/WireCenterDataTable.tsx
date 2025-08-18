import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import WireCenterContext from "../state/WireCenterContext";
import Typography from "@mui/material/Typography";
import useWireCenterContext from "../state/WireCenterContext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
} from "@mui/material";
import Place from "@mui/icons-material/Place";
import { Npa, NpaNxxData, Nxx } from "../types/WireCenter.types";

const WireCenterDataTable: React.FC = () => {
  // const wireCenterContextData = useContext(WireCenterContext);
  const wireCenterContextData = useWireCenterContext();

  if (wireCenterContextData === undefined) {
    throw new Error();
  }

  return (
    <Card id="wire-center-data-table-panel">
      <CardContent>
        {wireCenterContextData.wireCenterList.map((wc) => (
          // <Typography key={wc.clli}>
          //     {wc.clli} - {(typeof wc.globalPos.lon === "number" && typeof wc.globalPos.lat === "number") ? `${wc.globalPos.lon.toFixed(2)}, ${wc.globalPos.lat.toFixed(2)}` : "error"}
          // </Typography>
          <Accordion key={wc.clli}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="wire-center-data-table-accordion-summary-container">
                <Typography>{wc.clli}</Typography>
                <Place className="wire-center-data-table-accordion-summary-map-icon" />
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {wc.npaMap.keys().map((npa: Npa) => (
                <Accordion key={`${wc.clli}-${npa}`}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{npa}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {wc.npaMap.get(npa)?.map((npaNxxData: NpaNxxData) => (
                            <Typography key={`${npaNxxData.clliExtended}-${npa}-${npaNxxData.nxx}`}>
                                {`${npaNxxData.clliExtended} | ${npa}-${npaNxxData.nxx}`}
                            </Typography>
                        ))}
                    </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
};

export default WireCenterDataTable;
