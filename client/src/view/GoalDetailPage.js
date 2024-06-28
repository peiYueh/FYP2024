import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Pressable, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useTheme, TextInput, Button, Menu, Provider, Surface } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import LoadingIndicator from '../components/loading-component';
import DropDown from "react-native-paper-dropdown";
import { PieChart } from 'react-native-gifted-charts';

const ViewGoalPage = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    // const { goalId } = route.params; // Assumes goalId is passed via navigation params
    const goalId = "667da042ce513693892d65ed"

    // const [loading, setLoading] = useState(true);
    const [goal, setGoal] = useState({});
    const [targetAge, setTargetAge] = useState('');
    const [goalDescription, setGoalDescription] = useState('');
    const [goalType, setGoalType] = useState(null);
    const [goalData, setGoalData] = useState({});
    const [showDropDown, setShowDropDown] = useState(false);
    const [editedData, setEditedData] = useState({})

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const itemList = [
        { label: 'Buy Property', value: 0 },
        { label: 'Buy Vehicle', value: 1 },
        { label: 'Traveling', value: 2 },
        { label: 'Custom Goal', value: 3 },
    ];

    useEffect(() => {
        const fetchGoalData = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${API_BASE_URL}/goal/${goalId}`);
                const goal = response.data;
                setGoal(goal);
                setTargetAge(goal.target_age);
                setGoalDescription(goal.goal_description);
                setGoalType(goal.goal_type);

                if (goal.goal_type === 0) {
                    const goalComponent = {
                        property_price: goal.property_price,
                        down_payment_percentage: goal.down_payment_percentage,
                        interest_rate: goal.interest_rate,
                        loan_period: goal.loan_period,
                    };
                    setGoalData(goalComponent);
                } else if (goal.goal_type === 1) {
                    const goalComponent = {
                        vehicle_price: goal.vehicle_price,
                        down_payment_percentage: goal.down_payment_percentage,
                        interest_rate: goal.interest_rate,
                        loan_period: goal.loan_period,
                    }
                    setGoalData(goalComponent);
                } else if (goal.goal_type === 2) {
                    const goalComponent = {
                        total_amount: goal.total_amount,
                        transport: goal.transport,
                        food_and_beverage: goal.food_and_beverage,
                        accommodation_cost: goal.accommodation_cost,
                        activities_cost: goal.activities_cost,
                    }
                    setGoalData(goalComponent);
                } else {
                    const goalComponent = {
                        total_amount: goal.total_amount,
                    }
                    setGoalData(goalComponent);
                }

                // setLoading(false);
            } catch (error) {
                console.error('Error fetching goal:', error);
                // setLoading(false);
            } finally {
                setLoading(false)
            }
        };

        fetchGoalData();
    }, [goalId]);

    const renderGoalComponent = () => {
        switch (goalType) {
            case 0:
                return <BuyProperty goalData={goalData} setEditedData={setEditedData} />;
            case 1:
                return <BuyVehicle goalData={goalData} setEditedData={setEditedData} />;
            case 2:
                return <Traveling goalData={goalData} setEditedData={setEditedData} />;
            case 3:
                return <CustomGoal goalData={goalData} setEditedData={setEditedData} />;
            default:
                return null;
        }
    };

    const handleSaveGoal = async () => {
        const updatedGoal = {
            _id: goalId,
            goal_type: goalType,
            goal_description: goalDescription,
            target_age: targetAge,
            component_data: editedData
        };
        console.log(updatedGoal)

        // set component -> total amount -> to float

        if (updatedGoal.goal_type == 2) {
            console.log("Goal 2 total amount: " + updatedGoal.component_data.overallCost);
            updatedGoal.component_data.overallCost = parseFloat(updatedGoal.component_data.overallCost).toFixed(2);
        } else if (updatedGoal.goal_type == 3) {
            console.log("Goal 3 total amount: " + updatedGoal.component_data.goalCost);
            updatedGoal.component_data.goalCost = parseFloat(updatedGoal.component_data.goalCost).toFixed(2);
        }
    
        setSaving(true)
        try {
            // Make API call to update liability data
            const response = await axios.post(API_BASE_URL + '/editGoal', updatedGoal);
            if (response.status === 200) {
                // Handle success if necessary
                Alert.alert('Success', 'Goal updated successfully!');
                // setEditMode(false); // Exit edit mode after saving

            } else {
                // Handle other statuses if needed
                Alert.alert('Error', 'Failed to update goal');
            }
        } catch (error) {
            console.error('Error updating goal:', error);
            Alert.alert('Error', 'Failed to update goal');
        } finally {
            setSaving(false); // Deactivate loading indicator
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
                    {loading ? ( // Display loading spinner while updating
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    ) : (
                        <View style={styles.content}>
                            <View style={styles.row}>
                                <TextInput
                                    label="Target Age"
                                    value={targetAge}
                                    onChangeText={setTargetAge}
                                    keyboardType="numeric"
                                    style={[styles.input, styles.targetAgeInput]}
                                    editable
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
                                {goalData && renderGoalComponent()}
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
                                onPress={handleSaveGoal}
                            >
                                <Text style={[styles.buttonText, { color: '#F4F9FB' }]}>Save Goal</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
                {(saving &&
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

const BuyProperty = ({ goalData, setEditedData }) => {
    const theme = useTheme();

    const [propertyPrice, setPropertyPrice] = useState('');
    const [downPaymentPercentage, setDownPaymentPercentage] = useState('');
    const [loanPeriodYears, setLoanPeriodYears] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [downPaymentAmount, setDownPaymentAmount] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState('');
    const [principal, setPrincipal] = useState('');
    const [interest, setInterest] = useState('');
    const [showPieChart, setShowPieChart] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false)

    // Update state values when goalData changes and has valid data
    useEffect(() => {
        if (goalData && Object.keys(goalData).length > 0) {
            console.log(goalData)
            setPropertyPrice(goalData.property_price || '0');
            setDownPaymentPercentage(goalData.down_payment_percentage || '0');
            setLoanPeriodYears(goalData.loan_period || '0');
            setInterestRate(goalData.interest_rate || '0');
            setDataLoaded(true)
        }
    }, [goalData]);

    useEffect(() => {
        calculateDownPayment();
    }, [propertyPrice, downPaymentPercentage]);

    useEffect(() => {
        calculateMonthlyPayment();
    }, [interestRate, loanPeriodYears, propertyPrice, downPaymentAmount]);

    useEffect(() => {
        setEditedData({
            property_price: propertyPrice,
            down_payment_percentage: downPaymentPercentage,
            down_payment_amount: downPaymentAmount,
            loan_period: loanPeriodYears,
            interest_rate: interestRate,
            monthly_payment: monthlyPayment,
        });
    }, [dataLoaded, propertyPrice, downPaymentPercentage, loanPeriodYears, interestRate]);

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

        const P = parseFloat(propertyPrice) - parseFloat(downPaymentAmount);
        const r = parseFloat(interestRate) / 100 / 12;
        let n = parseFloat(loanPeriodYears) * 12;


        if (!isNaN(P) && !isNaN(r) && !isNaN(n) && r !== 0) {
            const monthly = (P * r) / (1 - Math.pow(1 + r, -n));
            setMonthlyPayment(monthly.toFixed(2));

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
                    Down Payment Amount: RM {downPaymentAmount}
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
                    RM {monthlyPayment}
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
            </View>
        </ScrollView>
    );
};


const BuyVehicle = ({ goalData, setEditedData }) => {
    const theme = useTheme();
    const [vehiclePrice, setVehiclePrice] = useState('');
    const [downPaymentPercentage, setDownPaymentPercentage] = useState('');
    const [downPaymentAmount, setDownPaymentAmount] = useState('');
    const [loanPeriodYears, setLoanPeriodYears] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState('');
    const [principal, setPrincipal] = useState('');
    const [interest, setInterest] = useState('');
    const [showPieChart, setShowPieChart] = useState(false);

    const [dataLoaded, setDataLoaded] = useState(false)

    useEffect(() => {
        if (goalData && Object.keys(goalData).length > 0) {
            setVehiclePrice(goalData.vehicle_price || '0');
            setDownPaymentPercentage(goalData.down_payment_percentage || '0');
            setLoanPeriodYears(goalData.loan_period || '0');
            setInterestRate(goalData.interest_rate || '0');
            setDataLoaded(true)
        }
    }, [goalData]);

    useEffect(() => {
        calculateDownPayment();
    }, [vehiclePrice, downPaymentPercentage]);

    useEffect(() => {
        calculateMonthlyPayment();
    }, [interestRate, loanPeriodYears, vehiclePrice, downPaymentAmount, downPaymentPercentage]);

    useEffect(() => {
        setEditedData({
            vehicle_price: vehiclePrice,
            down_payment_percentage: downPaymentPercentage,
            down_payment_amount: downPaymentAmount,
            loan_period: loanPeriodYears,
            interest_rate: interestRate,
            monthly_payment: monthlyPayment,
        });
    }, [dataLoaded, vehiclePrice, downPaymentPercentage, loanPeriodYears, interestRate]);


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
            </View>
        </ScrollView>
    );
}

const Traveling = ({ goalData, setEditedData }) => {
    const theme = useTheme();
    const [overallCost, setOverallCost] = useState('');
    const [detailedCosts, setDetailedCosts] = useState({
        transport: '',
        food: '',
        accommodation: '',
        activities: ''
    });
    const [enterDetailedCosts, setEnterDetailedCosts] = useState(false);

    const [dataLoaded, setDataLoaded] = useState(false)

    useEffect(() => {
        if (detailedCosts.transport != '' || detailedCosts.food != '' || detailedCosts.accommodation != '' || detailedCosts.activities != '') {
            setEnterDetailedCosts(true);
        }
    }, [detailedCosts]);


    useEffect(() => {
        if (goalData && Object.keys(goalData).length > 0) {
            // console.log(goalData)
            setOverallCost(goalData.total_amount);
            console.log(overallCost)
            const details = {
                transport: goalData?.transport !== '-' ? goalData.transport : '',
                food: goalData?.food_and_beverage !== '-' ? goalData.food_and_beverage : '',
                accommodation: goalData?.accommodation_cost !== '-' ? goalData.accommodation_cost : '',
                activities: goalData?.activities_cost !== '-' ? goalData.activities_cost : ''
            };
            setDetailedCosts(details);
            setDataLoaded(true)
        }
    }, [goalData]);

    const handleOverallCostChange = (text) => {
        if (!enterDetailedCosts) {
            setOverallCost(parseFloat(text) || 0);
        }
    };

    useEffect(() => {
        setEditedData({
            overallCost,
            detailedCosts,
        });
    }, [dataLoaded, overallCost, detailedCosts]);


    const handleDetailedCostChange = (field, value) => {
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


const CustomGoal = ({ goalData, setEditedData }) => {
    const theme = useTheme();
    const [goalCost, setGoalCost] = useState('');

    const [dataLoaded, setDataLoaded] = useState(false)


    const handleGoalCostChange = (text) => {
        setGoalCost(text);
    };

    useEffect(() => {
        if (goalData && Object.keys(goalData).length > 0) {
            console.log(goalData)
            setGoalCost(goalData.total_amount || '0');
            setDataLoaded(true)
        }
    }, [goalData]);


    useEffect(() => {
        setEditedData({
            goalCost,
        });
    }, [dataLoaded, goalCost]);


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

export default ViewGoalPage;

// Note: Ensure that BuyProperty, BuyVehicle, Traveling, and CustomGoal components are imported or defined similarly as in the NewGoalPage.
