import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Text, Image, Alert } from 'react-native';
import { Button, TextInput, Title, ProgressBar, useTheme } from 'react-native-paper';
import styles from '../styles';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import LoadingIndicator from '../components/loading-component';
const { width } = Dimensions.get('window');
import { useNavigation, useRoute } from '@react-navigation/native';

const CustomInput = ({ label, value, onChangeText }) => {
    return (
        <View style={style.customInputContainer}>
            <Text style={style.label}>{label}</Text>
            <View style={style.inputWithPrefix}>
                <Text style={style.prefix}>RM</Text>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    style={[styles.inputField, style.inputContainer]}
                    keyboardType="numeric"
                />
            </View>
        </View>
    );
};

const GetStarted = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const route = useRoute();
    // const { userId } = route.params;
    const { userId } = "123";
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        income: '',
        expenses: '',
        savings: '',
        retirementAge: '',
        lifeExpectancy: '',
        user_id: userId
    });

    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: -width * (step - 1),
            useNativeDriver: true
        }).start();
    }, [step, translateX]);

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);
            try {
                const response = await axios.post(API_BASE_URL + '/getStarted', {formData});
                alert('Welcome to Doit4Duit! Please proceed to Login');
                navigation.navigate('Login');
            } catch (error) {
                console.error('Error Occurs', error);
                alert('There was an error. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const validateStep = () => {
        if (step === 0) {
            if (!formData.income || !formData.expenses) {
                Alert.alert('Validation Error', 'Please enter both income and expenses.');
                return false;
            }
        } else if (step === 1) {
            if (!formData.savings) {
                Alert.alert('Validation Error', 'Please enter your current savings.');
                return false;
            }
        }
        return true;
    };

    const validateForm = () => {
        if (!formData.retirementAge || !formData.lifeExpectancy) {
            Alert.alert('Validation Error', 'Please enter both retirement age and life expectancy.');
            return false;
        }
        return true;
    };

    const progress = (step + 1) / 3;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <Title style={[styles.heading, { color: theme.colors.background }]}>Let's Get Started!</Title>
            <ProgressBar progress={progress} color="#F4F9FB" style={styles.progressBar} />
            {loading && <LoadingIndicator theme={theme} />}
            <Animated.View style={[styles.innerContainer, { transform: [{ translateX }] }]}>
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
                    <View style={style.customInputContainer}>
                        <Text style={style.label}>Retirement Age:</Text>
                        <TextInput
                            value={formData.retirementAge}
                            onChangeText={(text) => handleChange('retirementAge', text)}
                            style={[styles.inputField, style.inputContainer, {flex: 1}]}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={style.customInputContainer}>
                        <Text style={style.label}>Life Expectancy:</Text>
                        <TextInput
                            value={formData.lifeExpectancy}
                            onChangeText={(text) => handleChange('lifeExpectancy', text)}
                            style={[styles.inputField, style.inputContainer, {flex: 1}]}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </Animated.View>

            <View style={styles.buttonContainer}>
                {step > 0 && <Button style={styles.backButton} mode="contained" onPress={handleBack} labelStyle={{ color: '#005A75' }}>Back</Button>}
                {step < 2 ? (
                    <Button style={styles.nextButton} mode="contained" onPress={handleNext}>Next</Button>
                ) : (
                    <Button style={styles.submitButton} mode="contained" onPress={handleSubmit}>Submit</Button>
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
    customInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    inputContainer: {
        marginBottom: 16,
        width: '80%',
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
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        width: '50%'
    },
    
});

export default GetStarted;
