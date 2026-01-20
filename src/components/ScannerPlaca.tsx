import { StyleSheet, TextInput, View } from "react-native";
import { Camera } from "react-native-vision-camera";
import Button from "../components/camera/Button";
import { styles } from "../theme/global";

export default function ScannerPlaca() {
  return (
    <View style={styles.container}>
      <View style={stylesScanner.options}>
        <Button icon="camera" onPress={handleToggleCameraPosition} />
        <Button
          icon="bolt"
          onPress={handleToggleFlash}
          color={isFlashOn ? "#FFD700" : "#888"}
        />
      </View>

      <Camera
        key={cameraKey}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!isPaused}
        frameProcessor={frameProcessor}
        torch={isFlashOn ? "on" : "off"}
      />

      <View style={stylesScanner.overlay}>
        <View style={stylesScanner.targetRegion} />
        <Text style={stylesScanner.instruction}>
          Aponte para o QR Code ou código de barras da placa
        </Text>
        <TextInput
          style={stylesScanner.textInput}
          value={text}
          onChangeText={setText}
          editable={false}
          placeholderTextColor="#888"
        />
      </View>
    </View>
  );
}

const stylesScanner = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  targetRegion: {
    width: "80%",
    height: 120,
    borderWidth: 3,
    borderColor: "#00FF00",
    borderRadius: 12,
    backgroundColor: "rgba(0, 255, 0, 0.05)",
  },
  instruction: {
    color: "white",
    marginTop: 20,
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  options: {
    position: "absolute",
    top: 40,
    right: 20,
    flexDirection: "column",
    zIndex: 10,
    gap: 8,
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
    color: "#000000",
    backgroundColor: "#ffffff",
    marginTop: 20,
  },
});
