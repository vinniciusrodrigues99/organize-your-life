import { useAppSelector } from "@/src/store/hooks";
import { TipoCategoria } from "@/src/types/Transacao";
import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import { styles } from "../../src/theme/global";

export default function ResumoFinanceiro() {
  const [descricao, setDescricao] = React.useState<string>("");
  const [saldoSalario, setSaldoSalario] = React.useState<string>("");
  const [saldoReceitas, setSaldoReceitas] = React.useState<string>("");
  const [saldoDespesas, setSaldoDespesas] = React.useState<string>("");
  const [saldoFinal, setSaldoFinal] = React.useState<string>("");
  const [investimentos, setInvestimentos] = React.useState<string>("");

  const transacoes = useAppSelector((state) => state.transacoes).lista;
  
  useEffect(() => {
    const totalSalario = transacoes
      .filter(t => t.tipo.name == TipoCategoria.Salario)
      .reduce((acc, curr) => acc + curr.valor, 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    setSaldoSalario(totalSalario);
    
    const totalReceitas = transacoes.filter(t => t.tipo.name == TipoCategoria.FreeLancer).reduce((acc, current) => acc + current.valor, 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setSaldoReceitas(totalReceitas);
    
    const totalDespesas = transacoes.filter(t => t.tipo.name != TipoCategoria.Salario && t.tipo.name != TipoCategoria.FreeLancer).reduce((acc, current) => acc + current.valor, 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setSaldoDespesas(totalDespesas);

    const totalInvestimentos = transacoes.filter(t => t.tipo.name == TipoCategoria.Investimentos).reduce((acc, current) => acc + current.valor, 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setInvestimentos(totalInvestimentos);

  }, [transacoes]);

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.text}>Valor do seu salário: </Text>
        <TextInput
          placeholder="Valor R$"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
          keyboardType="numeric"
          editable={false}
          value={saldoSalario}
        >
        </TextInput>

        <Text style={styles.text}>Valor das receitas: </Text>
        <TextInput
          placeholder="Valor R$"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
          onChangeText={setDescricao}
          value={saldoReceitas}
          keyboardType="numeric"
        ></TextInput>

        <Text style={styles.text}>Valor das despesas: </Text>
        <TextInput
          placeholder="Valor R$"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
          onChangeText={setDescricao}
          value={saldoDespesas}
          keyboardType="numeric"
        ></TextInput>

        <Text style={styles.text}>Saldo final: </Text>
        <TextInput
          placeholder="Valor R$"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
          onChangeText={setDescricao}
          value={saldoFinal}
          keyboardType="numeric"
        ></TextInput>

        <Text style={styles.text}>Investimentos: </Text>
        <TextInput
          placeholder="Valor R$"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
          onChangeText={setDescricao}
          value={investimentos}
          keyboardType="numeric"
        ></TextInput>
      </View>
    </View>
  );
}
