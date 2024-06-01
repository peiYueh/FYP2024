import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Text, Image } from 'react-native';
import { Button, TextInput, Title, ProgressBar, useTheme } from 'react-native-paper';
import styles from '../styles';
const { width } = Dimensions.get('window');

const GetStarted = () => {
    const theme = useTheme();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        income: '',
        expenses: '',
        savings: '',
        retirementAge: '',
        lifeExpectancy: ''
    });

    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: -width * (step - 1),
            useNativeDriver: true
        }).start();
    }, [step, translateX]);

    const handleNext = () => {
        if (step < 2) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };
    const progress = (step + 1) / 3;
    return (
        <View style={[style.container, { backgroundColor: theme.colors.primary }]}>
            <ProgressBar progress={progress} color="#F4F9FB" style={style.progressBar} />
            <Animated.View style={[style.innerContainer, { transform: [{ translateX }] }]}>
                <View style={styles.step}>
                    <Title style={[styles.bodyText, { color: theme.colors.tertiary, fontWeight: 900, fontSize: 18 }]}>Step 1: Enter your estimated monthly income and expenses</Title>
                    <TextInput
                        label="Estimated Monthly Income"
                        value={formData.income}
                        onChangeText={(text) => handleChange('income', text)}
                        style={style.input}
                        keyboardType="numeric"
                    />
                    <TextInput
                        label="Estimated Monthly Expenses"
                        value={formData.expenses}
                        onChangeText={(text) => handleChange('expenses', text)}
                        style={style.input}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.step}>
                    <Title style={[styles.bodyText, { color: theme.colors.tertiary, fontWeight: 900, fontSize: 18 }]}>Step 2: Enter the current saving amount you have</Title>
                    <TextInput
                        label="Current Savings"
                        value={formData.savings}
                        onChangeText={(text) => handleChange('savings', text)}
                        style={style.input}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.step}>
                    <Title style={[styles.bodyText, { color: theme.colors.tertiary, fontWeight: 900, fontSize: 18 }]}>Step 3: Retirement and Life Expectancy</Title>
                    <TextInput
                        label="Retirement Age"
                        value={formData.retirementAge}
                        onChangeText={(text) => handleChange('retirementAge', text)}
                        style={style.input}
                        keyboardType="numeric"
                    />
                    <TextInput
                        label="Life Expectancy"
                        value={formData.lifeExpectancy}
                        onChangeText={(text) => handleChange('lifeExpectancy', text)}
                        style={style.input}
                        keyboardType="numeric"
                    />
                </View>
            </Animated.View>

            <View style={style.buttonContainer}>
                {step > 0 && <Button style={style.backButton} mode="contained" onPress={handleBack} labelStyle={{ color: '#005A75' }}>Back</Button>}
                {step < 2 ? (
                    <Button style={style.nextButton} mode="contained" onPress={handleNext}>Next</Button>
                ) : (
                    <Button style={style.submitButton} mode="contained" onPress={() => console.log(formData)}>Submit</Button>
                )}
            </View>
            <Image
        source={require('../../assets/graph_bg.png')}
        style={styles.bottomImage}
      />
        </View>
    );

};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Align content to the top
        alignItems: 'center',
        overflow: 'hidden', // To prevent overflow during animation
        paddingTop: '10%'
    },
    progressBar: {
        height: 10,
        width: (width / 1.1),
        backgroundColor: '#DBDBDB'
    },
    innerContainer: {
        marginTop: 20, // Add some top margin
        flexDirection: 'row',
        width: width * 3, // Total width: 3 steps
        alignItems: 'flex-start'
    },
    input: {
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '90%', // Ensures buttons are centered within the screen
    },
    backButton: {
        flex: 1, // Takes 1/3 of the container's width
        marginRight: 5, // Adds some spacing between buttons
        left: 0,
        backgroundColor: '#DBDBDB',
        color: 'red'
    },
    nextButton: {
        flex: 1, // Takes 1/3 of the container's width
        marginLeft: 5, // Adds some spacing between buttons
        right: 0,
        backgroundColor: '#F69E35',
    },
    submitButton: {
        flex: 1, // Takes 1/3 of the container's width
        marginLeft: 5, // Adds some spacing between buttons
        backgroundColor: '#F69E35',
    },
});
export default GetStarted;
