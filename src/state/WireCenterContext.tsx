import { createContext, ReactNode, useContext, useEffect, useState } from "react";

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

// export default WireCenterContext;

export const WireCenterProvider: React.FC<WireCenterProviderProps> = ({
  children,
}) => {
  const [wireCenterList, setWireCenterList] = useState<WireCenter[]>([]);

  useEffect(() => {
    setWireCenterList([
      {
        clli: "CLLI 1",
        lat: 0,
        lon: 0,
        npaMap: new Map(),
      },
      {
        clli: "CLLI 2",
        lat: 0,
        lon: 0,
        npaMap: new Map(),
      },
      {
        clli: "CLLI 3",
        lat: 0,
        lon: 0,
        npaMap: new Map(),
      },
    ]);
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
