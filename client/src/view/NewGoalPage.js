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
    const navigation = useNavigation();
    const [targetAge, setTargetAge] = useState('');
    const [goalDescription, setGoalDescription] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [goalData, setGoalData] = useState([]);
    const [showDropDown, setShowDropDown] = useState(false);
    const [userAge, setUserAge] = useState(0)
    const [loading, setLoading] = useState(false);


    const fetchUserAge = async () => {
        try {
            const response = await axios.get(API_BASE_URL + '/userAge');
            console.log(response.data)
            setUserAge(response.data)
        } catch (error) {
            console.error('Error fetching user age:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Fetch transactions when the page gains focus
            fetchUserAge();
        });
        return unsubscribe;
    }, [navigation]);

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
                return <BuyProperty setGoalData={setGoalData} targetAge={targetAge} />;
            case 1:
                return <BuyVehicle setGoalData={setGoalData} targetAge={targetAge} />;
            case 2:
                return <Traveling setGoalData={setGoalData} />;
            case 3:
                return <CustomGoal setGoalData={setGoalData} />;
            default:
                return null;
        }
    };
    const handleAddGoal = () => {
        // validate data
        // Validate targetAge
        if (isNaN(targetAge) || targetAge <= 0) {
            alert("Please enter a valid target age.")
            return;
        }

        if (targetAge < userAge || targetAge > 80) {
            alert("Target age should be in range " + userAge.toString() + " years old to 80 years old!")
            return;
        }

        // Validate goalDescription
        if (!goalDescription.trim()) {
            alert("Please enter a goal description.")
            return;
        }

        // Validate goalType early
        if (![0, 1, 2, 3].includes(goalType)) {
            alert("Please select a valid goal type!");
            return;
        }

        // Common validation for downPaymentPercentage, loanPeriodYears, and interestRate
        const validateFinancialFields = ({ downPaymentPercentage, loanPeriodYears, interestRate }) => {
            if (isNaN(downPaymentPercentage) || downPaymentPercentage <= 9 || downPaymentPercentage > 100) {
                alert("Down payment percentage should be more than 10% and less than 100%.");
                return false;
            }
            if (isNaN(loanPeriodYears) || loanPeriodYears <= 0 || loanPeriodYears > 35) {
                alert("Please enter a valid loan period.");
                return false;
            }
            if (isNaN(interestRate) || interestRate <= 0 || interestRate > 100) {
                alert("Please enter a valid interest rate (1-100%).");
                return false;
            }
            return true;
        };

        // Validate goalData based on goalType
        if (goalType === 0) { // Buy Property
            const { propertyPrice, downPaymentPercentage, loanPeriodYears, interestRate } = goalData;
            if (isNaN(propertyPrice) || propertyPrice <= 0) {
                alert("Please enter a valid property price.");
                return;
            }
            if (!validateFinancialFields({ downPaymentPercentage, loanPeriodYears, interestRate })) {
                return;
            }
        } else if (goalType === 1) { // Buy Vehicle
            const { vehiclePrice, downPaymentPercentage, loanPeriodYears, interestRate } = goalData;
            if (isNaN(vehiclePrice) || vehiclePrice <= 0) {
                alert("Please enter a valid vehicle price.");
                return;
            }
            if (!validateFinancialFields({ downPaymentPercentage, loanPeriodYears, interestRate })) {
                return;
            }
        } else if (goalType === 2) { // Traveling
            const { overallCost } = goalData;
            if (isNaN(overallCost) || overallCost <= 0) {
                alert("Please enter a valid overall traveling cost.");
                return;
            }
        } else if (goalType === 3) { // Custom Goal
            const { goalCost } = goalData;
            if (isNaN(goalCost) || goalCost <= 0) {
                alert("Please enter a valid cost.");
                return;
            }
        }

        const goalPayload = {
            goal_type: goalType,
            goal_description: goalDescription,
            target_age: targetAge,
            component_data: goalData  // Assuming goalData contains specific details related to the selected goal type
        };

        if (goalPayload.goal_type == 2) {
            console.log("Goal 2 total amount: " + goalPayload.component_data.overallCost);
        } else if (goalPayload.goal_type == 3) {
            console.log("Goal 3 total amount: " + goalPayload.component_data.goalCost);
        }

        console.log(goalPayload)
        setLoading(true)
        axios.post(API_BASE_URL + '/newGoal', { goalPayload })
            .then(response => {
                console.log('Goal Data:', response.data);
                alert("Goal added successfully!")
                setGoalType(null)
                setLoading(false)
                setGoalData([])
                setGoalDescription('')
                setTargetAge('')
                navigation.navigate('My Goals')
            })
            .catch(error => {
                console.error('Error adding goal:', error);
                alert("Failed to add goal!")
                setLoading(false)
            })
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
                            onPress={handleAddGoal}
                        >
                            <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Add to Goal</Text>
                        </Pressable>
                    </View>
                </View>
                {(loading &&
                    <LoadingIndicator theme={theme} />
                )}
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
        marginLeft: 10
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

const BuyProperty = ({ setGoalData, targetAge }) => {
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
    }, [interestRate, loanPeriodYears, propertyPrice, downPaymentAmount, downPaymentPercentage]);

    const calculateDownPayment = () => {
        const price = parseFloat(propertyPrice);
        const percentage = parseFloat(downPaymentPercentage);
        if (percentage >= 100) {
            setDownPaymentAmount(price)
        } else {
            if (!isNaN(price) && !isNaN(percentage)) {
                const amount = (price * percentage) / 100;
                setDownPaymentAmount(amount);
            } else {
                setDownPaymentAmount(0);
            }
        }
    };

    const calculateMonthlyPayment = () => {
        if (!isNaN(downPaymentPercentage) && downPaymentPercentage > 100) {
            setDownPaymentPercentage('100');
        }

        if (!isNaN(interestRate) && interestRate > 100) {
            setInterestRate('100');
        }

        if (!isNaN(loanPeriodYears) && loanPeriodYears > 35) {
            setLoanPeriodYears('35');
        }

        if (!isNaN(loanPeriodYears) && loanPeriodYears > (70 - targetAge)) {
            setLoanPeriodYears((70 - targetAge) > 0 ? (70 - targetAge).toString() : '0');
        }

        const P = parseFloat(propertyPrice) - parseFloat(downPaymentAmount);
        const r = parseFloat(interestRate) / 100 / 12;
        let n = parseFloat(loanPeriodYears) * 12;


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

    useEffect(() => {
        setGoalData({
            propertyPrice,
            downPaymentPercentage,
            downPaymentAmount,
            loanPeriodYears,
            interestRate,
            monthlyPayment,
        });
    }, [propertyPrice, downPaymentPercentage, downPaymentAmount, loanPeriodYears, interestRate, monthlyPayment]);



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
                            textColor="white"
                            textBackgroundColor="black" // Add this line
                            radius={110}
                        />
                        <View style={styles.pieChartLabels}>
                            {pieData.map((slice, index) => (
                                <View key={index} style={styles.row}>
                                    <View style={[styles.colorBox, { backgroundColor: slice.color }]} />
                                    <View style={{alignItems: 'flex-end'}}>
                                        <Text style={styles.pieChartLabel}>
                                            {slice.key}
                                        </Text>
                                        <Text style={{fontSize: 12, color: 'gray'}}>
                                            (RM{slice.value.toFixed(0)})
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                )}
            </View>
        </ScrollView>
    );
};

