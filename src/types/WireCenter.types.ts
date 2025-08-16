export type GlobalPos = {
    lat: number;
    lon: number;
};

export type Npa = string;
export type Nxx = string;
export type NpaMap = Map<Npa, Nxx[]>;

export type WireCenter = {
    clli: string;
    npaMap: NpaMap;
    globalPos: GlobalPos;
};