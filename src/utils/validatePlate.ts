export const validatePlate = (plate: string): string | null => {
    const cleanText = plate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const mercosulRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    const tradicionalRegex = /^[A-Z]{3}[0-9]{4}$/;

    if (mercosulRegex.test(cleanText) || tradicionalRegex.test(cleanText)) {
        return cleanText;
    }
    return null;
};