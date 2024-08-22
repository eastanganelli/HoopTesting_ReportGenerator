interface QueryStandard {
    id:                 number;
    standard:           string;
    endcaps:            { key: number; endcap: string; }[];
    enviroments:        { key: number; insideFluid: string; outsideFluid: string; }[];
    conditionalperiods: { ket: number; maxwall: number; minwall: number; condPeriod: string; }[];
    testtypes:          { key: number; testtype: string; }[];
    materials:          { key: number; idMaterial: number; material: string; description: string;
                            specifications: { key: number; specification: string; description: string; }[]
                        }[];
};

interface QueryOperator {
    key:        number;
    dni:        number;
    name:       string;
    familyName: string;
};

interface QueryStatic {
    standards: QueryStandard[];
    operator:  QueryOperator[];
};

export type { QueryStatic, QueryStandard, QueryOperator };