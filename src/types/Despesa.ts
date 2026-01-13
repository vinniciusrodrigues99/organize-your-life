export interface Despesa {
  id: string;
  tipo: Categoria;
  valor: number;
  data: Date;
  descricao?: string;
}

export enum TipoCategoria {
  Alimentacao = "Alimentação",
  Transporte = "Transporte",
  Moradia = "Moradia",
  Lazer = "Lazer",
  CartaoDeCredito = "Cartão de Crédito",
  Outros = "Outros",
}
export interface Categoria {
  id: string;
  name: TipoCategoria;
}
