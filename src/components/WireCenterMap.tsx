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
    console.log(`---------- click ${wireCenter.clli}`);
    setSelectedWireCenter(wireCenter);
  };
  const handlePopupClose = () => {
    setSelectedWireCenter(null);
  };

  return (
    <Box id="wire-center-map-panel">
      {/* <div>
        Selected: {selectedWireCenter ? selectedWireCenter.clli : "null"}
        {`${viewState.longitude?.toFixed(2)}, ${viewState.latitude?.toFixed(2)}`}
      </div> */}
      <div id="wire-center-map-wrapper">
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
          {...viewState}
          style={{ width: "100%", height: "400px" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          onMove={handleMapMove}
        >
          {wireCenterContextData.wireCenterList.map((wc) => (
            <Marker
              key={wc.clli}
              longitude={wc.globalPos.lon}
              latitude={wc.globalPos.lat}
              anchor="bottom"
            >
              {/* <div
                style={{
                  transform: `scale(${Math.max(
                    0.5,
                    Math.min(
                      1.5,
                      viewState.zoom !== undefined ? viewState.zoom / 10 : 1.5
                    )
                  )})`,
                  transformOrigin: "center bottom",
                }}
              > */}
              <div onClick={(e) => handleMarkerClick(e, wc)}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                    fill={getWireCenterColor(wc, wireCenterContextData.wireCenterList)}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="9" r="3" fill="white" />
                </svg>
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
