# 📸 Guia Completo: Vision Camera v4 + OCR Frame Processor

Este documento detalha o processo completo para configurar **React Native Vision Camera v4** com **OCR (Reconhecimento de Texto)** em tempo real usando Frame Processors.

## 🎯 Contexto

### O Problema

A maioria dos plugins de OCR disponíveis no npm (`vision-camera-ocr`, `react-native-vision-camera-v3-text-recognition`) foram desenvolvidos para **Vision Camera v3** e **não funcionam** com a v4 devido a mudanças na API de Frame Processors.

**Erros comuns ao tentar usar plugins antigos com Vision Camera v4:**

- `Property 'scanOCR' doesn't exist`
- `Unresolved reference 'frameprocessor'`
- `Unresolved reference 'FrameProcessorPlugin'`
- `global._createSerializableHostObject is not a function`

### A Solução

Utilizar o fork **@ismaelmoreiraa/vision-camera-ocr v3.0.2**, que foi atualizado para **Vision Camera v4** e funciona perfeitamente com:

- React Native Vision Camera v4.x
- React Native Worklets Core v1.x
- Expo SDK 54+

**Repositório:** [https://github.com/ismaelsousa/vision-camera-ocr](https://github.com/ismaelsousa/vision-camera-ocr)

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- **Expo SDK**: ~54.0.30 (ou superior)
- **React Native**: 0.81.5+
- **Node.js**: Versão LTS
- **Android Studio** configurado com:
  - Android SDK (API 36)
  - NDK 27.1.12297006
  - Gradle 8.14.3

---

## 🚀 Instalação Passo a Passo

### 1. Instalar Dependências Base

```bash
npm install react-native-vision-camera@^4.7.3
npm install react-native-worklets-core@^1.6.2
```

### 2. Instalar o Plugin OCR Compatível com V4

**IMPORTANTE:** Use o fork do @ismaelmoreiraa, não o pacote oficial `vision-camera-ocr`:

```bash
npm install @ismaelmoreiraa/vision-camera-ocr@^3.0.2
```

Ou instale direto do GitHub (branch v3):

```bash
npm install github:ismaelsousa/vision-camera-ocr#v3
```

### 3. Configurar o Babel

Edite seu `babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["react-native-worklets-core/plugin"], // Necessário para Frame Processors
    ],
  };
};
```

**⚠️ Atenção:**

- O plugin `react-native-worklets-core/plugin` **deve estar antes** de outros plugins
- **NÃO** adicione `globals: ["__scanOCR"]` no babel para Vision Camera v4
- **NÃO** use `react-native-reanimated/plugin` no mesmo arquivo se não estiver usando Reanimated

### 4. Configurar Permissões

#### Android (`app.json`):

```json
{
  "expo": {
    "android": {
      "permissions": ["android.permission.CAMERA"]
    },
    "plugins": [
      [
        "react-native-vision-camera",
        {
          "cameraPermissionText": "Precisamos de acesso à câmera para ler texto.",
          "enableMicrophonePermission": false
        }
      ]
    ]
  }
}
```

#### iOS (`app.json`):

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Precisamos de acesso à câmera para ler texto."
      }
    }
  }
}
```

### 5. Regenerar o Projeto Nativo

```bash
npx expo prebuild --clean --platform android
```

### 6. Build e Execução

```bash
npx expo run:android
```

---

## 💻 Exemplo de Código Funcional

### Componente Completo de Scanner OCR

```tsx
import React, { useState, useCallback } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
  Frame,
} from "react-native-vision-camera";
import { runOnJS } from "react-native-reanimated";
import { scanOCR } from "@ismaelmoreiraa/vision-camera-ocr";

export default function ScannerOCR() {
  const [detectedText, setDetectedText] = useState<string>("");
  const [isPaused, setIsPaused] = useState(false);

  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();

  // Função para processar o texto detectado (fora do worklet)
  const handleTextDetected = useCallback(
    (text: string) => {
      if (!text || isPaused) return;

      setDetectedText(text);
      console.log("Texto detectado:", text);

      // Exemplo: pausar após detectar algo
      // setIsPaused(true);
      // Alert.alert("Texto Detectado", text);
    },
    [isPaused],
  );

  // Frame Processor para OCR em tempo real
  const frameProcessor = useFrameProcessor(
    (frame: Frame) => {
      "worklet";

      try {
        const scannedOcr = scanOCR(frame);

        // scannedOcr.result.text contém todo o texto detectado
        if (scannedOcr?.result?.text) {
          runOnJS(handleTextDetected)(scannedOcr.result.text);
        }
      } catch (error) {
        console.error("Erro no OCR:", error);
      }
    },
    [handleTextDetected],
  );

  // Solicitar permissão se não tiver
  if (!hasPermission) {
    requestPermission();
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Solicitando permissão da câmera...</Text>
      </View>
    );
  }

  // Aguardar dispositivo estar pronto
  if (device == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Carregando câmera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!isPaused}
        frameProcessor={frameProcessor}
        pixelFormat="yuv" // Importante para performance no Android
      />

      {/* Overlay com informações */}
      <View style={styles.overlay}>
        <View style={styles.textBox}>
          <Text style={styles.label}>Texto Detectado:</Text>
          <Text style={styles.detectedText}>
            {detectedText || "Aponte a câmera para um texto..."}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 20,
  },
  textBox: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 15,
    borderRadius: 10,
    maxHeight: 200,
  },
  label: {
    color: "#00FF00",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detectedText: {
    color: "white",
    fontSize: 16,
  },
  text: {
    color: "white",
    textAlign: "center",
    marginTop: 50,
  },
});
```

### Estrutura do Objeto Retornado pelo scanOCR

```typescript
interface OCRFrame {
  result: {
    text: string; // Texto completo detectado
    blocks: Block[]; // Blocos de texto individuais
  };
}

