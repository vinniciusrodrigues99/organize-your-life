import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Financas() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle a sua vida financeira</Text>
      <View style={styles.form}>
        <Text
          style={{
            fontSize: 18,
            color: "#FFFFFF",
            fontWeight: "bold",
            marginBottom: 6,
            letterSpacing: 0.75,
            textTransform: "uppercase",
          }}
        >
          Despesa:{" "}
        </Text>
        <TextInput
          placeholder="Valor R$"
          style={styles.textInput}
          placeholderTextColor={"#666"}
          selectionColor="#FFFFFF"
        ></TextInput>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#000000ff",
    padding: 24,
    gap: 24,
  },
  form: {
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: "Arial",
    color: "#ffffffff",
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  textInput: {
    fontSize: 20,
    fontFamily: "Arial",
    width: 300,
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 15,
    color: "#fff",
    backgroundColor: "#111",
  },
});
