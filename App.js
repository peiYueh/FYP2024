import React, { useState } from 'react';
import {Text, View} from 'react-native';
import { AppLoading } from 'expo';
import {
  useFonts,
  Lato_100Thin, Lato_300Light, Lato_400Regular, Lato_700Bold, Lato_900Black,
  Montserrat_100Thin, Montserrat_200ExtraLight, Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black,
  OpenSans_300Light, OpenSans_400Regular, OpenSans_600SemiBold, OpenSans_700Bold, OpenSans_800ExtraBold,
  Oswald_200ExtraLight, Oswald_300Light, Oswald_400Regular, Oswald_500Medium, Oswald_600SemiBold, Oswald_700Bold,
  Poppins_100Thin, Poppins_200ExtraLight, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, Poppins_900Black,
  Roboto_100Thin, Roboto_300Light, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black,
} from '@expo-google-fonts/dev';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
// import * as Font from 'expo-font';

import LandingPage from './src/screens/LandingPage'; // Import your LandingPage component
import LoginPage from './src/screens/LoginPage';
import SignUpPage from './src/screens/SignUpPage';


import styles from './src/styles';

// export default function App() {
//   let [fontsLoaded] = useFonts({
//     Lato_100Thin, Lato_300Light, Lato_400Regular, Lato_700Bold, Lato_900Black,
//     Montserrat_100Thin, Montserrat_200ExtraLight, Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black,
//     OpenSans_300Light, OpenSans_400Regular, OpenSans_600SemiBold, OpenSans_700Bold, OpenSans_800ExtraBold,
//     Oswald_200ExtraLight, Oswald_300Light, Oswald_400Regular, Oswald_500Medium, Oswald_600SemiBold, Oswald_700Bold,
//     Poppins_100Thin, Poppins_200ExtraLight, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, Poppins_900Black,
//     Roboto_100Thin, Roboto_300Light, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black,
//   });
// }


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
      level5: "rgb(216, 231, 237)"
    },
    surfaceDisabled: "rgba(25, 28, 29, 0.12)",
    onSurfaceDisabled: "rgba(25, 28, 29, 0.38)",
    backdrop: "rgba(42, 50, 53, 0.4)",
    accent: "rgb(255, 165, 0)",
  },
};



const App = () => {

  const [fontLoaded, setFontLoaded] = useState(false);
  return (
    <PaperProvider theme={theme} font={loadFonts}>
      <SignUpPage />
    </PaperProvider>
  );
};

export default App;
