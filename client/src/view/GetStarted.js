import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Text, Image } from 'react-native';
import { Button, TextInput, Title, ProgressBar, useTheme } from 'react-native-paper';
import styles from '../styles';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import LoadingIndicator from '../components/loading-component';
const { width } = Dimensions.get('window');

const CustomInput = ({ label, value, onChangeText }) => {
    return (
        <View style={style.customInputContainer}>
            <Text style={style.label}>{label}</Text>
            <View style={style.inputWithPrefix}>
                <Text style={style.prefix}>RM</Text>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    style={style.input}
                    keyboardType="numeric"
                />
            </View>
        </View>
    );
};

const GetStarted = () => {
    const theme = useTheme();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        income: '',
        expenses: '',
        savings: '',
        retirementAge: '',
        lifeExpectancy: '',
        user_id: '665094c0c1a89d9d19d13606' //NEED TO CHANGE THIS
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

    const handleSubmit = async () => {
        // Process the form data
        console.log(formData);
        // You can perform additional actions here, such as sending data to a server
        setLoading(true);
        try {
            console.log("Submitting: " + formData);
            const response = await axios.post(API_BASE_URL + '/getStarted', {
                formData
            });
            console.log('Done!', response.data);
            alert('DONE');
        } catch (error) {
            console.error('Error Occurs', error);
            alert('There was an error. Please try again.');
        } finally {
            setLoading(false); // Set loading to false regardless of login success or failure
        }
    };

    const progress = (step + 1) / 3;

    return (
        <View style={[style.container, { backgroundColor: theme.colors.primary }]}>
            <Title style={[styles.headingText, { color: theme.colors.background, fontWeight: 'bold', fontSize: 30, textAlign: 'left', marginBottom: '5%' }]}>Let's Get Started!</Title>
            <ProgressBar progress={progress} color="#F4F9FB" style={style.progressBar} />
            {(loading &&
                <LoadingIndicator theme={theme} />
            )}
            <Animated.View style={[style.innerContainer, { transform: [{ translateX }] }]}>
                <View style={styles.step}>
                    <Title style={[styles.bodyText, { color: theme.colors.tertiary, fontSize: 18 }]}>Step 1: Enter your estimated monthly income and expenses</Title>
                    <CustomInput
                        label="Monthly Income:"
                        value={formData.income}
                        onChangeText={(text) => handleChange('income', text)}
                    />
                    <CustomInput
                        label="Monthly Expenses:"
                        value={formData.expenses}
                        onChangeText={(text) => handleChange('expenses', text)}
                    />
                </View>

                <View style={styles.step}>
                    <Title style={[styles.bodyText, { color: theme.colors.tertiary, fontSize: 18 }]}>Step 2: Enter the current saving amount you have</Title>
                    <CustomInput
                        label="Current Savings:"
                        value={formData.savings}
                        onChangeText={(text) => handleChange('savings', text)}
                    />
                </View>

                <View style={styles.step}>
                    <Title style={[styles.bodyText, { color: theme.colors.tertiary, fontSize: 18 }]}>Step 3: Retirement and Life Expectancy</Title>
                    <View style={style.inputContainer}>
                        <Text style={style.label}>Retirement Age:</Text>
                        <TextInput
                            value={formData.retirementAge}
                            onChangeText={(text) => handleChange('retirementAge', text)}
                            style={style.input}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={style.inputContainer}>
                        <Text style={style.label}>Life Expectancy:</Text>
                        <TextInput
                            value={formData.lifeExpectancy}
                            onChangeText={(text) => handleChange('lifeExpectancy', text)}
                            style={style.input}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </Animated.View>

            <View style={style.buttonContainer}>
                {step > 0 && <Button style={style.backButton} mode="contained" onPress={handleBack} labelStyle={{ color: '#005A75' }}>Back</Button>}
                {step < 2 ? (
                    <Button style={style.nextButton} mode="contained" onPress={handleNext}>Next</Button>
                ) : (
                    <Button style={style.submitButton} mode="contained" onPress={handleSubmit}>Submit</Button>
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
    customInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    inputWithPrefix: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    prefix: {
        fontSize: 16,
        color: '#000',
        marginRight: 8,
        fontWeight: 'bold'
    },
    label: {
        flex: 1,
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold'
    },
    input: {
        flex: 1,
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
