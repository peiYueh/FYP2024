import React, { useState, useEffect, useCallback  } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Modal, Button } from 'react-native';
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
        lifeExpectancy,
        initialSavings
    } = route.params;

    const [predictedYearlySalary, setPredictedYearlySalary] = useState([]);
    const [originalYearlyExpenses, setOriginalYearlyExpenses] = useState([]);
    const [predictedYearlyExpenses, setPredictedYearlyExpenses] = useState([]);
    const [stackData, setStackData] = useState([]);
    const [goals, setGoals] = useState(goalsData);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedYearData, setSelectedYearData] = useState(null);
    const [userAge, setUserAge] = useState(0);

    const fetchUserAge = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/userAge`);
            setUserAge(response.data + 1);
        } catch (error) {
            console.error('Error fetching age:', error);
        }
    }, []);

    const fetchExpensePrediction = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/predictExpense`, {
                params: {
                    useHistoricalDataForExpenses,
                    totalSpending,
                    lifeExpectancy
                }
            });
            setOriginalYearlyExpenses(response.data.predictions);
            setPredictedYearlyExpenses(response.data.predictions);
        } catch (error) {
            console.error('Error fetching expense prediction:', error);
        }
    }, [useHistoricalDataForExpenses, totalSpending, lifeExpectancy]);

    const fetchSalaryPrediction = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/predictSalary`, {
                params: {
                    activeIncome,
                    retirementAge
                }
            });
            setPredictedYearlySalary(response.data.future_salaries);
        } catch (error) {
            console.error('Error fetching salary prediction:', error);
        }
    }, [activeIncome, retirementAge]);

    useEffect(() => {
        fetchUserAge();
        fetchExpensePrediction();
        fetchSalaryPrediction();
    }, [fetchUserAge, fetchExpensePrediction, fetchSalaryPrediction]);

    const constructStackData = (predictedSalary, predictedExpense, passiveIncome, currentAge) => {
        const maxLength = Math.max(predictedSalary.length, predictedExpense.length);
        const combinedData = Array.from({ length: maxLength }, (_, index) => ({
            index: index,
            active_income: predictedSalary[index] || 0,
            passive_income: passiveIncome,
            expenses: predictedExpense[index] || 0,
        }));

        let remainingSavings = parseInt(initialSavings);
        const tempStackData = combinedData.map((yearData, index) => {
            let remainingExpense = yearData.expenses;

            // Subtract passive income
            let passiveIncomeUsed = Math.min(remainingExpense, yearData.passive_income);
            remainingExpense -= passiveIncomeUsed;

            // Subtract active income
            let activeIncomeUsed = Math.min(remainingExpense, yearData.active_income);
            remainingExpense -= activeIncomeUsed;

            // Use savings to cover remaining expenses
            let savingUsed = Math.min(remainingExpense, remainingSavings);
            remainingExpense -= savingUsed;

            // Calculate unused income and update savings
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
                ],
                yearData: yearData, // Add year data for modal
                topLabelComponent: () => getIconsForAge(currentAge + index) // Add top label component
            };
        });

        return tempStackData;
    };

    const getIconsForAge = useCallback((age) => {
        const goalIcons = {
            0: 'home',
            1: 'car',
            2: 'plane',
            3: 'star'
        };

        const ageGoals = goals.filter(goal => parseInt(goal.target_age) === age && goal.apply);
        if (ageGoals.length === 0) return null;

        return (
            <View style={styles.iconContainer}>
                {ageGoals.map((goal, index) => (
                    <Icon
                        key={`${goal._id}-${index}`}
                        name={goalIcons[goal.goal_type]}
                        size={15}
                        color="gold"
                        style={[styles.icon, { top: -index * 20 }]} // Adjusted position
                    />
                ))}
            </View>
        );
    }, [goals]);

    useEffect(() => {
        if (predictedYearlySalary.length > 0 && predictedYearlyExpenses.length > 0) {
            const stackData = constructStackData(predictedYearlySalary, predictedYearlyExpenses, parseInt(passiveIncome) * 12, userAge);
            setStackData(stackData);
        }
    }, [predictedYearlySalary, predictedYearlyExpenses, goals]);

    const toggleGoalCompletion = (goalId) => {
        const updatedGoals = goals.map(goal =>
            goal._id === goalId ? { ...goal, apply: !goal.apply } : goal
        );
        setGoals(updatedGoals);

        const appliedGoals = updatedGoals.filter(goal => goal.apply);
        const updatedExpenses = calculateUpdatedExpenses(originalYearlyExpenses, appliedGoals);
        setPredictedYearlyExpenses(updatedExpenses);
    };

    const calculateUpdatedExpenses = (originalExpenses, appliedGoals) => {
        let updatedExpenses = [...originalExpenses];
        const BASE_AGE = userAge;

        appliedGoals.forEach(goal => {
            const targetAge = parseInt(goal.target_age);
            const targetIndex = targetAge - BASE_AGE;

            if (targetIndex < 0) return; // Skip goals starting before the base age (23)

            switch (goal.goal_type) {
                case 0: // Property Purchase
                case 1: // Vehicle Purchase
                    const downPayment = parseFloat(goal.total_amount) * (parseFloat(goal.down_payment_percentage) / 100);
                    const monthlyPayment = parseFloat(goal.monthly_payment);
                    const loanPeriod = parseInt(goal.loan_period);
                    for (let i = 0; i < loanPeriod; i++) {
                        const yearIndex = targetIndex + i;
                        if (yearIndex >= updatedExpenses.length) break; // Ensure we don't go out of bounds

                        if (i === 0) {
                            updatedExpenses[yearIndex] = (updatedExpenses[yearIndex] || 0) + downPayment + (monthlyPayment * 12);
                        } else {
                            updatedExpenses[yearIndex] = (updatedExpenses[yearIndex] || 0) + (monthlyPayment * 12);
                        }
                    }
                    break;
                case 2: // Travel Goals
                case 3: // Custom Goals
                    const expenseAmount = parseFloat(goal.total_amount);
                    if (targetIndex < updatedExpenses.length) {
                        updatedExpenses[targetIndex] = (updatedExpenses[targetIndex] || 0) + expenseAmount;
                    }
                    break;
                default:
                    break;
            }
        });

        return updatedExpenses;
    };

    const handleBarClick = (item) => {
        setSelectedYearData(stackData[item.yearData.index]);
        setModalVisible(true);
    };

    const Legend = () => {
        const legendItems = [
            { color: "#f4e285", label: "Passive Income" },
            { color: "#8cb369", label: "Active Income" },
            { color: "#f4a259", label: "Savings Used" },
            { color: "#bc4b51", label: "Downfall" }
        ];

        return (
            <View style={styles.legendContainer}>
                {legendItems.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text style={styles.legendLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>
        );
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
                        barWidth={19}
                        spacing={3}
                        labelStyle={{ fontSize: 10 }}
                        onPress={(barItem) => handleBarClick(barItem)}
                        yAxisExtraHeight={30}
                        xAxisThickness={0}
                        yAxisThickness={0}
                        xAxisLabelTextStyle={{fontSize: 10}}
                        yAxisTextStyle={{fontSize: 10}}
                        yAxisTextNumberOfLines={2}
                        yAxisLabelWidth={60}
                        yAxisLabelPrefix={"RM"}
                    />
                    <Legend />
                </View>
                <View>
                    <View style={[styles.goalContainer, styles.sideContainer]}>
                        <Text style={styles.sideTitle}>My Goals</Text>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, width: '100%' }}>
                            {goals.map(goal => (
                                <TouchableOpacity
                                    key={goal._id}
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
                        <Text style={styles.infoText}>Active Income: RM {activeIncome}</Text>
                        <Text style={styles.infoText}>Passive Income: RM {passiveIncome}</Text>
                        <Text style={styles.infoText}>Total Spending: RM {totalSpending}</Text>
                    </View>
                </View>
            </View>

            {selectedYearData && (
    <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Year {selectedYearData.label}</Text>
                <Text style={styles.modalText}>Active Income: RM {selectedYearData.stacks[1].value.toFixed()}</Text>
                <Text style={styles.modalText}>Passive Income: RM {selectedYearData.stacks[0].value.toFixed()}</Text>
                <Text style={styles.modalText}>Savings Used: RM {selectedYearData.stacks[2].value.toFixed()}</Text>
                <Text style={styles.modalText}>Downfall: RM {selectedYearData.stacks[3].value.toFixed()}</Text>
                <Text style={styles.modalText}>Expenses: RM {selectedYearData.yearData.expenses.toFixed()}</Text>
                
                {/* Add yearly goals if available */}
                {goals.filter(goal => parseInt(goal.target_age) === parseInt(selectedYearData.label) && goal.apply).length > 0 && (
                    <View style={styles.modalGoalsContainer}>
                        <Text style={styles.modalText}>Yearly Goals:</Text>
                        {goals.filter(goal => parseInt(goal.target_age) === parseInt(selectedYearData.label) && goal.apply).map((goal, index) => (
                            <Text key={index} style={styles.modalGoalText}>
                                - {goal.goal_description}
                            </Text>
                        ))}
                    </View>
                )}
                
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
)}

        </View>
    );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    rotatedContainer: {
        transform: [{ rotate: '90deg' }],
        paddingHorizontal: '10%',
        paddingVertical: '5%',
        flexDirection: 'row',
        width: height,
        height: width,
    },
    chartContainer: {
        // justifyContent: 'center',
        alignItems: 'center',
        height: 750
    },
    goalContainer: {
        justifyContent: 'center',
        // marginLeft: height / 100 * 5,
        flex: 1
    },
    infoContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 5,
    },
    sideContainer: {
        padding: 10,
        borderRadius: 3,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 5 },
        marginLeft: height / 100 * 10,
        // width: height / 100 * 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sideTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    goalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    goalText: {
        fontSize: 16,
        marginLeft: 10,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        transform: [{ rotate: '90deg' }],
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
    },
    modalGoalsContainer: {
        marginTop: 20,
        width: '100%',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    modalGoalText: {
        fontSize: 14,
        marginBottom: 5,
        color: '#777',
    },
    modalButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
    },
    modalButtonText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    iconContainer: {
        position: 'absolute',
        bottom: '100%', // Position the icons above the chart
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        zIndex: 10,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    legendColor: {
        width: 15,
        height: 15,
        marginRight: 5,
    },
    legendLabel: {
        fontSize: 12,
    },
    modalGoalsContainer: {
        marginTop: 10,
    },
    modalGoalText: {
        fontSize: 14,
        marginBottom: 5,
    },
});

export default FinancialScenarioPage;
