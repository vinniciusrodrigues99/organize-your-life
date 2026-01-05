import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function NotFound() {
  return (
    <>
      <View style={styles.container}>
        <Link href="../" style={styles.button}>
          GO back to Home Screen
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000ff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