interface Block {
  text: string;
  lines: Line[];
  frame: { x: number; y: number; width: number; height: number };
}

interface Line {
  text: string;
  elements: Element[];
  frame: { x: number; y: number; width: number; height: number };
}

interface Element {
  text: string;
  frame: { x: number; y: number; width: number; height: number };
}
```

**Exemplo de uso:**

```typescript
const frameProcessor = useFrameProcessor((frame) => {
  "worklet";
  const scannedOcr = scanOCR(frame);

  // Texto completo
  const fullText = scannedOcr.result.text;

  // Iterar pelos blocos
  scannedOcr.result.blocks.forEach((block) => {
    console.log("Bloco:", block.text);
    console.log("Posição:", block.frame);
  });
}, []);
```

---

## 🔧 Solução de Problemas

### Erro: "Property 'scanOCR' doesn't exist"

**Causa:** O plugin nativo não foi compilado corretamente ou você tem plugins OCR duplicados.

**Solução:**

1. Verifique os pacotes instalados:

   ```bash
   npm list react-native-vision-camera vision-camera-ocr react-native-worklets-core
   ```

2. Se houver `vision-camera-ocr@1.0.0` ou múltiplos plugins OCR, **remova os antigos**:

   ```bash
   npm uninstall vision-camera-ocr
   ```

3. Mantenha **apenas** `@ismaelmoreiraa/vision-camera-ocr`:

   ```bash
   npm install @ismaelmoreiraa/vision-camera-ocr@^3.0.2
   ```

4. Recompile o projeto:
   ```bash
   npx expo prebuild --clean --platform android
   npx expo run:android
   ```

### Erro: "react-native-worklets-core not found"

**Causa:** O worklets-core não está instalado ou não está sendo reconhecido.

**Solução:**

1. Instale explicitamente:

   ```bash
   npm install react-native-worklets-core@^1.6.2
   ```

2. Verifique o `babel.config.js` (veja seção 3 acima).

3. Limpe o cache e reinicie:
   ```bash
   npx expo start --clear
   ```

### Erro de Compilação CMake/Kotlin

**Sintomas:**

```
Unresolved reference 'frameprocessor'
Compilation error in vision-camera-ocr
```

**Causa:** Plugin antigo ou incompatível com Vision Camera v4.

**Solução:** Use **exatamente** o fork do @ismaelmoreiraa:

```bash
npm uninstall vision-camera-ocr
npm install @ismaelmoreiraa/vision-camera-ocr@^3.0.2
npx expo prebuild --clean
npx expo run:android
```

### Performance Baixa / FPS Baixo

**Soluções:**

1. **Use pixelFormat="yuv"** na Camera (essencial no Android):

   ```tsx
   <Camera pixelFormat="yuv" frameProcessor={frameProcessor} />
   ```

2. **Reduza a frequência de processamento:**

   ```typescript
   const frameProcessor = useFrameProcessor((frame) => {
     "worklet";
     // Processar apenas a cada N frames
     if (frame.timestamp % 5 === 0) {
       const scannedOcr = scanOCR(frame);
       // ...
     }
   }, []);
   ```

3. **Desabilite temporariamente durante processamento:**

   ```typescript
   const [isProcessing, setIsProcessing] = useState(false);

   const frameProcessor = useFrameProcessor(
     (frame) => {
       "worklet";
       if (isProcessing) return;

       runOnJS(setIsProcessing)(true);
       const scannedOcr = scanOCR(frame);
       // Processar...
       runOnJS(setIsProcessing)(false);
     },
     [isProcessing],
   );
   ```

---

## 📊 Comparação de Versões

| Feature                                  | Vision Camera v3        | Vision Camera v4                    |
| ---------------------------------------- | ----------------------- | ----------------------------------- |
| Frame Processors API                     | `react-native-worklets` | `react-native-worklets-core`        |
| Plugins OCR Oficiais                     | ✅ Disponíveis          | ❌ Incompatíveis                    |
| Plugin @ismaelmoreiraa/vision-camera-ocr | ❌ Incompatível         | ✅ Funciona                         |
| Performance                              | Boa                     | Melhor                              |
| Estabilidade                             | Estável                 | Estável (após configuração correta) |

---

## ✅ Checklist de Verificação

Antes de buildar, confirme:

- [ ] `react-native-vision-camera` versão **^4.7.3** instalado
- [ ] `react-native-worklets-core` versão **^1.6.2** instalado
- [ ] `@ismaelmoreiraa/vision-camera-ocr` versão **^3.0.2** instalado
- [ ] **NÃO** há `vision-camera-ocr@1.0.0` instalado
- [ ] `babel.config.js` tem `react-native-worklets-core/plugin`
- [ ] Permissões de câmera configuradas no `app.json`
- [ ] Projeto nativo regenerado com `npx expo prebuild --clean`

---

## 🎓 Conceitos Importantes

### Frame Processors

Frame Processors permitem processar cada frame da câmera em tempo real usando código JavaScript/TypeScript rodando em thread separada (worklet).

**Vantagens:**

- Processamento em tempo real (60 FPS)
- Não bloqueia a UI
- Acesso a plugins nativos (OCR, Face Detection, etc.)

**Sintaxe:**

```typescript
const frameProcessor = useFrameProcessor(
  (frame) => {
    "worklet"; // Obrigatório para rodar em thread separada
    // Seu código aqui roda a cada frame
  },
  [dependencies],
);
```

### Worklets

Worklets são funções JavaScript que rodam em thread separada (não na main thread). São necessários para Frame Processors.

**Regra importante:**

- Código dentro do worklet **não pode** acessar state/props diretamente
- Use `runOnJS()` para chamar funções fora do worklet:

  ```typescript
  const updateState = (value: string) => {
    setState(value); // Função normal
  };

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const result = scanOCR(frame);
    runOnJS(updateState)(result.text); // Chama função normal
  }, []);
  ```

---

## 📚 Recursos Adicionais

- **Vision Camera v4 Docs:** [https://react-native-vision-camera.com/](https://react-native-vision-camera.com/)
- **Plugin OCR (fork compatível):** [https://github.com/ismaelsousa/vision-camera-ocr](https://github.com/ismaelsousa/vision-camera-ocr)
- **Worklets Core:** [https://github.com/margelo/react-native-worklets-core](https://github.com/margelo/react-native-worklets-core)
- **ML Kit Text Recognition:** [https://developers.google.com/ml-kit/vision/text-recognition](https://developers.google.com/ml-kit/vision/text-recognition)

---

## 🎉 Conclusão

Com este guia, você consegue configurar **Vision Camera v4** com **OCR em tempo real** usando Frame Processors. A chave é usar o fork correto (`@ismaelmoreiraa/vision-camera-ocr`) e seguir a configuração exata do Babel e dependências.

**Resultado esperado:**

- ✅ Camera funcionando em 60 FPS
- ✅ Reconhecimento de texto em tempo real
- ✅ Zero erros de compilação
- ✅ Performance nativa

---

**Última atualização:** Janeiro 2026  
**Versões testadas:**

- Expo SDK: 54.0.30
- React Native: 0.81.5
- Vision Camera: 4.7.3
- Worklets Core: 1.6.2
- @ismaelmoreiraa/vision-camera-ocr: 3.0.2

**Autor:** Vinícius Rodrigues  
**LinkedIn:** [Link para publicação]

---

## 📝 Template para Publicação no LinkedIn

```markdown
🚀 Como usar Vision Camera v4 com OCR em React Native/Expo

