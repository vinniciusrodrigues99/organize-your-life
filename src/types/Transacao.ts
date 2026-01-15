export interface Transacao {
  id?: string;
  tipo: Categoria;
  valor: number;
  data: string;
  descricao?: string;
}

export enum TipoCategoria {
  Salario = "Salário",
  FreeLancer = "Freelancer",
  Alimentacao = "Alimentação",
  Transporte = "Transporte",
  Moradia = "Moradia",
  Lazer = "Lazer",
  CartaoDeCredito = "Cartão de Crédito",
  Investimentos = "Investimentos",
  Outros = "Outros",
}
export interface Categoria {
  id?: string;
  name: TipoCategoria;
}
