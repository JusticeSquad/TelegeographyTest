import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Map, {
  MapRef,
  Marker,
  Popup,
  ViewState,
  ViewStateChangeEvent,
} from "react-map-gl/mapbox";
import useWireCenterContext from "../state/WireCenterContext";
import { WireCenter } from "../types/WireCenter.types";
import { getWireCenterColor } from "../utils/colorScale";
import { getCountByClli } from "../utils/wireCenterCount";
import Place from "@mui/icons-material/Place";

const WireCenterMap: React.FC = () => {
  const wireCenterContextData = useWireCenterContext();
  const [selectedWireCenter, setSelectedWireCenter] =
    useState<WireCenter | null>(null);
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    latitude: 40,
    longitude: -75,
    zoom: 9,
  });
  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    if (mapRef) {
      wireCenterContextData?.setMapRef(mapRef);
    }
  }, [wireCenterContextData?.setMapRef, mapRef]);

  if (wireCenterContextData === undefined) {
    throw new Error();
  }

  const handleMapMove = (e: ViewStateChangeEvent) => setViewState(e.viewState);
  const handleMarkerClick = (e: any, wireCenter: WireCenter) => {
    e.stopPropagation();
    setSelectedWireCenter(wireCenter);
  };
  const handlePopupClose = () => {
    setSelectedWireCenter(null);
  };

  return (
    <Box id="wire-center-map-panel">
      <div id="wire-center-map-wrapper">
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
          {...viewState}
          style={{ width: "100%", height: "400px" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          onMove={handleMapMove}
        >
          {wireCenterContextData.wireCenterDisplayList.map((wc) => (
            <Marker
              key={wc.clli}
              longitude={wc.globalPos.lon}
              latitude={wc.globalPos.lat}
              anchor="bottom"
            >
              <div onClick={(e) => handleMarkerClick(e, wc)}>
                <Place sx={{ color: getWireCenterColor(wc, wireCenterContextData.wireCenterList) }} />
              </div>
            </Marker>
          ))}

          {selectedWireCenter && (
            <Popup
              latitude={selectedWireCenter.globalPos.lat}
              longitude={selectedWireCenter.globalPos.lon}
              anchor="top"
              maxWidth="250px"
              onClose={handlePopupClose}
            >
              <div className="wire-center-map-popup-content-wrapper">
                <Typography>{selectedWireCenter.clli}</Typography>
                <Typography>Count - {getCountByClli(selectedWireCenter)}</Typography>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </Box>
  );
};

export default WireCenterMap;
