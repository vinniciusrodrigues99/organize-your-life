export const formatCurrency = (value: string): string => {
  let limpo = value.replace(/\D/g, "");
  let valorFormatado = Number(limpo) / 100;
  return valorFormatado.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};
