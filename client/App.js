import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingPage from "./src/view/LandingPage"; // Import your LandingPage component
import LoginPage from "./src/view/LoginPage";
import SignUpPage from "./src/view/SignUpPage";
import NewTransactionPage from "./src/view/NewTransactionPage";
import MyTransactionPage from "./src/view/MyTransactionPage";
import GetStartedPage from "./src/view/GetStarted";
import EditTransactionPage from "./src/view/EditTransactionPage";
import FinancialScenarioPage from "./src/view/FinancialScenarioPage";
import MyLiabilityPage from "./src/view/MyLiabilityPage";
import LiabilityDetailPage from "./src/view/LiabilityDetailPage";
import NewGoalPage from "./src/view/NewGoalPage";
import GoalDetailPage from "./src/view/GoalDetailPage";
import AccountPage from "./src/view/MyAccountPage";
import MyGoalPage from "./src/view/MyGoalPage";
import FinancialScenarioSetting from "./src/view/FinancialScenarioSetting";


import { registerTranslation } from "react-native-paper-dates";
import { useFonts, Oswald_400Regular } from "@expo-google-fonts/oswald";
import { Lato } from "@expo-google-fonts/lato";
import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import {
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light_Italic,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black_Italic,
} from "@expo-google-fonts/montserrat";
import { Roboto } from "@expo-google-fonts/roboto";
import { OpenSans } from "@expo-google-fonts/open-sans";
import FlashMessage from "react-native-flash-message";
import HomePage from "./src/view/HomePage";


registerTranslation("en", {
  save: "Save",
  selectSingle: "Select date",
  selectMultiple: "Select dates",
  selectRange: "Select period",
  notAccordingToDateFormat: (inputFormat) => `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date) => `Must be later then ${date}`,
  mustBeLowerThan: (date) => `Must be earlier then ${date}`,
  mustBeBetween: (startDate, endDate) => `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: "Day is not allowed",
  previous: "Previous",
  next: "Next",
  typeInDate: "Type in date",
  pickDateFromCalendar: "Pick date from calendar",
  close: "Close",
});

const theme = {
  colors: {
    primary: "#1F8AAA",
    onPrimary: "#F4F9FB",
    primaryContainer: "rgb(185, 234, 255)",
    onPrimaryContainer: "rgb(0, 31, 41)",
    secondary: "rgb(0, 104, 122)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(171, 237, 255)",
    onSecondaryContainer: "rgb(0, 31, 38)",
    tertiary: "#F69E35",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 220, 189)",
    onTertiaryContainer: "rgb(44, 22, 0)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(251, 252, 254)",
    onBackground: "rgb(25, 28, 29)",
    surface: "rgb(251, 252, 254)",
    onSurface: "rgb(25, 28, 29)",
    surfaceVariant: "rgb(220, 228, 232)",
    onSurfaceVariant: "rgb(64, 72, 76)",
    outline: "rgb(112, 120, 124)",
    outlineVariant: "rgb(192, 200, 204)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(46, 49, 50)",
    inverseOnSurface: "rgb(239, 241, 243)",
    inversePrimary: "rgb(95, 212, 253)",
    elevation: {
      level0: "transparent",
      level1: "rgb(238, 245, 248)",
      level2: "rgb(231, 240, 244)",
      level3: "rgb(223, 236, 240)",
      level4: "rgb(221, 234, 239)",
      level5: "rgb(216, 231, 237)",
    },
    surfaceDisabled: "rgba(25, 28, 29, 0.12)",
    onSurfaceDisabled: "rgba(25, 28, 29, 0.38)",
    backdrop: "rgba(42, 50, 53, 0.4)",
    accent: "rgb(255, 165, 0)",
  },
};
// Define your stack navigator
const Stack = createStackNavigator();

const App = () => {
  const [fontLoaded] = useFonts({
    Oswald_400Regular,
    Lato,
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light_Italic,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black_Italic,
    Roboto,
    OpenSans,
  });

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="My Transactions">
          <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
          <Stack.Screen name="SignUpPage" component={SignUpPage} options={{ headerShown: false }} />
          <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="New Transaction Page" component={NewTransactionPage} options={{ headerShown: true }} />
          <Stack.Screen name="Get Started" component={GetStartedPage} options={{ headerShown: false }} />
          <Stack.Screen name="My Transactions" component={MyTransactionPage} options={{ headerShown: true }} />
          <Stack.Screen name="EditTransactionPage" component={EditTransactionPage} options={{ headerShown: true }} />
          <Stack.Screen name="New Goal" component={NewGoalPage} options={{ headerShown: true }} />
          <Stack.Screen name="View Goal" component={GoalDetailPage} options={{ headerShown: true }} />
          <Stack.Screen name="My Goals" component={MyGoalPage} options={{ headerShown: true }} />
          <Stack.Screen name="My Liabilities" component={MyLiabilityPage} options={{ headerShown: true }} />
          <Stack.Screen name="Liability Detail" component={LiabilityDetailPage} options={{ headerShown: true }} />
          <Stack.Screen name="My Account" component={AccountPage} options={{ headerShown: true }} />
          <Stack.Screen name="Financial Scenario" component={FinancialScenarioPage} options={{ headerShown: false }} />
          <Stack.Screen name="Financial Scenario Settings" component={FinancialScenarioSetting} options={{ headerShown: false }} />
          <Stack.Screen name="Home Page" component={HomePage} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="top" />
    </PaperProvider>
  );
};
export default App;
