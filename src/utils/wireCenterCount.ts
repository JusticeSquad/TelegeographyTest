import { WireCenter } from "../types/WireCenter.types";

export const getCountByClli = (
    wireCenter: WireCenter,
): number => {
    let count = 0;

    for (const npaNxxData of wireCenter.npaMap.values()) {
        count += npaNxxData?.length ?? 0;
    }

    return count;
};
