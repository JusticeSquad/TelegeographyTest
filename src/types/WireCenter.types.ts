type Npa = string;
type Nxx = string;

type WireCenter = {
    clli: string;
    npaMap: Map<Npa, Nxx[]>;
    lat: number;
    lon: number;
};