import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import latLonData from "../data/clli-lat-lon.txt";
import npaNxxData from "../data/clli-npa-nxx.txt";
import { parseWireCenterData } from "../utils/dataReader";
import { WireCenter } from "../types/WireCenter.types";

export type WireCenterContextType = {
  wireCenterList: WireCenter[];

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

  useEffect(() => {
    try {
        const parsedWireCenterList: WireCenter[] = parseWireCenterData(
            latLonData,
            npaNxxData,
        );

        setWireCenterList(parsedWireCenterList);
    }
    catch(err) {
        console.error(err);
    }
  }, []);
  // const parsedData = parseWireCenterData(
  //   latLonData.default,
  //   npaNxxData.default
  // );

  const addWireCenter = (newWireCenter: WireCenter) => {
    setWireCenterList((prevState) => [...prevState, newWireCenter]);
  };

  const wireCenterData: WireCenterContextType = {
    wireCenterList,

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
