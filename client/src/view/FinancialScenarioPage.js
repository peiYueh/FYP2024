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
        goalsData,
        useHistoricalDataForIncome,
        useHistoricalDataForExpenses,
        retirementAge,
        lifeExpectancy
    } = route.params;

    const [predictedYearlySalary, setPredictedYearlySalary] = useState([]);
    const [predictedYearlyExpenses, setPredictedYearlyExpenses] = useState([]);
    const [stackData, setStackData] = useState([]);
    const [goals, setGoals] = useState(goalsData);
    console.log(goals)
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
                // console.log("Expense Prediction: " + response.data);  // Log response data to console
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
                // console.log("Salary Prediction: " + response.data.future_salaries);  // Log response data to console
                setPredictedYearlySalary(response.data.future_salaries);
            } catch (error) {
                console.error('Error fetching salary prediction:', error);
            }
        };

        expensePrediction();
        salaryPrediction();
    }, [route.params]);
    // Financial Projection

    const constructStackData = (predictedSalary, predictedExpense, passiveIncome, currentAge) => {
        // Combine the data into a single array of objects
        const maxLength = Math.max(predictedSalary.length, predictedExpense.length);
        // Combine the data into a single array of objects
        const combinedData = Array.from({ length: maxLength }, (_, index) => {
            return {
                index: index,
                active_income: predictedSalary[index] || 0,
                passive_income: passiveIncome,
                expenses: predictedExpense[index] || 0,
            };
        });
        let remainingSavings = 0;
        const tempStackData = combinedData.map((yearData, index) => {
            let remainingExpense = yearData.expenses;
            
            // Subtract passive income
            let passiveIncomeUsed = Math.min(remainingExpense, yearData.passive_income);
            remainingExpense -= passiveIncomeUsed;
            
            // Subtract active income
            let activeIncomeUsed = Math.min(remainingExpense, yearData.active_income);
            remainingExpense -= activeIncomeUsed;
    
            let savingUsed = Math.min(remainingExpense, remainingSavings);
            remainingExpense -= savingUsed;
    
            // Calculate unused income and add it to savings for the next year
            let unusedIncome = (yearData.passive_income + yearData.active_income) - yearData.expenses;
            if (unusedIncome > 0) {
                remainingSavings += unusedIncome;
            }
    
            let downfall = remainingExpense > 0 ? remainingExpense : 0;
    
            return {
                label: `${currentAge + index}`,
                stacks: [
                    { color: "#f4e285", value: passiveIncomeUsed },
                    { color: "#8cb369", value: activeIncomeUsed },
                    { color: "#f4a259", value: savingUsed },
                    { color: "#bc4b51", value: downfall }
                ]
            };
        });
    
        return tempStackData;
    };
    
    useEffect(() => {
        if (predictedYearlySalary.length > 0 && predictedYearlyExpenses.length > 0) {
            const stackData = constructStackData(predictedYearlySalary, predictedYearlyExpenses, parseInt(passiveIncome) * 12, 23);
            setStackData(stackData);
        }
    }, [predictedYearlySalary, predictedYearlyExpenses, goals]);

    // Function to toggle completion status of a goal
    const toggleGoalCompletion = (goalId) => {
        const updatedGoals = goals.map(goal =>
            goal._id === goalId ? { ...goal, apply: !goal.apply } : goal
        );
        setGoals(updatedGoals);
    
        // Recalculate the predicted expenses with the updated goals
        const appliedGoals = updatedGoals.filter(goal => goal.apply);
        const updatedExpenses = calculateUpdatedExpenses(predictedYearlyExpenses, appliedGoals);
        setPredictedYearlyExpenses(updatedExpenses);
    };

    const calculateUpdatedExpenses = (originalExpenses, appliedGoals) => {
        // Make a deep copy of the original expenses to avoid direct mutation
        let updatedExpenses = [...originalExpenses];
    
        // Loop through each applied goal and update the expenses for the target age
        appliedGoals.forEach(goal => {
            const targetAge = parseInt(goal.target_age);
            const expenseAmount = parseFloat(goal.total_amount);
            console.log(expenseAmount)
    
            // Find the index corresponding to the target age
            const targetIndex = targetAge - 23; // Assuming the current age is 23
    
            // Add the expense to the target year
            if (updatedExpenses[targetIndex] !== undefined) {
                updatedExpenses[targetIndex] += (expenseAmount + 100000);
                console.log("updated expenses"+updatedExpenses[targetIndex])
            } else {
                updatedExpenses[targetIndex] = expenseAmount;
            }
        });
    
        return updatedExpenses;
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
