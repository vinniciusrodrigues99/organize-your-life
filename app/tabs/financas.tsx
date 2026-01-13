import Button from "@/src/components/Button";
import { Select } from "@/src/components/Select";
import { TipoCategoria } from "@/src/types";
import { formatCurrency } from "@/src/utils/currency";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { styles } from "../../src/theme/global";

export default function Financas() {
  const [valor, setValor] = React.useState("");
  const [descricao, setDescricao] = React.useState<string>("");
  const [categoria, setCategoria] = React.useState<TipoCategoria>();

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
          onChangeText={(text) => setValor(formatCurrency(text))}
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
        <Button label="Adicionar"></Button>
      </View>
    </View>
  );
}
