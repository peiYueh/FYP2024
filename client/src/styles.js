import { StyleSheet, Dimensions } from "react-native";
import { AppLoading } from "expo";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    position: "relative",
    width: width,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    // height: "40%",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 350,
    zIndex: -1, // Set a lower zIndex to keep it behind the content
  },
  heading: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 40,
    fontWeight: "bold",
  },
  subHeading: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 20,
    fontWeight: "bold",
  },
  pageHeading: {
    top: "1%", // Adjust the top value to position it where you want
    zIndex: 2,
    position: "absolute",
    textShadowColor: "#F69E35",
    fontFamily: "Montserrat_500Medium",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "left",
    paddingLeft: "10%",
  },
  topLeftButton: {
    position: "absolute",
    top: "5%",
    left: "2%",
    zIndex: 100,
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
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    // fontWeight: 900,
    color: "white",
  },
  remarkText: {
    fontFamily: "serif",
    fontSize: 15,
    top: 40,
  },
  hyperLinkText: {
    color: "yellow",
    textDecorationLine: "underline",
    fontStyle: "italic",
  },
  inputField: {
    width: 300,
    height: 50,
    marginBottom: 20,
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
    fontFamily: "Poppins_500Medium",
    fontSize: 24,
  },
  montserratText: {
    fontFamily: "Montserrat_500Medium",
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
  showPasswordIconButton: {
    position: "absolute",
    right: 40, // Adjust this value as needed
    top: "54%", // Align it vertically to the center
    transform: [{ translateY: -12 }],
  },
  dateBtn: {
    width: 140,
    height: 50,
    backgroundColor: "#87B6C4",
    borderWidth: 1, // Border width
    borderColor: "#F4F9FB", // Border color
    borderRadius: 5,
    flexDirection: "column",
    padding: 15,
    justifyContent: "center",
    pointerEvents: "auto",
  },
  dateBtnText: {
    fontWeight: "regular",
    color: "black",
  },
  genderDropdown: {
    width: 145,
    height: 30,
    margin: 15,
    top: 0,
    marginRight: 0,
    backgroundColor: "#87B6C4",
    borderWidth: 1, // Border width
    borderColor: "#F4F9FB", // Border color
    borderRadius: 5,
    flexDirection: "row",
  },
  dropDownContainer: {
    width: 200, // Set your desired width here
    alignSelf: "center", // Center the dropdown items if desired
  },
  row: {
    width: 300,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  transactionInput: {
    height: 100,
    width: "100%",
    marginVertical: 20,
    fontSize: 50,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 5,
  },
  option: {
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 20,
  },
  selectedOption: {
    borderRadius: 5,
    backgroundColor: "#ddd", // Fill color when selecte
  },
  optionText: {
    color: "#000",
  },
  selectedText: {
    fontWeight: "bold",
  },
  transactionComponent: {
    padding: 15,
    alignItems: "center",
  },
  transactionDetailInput: {
    backgroundColor: "transparent",
    margin: 10,
    width: "90%",
    height: 55,
    fontSize: 20,
  },
  getStartedContainer: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
    position: "relative",
  },
  progressBar: {
    height: 10,
    width: width / 3,
    marginBottom: 16,
  },
  innerContainer: {
    flexDirection: "row",
    width: width * 3, // Total width: 3 steps
  },
  step: {
    marginTop: "10%",
    marginBottom: "10%",
    width: width,
    padding: 16,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  chart: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FBFCFE",
    borderRadius: 10,
    height: "15%",
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 0,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333", // Adjust the color as needed
  },
  chartTitle: {
    fontFamily: "Montserrat_500Medium",
    fontWeight: 900,
    fontSize: 18,
  },
  monthYearHeader: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 10,
    width: "100%",
    // backgroundColor: 'blue'
  },
  transactionContainer: {
    borderRadius: 5,
  },
  transactionHeader: {
    // width: '100%',
    backgroundColor: "#D5E5EB",
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: 15,
  },
  transactionContent: {
    backgroundColor: "#FBFCFE",
    marginHorizontal: 10,
    padding: 10,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
    height: 50,
  },
  leftColumn: {
    flex: 2,
    width: "100%",
  },
  rightColumn: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center", // Align items vertically in the center
    width: "100%",
  },
  description: {
    fontSize: 16,
    fontWeight: "900",
    fontFamily: "Roboto",
    maxWidth: "100%", // Ensure it doesn't exceed parent width
    // Vertically center the text
  },
  date: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    // fontFamily: 'Lato',
  },
  // filterSection: {
  //     paddingTop: 5,
  //     paddingBottom: 5,
  //     flexDirection: 'row',
  //     justifyContent: 'space-between',
  //     alignItems: 'center',
  //     alignContent: 'center',
  //     width: '90%'
  // },
  // filterItem: {
  //     flex: 1,
  //     marginHorizontal: 10,
  //     alignItems: 'center',
  //     borderWidth: 1,
  //     height: 30,
  //     width: '100%',
  //     fontSize: 10,
  //     justifyContent: 'center',
  //     // fontSize: 10
  //     borderRadius: 5
  // },
  // cancelButtonContainer: {
  //   width: '5%'
  // }

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 10,
  },
  filterButtonText: {
    marginRight: 5,
    color: "#333",
  },
  filterModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterModal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  filterModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  filterModalHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterModalContent: {
    marginTop: 10,
  },
  filterItem: {
    marginBottom: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  applyFilterButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  applyFilterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  receiptContainer: {
    backgroundColor: "rgb(220, 228, 232)",
    marginHorizontal: 40,
    height: "40%",
    width: "80%",
    padding: 20,
    // borderWidth:1
    justifyContent: "center",
    alignItems: "center",
  },
  receiptTitle: {
    fontFamily: "Monaco",
    fontWeight: "bold",
    fontSize: 20,
  },
  popupTitle: {
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 30,
    paddingBottom: 10,
    textTransform: "uppercase",
  },
  transactionPopupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  transactionPopup: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  popupText: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 5,
    padding: 5,
    fontSize: 18,
    paddingLeft: 10,
  },
  actionButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    alignItems: "center",
    width: "40%",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 10, // Adjust this value to position the button vertically
    right: 10, // Adjust this value to position the button horizontally
    backgroundColor: "#A9A9A9",
    padding: 10,
    borderRadius: 5,
    zIndex: 99,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  popupIcon: {
    fontSize: 25,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // top: '50%',
    height: 700,
    // backgroundColor: 'red',
    // transform: [{ translateY: 100 }]
  },
  totalLiabilityContainer: {
    width: "90%",
    backgroundColor: "#D5E5EB",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
  },
  scrollViewContent: {
    width: width,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addLiabilityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    margin: 10,
    width: "90%",
  },
  liabilityFact: {
    marginTop: 0, // Remove top margin
    paddingTop: 0, // Remove top padding
    alignSelf: "stretch",
  },
  swiperContainer: {
    height: 250, // Set a fixed height for the Swiper container
    marginTop: 0, // Remove top margin
    paddingTop: 0, // Remove top padding
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    height: 250, // Ensure each slide matches the height of the Swiper container
  },
  image: {
    width: "100%", // Make the image take up the full width of its container
    height: "100%", // Ensure the image takes up the full height of its container
    resizeMode: "contain",
  },
});

export default styles;
