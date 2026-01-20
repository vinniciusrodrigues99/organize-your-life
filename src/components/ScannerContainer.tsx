import { scanOCR } from "@ismaelmoreiraa/vision-camera-ocr";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useRunOnJS, useSharedValue } from "react-native-worklets-core";
import { styles } from "../theme/global";
import Button from "./camera/Button";

export default function ScannerContainer() {
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const alertOpenRef = useRef(false);
  const [text, setText] = useState<string>("");
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>("back");
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [cameraKey, setCameraKey] = useState(0); // Key para forçar re-render da câmera

  const lastDetectedCodeShared = useSharedValue("");
  const lastDetectedTimeShared = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      // Ativa a câmera quando a tela ganha foco
      console.log("Tela focada, ativando câmera.");
      isPausedRef.current = false;
      setIsPaused(false);
      setCameraKey((prev) => prev + 1); // Força remontagem para garantir

      return () => {
        // Desativa a câmera quando a tela perde o foco
        console.log("Tela desfocada, pausando câmera.");
        isPausedRef.current = true;
        setIsPaused(true);
      };
    }, []),
  );

  useEffect(() => {
    setIsPaused(false);
    setCameraKey((prev) => prev + 1); // Força re-render da câmera
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

  const lastProcessedRef = useRef(0);

  const handleCodeFound = (code: string, type: string) => {
    if (alertOpenRef.current) {
      console.log("Alert já aberto, ignorando...");
      return;
    }

    console.log("📸 Pausando câmera para mostrar Alert");
    setText(code);
    alertOpenRef.current = true;
    isPausedRef.current = true;
    setIsPaused(true);

    Alert.alert(
      type === "container" ? "Container Identificado" : "Placa Identificada",
      `Código: ${code}`,
      [
        {
          text: "Continuar Escaneando",
          onPress: () => {
            console.log("🔄 BOTÃO CLICADO: Continuar Escaneando");
            alertOpenRef.current = false;
            isPausedRef.current = false;
            lastProcessedRef.current = 0;
            setCameraKey((prev) => prev + 1);
            setIsPaused(false);
            console.log("✅ Estados resetados, câmera deve reativar");
            console.log(`   isPaused agora é: false`);
            console.log(`   isPausedRef agora é: ${isPausedRef.current}`);
          },
        },
        {
          text: "OK",
          style: "default",
          onPress: () => {
            console.log("❌ BOTÃO CLICADO: OK (câmera permanece pausada)");
            alertOpenRef.current = false;
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  // Cria worklets para chamar do frame processor
  const onContainerFound = useRunOnJS(
    (code: string) => handleCodeFound(code, "container"),
    [handleCodeFound],
  );

  const onPlacaFound = useRunOnJS(
    (code: string) => handleCodeFound(code, "placa"),
    [handleCodeFound],
  );

  // Lista de códigos BIC válidos (operadoras de container)
  // Fonte: https://www.bic-code.org/
  const validBicCodes = [
    "MRKU",
    "MAEU",
    "MSCU",
    "MSKU",
    "CSLU",
    "CSNU",
    "CXDU",
    "HLBU",
    "HLCU",
    "HLXU",
    "OOLU",
    "OOCU",
    "CMAU",
    "CMDU",
    "EMCU",
    "EGHU",
    "YMLU",
    "YRTU",
    "ONEY",
    "ONEU",
    "BMOU",
    "BSIU",
    "MSMU",
    "MEDU",
    "ZIMU",
    "ZCSU",
    "ZIPU",
    "CARU",
    "CRXU",
    "TTNU",
    "TRIU",
    "TEMU",
    "TEXU",
    "GESU",
    "GLDU",
    "DRYU",
    "DFSU",
    "FCIU",
    "FSCU",
    "CAIU",
    "CAXU",
    "TCLU",
    "TCNU",
    "TGBU",
    "TGHU",
  ];

  // Função para validar dígito verificador de container (ISO 6346)
  const validateContainerCheckDigit = (code: string): boolean => {
    "worklet";
    if (code.length !== 11) {
      console.log(`Container ${code} tem tamanho ${code.length}, esperado 11`);
      return false;
    }

    // Valida código BIC (operadora)
    const bicCode = code.substring(0, 4);
    if (!validBicCodes.includes(bicCode)) {
      console.log(
        `❌ Código BIC inválido: ${bicCode} (não é uma operadora conhecida)`,
      );
      return false;
    }

    const letters = code.substring(0, 4);
    const numbers = code.substring(4, 10);
    const checkDigit = parseInt(code[10]);

    console.log(`Validando: ${code}`);
    console.log(
      `Letras: ${letters}, Números: ${numbers}, Dígito: ${checkDigit}`,
    );

    // Tabela de valores para letras (ISO 6346)
    const letterValues: Record<string, number> = {
      A: 10,
      B: 12,
      C: 13,
      D: 14,
      E: 15,
      F: 16,
      G: 17,
      H: 18,
      I: 19,
      J: 20,
      K: 21,
      L: 23,
      M: 24,
      N: 25,
      O: 26,
      P: 27,
      Q: 28,
      R: 29,
      S: 30,
      T: 31,
      U: 32,
      V: 34,
      W: 35,
      X: 36,
      Y: 37,
      Z: 38,
    };

    let sum = 0;

    // Calcula soma ponderada das letras
    for (let i = 0; i < 4; i++) {
      const value = letterValues[letters[i]];
      if (!value) {
        console.log(`Letra inválida: ${letters[i]}`);
        return false;
      }
      const contribution = value * Math.pow(2, i);
      console.log(
        `${letters[i]} (pos ${i}): ${value} * ${Math.pow(2, i)} = ${contribution}`,
      );
      sum += contribution;
    }

    console.log(`Soma após letras: ${sum}`);

    // Calcula soma ponderada dos números
    for (let i = 0; i < 6; i++) {
      const digit = parseInt(numbers[i]);
      const contribution = digit * Math.pow(2, i + 4);
      console.log(
        `${numbers[i]} (pos ${i + 4}): ${digit} * ${Math.pow(2, i + 4)} = ${contribution}`,
      );
      sum += contribution;
    }

    console.log(`Soma total: ${sum}`);
    console.log(`${sum} % 11 = ${sum % 11}`);

    // Calcula dígito verificador
    const remainder = sum % 11;
    const calculatedCheckDigit = remainder === 10 ? 0 : remainder;

    console.log(
      `Dígito calculado: ${calculatedCheckDigit}, Dígito esperado: ${checkDigit}`,
    );

    return calculatedCheckDigit === checkDigit;
  };

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      if (isPausedRef.current) return;

      const now = Date.now();
      if (now - lastProcessedRef.current < 500) return; // processa a cada 500ms
      lastProcessedRef.current = now;

      const scannedOcr = scanOCR(frame);

      if (!scannedOcr?.result?.text || !scannedOcr?.result?.blocks) return;

      const ocrText = scannedOcr.result.text;
      console.log("Scanned OCR:", ocrText);

      const cleanedText = ocrText.replace(/[^A-Z0-9]/gi, "").toUpperCase();

      // Busca por container (4 letras + 7 dígitos com rigor ISO 6346)
      // Padrão: 4 letras (código do proprietário) + 6 dígitos (número serial) + 1 dígito verificador
      const containerMatches = cleanedText.match(/[A-Z]{4}\d{7}/g);

      if (containerMatches) {
        for (const match of containerMatches) {
          // Ignora se for o mesmo container detectado recentemente (dentro de 5 segundos)
          const nowCheck = Date.now();
          const timeSinceLastDetection =
            nowCheck - lastDetectedTimeShared.value;

          console.log(`Verificando container: ${match}`);
          console.log(`Último detectado: ${lastDetectedCodeShared.value}`);
          console.log(
            `Tempo desde última detecção: ${timeSinceLastDetection}ms (${timeSinceLastDetection / 1000}s)`,
          );

          if (
            lastDetectedCodeShared.value === match &&
            timeSinceLastDetection < 5000
          ) {
            console.log(
              `⚠️ Container ${match} já detectado há ${timeSinceLastDetection / 1000}s, ignorando...`,
            );
            continue;
          }

          // Valida dígito verificador ISO 6346
          const isValid = validateContainerCheckDigit(match);

          if (isValid) {
            console.log("✅ Container válido encontrado:", match);
            lastDetectedCodeShared.value = match; // Armazena o código detectado
            lastDetectedTimeShared.value = nowCheck; // Armazena o timestamp
            console.log(
              `Salvando: lastDetectedCode=${lastDetectedCodeShared.value}, lastDetectedTime=${lastDetectedTimeShared.value}`,
            );
            isPausedRef.current = true;
            onContainerFound(match);
            return;
          } else {
            // Apenas loga, não pausa nem mostra alert
            console.log("❌ Container inválido (dígito verificador):", match);
          }
        }
      }

      // Busca por placa Mercosul (3 letras + 1 número + 1 letra + 2 números)
      // const placaMercosulMatch = cleanedText.match(/[A-Z]{3}\d[A-Z]\d{2}/);
      // if (placaMercosulMatch) {
      //   console.log("Placa Mercosul encontrada:", placaMercosulMatch[0]);
      //   isPausedRef.current = true;
      //   onPlacaFound(placaMercosulMatch[0]);
      //   return;
      // }

      // // Busca por placa antiga (3 letras + 4 números) - fallback
      // const placaAntigaMatch = cleanedText.match(/[A-Z]{3}\d{4}/);
      // if (placaAntigaMatch) {
      //   console.log("Placa antiga encontrada:", placaAntigaMatch[0]);
      //   isPausedRef.current = true;
      //   onPlacaFound(placaAntigaMatch[0]);
      //   return;
      // }
    },
    [onContainerFound, onPlacaFound],
  );

  if (device == null)
    return <Text style={{ color: "white", marginTop: 50 }}>Carregando...</Text>;

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
