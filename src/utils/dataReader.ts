import {
  CLLI_PRIMARY_LENGTH,
  GlobalPos,
  NpaMap,
  NpaNxxData,
  WireCenter,
} from "../types/WireCenter.types";

export const parseWireCenterData = (
  latLonContent: string,
  npaNxxContent: string
): WireCenter[] => {
  const coordsMap = parseClliLatLonData(latLonContent);
  const npaMap = parseClliNpaNxxData(npaNxxContent);

  return combineWireCenterData(coordsMap, npaMap);
};

const parseClliLatLonData = (fileContent: string): Map<string, GlobalPos> => {
  const coordsMap = new Map<string, GlobalPos>();

  const lineList = fileContent.trim().split("\n");

  for (const line of lineList) {
    const trimmedLine = line.trim();

    const parts = trimmedLine.split("\t");
    if (parts.length !== 3) {
      console.warn(`${line} -> invalid format`);
      continue;
    }

    const [clli, latStr, lonStr] = parts;
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
      console.warn(`${clli} -> invalid coordinates (${latStr}, ${lonStr})`);
      continue;
    }

    coordsMap.set(clli, { lat, lon });
  }

  return coordsMap;
};

const parseClliNpaNxxData = (
  fileContent: string,
): Map<string, NpaMap> => {
  const npaMap = new Map<string, NpaMap>();

  const lines = fileContent.trim().split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();

    const parts = trimmedLine.split("|");
    if (parts.length !== 3) {
      console.warn(`${line} -> invalid format`);
      continue;
    }

    const [clli, npa, nxx] = parts;

    // Validate NPA and NXX are 3-digit numbers
    if (!/^\d{3}$/.test(npa) || !/^\d{3}$/.test(nxx)) {
      console.warn(`${clli} -> invalid NPA/NXX format (${npa}, ${nxx})`);
      continue;
    }

    // Validate that this data isn't already present
    const npaNxxMatchCb = (npaNxxData: NpaNxxData): boolean => {
      return npaNxxData.clliExtended === clli && npaNxxData.nxx === nxx;
    }
    if (
      npaMap.has(clli) &&
      npaMap.get(clli)?.has(npa) &&
      npaMap.get(clli)?.get(npa)?.find(npaNxxMatchCb) !== undefined) {
        console.warn(`${clli} | ${npa}-${nxx} -> data already present, ignoring duplicate`);
        continue;
    }

    // Get or create the CLLI's NPA map
    if (!npaMap.has(clli)) {
      npaMap.set(clli, new Map<string, NpaNxxData[]>());
    }

    const clliNpaMap = npaMap.get(clli)!;

    // Get or create the NPA's NXX array
    if (!clliNpaMap.has(npa)) {
      clliNpaMap.set(npa, []);
    }

    let nxxArray = clliNpaMap.get(npa);

    // Sanity check for undefined value
    if (!nxxArray) {
      nxxArray = [];
    }

    // Add NXX if not already present
    const npaNxxData: NpaNxxData = {
      clliExtended: clli,
      nxx,
    };
    if (!nxxArray.includes(npaNxxData)) {
      nxxArray.push(npaNxxData);
    }
  }

  return npaMap;
};

const combineNpaNxxData = (
  clli: string,
  globalPos: GlobalPos,
  npaMap: NpaMap,
  wireCenterMap: Map<string, WireCenter>
): void => {
  const dupWireCenter = wireCenterMap.get(clli);

  // If the value is somehow undefined, make the new wire center
  if (dupWireCenter === undefined) {
    wireCenterMap.set(clli, {
      clli,
      globalPos,
      npaMap,
    });

    return;
  }

  for (const [npa, npaNxxData] of npaMap) {
    // If the npa is missing, add the npaNxxData directly
    if (!dupWireCenter.npaMap.has(npa)) {
      dupWireCenter.npaMap.set(npa, npaNxxData);
    } else {
      const dupNpaNxxData = dupWireCenter.npaMap.get(npa);

      if (dupNpaNxxData === undefined) {
        dupWireCenter.npaMap.set(npa, npaNxxData);
      }
      else {
        dupWireCenter.npaMap.set(npa, [...dupNpaNxxData, ...npaNxxData]);
      }
    }
  }
};

const combineWireCenterData = (
  coordsMap: Map<string, GlobalPos>,
  npaNxxMap: Map<string, NpaMap>
): WireCenter[] => {
  const wireCenterMap = new Map<string, WireCenter>();

  for (const [clliExtended, npaMap] of npaNxxMap) {
    const clli: string = clliExtended.slice(0, CLLI_PRIMARY_LENGTH);

    if (!coordsMap.has(clli)) {
      continue;
    }
    const globalPos: GlobalPos | undefined = coordsMap.get(clli);
    if (!globalPos) {
      continue;
    }

    if (wireCenterMap.has(clli)) {
      combineNpaNxxData(clli, globalPos, npaMap, wireCenterMap);
    } else {
      wireCenterMap.set(clli, {
        clli,
        globalPos,
        npaMap,
      });
    }
  }
  
  return Array.from(wireCenterMap.values());
};
