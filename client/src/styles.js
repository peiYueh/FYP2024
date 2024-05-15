import { StyleSheet } from 'react-native';
import { AppLoading } from 'expo';

const styles = (fonts) = StyleSheet.create({
    container: {
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: '100%',
        width: '100%',
    },
    landingContent: {
        top: '15%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionContent: {
        marginTop: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    landingImage: {
        width: 130,
        height: 130,
        marginBottom: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    bottomImage: {
        position: 'relative',
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        height: 350,
        zIndex: -1
      },
    heading: {
        fontFamily: fonts.Montserrat,
        fontSize: 40,
        fontWeight: 'bold',
    },
    pageHeading: {
        textShadowColor: '#F69E35',
        top: '20%',
        fontFamily: fonts.Montserrat,
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingLeft: '10%',
    },
    bodyText: {
        fontFamily: 'Roboto',
        fontSize: 20,
        lineHeight: 25,
        fontWeight: "bold"
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        fontFamily: 'Poppins',
        fontSize: 18,
        color: 'white',
    },
    inputField: {
        width: 300,
        height: 50,
        margin: 20,
        backgroundColor: '#87B6C4',
        borderWidth: 1, // Border width
        borderColor: '#F4F9FB', // Border color
        borderRadius: 5, // Border radius
      },
      latoThin: {
        fontFamily: 'Lato_100Thin',
        fontSize: 18,
      },
      latoLight: {
        fontFamily: 'Lato_300Light',
        fontSize: 18,
      },
      latoRegular: {
        fontFamily: 'Lato_400Regular',
        fontSize: 18,
      },
      latoBold: {
        fontFamily: 'Lato_700Bold',
        fontSize: 18,
      },
      latoBlack: {
        fontFamily: 'Lato_900Black',
        fontSize: 18,
      },
      montserratThin: {
        fontFamily: 'Montserrat_100Thin',
        fontSize: 18,
      },
      montserratExtraLight: {
        fontFamily: 'Montserrat_200ExtraLight',
        fontSize: 18,
      },
      montserratLight: {
        fontFamily: 'Montserrat_300Light',
        fontSize: 18,
      },
      montserratRegular: {
        fontFamily: 'Montserrat_400Regular',
        fontSize: 18,
      },
      montserratMedium: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 18,
      },
      montserratSemiBold: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 18,
      },
      montserratBold: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 18,
      },
      montserratExtraBold: {
        fontFamily: 'Montserrat_800ExtraBold',
        fontSize: 18,
      },
      montserratBlack: {
        fontFamily: 'Montserrat_900Black',
        fontSize: 18,
      },
      openSansLight: {
        fontFamily: 'OpenSans_300Light',
        fontSize: 18,
      },
      openSansRegular: {
        fontFamily: 'OpenSans_400Regular',
        fontSize: 18,
      },
      openSansSemiBold: {
        fontFamily: 'OpenSans_600SemiBold',
        fontSize: 18,
      },
      openSansBold: {
        fontFamily: 'OpenSans_700Bold',
        fontSize: 18,
      },
      openSansExtraBold: {
        fontFamily: 'OpenSans_800ExtraBold',
        fontSize: 18,
      },
      oswaldExtraLight: {
        fontFamily: 'Oswald_200ExtraLight',
        fontSize: 18,
      },
      oswaldLight: {
        fontFamily: 'Oswald_300Light',
        fontSize: 18,
      },
      oswaldRegular: {
        fontFamily: 'Oswald_400Regular',
        fontSize: 18,
      },
      oswaldMedium: {
        fontFamily: 'Oswald_500Medium',
        fontSize: 18,
      },
      oswaldSemiBold: {
        fontFamily: 'Oswald_600SemiBold',
        fontSize: 18,
      },
      oswaldBold: {
        fontFamily: 'Oswald_700Bold',
        fontSize: 18,
      },
      poppinsThin: {
        fontFamily: 'Poppins_100Thin',
        fontSize: 18,
      },
      poppinsExtraLight: {
        fontFamily: 'Poppins_200ExtraLight',
        fontSize: 18,
      },
      poppinsLight: {
        fontFamily: 'Poppins_300Light',
        fontSize: 18,
      },
      poppinsRegular: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 18,
      },
      poppinsMedium: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 18,
      },
      poppinsSemiBold: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 18,
      },
      poppinsBold: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
      },
      poppinsExtraBold: {
        fontFamily: 'Poppins_800ExtraBold',
        fontSize: 18,
      },
      poppinsBlack: {
        fontFamily: 'Poppins_900Black',
        fontSize: 18,
      },
      robotoThin: {
        fontFamily: 'Roboto_100Thin',
        fontSize: 18,
      },
      robotoLight: {
        fontFamily: 'Roboto_300Light',
        fontSize: 18,
      },
      robotoRegular: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 18,
      },
      robotoMedium: {
        fontFamily: 'Roboto_500Medium',
        fontSize: 18,
      },
      robotoBold: {
        fontFamily: 'Roboto_700Bold',
        fontSize: 18,
      },
      robotoBlack: {
        fontFamily: 'Roboto_900Black',
        fontSize: 18,
      },
});

export default styles;
