import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import Icon from 'react-native-vector-icons/FontAwesome';
const FinancialScenarioPage = ({ route }) => {
    const {
        activeIncome,
        passiveIncome,
        needsSpending,
        wantsSpending,
        savings,
        goalsData,
    } = route.params;

    console.log(route.params)
    
    const stackData = [
        { stacks: [{ value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' }, //label is user's age
        {
            stacks: [{ value: 10, color: '#f4a259' }, { value: 11, color: '#f4e285' }, { value: 15, color: '#8cb369' }], label: '25', topLabelComponent: () => (
                <Icon name="home" size={20} color="black" style={styles.icon} />
            )
        },
        { stacks: [{ value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },
        { stacks: [{ value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },
        { stacks: [{ value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },
        { stacks: [{ value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },
        { stacks: [{ value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },
        { stacks: [{ value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },
        { stacks: [{ value: 20, color: '#f4a259' }, { value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },
        { stacks: [{ value: 10, color: '#bc4b51' }, { value: 20, color: '#f4a259' }, { value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },
        { stacks: [{ value: 10, color: '#bc4b51' }, { value: 20, color: '#f4a259' }, { value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },
        { stacks: [{ value: 10, color: '#bc4b51' }, { value: 20, color: '#f4a259' }, { value: 20, color: '#f4e285' }, { value: 20, color: '#8cb369' }], label: '24' },
        
    ];

    const initialGoals = [
        { id: 1, title: 'Save $10,000 for vacation', completed: false },
        { id: 2, title: 'Buy a new car', completed: true },
        { id: 3, title: 'Invest in stocks', completed: false },
        // Add more goals as needed
    ];

    const [goals, setGoals] = useState(initialGoals);

    // Function to toggle completion status of a goal
    const toggleGoalCompletion = (goalId) => {
        const updatedGoals = goals.map(goal =>
            goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
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
                        {goals.map(goal => (
                            <TouchableOpacity
                                key={goal.id}
                                onPress={() => toggleGoalCompletion(goal.id)}
                                style={styles.goalItem}
                            >
                                <Icon name={goal.completed ? 'check-square' : 'square-o'} size={20} color="black" />
                                <Text style={[styles.goalText, { textDecorationLine: goal.completed ? 'line-through' : 'none' }]}>
                                    {goal.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
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
        alignItems: 'flex-start', // Center content horizontally
        marginLeft: height / 100 * 5, // Add space between chart and goal container
        // backgroundColor: 'red',
        width: height / 100 * 30,
    },
    infoContainer: {
        justifyContent: 'center', // Center content vertically
        alignItems: 'flex-start', // Center content horizontally
        // backgroundColor: 'red',
        width: height / 100 * 30,
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
        justifyContent: 'center',
        marginBottom: 5,
    },
    goalText: {
        fontSize: 16,
        marginLeft: 10,
    },
});

export default FinancialScenarioPage;
