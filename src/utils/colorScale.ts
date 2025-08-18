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

const COLOR_SCALE_MAX = 400;
const COLOR_SCALE_SPLIT = 50;

export const getWireCenterColor = (wireCenter: WireCenter): string => {
    const count = getCountByClli(wireCenter);

    if (count >= COLOR_SCALE_MAX) {
        return COLOR_SCALE[9];
    }

    return COLOR_SCALE[Math.floor(count / COLOR_SCALE_SPLIT)];
};