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

    console.log(route.params)
    //ML 1: Expense Prediction
    useEffect(() => {
        const expensePrediction = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/predictExpense`, {
                    params: {
                        useHistoricalDataForExpenses,  // Assuming these are variables in your scope
                        totalSpending,
                        lifeExpectancy
                    }
                });
                console.log(response.data);  // Log response data to console
                // setGoalsData(response.data);  // Uncomment to set response data to state or variable
            } catch (error) {
                console.error('Error fetching expense prediction:', error);
            }
            // setDataLoaded(true);  // Assuming setDataLoaded is a function to set state indicating data is loaded
        };

        const salaryPrediction = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/predictSalary`, {
                    params: {
                        activeIncome,
                        retirementAge
                    }
                });
                console.log("Salary" + response.data);  // Log response data to console
                // setGoalsData(response.data);  // Uncomment to set response data to state or variable
            } catch (error) {
                console.error('Error fetching expense prediction:', error);
            }
        }
        expensePrediction();
        salaryPrediction();
    }, [route.params]);
    //ML 2: Salary Prediction

    // Financial Projection

    const stackData = [
        { stacks: [{ value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' }, //label is user's age
        {
            stacks: [{ value: 10, color: '#f4a259' }, { value: 11, color: '#f4e285' }, { value: 15, color: '#8cb369' }], label: '25', topLabelComponent: () => (
                <Icon name="home" size={20} color="black" style={styles.icon} />
            )
        },
        { stacks: [{ value: 10, color: '#bc4b51' }, { value: 20, color: '#f4a259' }, { value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },

    ];

    const [goals, setGoals] = useState(goalsData);

    // Function to toggle completion status of a goal
    const toggleGoalCompletion = (goalId) => {
        console.log(goalId)
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
        transform: [{ rotate: '90deg' }], // Rotate container and its contents by 90 degrees
        paddingHorizontal: '10%',
        paddingVertical: '10%',
        flexDirection: 'row', // Arrange children horizontally
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
