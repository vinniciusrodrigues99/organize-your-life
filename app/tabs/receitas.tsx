import { TipoCategoria } from "@/src/types/Despesa";
import { formatCurrency } from "@/src/utils/currency";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { styles } from "../../src/theme/global";

export default function Receitas() {
  const [valor, setValor] = React.useState("");
  const [descricao, setDescricao] = React.useState<string>("");
  const [categoria, setCategoria] = React.useState<TipoCategoria>();

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
          onChangeText={(text) => setValor(formatCurrency(text))}
          value={valor}
        ></TextInput>

        <Text style={styles.text}>Valor das receitas: </Text>
        <TextInput
          placeholder="Valor R$"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
          onChangeText={setDescricao}
          value={descricao}
          keyboardType="numeric"
        ></TextInput>

        <Text style={styles.text}>Valor das despesas: </Text>
        <TextInput
          placeholder="Valor R$"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
          onChangeText={setDescricao}
          value={descricao}
          keyboardType="numeric"
        ></TextInput>

        <Text style={styles.text}>Saldo final: </Text>
        <TextInput
          placeholder="Valor R$"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
          onChangeText={setDescricao}
          value={descricao}
          keyboardType="numeric"
        ></TextInput>

        <Text style={styles.text}>Investimentos: </Text>
        <TextInput
          placeholder="Valor R$"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
          onChangeText={setDescricao}
          value={descricao}
          keyboardType="numeric"
        ></TextInput>
      </View>
    </View>
  );
}
