import { bicCodes } from "./data/bicCodes";

const validBicCodesSet = new Set(bicCodes);

export const isValidBicCode = (code: string): boolean => {
  return validBicCodesSet.has(code);
};

export const getAllBicCodes = (): string[] => {
  return bicCodes;
};

export const getBicCodesCount = (): number => {
  return bicCodes.length;
};
