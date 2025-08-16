import { GlobalPos, Npa, NpaMap, Nxx, WireCenter } from "../types/WireCenter.types";

export const parseWireCenterData = (
  latLonContent: string,
  npaNxxContent: string
): WireCenter[] => {
  const coordsMap = parseClliLatLonData(latLonContent);
  const npaMap = parseClliNpaNxxData(npaNxxContent);

  return combineWireCenterData(coordsMap, npaMap);
};

const parseClliLatLonData = (
  fileContent: string
): Map<string, GlobalPos> => {
  const coordsMap = new Map<string, GlobalPos>();

  const lineList = fileContent.trim().split("\n");

  for (const line of lineList) {
    const trimmedLine = line.trim();

    // Skip empty lines
    // if (!trimmedLine) {
    //     continue;
    // }

    const parts = trimmedLine.split("\t");
    if (parts.length !== 3) {
      console.warn(`${line} -> invalid format`);
      continue;
    }

    const [clli, latStr, lonStr] = parts;
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
      console.warn(
        `${clli} -> invalid coordinates (${latStr}, ${lonStr})`
      );
      continue;
    }

    coordsMap.set(clli, { lat, lon });
  }

  return coordsMap;
};

function parseClliNpaNxxData(fileContent: string): Map<string, NpaMap> {
  const npaMap = new Map<string, NpaMap>();

  const lines = fileContent.trim().split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();
    // if (!trimmedLine) continue; // Skip empty lines

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

    // Get or create the CLLI's NPA map
    if (!npaMap.has(clli)) {
      npaMap.set(clli, new Map<string, string[]>());
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
    if (!nxxArray.includes(nxx)) {
      nxxArray.push(nxx);
    }
  }

  return npaMap;
}

function combineWireCenterData(
  coordsMap: Map<string, GlobalPos>,
  npaMap: Map<string, NpaMap>
): WireCenter[] {
  const wireCenters: WireCenter[] = [];

  // Loop through CLLI's
  for (const [clli, coords] of coordsMap) {
    // Get NPA/NXX data related to current CLLI
    const npaData = npaMap.get(clli) || new Map<Npa, Nxx[]>();

    wireCenters.push({
      clli,
      npaMap: npaData,
      globalPos: coords,
    });
  }

  // Log any CLLIs that have NPA-NXX data but no coordinates
  for (const clli of npaMap.keys()) {
    if (!coordsMap.has(clli)) {
      console.warn(`CLLI ${clli} has NPA-NXX data but no coordinates`);
    }
  }

  return wireCenters;
}
