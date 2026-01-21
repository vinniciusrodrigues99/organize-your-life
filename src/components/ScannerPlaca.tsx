import { scanOCR } from "@ismaelmoreiraa/vision-camera-ocr";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useTensorflowModel } from "react-native-fast-tflite";
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useRunOnJS, useSharedValue } from "react-native-worklets-core";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { styles } from "../../src/theme/global";
import Button from "./camera/Button";

export default function ScannerPlaca() {
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const alertOpenRef = useRef(false);
  const lastProcessedRef = useRef(0);
  const [text, setText] = useState<string>("");
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>("back");
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [cameraKey, setCameraKey] = useState(0);

  // Shared values para detecção de duplicatas
  const lastDetectedPlateShared = useSharedValue("");
  const lastDetectedTimeShared = useSharedValue(0);

  // Carrega o modelo TFLite
  const objectDetection = useTensorflowModel(
    require("../../assets/models/ssd_mobilenet_v1.tflite"),
  );
  const model =
    objectDetection.state === "loaded" ? objectDetection.model : undefined;

  // Plugin de resize para processar frames
  const { resize } = useResizePlugin();

  useFocusEffect(
    useCallback(() => {
      isPausedRef.current = false;
      setIsPaused(false);
      setCameraKey((prev) => prev + 1);

      return () => {
        isPausedRef.current = true;
        setIsPaused(true);
      };
    }, []),
  );

  useEffect(() => {
    setIsPaused(false);
    setCameraKey((prev) => prev + 1);
  }, []);

  let devices;
  const device =
    cameraPosition == "front"
      ? (devices = useCameraDevice("front"))
      : (devices = useCameraDevice("back"));

  const handleToggleCameraPosition = () => {
    setCameraPosition((prevPosition) =>
      prevPosition === "back" ? "front" : "back",
    );
  };

  const handleToggleFlash = () => {
    if (cameraPosition === "front")
      return Alert.alert(
        "Flash indisponível",
        "A câmera frontal não possui flash.",
      );

    setIsFlashOn((prevState) => !prevState);
  };

  const handlePlateFound = (plate: string) => {
    if (alertOpenRef.current) return;

    setText(plate);
    alertOpenRef.current = true;
    isPausedRef.current = true;
    setIsPaused(true);

    Alert.alert(
      "Placa Identificada",
      `Código: ${plate}`,
      [
        {
          text: "Continuar Escaneando",
          onPress: () => {
            alertOpenRef.current = false;
            isPausedRef.current = false;
            lastProcessedRef.current = 0;
            lastDetectedPlateShared.value = "";
            lastDetectedTimeShared.value = 0;
            setCameraKey((prev) => prev + 1);
            setIsPaused(false);
          },
        },
        {
          text: "OK",
          style: "default",
          onPress: () => {
            alertOpenRef.current = false;
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  // Cria worklet para chamar do frame processor
  const onPlateFound = useRunOnJS(
    (plate: string) => handlePlateFound(plate),
    [handlePlateFound],
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      if (isPausedRef.current || !model) return;

      const now = Date.now();
      if (now - lastProcessedRef.current < 500) return;
      lastProcessedRef.current = now;

      try {
        // PASSO 1: TFLite detecta a região da placa
        const resized = resize(frame, {
          scale: {
            width: 300,
            height: 300,
          },
          pixelFormat: "rgb",
          dataType: "uint8",
        });

        const outputs = model.runSync([resized]);
        const detection_boxes = outputs[0];
        const detection_scores = outputs[2];
        const num_detections = outputs[3][0];

        // Procura por objeto com aspect ratio de placa e confiança > 50%
        for (let i = 0; i < num_detections; i++) {
          const confidence = detection_scores[i];

          if (confidence > 0.5) {
            const top = detection_boxes[i * 4];
            const left = detection_boxes[i * 4 + 1];
            const bottom = detection_boxes[i * 4 + 2];
            const right = detection_boxes[i * 4 + 3];

            const width = Number(right) - Number(left);
            const height = Number(bottom) - Number(top);
            const aspectRatio = width / height;

            // Verifica se tem proporção de placa (2:1 a 3:1)
            if (aspectRatio >= 1.5 && aspectRatio <= 3.5) {
              // PASSO 2: OCR apenas na região detectada
              const scannedOcr = scanOCR(frame);

              if (!scannedOcr?.result?.text) continue;

              const ocrText = scannedOcr.result.text;
              const cleanedText = ocrText
                .replace(/[^A-Z0-9]/gi, "")
                .toUpperCase();

              // PASSO 3: Regex para validar padrões de placa brasileira
              // Mercosul: ABC1D23 (3 letras + 1 número + 1 letra + 2 números)
              const placaMercosul = cleanedText.match(/[A-Z]{3}\d[A-Z]\d{2}/);

              // Antiga: ABC1234 (3 letras + 4 números)
              const placaAntiga = cleanedText.match(/[A-Z]{3}\d{4}/);

              const plateMatch = placaMercosul || placaAntiga;

              if (plateMatch) {
                const plate = plateMatch[0];

                // Verifica duplicatas (5 segundos)
                const timeSinceLastDetection =
                  now - lastDetectedTimeShared.value;

                if (
                  lastDetectedPlateShared.value === plate &&
                  timeSinceLastDetection < 5000
                ) {
                  continue;
                }

                // Placa válida encontrada!
                lastDetectedPlateShared.value = plate;
                lastDetectedTimeShared.value = now;

                const confidencePercent = Math.round(Number(confidence) * 100);
                const plateType = placaMercosul ? "Mercosul" : "Antiga";
                onPlateFound(
                  `${plate} (${plateType}) - ${confidencePercent}% confiança`,
                );
                return;
              }
            }
          }
        }
      } catch (error) {
        // Silenciar erros para máxima fluidez
      }
    },
    [model],
  );

  if (device == null)
    return <Text style={{ color: "white", marginTop: 50 }}>Carregando...</Text>;

  if (objectDetection.state === "loading")
    return (
      <Text style={{ color: "white", marginTop: 50 }}>
        Carregando modelo TFLite...
      </Text>
    );

  if (objectDetection.state === "error")
    return (
      <Text style={{ color: "red", marginTop: 50 }}>
        Erro ao carregar modelo: {objectDetection.error.message}
      </Text>
    );

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
          Aponte para a placa do veículo
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
