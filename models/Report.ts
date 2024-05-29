export type CatSterilizationReport = {
  content: string;
};

export const castToReport = (
  backendReport: string
): CatSterilizationReport => ({ content: backendReport });
