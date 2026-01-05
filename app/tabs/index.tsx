import { StyleSheet, Text, View } from "react-native";
import placeHolderImage from "../../assets/images/background-image.png";
import Button from "../components/Button";
import ImageViewer from "../components/ImageViewer";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Welcome to Organize Your Life</Text>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={placeHolderImage} />
      </View>
      <View style={styles.footerContainer}>
        <Button label="Choose a foto!" theme="primary" />
        <Button label="Use this foto!" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000ff",
    gap: 8,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Arial",
    color: "#ffffffff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#ffffffff",
    fontStyle: "normal",
    fontVariant: ["small-caps"],
    fontWeight: "600",
    marginBottom: 20,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 0.333,
    alignItems: "center",
  },
});
