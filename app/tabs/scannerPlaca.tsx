import React from "react";
import { StyleSheet, View } from "react-native";
import ScannerPlaca from "../../src/components/ScannerPlaca";

export default function ScannerPlacaScreen() {
  return (
    <View style={styles.container}>
      <ScannerPlaca />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
