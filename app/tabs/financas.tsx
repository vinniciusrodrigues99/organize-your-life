import Button from "@/components/Button";
import { Select } from "@/components/Select";
import { TipoCategoria } from "@/types";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Financas() {
  const [valor, setValor] = React.useState("");
  const [descricao, setDescricao] = React.useState<string>("");
  const [categoria, setCategoria] = React.useState<TipoCategoria>();

  const formatarMoeda = (valor: string) => {
    let limpo = valor.replace(/\D/g, "");

    let valorFormatado = (Number(limpo) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    setValor(valorFormatado);
  };
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.text}>Valor: </Text>
        <TextInput
          placeholder="Valor R$"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
          keyboardType="numeric"
          onChangeText={formatarMoeda}
          value={valor}
        ></TextInput>

        <Text style={styles.text}>Descrição: </Text>
        <TextInput
          placeholder="Descrição"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
          onChangeText={setDescricao}
          value={descricao}
        ></TextInput>

        <Select
          options={Object.values(TipoCategoria).map((categoria) => ({
            label: categoria,
            value: categoria,
          }))}
          selectedValue={categoria as TipoCategoria}
          onSelect={(value) => setCategoria(value as TipoCategoria)}
          label="Selecione a categoria"
          placeholder="Aluguel"
        />
        <Button label="Adicionar Despesa"></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000000ff",
    padding: 20,
    gap: 32,
  },
  form: {
    gap: 16,
    marginTop: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "Arial",
    color: "#ffffffff",
    fontWeight: "700",
    letterSpacing: 2.0,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 12,
    padding: 4,
  },
  textInput: {
    fontSize: 18,
    fontFamily: "Arial",
    width: 340,
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 15,
    color: "#fff",
    backgroundColor: "#111",
    marginBottom: 10,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.8,
  },
});
