import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import latLonData from "../data/clli-lat-lon.txt";
import npaNxxData from "../data/clli-npa-nxx.txt";
import { parseWireCenterData } from "../utils/dataReader";
import {
  FilterWireCenterData,
  WireCenter,
} from "../types/WireCenter.types";
import { MapRef } from "react-map-gl/mapbox";

export type WireCenterContextType = {
  wireCenterList: WireCenter[];
  wireCenterDisplayList: WireCenter[];
  mapRef: React.RefObject<MapRef | null> | null;
  filterData: FilterWireCenterData;
  filterAvailableOptions: FilterWireCenterData;

  setMapRef: (mapRef: React.RefObject<MapRef | null>) => void;
  panToWireCenter: (wireCenter: WireCenter) => void;
  addWireCenter: (newWireCenter: WireCenter) => void;
  addFilter: (value: string, isClli: boolean) => void;
  removeFilter: (value: string) => void;
  clearAllFilters: () => void;
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
  const [mapRef, setMapRef] = useState<React.RefObject<MapRef | null> | null>(
    null
  );
  const [filterData, setFilterData] =
    useState<FilterWireCenterData>({
      filterClliList: [],
      filterNpaList: [],
    });

  const filterAvailableOptions = useMemo((): FilterWireCenterData => {
    const result: FilterWireCenterData = {
      filterClliList: [],
      filterNpaList: [],
    };

    wireCenterList.forEach((wc: WireCenter) => {
      if (!result.filterClliList.includes(wc.clli)) {
        result.filterClliList.push(wc.clli);
      }

      for (const npa of wc.npaMap.keys()) {
        if (!result.filterNpaList.includes(npa)) {
          result.filterNpaList.push(npa);
        }
      }
    });

    result.filterClliList.sort((a, b) => a.localeCompare(b));
    result.filterNpaList.sort((a, b) => a.localeCompare(b));

    return result;
  }, [wireCenterList]);

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

  const wireCenterDisplayList = useMemo(() => {
    if (filterData.filterClliList.length === 0 && filterData.filterNpaList.length === 0) {
      return wireCenterList;
    }

    const result: WireCenter[] = [];

    for (const wc of wireCenterList) {
      if (filterData.filterClliList.includes(wc.clli)) {
        result.push(wc);
      }
      else {
        for (const npa of wc.npaMap.keys()) {
          if (filterData.filterNpaList.includes(npa)) {
            result.push(wc);
          }
        }
      }
    }

    return result;
  }, [wireCenterList, filterData]);

  const panToWireCenter = useCallback(
    (wireCenter: WireCenter) => {
      if (mapRef?.current) {
        mapRef.current.flyTo({
          center: [wireCenter.globalPos.lon, wireCenter.globalPos.lat],
          zoom: 14,
          duration: 1000,
        });
      }
    },
    [mapRef]
  );

  const addWireCenter = (newWireCenter: WireCenter) => {
    setWireCenterList((prevState) => [...prevState, newWireCenter]);
  };

  const addFilter = useCallback((value: string, isClli: boolean) => {
    setFilterData((prevState) => {
      if (isClli) {
        if (prevState.filterClliList.includes(value)) {
          return prevState;
        }

        return {
          ...prevState,
          filterClliList: [...prevState.filterClliList, value],
        };
      }
      else {
        if (prevState.filterNpaList.includes(value)) {
          return prevState;
        }

        return {
          ...prevState,
          filterNpaList: [...prevState.filterNpaList, value],
        };
      }
    });
  }, []);

  const removeFilter = useCallback((value: string) => {
    setFilterData((prevState) => {
      if (prevState === null) {
        return prevState;
      }

      return {
        filterClliList: prevState.filterClliList.filter((clli) => clli !== value),
        filterNpaList: prevState.filterNpaList.filter((npa) => npa !== value),
      }
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterData({
      filterClliList: [],
      filterNpaList: [],
    })
  }, []);

  const wireCenterData: WireCenterContextType = {
    wireCenterList,
    wireCenterDisplayList,
    mapRef,
    filterData,
    filterAvailableOptions,

    setMapRef,
    panToWireCenter,
    addWireCenter,
    addFilter,
    removeFilter,
    clearAllFilters,
  };

  return (
    <WireCenterContext.Provider value={wireCenterData}>
      {children}
    </WireCenterContext.Provider>
  );
};

const useWireCenterContext = () => useContext(WireCenterContext);

export default useWireCenterContext;
