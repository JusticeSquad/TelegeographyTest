import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import latLonData from "../data/clli-lat-lon.txt";
import npaNxxData from "../data/clli-npa-nxx.txt";
import { parseWireCenterData } from "../utils/dataReader";
import { WireCenter } from "../types/WireCenter.types";
import { MapRef } from "react-map-gl/mapbox";

export type WireCenterContextType = {
  wireCenterList: WireCenter[];
  mapRef: React.RefObject<MapRef | null> | null;

  setMapRef: (mapRef: React.RefObject<MapRef | null>) => void;
  panToWireCenter: (wireCenter: WireCenter) => void;
  addWireCenter: (newWireCenter: WireCenter) => void;
};
type WireCenterProviderProps = {
  children: ReactNode;
};

const WireCenterContext = createContext<WireCenterContextType | undefined>(
  undefined
);

export const WireCenterProvider: React.FC<WireCenterProviderProps> = ({
  children,
}) => {
  const [wireCenterList, setWireCenterList] = useState<WireCenter[]>([]);
  const [mapRef, setMapRef] = useState<React.RefObject<MapRef | null> | null>(null);

  useEffect(() => {
    try {
      const parsedWireCenterList: WireCenter[] = parseWireCenterData(
        latLonData,
        npaNxxData
      );

      setWireCenterList(parsedWireCenterList);
    } catch (err) {
      console.error(err);
    }
  }, []);
  // const parsedData = parseWireCenterData(
  //   latLonData.default,
  //   npaNxxData.default
  // );

  const panToWireCenter = useCallback(
    (wireCenter: WireCenter) => {
      if (mapRef?.current) {
        mapRef.current.flyTo({
          center: [wireCenter.globalPos.lon, wireCenter.globalPos.lat],
          zoom: 14,
          duration: 1000,
        });
      }
    }, [mapRef]);

  const addWireCenter = (newWireCenter: WireCenter) => {
    setWireCenterList((prevState) => [...prevState, newWireCenter]);
  };

  const wireCenterData: WireCenterContextType = {
    wireCenterList,
    mapRef,

    setMapRef,
    panToWireCenter,
    addWireCenter,
  };

  return (
    <WireCenterContext.Provider value={wireCenterData}>
      {children}
    </WireCenterContext.Provider>
  );
};

const useWireCenterContext = () => useContext(WireCenterContext);

export default useWireCenterContext;
