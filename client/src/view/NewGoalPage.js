import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Pressable, SafeAreaView } from 'react-native';
import { useTheme, TextInput, Button, Menu, Provider, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import LoadingIndicator from '../components/loading-component';
import DropDownPicker from 'react-native-dropdown-picker';
import { PieChart } from 'react-native-gifted-charts';
import DropDown from "react-native-paper-dropdown";

const NewGoalPage = () => {
    const theme = useTheme();
    const [targetAge, setTargetAge] = useState('');
    const [goalDescription, setGoalDescription] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);

    const [showDropDown, setShowDropDown] = useState(false);

    const itemList = [
        { label: 'Buy Property', value: 0 },
        { label: 'Buy Vehicle', value: 1 },
        { label: 'Traveling', value: 2 },
        { label: 'Custom Goal', value: 3 },
    ];
    const [goalType, setGoalType] = useState(null);

    const validGoalType = (goalType) => {
        return goalType !== null;
    };

    const renderGoalComponent = () => {
        switch (goalType) {
            case 0:
                return <BuyProperty />;
            case 1:
                return <BuyVehicle />;
            case 2:
                return <Traveling />;
            case 3:
                return <CustomGoal />;
            default:
                return null;
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
            >
                <View style={[styles.container, { backgroundColor: theme.colors.onPrimary }]}>
                    <View style={styles.content}>
                        <View style={styles.row}>
                            <TextInput
                                label="Target Age"
                                value={targetAge}
                                onChangeText={setTargetAge}
                                keyboardType="numeric"
                                style={[styles.input, styles.targetAgeInput]}
                                editable={!menuVisible}
                            />
                            <Surface style={styles.containerStyle}>
                                <SafeAreaView style={styles.safeContainerStyle}>
                                    <DropDown
                                        label={"Goal Type"}
                                        mode={"outlined"}
                                        visible={showDropDown}
                                        showDropDown={() => setShowDropDown(true)}
                                        onDismiss={() => setShowDropDown(false)}
                                        value={goalType}
                                        setValue={setGoalType}
                                        list={itemList}
                                    />
                                    <View style={styles.spacerStyle} />
                                </SafeAreaView>
                            </Surface>
                        </View>
                        <TextInput
                            label="Goal Description"
                            value={goalDescription}
                            onChangeText={setGoalDescription}
                            multiline
                            style={styles.input}
                        />
                        <View style={styles.goalComponent}>
                            {renderGoalComponent()}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = {
    container: {
        padding: 20,
    },
    content: {
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    halfInput: {
        flex: 1,
        marginHorizontal: 2,
    },
    targetAgeInput: {
        flex: 1,
        marginRight: 10,
    },
    menuContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    menuButton: {
        width: '100%',
        borderRadius: 5,
    },
    menuButtonContent: {
        height: 50,
    },
    goalComponent: {
        marginTop: 20,
    },
    resultLable: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    calculationLable: {
        marginBottom: 10,
        fontSize: 15,
        textAlign: 'right',
    },
    result: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    pieChart: {
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    pieChartLabel: {
        marginHorizontal: 10
    },
    colorBox: {
        width: 16,
        height: 16,
        marginRight: 2,
    },
    pieChartLabels: {
        // flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
    },
    detailedCostContainer: {
        marginTop: 5,
    },
    input: {
        marginVertical: 5,
    },
    resultLabel: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
};

const BuyProperty = () => {
    const theme = useTheme();
    const [propertyPrice, setPropertyPrice] = useState('');
    const [downPaymentPercentage, setDownPaymentPercentage] = useState('');
    const [downPaymentAmount, setDownPaymentAmount] = useState(0);
    const [loanPeriodYears, setLoanPeriodYears] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [principal, setPrincipal] = useState(0);
    const [interest, setInterest] = useState(0);
    const [showPieChart, setShowPieChart] = useState(false);
    useEffect(() => {
        calculateDownPayment();
    }, [propertyPrice, downPaymentPercentage]);

    useEffect(() => {
        calculateMonthlyPayment();
    }, [interestRate, loanPeriodYears, propertyPrice, downPaymentAmount]);

    const calculateDownPayment = () => {
        const price = parseFloat(propertyPrice);
        const percentage = parseFloat(downPaymentPercentage);
        if (!isNaN(price) && !isNaN(percentage)) {
            const amount = (price * percentage) / 100;
            setDownPaymentAmount(amount);
        } else {
            setDownPaymentAmount(0);
        }
    };

    const calculateMonthlyPayment = () => {
        const P = parseFloat(propertyPrice) - parseFloat(downPaymentAmount);
        const r = parseFloat(interestRate) / 100 / 12;
        let n = parseFloat(loanPeriodYears) * 12;

        if (!isNaN(n) && n / 12 > 35) {
            n = 35 * 12;  // Limit loan period to 35 years
            setLoanPeriodYears('35');  // Update the input field to 35
        }

        if (!isNaN(P) && !isNaN(r) && !isNaN(n) && r !== 0) {
            const monthly = (P * r) / (1 - Math.pow(1 + r, -n));
            setMonthlyPayment(monthly);

            const totalPayment = monthly * n;
            const totalInterest = totalPayment - P;
            setPrincipal(P);
            setInterest(totalInterest);
            setShowPieChart(true);
        } else {
            setMonthlyPayment(0);
            setPrincipal(0);
            setInterest(0);
            setShowPieChart(false);
        }
    };

    const pieData = [
        { key: 'Principal', value: parseFloat(principal.toFixed(2)), color: theme.colors.primary, text: 'RM ' + principal.toFixed(2) },
        { key: 'Interest', value: parseFloat(interest.toFixed(2)), color: theme.colors.tertiary, text: 'RM ' + interest.toFixed(2) },
    ];


    return (
        <ScrollView>
            <View style={styles.content}>
                <View style={styles.row}>
                    <TextInput
                        label="Property Price"
                        value={propertyPrice}
                        onChangeText={text => setPropertyPrice(text)}
                        keyboardType="numeric"
                        style={[styles.input, styles.halfInput]}
                    />
                    <TextInput
                        label="Down Payment %"
                        value={downPaymentPercentage}
                        onChangeText={text => setDownPaymentPercentage(text)}
                        keyboardType="numeric"
                        style={[styles.input, styles.halfInput]}
                    />
                </View>
                <Text style={styles.calculationLabel}>
                    Down Payment Amount: RM {downPaymentAmount.toFixed(2)}
                </Text>
                <View style={styles.row}>
                    <TextInput
                        label="Period (years)"
                        value={loanPeriodYears}
                        onChangeText={text => setLoanPeriodYears(text)}
                        keyboardType="numeric"
                        style={[styles.input, styles.halfInput]}
                    />
                    <TextInput
                        label="Interest Rate (%)"
                        value={interestRate}
                        onChangeText={text => setInterestRate(text)}
                        keyboardType="numeric"
                        style={[styles.input, styles.halfInput]}
                    />
                </View>
                <Text style={styles.resultLabel}>
                    Estimated Monthly Payment
                </Text>
                <Text style={styles.result}>
                    RM {monthlyPayment.toFixed(2)}
                </Text>
                {showPieChart && (
                    <View style={styles.pieChart}>
                        <PieChart
                            data={pieData}
                            showText
                            textColor="white"
                            textBackgroundColor="black" // Add this line
                            radius={110}
                            labelsPosition="inward"
                        />
                        <View style={styles.pieChartLabels}>
                            {pieData.map((slice, index) => (
                                <View key={index} style={styles.row}>
                                    <View style={[styles.colorBox, { backgroundColor: slice.color }]} />
                                    <Text style={styles.pieChartLabel}>
                                        {slice.key}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                )}
                {showPieChart && (
                    <Pressable
                        style={({ pressed }) => ({
                            backgroundColor: pressed ? 'rgba(0, 0, 0, 0.3)' : theme.colors.primary,
                            padding: 10,
                            borderRadius: 25,
                            width: 300,
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'auto',
                            alignSelf: 'center',
                            marginTop: 10
                        })}
                        onPress={() => console.log("saving")}
                    >
                        <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Add to Goal</Text>
                    </Pressable>
                )}
            </View>
        </ScrollView>
    );
};

const BuyVehicle = () => {
    const theme = useTheme();
    const [vehiclePrice, setVehiclePrice] = useState('');
    const [downPaymentPercentage, setDownPaymentPercentage] = useState('');
    const [downPaymentAmount, setDownPaymentAmount] = useState(0);
    const [loanPeriodYears, setLoanPeriodYears] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [principal, setPrincipal] = useState(0);
    const [interest, setInterest] = useState(0);
    const [showPieChart, setShowPieChart] = useState(false);
    useEffect(() => {
        calculateDownPayment();
    }, [vehiclePrice, downPaymentPercentage]);

    useEffect(() => {
        calculateMonthlyPayment();
    }, [interestRate, loanPeriodYears, vehiclePrice, downPaymentAmount]);

    const calculateDownPayment = () => {
        const price = parseFloat(vehiclePrice);
        const percentage = parseFloat(downPaymentPercentage);
        if (!isNaN(price) && !isNaN(percentage)) {
            const amount = (price * percentage) / 100;
            setDownPaymentAmount(amount);
        } else {
            setDownPaymentAmount(0);
        }
    };

    const calculateMonthlyPayment = () => {
        const P = parseFloat(vehiclePrice) - parseFloat(downPaymentAmount);
        const r = parseFloat(interestRate) / 100 / 12;
        let n = parseFloat(loanPeriodYears) * 12;

        if (!isNaN(n) && n / 12 > 35) {
            n = 35 * 12;  // Limit loan period to 35 years
            setLoanPeriodYears('35');  // Update the input field to 35
        }

        if (!isNaN(P) && !isNaN(r) && !isNaN(n) && r !== 0) {
            const monthly = (P * r) / (1 - Math.pow(1 + r, -n));
            setMonthlyPayment(monthly);

            const totalPayment = monthly * n;
            const totalInterest = totalPayment - P;
            setPrincipal(P);
            setInterest(totalInterest);
            setShowPieChart(true);
        } else {
            setMonthlyPayment(0);
            setPrincipal(0);
            setInterest(0);
            setShowPieChart(false);
        }
    };

    const pieData = [
        { key: 'Principal', value: parseFloat(principal.toFixed(2)), color: theme.colors.primary, text: 'RM ' + principal.toFixed(2) },
        { key: 'Interest', value: parseFloat(interest.toFixed(2)), color: theme.colors.tertiary, text: 'RM ' + interest.toFixed(2) },
    ];


    return (
        <ScrollView>
            <View style={styles.content}>
                <View style={styles.row}>
                    <TextInput
                        label="Vehicle Price"
                        value={vehiclePrice}
                        onChangeText={text => setVehiclePrice(text)}
                        keyboardType="numeric"
                        style={[styles.input, styles.halfInput]}
                    />
                    <TextInput
                        label="Down Payment %"
                        value={downPaymentPercentage}
                        onChangeText={text => setDownPaymentPercentage(text)}
                        keyboardType="numeric"
                        style={[styles.input, styles.halfInput]}
                    />
                </View>
                <Text style={styles.calculationLabel}>
                    Down Payment Amount: RM {downPaymentAmount.toFixed(2)}
                </Text>
                <View style={styles.row}>
                    <TextInput
                        label="Period (years)"
                        value={loanPeriodYears}
                        onChangeText={text => setLoanPeriodYears(text)}
                        keyboardType="numeric"
                        style={[styles.input, styles.halfInput]}
                    />
                    <TextInput
                        label="Interest Rate (%)"
                        value={interestRate}
                        onChangeText={text => setInterestRate(text)}
                        keyboardType="numeric"
                        style={[styles.input, styles.halfInput]}
                    />
                </View>
                <Text style={styles.resultLabel}>
                    Estimated Monthly Payment
                </Text>
                <Text style={styles.result}>
                    RM {monthlyPayment.toFixed(2)}
                </Text>
                {showPieChart && (
                    <View style={styles.pieChart}>
                        <PieChart
                            data={pieData}
                            showText
                            textColor="white"
                            textBackgroundColor="black" // Add this line
                            radius={110}
                            labelsPosition="inward"
                        />
                        <View style={styles.pieChartLabels}>
                            {pieData.map((slice, index) => (
                                <View key={index} style={styles.row}>
                                    <View style={[styles.colorBox, { backgroundColor: slice.color }]} />
                                    <Text style={styles.pieChartLabel}>
                                        {slice.key}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                )}
                {showPieChart && (
                    <Pressable
                        style={({ pressed }) => ({
                            backgroundColor: pressed ? 'rgba(0, 0, 0, 0.3)' : theme.colors.primary,
                            padding: 10,
                            borderRadius: 25,
                            width: 300,
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'auto',
                            alignSelf: 'center',
                            marginTop: 10
                        })}
                        onPress={() => console.log("saving")}
                    >
                        <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Add to Goal</Text>
                    </Pressable>
                )}
            </View>
        </ScrollView>
    );
}
const Traveling = () => {
    const theme = useTheme();
    const [overallCost, setOverallCost] = useState('');
    const [detailedCosts, setDetailedCosts] = useState({
        transport: '',
        food: '',
        accommodation: '',
        activities: ''
    });
    const [enterDetailedCosts, setEnterDetailedCosts] = useState(false);

    useEffect(() => {
        if (enterDetailedCosts) {
            const total = totalDetailedCost();
            setOverallCost(total.toFixed(2));
        }
    }, [detailedCosts, enterDetailedCosts]);

    const handleOverallCostChange = (text) => {
        if (!enterDetailedCosts) {
            setOverallCost(text);
        }
    };

    const handleDetailedCostChange = (field, value) => {
        setDetailedCosts(prevCosts => ({
            ...prevCosts,
            [field]: value
        }));
    };

    const handleToggleDetailedCosts = () => {
        setEnterDetailedCosts(!enterDetailedCosts);
    };

    const totalDetailedCost = () => {
        const { transport, food, accommodation, activities } = detailedCosts;
        return (
            parseFloat(transport) || 0 +
            parseFloat(food) || 0 +
            parseFloat(accommodation) || 0 +
            parseFloat(activities) || 0
        );
    };

    return (
        // <KeyboardAvoidingView
        //     style={{ flex: 1 }}
        //     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        //     keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        // >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={styles.content}>
                <TextInput
                    label="Overall Traveling Cost"
                    value={overallCost}
                    onChangeText={handleOverallCostChange}
                    keyboardType="numeric"
                    style={styles.input}
                    editable={!enterDetailedCosts}
                />
                <Button onPress={handleToggleDetailedCosts}>
                    {enterDetailedCosts ? "Hide Detailed Costs" : "Enter Detailed Costs"}
                </Button>
                {enterDetailedCosts && (
                    <View style={styles.detailedCostContainer}>
                        <TextInput
                            label="Transport Cost"
                            value={detailedCosts.transport}
                            onChangeText={(text) => handleDetailedCostChange('transport', text)}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            label="Food and Beverage Cost"
                            value={detailedCosts.food}
                            onChangeText={(text) => handleDetailedCostChange('food', text)}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            label="Accommodation Cost"
                            value={detailedCosts.accommodation}
                            onChangeText={(text) => handleDetailedCostChange('accommodation', text)}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            label="Activity Cost"
                            value={detailedCosts.activities}
                            onChangeText={(text) => handleDetailedCostChange('activities', text)}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    </View>
                )}
            </View>
            <Pressable
                style={({ pressed }) => ({
                    backgroundColor: pressed ? 'rgba(0, 0, 0, 0.3)' : theme.colors.primary,
                    padding: 10,
                    borderRadius: 25,
                    width: 300,
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                    alignSelf: 'center',
                    marginTop: 10
                })}
                onPress={() => console.log("saving")}
            >
                <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Add to Goal</Text>
            </Pressable>
        </ScrollView>
        // </KeyboardAvoidingView>
    );
};
const CustomGoal = () => {
    const theme = useTheme();
    const [goalCost, setGoalCost] = useState('');

    const handleGoalCostChange = (text) => {
        setGoalCost(text);
    };

    return (
        <ScrollView>
            <View style={styles.content}>
                <TextInput
                    label="Amount Needed (RM)"
                    value={goalCost}
                    onChangeText={handleGoalCostChange}
                    keyboardType="numeric"
                    style={styles.input}
                />
            </View>
            <Pressable
                style={({ pressed }) => ({
                    backgroundColor: pressed ? 'rgba(0, 0, 0, 0.3)' : theme.colors.primary,
                    padding: 10,
                    borderRadius: 25,
                    width: 300,
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                    alignSelf: 'center',
                    marginTop: 10
                })}
                onPress={() => console.log("saving")}
            >
                <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Add to Goal</Text>
            </Pressable>
        </ScrollView>

    )
};

export default NewGoalPage;
