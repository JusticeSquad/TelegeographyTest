export const CLLI_PRIMARY_LENGTH = 8;

export type GlobalPos = {
    lat: number;
    lon: number;
};

export type Npa = string;
export type Nxx = string;
export type NpaNxxData = {
    clliExtended: string;
    nxx: Nxx;
};
export type NpaMap = Map<Npa, NpaNxxData[]>;

export type WireCenter = {
    clli: string;
    npaMap: NpaMap;
    globalPos: GlobalPos;
};

export type FilterWireCenterData = {
    filterClliList: string[];
    filterNpaList: Npa[];
}