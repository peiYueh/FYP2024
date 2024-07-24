import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, TextInput, Button, Appbar, IconButton, Checkbox } from 'react-native-paper';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import LottieView from 'lottie-react-native';

const FinancialScenarioSetting = ({ navigation }) => {
    const [lifeExpectancy, setLifeExpectancy] = useState('');
    const [retirementAge, setRetirementAge] = useState('');
    const [activeIncome, setActiveIncome] = useState('');
    const [passiveIncome, setPassiveIncome] = useState('');
    const [totalSpending, setTotalSpending] = useState('');
    const [initialActiveIncome, setInitialActiveIncome] = useState('');
    const [initialPassiveIncome, setInitialPassiveIncome] = useState('');
    const [initialTotalSpending, setInitialTotalSpending] = useState('');
    const [goalsData, setGoalsData] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [initialSavings, setInitialSavings] = useState('');

    const [useHistoricalDataForIncome, setUseHistoricalDataForIncome] = useState(false);
    const [useHistoricalDataForExpenses, setUseHistoricalDataForExpenses] = useState(false);

    useEffect(() => {
        const fetchBasicInformation = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/basicInformation`);
                setLifeExpectancy(response.data.lifeExpectancy.toString())
                setRetirementAge(response.data.retirementAge.toString())
                setInitialSavings(response.data.savings.toString())
            } catch (error) {
                console.error('Error fetching goals:', error);
            }
            setDataLoaded(true);
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/categorizeTransaction`);
                const fetchedData = response.data;

                const totalNeeds = Math.abs(fetchedData.needs_expense.reduce((acc, item) => acc + item.transaction_amount, 0));
                const totalWants = Math.abs(fetchedData.wants_expense.reduce((acc, item) => acc + item.transaction_amount, 0));
                const totalExpenses = (totalNeeds + totalWants).toFixed(0);
                const activeIncome = Math.abs(fetchedData.active_income.reduce((acc, item) => acc + item.transaction_amount, 0));
                const passiveIncome = Math.abs(fetchedData.passive_income.reduce((acc, item) => acc + item.transaction_amount, 0));

                setInitialActiveIncome(activeIncome.toString());
                setInitialPassiveIncome(passiveIncome.toString());
                setInitialTotalSpending(totalExpenses.toString());
                setDataLoaded(true);

                if (useHistoricalDataForIncome) {
                    setActiveIncome(activeIncome.toString());
                    setPassiveIncome(passiveIncome.toString());
                }
                if (useHistoricalDataForExpenses) {
                    setTotalSpending(totalExpenses.toString());
                }
            } catch (error) {
                console.error('Error fetching categorized transactions:', error);
            }
        };

        const fetchGoals = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/myGoals`);
                setGoalsData(response.data);
            } catch (error) {
                console.error('Error fetching goals:', error);
            }
            setDataLoaded(true);
        };

        if (!dataLoaded) {
            fetchBasicInformation();
            console.log("Information Fetched")
            setDataLoaded(false);
            fetchData();
            console.log("Data Fetched")
            setDataLoaded(false);
            fetchGoals();
            console.log("Goals Fetched")
        }
    }, [useHistoricalDataForIncome, useHistoricalDataForExpenses]);

    const addGoal = () => {
        setGoalsData([...goalsData, { _id: Date.now().toString(), goal_description: '', total_amount: '', target_age: '', apply: false, goal_type: 3 }]);
    };

    const handleGoalChange = (index, field, value) => {
        const newGoals = [...goalsData];
        newGoals[index][field] = value;
        setGoalsData(newGoals);
    };

    const deleteGoal = (index) => {
        const newGoals = [...goalsData];
        newGoals.splice(index, 1);
        setGoalsData(newGoals);
    };

    const handleSubmit = () => {
        if (!activeIncome || !passiveIncome || !totalSpending) {
            alert('Please fill in all income and expense fields.');
            return;
        }

        if (!initialSavings) {
            alert('Please fill in initial savings!');
            return;
        }

        if (!retirementAge || !lifeExpectancy) {
            alert('Please fill in all basic information fields!.');
            return;
        }

        const goalsValid = goalsData.every(goal => goal.goal_description && goal.total_amount && goal.target_age);
        if (!goalsValid) {
            alert('Please fill in all goals fields or remove unwanted goals.');
            return;
        }

        navigation.navigate('Financial Scenario', {
            activeIncome,
            passiveIncome,
            totalSpending,
            goalsData,
            useHistoricalDataForIncome,
            useHistoricalDataForExpenses,
            retirementAge,
            lifeExpectancy,
            initialSavings
        });
    };

    return (
        <>
            {
                dataLoaded ? (
                    <>
                        <View style={styles.container}>
                            <Appbar.Header>
                                <Appbar.BackAction onPress={() => navigation.goBack()} />
                                <Appbar.Content title="Financial Scenario Settings" />
                            </Appbar.Header>
                            <ScrollView style={styles.content}>
                                <Card style={styles.card}>
                                    <Card.Content>
                                        <Title>Basic Information</Title>
                                        <View style={styles.row}>
                                            <TextInput
                                                label="Life Expectancy"
                                                value={lifeExpectancy}
                                                onChangeText={setLifeExpectancy}
                                                keyboardType="numeric"
                                                style={styles.input}
                                            />
                                            <TextInput
                                                label="Retirement Age"
                                                value={retirementAge}
                                                onChangeText={setRetirementAge}
                                                keyboardType="numeric"
                                                style={styles.input}
                                            />
                                        </View>
                                    </Card.Content>
                                </Card>
                                <Card style={styles.card}>
                                    <Card.Content>
                                        <Title>Income & Expenses</Title>
                                        <Checkbox.Item
                                            label="Simulate with Historical Data"
                                            status={useHistoricalDataForIncome ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setUseHistoricalDataForIncome(!useHistoricalDataForIncome);
                                                if (!useHistoricalDataForIncome) {
                                                    setActiveIncome(initialActiveIncome);
                                                    setPassiveIncome(initialPassiveIncome);
                                                } else {
                                                    setActiveIncome('');
                                                    setPassiveIncome('');
                                                }
                                            }}
                                        />
                                        <View style={styles.row}>
                                            <TextInput
                                                label="Active (RM)"
                                                value={activeIncome}
                                                onChangeText={setActiveIncome}
                                                keyboardType="numeric"
                                                style={styles.input}
                                                disabled={useHistoricalDataForIncome}
                                            />
                                            <TextInput
                                                label="Passive (RM)"
                                                value={passiveIncome}
                                                onChangeText={setPassiveIncome}
                                                keyboardType="numeric"
                                                style={styles.input}
                                                disabled={useHistoricalDataForIncome}
                                            />
                                        </View>
                                        <Checkbox.Item
                                            label="Simulate with Historical Data"
                                            status={useHistoricalDataForExpenses ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setUseHistoricalDataForExpenses(!useHistoricalDataForExpenses);
                                                if (!useHistoricalDataForExpenses) {
                                                    setTotalSpending(initialTotalSpending);
                                                } else {
                                                    setTotalSpending('');
                                                }
                                            }}
                                        />
                                        <View style={styles.row}>
                                            <TextInput
                                                label="Expenses (RM)"
                                                value={totalSpending}
                                                onChangeText={setTotalSpending}
                                                keyboardType="numeric"
                                                style={styles.input}
                                                disabled={useHistoricalDataForExpenses}
                                            />
                                        </View>
                                    </Card.Content>
                                </Card>

                                <Card style={styles.card}>
                                    <Card.Content>
                                        <Title>Savings</Title>
                                        <TextInput
                                            label="Initial Savings"
                                            value={initialSavings}
                                            onChangeText={setInitialSavings}
                                            keyboardType="numeric"
                                            style={styles.input}
                                        />

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
                                                                value={goal.total_amount.toString()}
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
                                    Generate Scenario
                                </Button>
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <>
                    <View style={styles.loadingContainer}>
                            <LottieView
                                source={{ uri: 'https://lottie.host/6a21c22c-36b8-4fa1-bc75-b73732cafc3a/YpSTs5jeHP.json' }}
                                autoPlay
                                loop
                                style={styles.lottieAnimation}
                            />
                        </View>
                    </>
                )
            }
        </>


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
        marginTop: 10,
        marginBottom: '10%'
    },
    savingRow: {
        marginBottom: 8,
    },
    addButton: {
        marginTop: 8,
    },
    savingCard: {
        marginBottom: 12,
        backgroundColor:'#F4F9FB'
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
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 700,
    },
    noDataImage: {
        width: 400,
        height: 400,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottieAnimation: {
        width: 200,
        height: 200,
    },
});

export default FinancialScenarioSetting;
