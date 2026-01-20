# Documentação - Build e Configuração Android/APK

Este documento contém instruções detalhadas para realizar o build da aplicação para Android e resolver problemas comuns.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão LTS recomendada)
- **npm** ou **yarn**
- **Android Studio** com:
  - Android SDK (API 36)
  - Android SDK Build-Tools 36.0.0
  - NDK 27.1.12297006
  - Gradle 8.14.3
- **Java JDK** (versão 17 ou superior)

### Configuração de Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas:

```powershell
ANDROID_HOME = C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Java\jdk-17
```

Adicione ao PATH:

- `%ANDROID_HOME%\platform-tools`
- `%ANDROID_HOME%\tools`
- `%JAVA_HOME%\bin`

## 🚀 Comandos Principais

### 1. Instalação das Dependências

```bash
npm install
```

### 2. Build para Android (Desenvolvimento)

```bash
npm run android
# ou
npx expo run:android
```

### 3. Build para Android (Produção - APK)

```bash
# Build de produção
cd android
./gradlew assembleRelease

# O APK estará em:
# android/app/build/outputs/apk/release/app-release.apk
```

### 4. Build para Android (Produção - AAB para Google Play)

```bash
cd android
./gradlew bundleRelease

# O AAB estará em:
# android/app/build/outputs/bundle/release/app-release.aab
```

## 🔧 Solução de Problemas Comuns

### Erro: "No matching variant of project"

**Sintomas:**

```
Could not resolve project :react-native-async-storage_async-storage
No matching variant of project was found
```

**Solução:**

1. **Limpar cache do Gradle:**

```powershell
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android\build,android\app\build,android\.gradle
```

2. **Regenerar o projeto Android:**

```bash
npx expo prebuild --clean --platform android
```

3. **Tentar o build novamente:**

```bash
npx expo run:android
```

### Erro: Caminho muito longo no Windows

**Sintomas:**

```
Path too long exception
```

**Solução:**

- Mova o projeto para um diretório com caminho mais curto (ex: `C:\organize-your-life`)
- Ou habilite caminhos longos no Windows:
  - Execute como administrador: `reg add HKLM\SYSTEM\CurrentControlSet\Control\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f`
  - Reinicie o computador

### Erro: global_createSerializableHostObject is not a function

**Sintomas:**

```
Uncaught Error: global_createSerializableHostObject is not a function (it is undefined)
```

**Causa:** O `react-native-reanimated` não está inicializado corretamente no código nativo.

**Solução:**

1. **Verifique o babel.config.js:**

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin", // DEVE ser o último plugin
    ],
  };
};
```

2. **Adicione a importação no arquivo raiz (app/\_layout.tsx):**

```tsx
import "react-native-reanimated";
```

3. **Limpe o cache e reconstrua:**

```bash
# Limpe o cache do Metro
npx expo start --clear

# Em outro terminal, reconstrua o app
npx expo run:android
```

4. **Se o erro persistir, faça um rebuild completo:**

```powershell
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android\build,android\app\build
npx expo prebuild --clean --platform android
npx expo run:android
```

### Erro: Gradle Daemon incompatível

**Sintomas:**

```
incompatible and stopped Daemons could not be reused
```

**Solução:**

```bash
cd android
./gradlew --stop
./gradlew clean
cd ..
npx expo run:android
```

### Erro: SDK/NDK não encontrado

**Sintomas:**

```
SDK location not found
```

**Solução:**

1. Crie o arquivo `android/local.properties`:

```properties
sdk.dir=C:\\Users\\[SEU_USUARIO]\\AppData\\Local\\Android\\Sdk
ndk.dir=C:\\Users\\[SEU_USUARIO]\\AppData\\Local\\Android\\Sdk\\ndk\\27.1.12297006
```

2. Ou defina a variável de ambiente `ANDROID_HOME`

## 🎯 Workflow Recomendado

### Para desenvolvimento diário:

```bash
# Inicie o Metro bundler
npm start

# Em outro terminal, faça o build
npm run android
```

### Para testar mudanças nativas:

```bash
# Limpe e recompile
npx expo prebuild --clean --platform android
npm run android
```

### Para distribuição (APK Release):

1. **Configure a assinatura** (primeira vez):
   - Crie um keystore:

   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore organize-your-life.keystore -alias organize-your-life -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure o `android/gradle.properties`:**

   ```properties
   MYAPP_UPLOAD_STORE_FILE=organize-your-life.keystore
   MYAPP_UPLOAD_KEY_ALIAS=organize-your-life
   MYAPP_UPLOAD_STORE_PASSWORD=***
   MYAPP_UPLOAD_KEY_PASSWORD=***
   ```

3. **Atualize `android/app/build.gradle`:**

   ```gradle
   android {
       ...
       signingConfigs {
           release {
               if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                   storeFile file(MYAPP_UPLOAD_STORE_FILE)
                   storePassword MYAPP_UPLOAD_STORE_PASSWORD
                   keyAlias MYAPP_UPLOAD_KEY_ALIAS
                   keyPassword MYAPP_UPLOAD_KEY_PASSWORD
               }
           }
       }
       buildTypes {
           release {
               ...
               signingConfig signingConfigs.release
           }
       }
   }
   ```

4. **Gere o APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## 📱 Testando o APK

### Instalação manual:

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Via USB:

1. Ative o modo desenvolvedor no dispositivo
2. Conecte via USB
3. Execute: `adb devices` para verificar
4. Execute o comando de instalação acima

## 🔄 Processo de Build Limpo (Clean Build)

Quando houver problemas persistentes, execute uma limpeza completa:

```bash
# 1. Limpar cache do npm
npm cache clean --force

# 2. Remover node_modules e reinstalar
Remove-Item -Recurse -Force node_modules
npm install

# 3. Limpar build Android
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue android\build,android\app\build,android\.gradle

# 4. Regenerar projeto Android
npx expo prebuild --clean --platform android

# 5. Build novamente
npx expo run:android
```

## 📝 Notas Importantes

1. **Primeira build leva mais tempo**: A primeira compilação pode levar 5-10 minutos pois baixa todas as dependências
2. **Warnings são normais**: Avisos de depreciação do Kotlin/Java não impedem a compilação
3. **Mantenha o SDK atualizado**: Use o Android Studio para manter as ferramentas atualizadas
4. **Teste em dispositivos reais**: Emuladores podem ter comportamento diferente

## 🐛 Debug e Logs

### Ver logs do dispositivo:

```bash
adb logcat
```

### Ver logs filtrados:

```bash
adb logcat | grep -i "ReactNative"
```

### Ver logs do Expo:

```bash
npx expo start --clear
```

## 📚 Recursos Úteis

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Android Setup](https://reactnative.dev/docs/environment-setup)
- [Gradle Documentation](https://docs.gradle.org/)
- [Android Developer Guide](https://developer.android.com/)

---

**Última atualização:** Janeiro 2026
**Versões:**

- Expo SDK: ~54.0.30
- React Native: 0.81.5
- Gradle: 8.14.3
- Android SDK: 36
- NDK: 27.1.12297006
