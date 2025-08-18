import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import WireCenterContext from "../state/WireCenterContext";
import Typography from "@mui/material/Typography";
import useWireCenterContext from "../state/WireCenterContext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import Place from "@mui/icons-material/Place";
import { Npa, NpaNxxData, WireCenter } from "../types/WireCenter.types";
import { getCountByClli } from "../utils/wireCenterCount";
import { getWireCenterColor } from "../utils/colorScale";

const WireCenterDataTable: React.FC = () => {
  // const wireCenterContextData = useContext(WireCenterContext);
  const wireCenterContextData = useWireCenterContext();

  if (wireCenterContextData === undefined) {
    throw new Error();
  }

  const handlePanToWireCenter = (wireCenter: WireCenter): void => {
    wireCenterContextData.panToWireCenter(wireCenter);
  }

  return (
    <Card id="wire-center-data-table-panel">
      <CardContent>
        {wireCenterContextData.wireCenterDisplayList.map((wc) => (
          // <Typography key={wc.clli}>
          //     {wc.clli} - {(typeof wc.globalPos.lon === "number" && typeof wc.globalPos.lat === "number") ? `${wc.globalPos.lon.toFixed(2)}, ${wc.globalPos.lat.toFixed(2)}` : "error"}
          // </Typography>
          <Accordion key={wc.clli}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="wire-center-data-table-accordion-summary-container">
                <div className="wire-center-data-table-accordion-summary-title-container">
                  <Place
                    className="wire-center-data-table-accordion-summary-map-icon"
                    sx={{ color: getWireCenterColor(wc, wireCenterContextData.wireCenterList) }}
                  />
                  <Typography>{wc.clli}</Typography>
                </div>
                <Typography>{getCountByClli(wc)}</Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="wire-center-data-table-accordion-details-pan-btn">
                <Button
                  variant="contained"
                  onClick={() => handlePanToWireCenter(wc)}>
                  Pan to Wire Center
                </Button>
              </div>
              {wc.npaMap.keys().map((npa: Npa) => (
                <Accordion key={`${wc.clli}-${npa}`}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{npa} - {wc.npaMap.get(npa)?.length ?? 0}</Typography>
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
