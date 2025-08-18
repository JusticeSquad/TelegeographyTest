import { WireCenter } from "../types/WireCenter.types";
import { getCountByClli } from "./wireCenterCount";

const COLOR_SCALE = [
  "#E3F2FD",
  "#BBDEFB",
  "#90CAF9",
  "#64B5F6",
  "#42A5F5",
  "#2196F3",
  "#1E88E5",
  "#1976D2",
  "#1565C0",
  "#0D47A1",
] as const;

export const getWireCenterColor = (
    wireCenter: WireCenter,
    wireCenterList: WireCenter[],
): string => {
    const firstCount = getCountByClli(wireCenterList[0]);
    let count: number | null =
        wireCenterList[0].clli === wireCenter.clli ?
        firstCount :
        null;
    let countMax: number = firstCount;
    let countMin: number = firstCount;
    
    // TODO: Cache this calculation
    for (const wc of wireCenterList.slice(1)) {
        const clliCount = getCountByClli(wc);
        
        countMax = Math.max(countMax, clliCount);
        countMin = Math.min(countMin, clliCount);

        if (wc.clli === wireCenter.clli) {
            count = clliCount;
        }
    }

    // TODO: Proper error handling
    // For now, just return the lowest color scale
    if (count === null) {
        console.error(`${wireCenter.clli} -> ${countMin}, ${countMax}`)
        return COLOR_SCALE[0];
    }

    return COLOR_SCALE[Math.min(
        Math.floor((count - countMin) / (countMax - countMin) * COLOR_SCALE.length),
        COLOR_SCALE.length - 1)];
};