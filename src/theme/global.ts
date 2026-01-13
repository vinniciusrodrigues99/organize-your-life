import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