const BuyVehicle = ({ setGoalData, targetAge }) => {
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
    }, [interestRate, loanPeriodYears, vehiclePrice, downPaymentAmount, downPaymentPercentage]);

    useEffect(() => {
        setGoalData({
            vehiclePrice,
            downPaymentPercentage,
            downPaymentAmount,
            loanPeriodYears,
            interestRate,
            monthlyPayment,
        });
    }, [vehiclePrice, downPaymentPercentage, downPaymentAmount, loanPeriodYears, interestRate, monthlyPayment]);


    const calculateDownPayment = () => {
        const price = parseFloat(vehiclePrice);
        const percentage = parseFloat(downPaymentPercentage);
        if (percentage >= 100) {
            setDownPaymentAmount(price)
        } else {
            if (!isNaN(price) && !isNaN(percentage)) {
                const amount = (price * percentage) / 100;
                setDownPaymentAmount(amount);
            } else {
                setDownPaymentAmount(0);
            }
        }
    };

    const calculateMonthlyPayment = () => {
        if (!isNaN(downPaymentPercentage) && downPaymentPercentage > 100) {
            setDownPaymentPercentage('100');
        }

        if (!isNaN(interestRate) && interestRate > 100) {
            setInterestRate('100');
        }

        if (!isNaN(loanPeriodYears) && loanPeriodYears > 35) {
            setLoanPeriodYears('35');
        }
        if (!isNaN(loanPeriodYears) && loanPeriodYears > (70 - targetAge)) {
            setLoanPeriodYears((70 - targetAge) > 0 ? (70 - targetAge).toString() : '0');
        }
        const P = parseFloat(vehiclePrice) - parseFloat(downPaymentAmount);
        const r = parseFloat(interestRate) / 100 / 12;
        let n = parseFloat(loanPeriodYears) * 12;

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
                            textColor="white"
                            textBackgroundColor="black" // Add this line
                            radius={110}
                        />
                        <View style={styles.pieChartLabels}>
                            {pieData.map((slice, index) => (
                                <View key={index} style={styles.row}>
                                    <View style={[styles.colorBox, { backgroundColor: slice.color }]} />
                                    <View style={{alignItems: 'flex-end'}}>
                                        <Text style={styles.pieChartLabel}>
                                            {slice.key}
                                        </Text>
                                        <Text style={{fontSize: 12, color: 'gray'}}>
                                            (RM{slice.value.toFixed(0)})
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                )}
            </View>
        </ScrollView>
    );
}
const Traveling = ({ setGoalData }) => {
    const theme = useTheme();
    const [overallCost, setOverallCost] = useState(0);
    const [detailedCosts, setDetailedCosts] = useState({
        transport: '',
        food: '',
        accommodation: '',
        activities: ''
    });
    const [enterDetailedCosts, setEnterDetailedCosts] = useState(false);

    // useEffect(() => {
    //     if (enterDetailedCosts) {
    //         const total = totalDetailedCost();
    //         setOverallCost(total.toFixed(2));
    //     }
    // }, [detailedCosts, enterDetailedCosts]);

    const handleOverallCostChange = (text) => {
        if (!enterDetailedCosts) {
            setOverallCost(parseFloat(text) || 0);
        }
    };

    useEffect(() => {
        setGoalData({
            overallCost,
            detailedCosts,
        });
    }, [overallCost, detailedCosts]);


    const handleDetailedCostChange = (field, value) => {
        const numericValue = parseFloat(value) || 0;
        setDetailedCosts(prevCosts => {
            const updatedCosts = { ...prevCosts, [field]: value };
            const totalDetailedCost = Object.values(updatedCosts)
                .map(val => parseFloat(val) || 0)
                .reduce((acc, curr) => acc + curr, 0);
            setOverallCost(totalDetailedCost.toFixed(2));
            return updatedCosts;
        });
    };

    const handleToggleDetailedCosts = () => {
        setEnterDetailedCosts(!enterDetailedCosts);
        if (enterDetailedCosts) {
            // Reset detailed costs when hiding detailed costs section
            setDetailedCosts({
                transport: '',
                food: '',
                accommodation: '',
                activities: ''
            });
        }
    };

    return (
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
                    {enterDetailedCosts ? "Hide and Remove Detailed Costs" : "Enter Detailed Costs"}
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
        </ScrollView>
        // </KeyboardAvoidingView>
    );
};

const CustomGoal = ({ setGoalData }) => {
    const theme = useTheme();
    const [goalCost, setGoalCost] = useState('');

    const handleGoalCostChange = (text) => {
        setGoalCost(text);
    };

    useEffect(() => {
        setGoalData({
            goalCost,
        });
    }, [goalCost]);


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

        </ScrollView>

    )
};

export default NewGoalPage;
