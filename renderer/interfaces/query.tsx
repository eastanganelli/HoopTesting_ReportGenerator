interface TestSample {
    idSample: number;
    standard: string;
    material: string;
    mySpecimens: TestSpecimen[];
};

interface TestSpecimen {
    idSpecimen: number;
    init: string;
    end: string;
    duration: string;
    operator: string;
};

export type { TestSample, TestSpecimen };