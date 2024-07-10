import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { API_BASE_URL } from '../../config';


const FinancialScenarioPage = ({ route }) => {
    const {
        activeIncome,
        passiveIncome,
        totalSpending,
        savings,
        goalsData,
        useHistoricalDataForIncome,
        useHistoricalDataForExpenses,
        retirementAge,
        lifeExpectancy
    } = route.params;

    // console.log("savings" + savings)
    // savings.forEach((data, index) => {
    //     console.log(`Row ${index + 1}:`);
    //     console.log(data);
    // });
    const [predictedYearlySalary, setPredictedYearlySalary] = useState([]);
    const [predictedYearlyExpenses, setPredictedYearlyExpenses] = useState([]);
    const [futureSavingData, setFutureSavingData] = useState([]);
    const [stackData, setStackData] = useState([]);
    const [goals, setGoals] = useState(goalsData);
    //ML 1: Expense Prediction
    useEffect(() => {
        const expensePrediction = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/predictExpense`, {
                    params: {
                        useHistoricalDataForExpenses,
                        totalSpending,
                        lifeExpectancy
                    }
                });
                // console.log(response.data);  // Log response data to console
                setPredictedYearlyExpenses(response.data.predictions);
            } catch (error) {
                console.error('Error fetching expense prediction:', error);
            }
        };

        const salaryPrediction = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/predictSalary`, {
                    params: {
                        activeIncome,
                        retirementAge
                    }
                });
                // console.log(response.data.future_salaries);  // Log response data to console
                setPredictedYearlySalary(response.data.future_salaries);
            } catch (error) {
                console.error('Error fetching salary prediction:', error);
            }
        };

        expensePrediction();
        salaryPrediction();
    }, [route.params]);
    // Financial Projection

    // const tempStackData = [
    //     {"label": "69", "stacks": [{"color": "#f4e285", "value": 3500}, {"color": "#8cb369", "value": 0}, {"color": "#f4a259", "value": 15600}, {"color": "#bc4b51", "value": 0}]},
    //     {label: "73", "stacks": [{"color": "#f4e285", "value": 3500}, {"color": "#8cb369", "value": 0}, {"color": "#f4a259", "value": 15600}, {"color": "#bc4b51", "value": 0}]},
    //     {label: "74", stacks: [{"color": "#f4e285", "value": 3500}, {"color": "#8cb369", "value": 0}, {"color": "#f4a259", "value": 15600}, {"color": "#bc4b51", "value": 0}], topLabelComponent: () => (
    //         <Icon name="home" size={20} color="black" style={styles.icon} />
    //     )},
    //     { stacks: [{ value: 10, color: '#bc4b51' }, { value: 20, color: '#f4a259' }, { value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },

    // ];

    // tempStackData.forEach((data, index) => {
    //     console.log(`Row ${index + 1}:`);
    //     console.log(data);
    // });
    // Calculate yearly savings with accumulation
    const calculateYearlySavings = (savings) => {
        const yearlySavings = {};

        // Initialize accumulated amounts for each saving
        const accumulatedAmounts = savings.map(saving => parseFloat(saving.initial));

        for (let year = 1; year <= Math.max(...savings.map(s => parseInt(s.contributionYear, 10))); year++) {
            savings.forEach((saving, index) => {
                const monthlyContribution = parseFloat(saving.monthly);
                const yearlyInterestRate = parseFloat(saving.interestRate) / 100;
                const contributionYear = parseInt(saving.contributionYear, 10);

                if (year <= contributionYear) {
                    // Add contributions and interest for this year
                    for (let month = 1; month <= 12; month++) {
                        accumulatedAmounts[index] += monthlyContribution;
                        accumulatedAmounts[index] *= (1 + yearlyInterestRate / 12);
                    }
                } else {
                    // Only add interest for this year
                    for (let month = 1; month <= 12; month++) {
                        accumulatedAmounts[index] *= (1 + yearlyInterestRate / 12);
                    }
                }

                if (!yearlySavings[year]) {
                    yearlySavings[year] = 0;
                }
                yearlySavings[year] += accumulatedAmounts[index];
            });
        }

        const sortedYears = Object.keys(yearlySavings).sort((a, b) => a - b);
        const result = sortedYears.map(year => ({ year: parseInt(year, 10), savings: yearlySavings[year] }));

        console.log("Yearly savings: ", result);
        return result;
    };
    const constructStackData = (predictedSalary, predictedExpense, yearlySavings, passiveIncome, currentAge) => {
        // Combine the data into a single array of objects
        const maxLength = Math.max(predictedSalary.length, predictedExpense.length, yearlySavings.length);

        // Get the last available savings value for cases where yearlySavings is out of range
        const lastSavings = yearlySavings[yearlySavings.length - 1].savings;

        // Create an array to store the remaining savings for each year
        let remainingSavings = yearlySavings.map(item => item.savings);
        console.log(maxLength)
        // Combine the data into a single array of objects
        const combinedData = Array.from({ length: maxLength }, (_, index) => {
            return {
                index: index,
                active_income: predictedSalary[index] || 0,
                passive_income: passiveIncome,
                savings: remainingSavings[index] !== undefined ? remainingSavings[index] : lastSavings,
                expenses: predictedExpense[index] || 0
            };
        });

        console.log(combinedData)

        const tempStackData = combinedData.map((yearData, index) => {
            let remainingExpense = yearData.expenses;

            // Subtract passive income
            let passiveIncomeUsed = Math.min(remainingExpense, yearData.passive_income);
            remainingExpense -= passiveIncomeUsed;

            // Subtract active income
            let activeIncomeUsed = Math.min(remainingExpense, yearData.active_income);
            remainingExpense -= activeIncomeUsed;

            // Subtract savings and update remaining savings for future years
            let savingsUsed = Math.min(remainingExpense, yearData.savings);
            remainingExpense -= savingsUsed;
            if (index < remainingSavings.length) {
                remainingSavings[index] -= savingsUsed;
                if (remainingSavings[index] < 0) remainingSavings[index] = 0;
            }

            // Deduct savings used from subsequent years
            for (let i = index + 1; i < remainingSavings.length && savingsUsed > 0; i++) {
                let savingsToDeduct = Math.min(savingsUsed, remainingSavings[i]);
                remainingSavings[i] -= savingsToDeduct;
                savingsUsed -= savingsToDeduct;
            }

            let downfall = remainingExpense > 0 ? remainingExpense : 0;

            return {
                label: `${currentAge + index}`,
                stacks: [
                    { color: "#f4e285", value: passiveIncomeUsed },
                    { color: "#8cb369", value: activeIncomeUsed },
                    { color: "#f4a259", value: savingsUsed },
                    // { color: "#bc4b51", value: downfall }
                ]
            };
        });

        // console.log(tempStackData);
        // tempStackData.forEach((data, index) => {
        //     console.log(`Row ${index + 1}:`);
        //     console.log(data);
        // });
        // setStackData(tempStackData)
        return tempStackData
    };



    const savingData = [
        { initial: '3600', interestRate: '5', monthly: '300', name: 'Interest income', contributionYear: 10 },
        // { initial: '1800', interestRate: '0', monthly: '150', name: 'Interest income', contributionYear: 10 },
        { initial: '2400', interestRate: '4', monthly: '200', name: 'Interest income', contributionYear: 15 }
    ];


    useEffect(() => {
        if (predictedYearlySalary.length > 0 && predictedYearlyExpenses.length > 0) {
            const maxLength = Math.max(predictedYearlySalary.length, predictedYearlyExpenses.length);
            const years = 10; // Number of years to project
            const yearlySavings = calculateYearlySavings(savingData, years);
            const stackData = constructStackData(predictedYearlySalary, predictedYearlyExpenses, yearlySavings, parseInt(passiveIncome), 23);
            setStackData(stackData);
        }
    }, [predictedYearlySalary, predictedYearlyExpenses]);

    // Function to toggle completion status of a goal
    const toggleGoalCompletion = (goalId) => {
        // console.log(goalId)
        const updatedGoals = goals.map(goal =>
            goal.id === goalId ? { ...goal, apply: !goal.apply } : goal
        );
        setGoals(updatedGoals);
    };

    return (
        <View style={styles.container}>
            <View style={[styles.rotatedContainer, { width: height, height: width }]}>
                <View style={styles.chartContainer}>
                    <Text style={styles.title}>My Financial Scenario</Text>
                    <BarChart
                        width={height / 100 * 55}
                        noOfSections={5}
                        stackData={stackData}
                        barWidth={18}
                        spacing={3}
                        labelStyle={{ fontSize: 10 }}
                    />
                </View>
                <View>
                    <View style={[styles.goalContainer, styles.sideContainer]}>
                        <Text style={styles.sideTitle}>My Goals</Text>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, width: '100%' }}>
                            {goals.map(goal => (
                                <TouchableOpacity
                                    key={goal._id}  // Ensure each goal has a unique key
                                    onPress={() => toggleGoalCompletion(goal._id)}
                                    style={styles.goalItem}
                                >
                                    <Icon name={goal.apply ? 'check-square' : 'square-o'} size={25} color="black" />
                                    <Text style={[styles.goalText, { textDecorationLine: goal.apply ? 'line-through' : 'none' }]}>
                                        {goal.goal_description}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={[styles.infoContainer, styles.sideContainer]}>
                        <Text style={styles.sideTitle}>Financial Information</Text>
                        <Text style={styles.infoText}>Active Income: RM1000</Text>
                        <Text style={styles.infoText}>Passive Income: RM1000</Text>
                        <Text style={styles.infoText}>Needs Spending: RM1000</Text>
                        <Text style={styles.infoText}>Wants Spending: RM1000</Text>
                        <Text style={styles.infoText}>Savings: RM1000</Text>
                    </View>
                </View>

            </View>
        </View>
    );
};
const { width, height } = Dimensions.get('window'); // Get dimensions of the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Background color for the entire screen
    },
    rotatedContainer: {
        transform: [{ rotate: '90deg' }],
        paddingHorizontal: '10%',
        paddingVertical: '10%',
        flexDirection: 'row',
        width: height,  // Ensure dimensions are correctly swapped
        height: width,
    },
    chartContainer: {
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },
    goalContainer: {
        justifyContent: 'center', // Center content vertically
        // alignItems: 'flex-start', // Center content horizontally
        marginLeft: height / 100 * 5, // Add space between chart and goal container
        // backgroundColor: 'red',
        // width: height / 100 * 30,
    },
    infoContainer: {
        justifyContent: 'center', // Center content vertically
        alignItems: 'flex-start', // Center content horizontally
        // backgroundColor: 'red',
        // width: height / 100 * 30,
    },
    sideContainer: {
        margin: 5,
        padding: 10,
        borderRadius: 3,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 5 },
        height: '50%',
        marginLeft: height / 100 * 10,
        width: height / 100 * 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sideTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    goalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        marginBottom: 5,
        // flex: 1
    },
    goalText: {
        fontSize: 16,
        marginLeft: 10,
    },
});

export default FinancialScenarioPage;
