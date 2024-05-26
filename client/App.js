import React, { useState } from "react";
import { Text, View } from "react-native";
import { AppLoading } from "expo";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import LandingPage from "./src/screens/LandingPage"; // Import your LandingPage component
import LoginPage from "./src/screens/LoginPage";
import SignUpPage from "./src/screens/SignUpPage";
import DatePickerComponent from "./src/components/datePicker";
import styles from "./src/styles";
import { registerTranslation } from 'react-native-paper-dates'

import { useFonts, Oswald_400Regular } from "@expo-google-fonts/oswald";
import { Lato } from "@expo-google-fonts/lato";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";
import { Montserrat } from "@expo-google-fonts/montserrat";
import { Roboto } from "@expo-google-fonts/roboto";
import { OpenSans } from "@expo-google-fonts/open-sans";

import { useEffect } from "react";
registerTranslation('en', {
  save: 'Save',
  selectSingle: 'Select date',
  selectMultiple: 'Select dates',
  selectRange: 'Select period',
  notAccordingToDateFormat: (inputFormat) =>
    `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date) => `Must be later then ${date}`,
  mustBeLowerThan: (date) => `Must be earlier then ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: 'Day is not allowed',
  previous: 'Previous',
  next: 'Next',
  typeInDate: 'Type in date',
  pickDateFromCalendar: 'Pick date from calendar',
  close: 'Close',
})

const theme = {
  colors: {
    primary: "#1F8AAA",
    onPrimary: "rgb(255, 255, 255)",
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

const App = () => {
  const [fontLoaded] = useFonts({
    Oswald_400Regular,
    Lato,
    Poppins_400Regular,
    Montserrat,
    Roboto,
    OpenSans,
  });
  // const [fontLoaded, setFontLoaded] = useState(false);
  return (
    <PaperProvider theme={theme}>
      <LoginPage />
    </PaperProvider>
  );
};

export default App;
