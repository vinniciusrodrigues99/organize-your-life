import React from "react";
import { StyleSheet, View } from "react-native";
import ScannerContainer from "../../src/components/ScannerContainer";

export default function ScannerContainerScreen() {
  return (
    <View style={styles.container}>
      <ScannerContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