Recentemente implementei reconhecimento de texto (OCR) em tempo real no meu app React Native usando Vision Camera v4, e foi mais desafiador do que esperava!

🔍 O PROBLEMA:
A maioria dos plugins OCR disponíveis no npm foram feitos para Vision Camera v3 e NÃO funcionam com a v4 devido a mudanças na API de Frame Processors.

Erros comuns:
❌ Property 'scanOCR' doesn't exist
❌ Unresolved reference 'frameprocessor'
❌ global.\_createSerializableHostObject is not a function

✅ A SOLUÇÃO:
Encontrei o fork @ismaelmoreiraa/vision-camera-ocr v3.0.2, que foi atualizado especificamente para Vision Camera v4!

🛠️ STACK TÉCNICA:
• React Native Vision Camera v4.7.3
• React Native Worklets Core v1.6.2
• @ismaelmoreiraa/vision-camera-ocr v3.0.2
• Expo SDK 54

📦 INSTALAÇÃO:
npm install react-native-vision-camera@^4.7.3
npm install react-native-worklets-core@^1.6.2
npm install @ismaelmoreiraa/vision-camera-ocr@^3.0.2

⚙️ BABEL CONFIG:
module.exports = {
plugins: [["react-native-worklets-core/plugin"]],
};

🎯 RESULTADO:
✅ OCR funcionando em 60 FPS
✅ Reconhecimento de texto em tempo real
✅ Performance nativa com ML Kit
✅ Zero crashes

💡 DICA IMPORTANTE:
NÃO use o pacote "vision-camera-ocr" original (v1.0.0). Ele só funciona com Vision Camera v3. Use APENAS o fork do @ismaelmoreiraa!

📄 Documentação completa disponível no meu GitHub (link nos comentários)

#ReactNative #Expo #VisionCamera #OCR #MachineLearning #MobileDevelopment #JavaScript #TypeScript

Alguém mais teve dificuldades com isso? Compartilha sua experiência! 👇
```
