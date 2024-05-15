import { StyleSheet } from "react-native";
import { AppLoading } from "expo";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: "100%",
    width: "100%",
  },
  landingContent: {
    top: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  actionContent: {
    marginTop: "30%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  landingImage: {
    width: 130,
    height: 130,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  bottomImage: {
    position: "relative",
    bottom: 0,
    right: 0,
    left: 0,
    width: "100%",
    height: 350,
    zIndex: -1,
  },
  heading: {
    fontFamily: "Montserrat",
    fontSize: 40,
    fontWeight: "bold",
  },
  pageHeading: {
    textShadowColor: "#F69E35",
    top: "20%",
    fontFamily: "Montserrat",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "left",
    paddingLeft: "10%",
  },
  bodyText: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 25,
    letterSpacing: 1,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 18,
    fontWeight: 900,
    color: "white",
  },
  inputField: {
    width: 300,
    height: 50,
    margin: 20,
    backgroundColor: "#87B6C4",
    borderWidth: 1, // Border width
    borderColor: "#F4F9FB", // Border color
    borderRadius: 5, // Border radius
  },
  oswaldText: {
    fontFamily: "Oswald_400Regular",
    fontSize: 24,
  },
  latoText: {
    fontFamily: "Lato",
    fontSize: 24,
  },
  poppinsText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 24,
  },
  montserratText: {
    fontFamily: "Montserrat",
    fontSize: 24,
  },
  robotoText: {
    fontFamily: "Roboto",
    fontSize: 24,
  },
  openSansText: {
    fontFamily: "OpenSans",
    fontSize: 24,
  },
});

export default styles;
