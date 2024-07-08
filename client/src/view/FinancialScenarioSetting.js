import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, TextInput, Button, Appbar, IconButton, List } from 'react-native-paper';

const FinancialScenarioSetting = ({ navigation }) => {
    const [activeIncome, setActiveIncome] = useState('');
    const [passiveIncome, setPassiveIncome] = useState('');
    // const [needsSpending, setNeedsSpending] = useState('');
    const [totalSpending, setTotalSpending] = useState('');
    const [financialGoals, setFinancialGoals] = useState('');
    const [savings, setSavings] = useState([]);
    const [goalsData, setGoalsData] = useState([
        { "_id": "66884730ce22da648f486a0f", "goal_description": "Goal 1", "goal_type": 3, "target_age": "50", "total_amount": "888", "user_id": "665094c0c1a89d9d19d13606" },
        { "_id": "66884733ce22da648f486a11", "goal_description": "Goal 2", "goal_type": 3, "target_age": "50", "total_amount": "888", "user_id": "665094c0c1a89d9d19d13606" },
        { "_id": "66884742ce22da648f486a19", "goal_description": "Goal 3", "goal_type": 3, "target_age": "50", "total_amount": "888", "user_id": "665094c0c1a89d9d19d13606" },
        { "_id": "66884734ce22da648f486a17", "goal_description": "Goal 4", "goal_type": 3, "target_age": "50", "total_amount": "888", "user_id": "665094c0c1a89d9d19d13606" },
    ]);

    // useEffect for fetching data would typically be here

    const addSaving = () => {
        setSavings([...savings, { name: '', initial: '', monthly: '', interestRate: '' }]);
    };

    const handleSavingChange = (index, field, value) => {
        const newSavings = [...savings];
        newSavings[index][field] = value;
        setSavings(newSavings);
    };

    const deleteSaving = (index) => {
        const newSavings = [...savings];
        newSavings.splice(index, 1);
        setSavings(newSavings);
    };

    // Function to add a new goal
    const addGoal = () => {
        setGoalsData([...goalsData, { goal_description: '', total_amount: '', target_age: '' }]);
    };

    // Function to handle changes in goal fields
    const handleGoalChange = (index, field, value) => {
        const newGoals = [...goalsData];
        newGoals[index][field] = value;
        setGoalsData(newGoals);
    };

    // Function to delete a goal
    const deleteGoal = (index) => {
        const newGoals = [...goalsData];
        newGoals.splice(index, 1);
        setGoalsData(newGoals);
    };

    const handleSubmit = () => {
        // Perform data validation
        if (!activeIncome || !passiveIncome || !totalSpending) {
            alert('Please fill in all income and expense fields.');
            return;
        }
    
        const savingsValid = savings.every(saving => saving.name && saving.initial && saving.monthly && saving.interestRate);
        if (!savingsValid) {
            alert('Please fill in all savings fields or remove unwanted savings.');
            return;
        }
    
        const goalsValid = goalsData.every(goal => goal.goal_description && goal.total_amount && goal.target_age);
        if (!goalsValid) {
            alert('Please fill in all goals fields or remove unwanted goals.');
            return;
        }
    
        // Handle scenario submission logic here
        console.log({
            activeIncome,
            passiveIncome,
            totalSpending,
            financialGoals: financialGoals, // Assuming you'll set this state somewhere
            savings,
            goalsData,
        });
    
        // Navigate back or to another screen after submission
        navigation.navigate('Financial Scenario', {
            activeIncome,
            passiveIncome,
            totalSpending,
            savings,
            goalsData,
        });
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Financial Scenario Settings" />
            </Appbar.Header>
            <ScrollView style={styles.content}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Income & Expenses</Title>
                        <View style={styles.row}>
                            <TextInput
                                label="Active (RM)"
                                value={activeIncome}
                                onChangeText={setActiveIncome}
                                keyboardType="numeric"
                                style={styles.input}
                            />
                            <TextInput
                                label="Passive (RM)"
                                value={passiveIncome}
                                onChangeText={setPassiveIncome}
                                keyboardType="numeric"
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                label="Expenses(RM)"
                                value={totalSpending}
                                onChangeText={setTotalSpending}
                                keyboardType="numeric"
                                style={styles.input}
                            />
                        </View>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Savings</Title>
                        {savings.map((saving, index) => (
                            <Card key={index} style={styles.savingCard}>
                                <Card.Content>
                                    <View style={styles.titleRow}>
                                        <Title>{`Saving ${index + 1}`}</Title>
                                        <IconButton
                                            icon="delete"
                                            size={20}
                                            onPress={() => deleteSaving(index)}
                                            style={styles.deleteButton}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            label="Saving Name"
                                            value={saving.name}
                                            onChangeText={(text) => handleSavingChange(index, 'name', text)}
                                            style={styles.input}
                                        />
                                        <TextInput
                                            label="Initial (RM)"
                                            value={saving.initial}
                                            onChangeText={(text) => handleSavingChange(index, 'initial', text)}
                                            keyboardType="numeric"
                                            style={styles.input}
                                        />
                                    </View>
                                    <View style={styles.row}>
                                        <TextInput
                                            label="Monthly (RM)"
                                            value={saving.monthly}
                                            onChangeText={(text) => handleSavingChange(index, 'monthly', text)}
                                            keyboardType="numeric"
                                            style={styles.input}
                                        />
                                        <TextInput
                                            label="Interest (%)"
                                            value={saving.interestRate}
                                            onChangeText={(text) => handleSavingChange(index, 'interestRate', text)}
                                            keyboardType="numeric"
                                            style={styles.input}
                                        />
                                    </View>
                                </Card.Content>
                            </Card>
                        ))}
                        <Button mode="outlined" onPress={addSaving} style={styles.addButton}>
                            Add Saving
                        </Button>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Goals</Title>
                        {goalsData.map((goal, index) => (
                            <Card key={index} style={styles.savingCard}>
                                <Card.Content>
                                    <View style={styles.titleRow}>
                                        <Title>{`Goal ${index + 1}`}</Title>
                                        <IconButton
                                            icon="delete"
                                            size={20}
                                            onPress={() => deleteGoal(index)}
                                            style={styles.deleteButton}
                                        />
                                    </View>
                                    <View key={index} style={styles.goalRow}>
                                        <TextInput
                                            label="Goal Description"
                                            value={goal.goal_description}
                                            onChangeText={(text) => handleGoalChange(index, 'goal_description', text)}
                                            style={[styles.input, { flex: 2 }]}
                                        />
                                        <View style={styles.row}>
                                            <TextInput
                                                label="Amount (RM)"
                                                value={goal.total_amount}
                                                onChangeText={(text) => handleGoalChange(index, 'total_amount', text)}
                                                keyboardType="numeric"
                                                style={[styles.input, { flex: 1, marginLeft: 4 }]}
                                            />
                                            <TextInput
                                                label="Target Age"
                                                value={goal.target_age}
                                                onChangeText={(text) => handleGoalChange(index, 'target_age', text)}
                                                keyboardType="numeric"
                                                style={[styles.input, { flex: 1, marginLeft: 4 }]}
                                            />
                                        </View>

                                    </View>
                                </Card.Content>
                            </Card>
                        ))}
                        <Button mode="outlined" onPress={addGoal} style={styles.addButton}>
                            Add Goal
                        </Button>
                    </Card.Content>
                </Card>


                <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                    Save Scenario
                </Button>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        flex: 1,
        marginHorizontal: 4,
        marginBottom: 12,
    },
    button: {
        marginTop: 16,
    },
    savingRow: {
        marginBottom: 8,
    },
    addButton: {
        marginTop: 8,
    },
    savingCard: {
        marginBottom: 12,
    },
    button: {
        marginTop: 16,
    },
    deleteButton: {
        marginLeft: 8,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
});

export default FinancialScenarioSetting;
