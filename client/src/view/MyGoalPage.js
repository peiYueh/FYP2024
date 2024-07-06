import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, Text, Provider as PaperProvider, Title, Button, IconButton, Snackbar, Portal, Dialog, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { API_BASE_URL } from '../../config'; // Ensure API_BASE_URL is correctly imported

// Importing local images
import propertyImage from '../../assets/background/goals_background/property-1.jpg';
import vehicleImage from '../../assets/background/goals_background/vehicle-2.jpg';
import travelImage from '../../assets/background/goals_background/travel.jpg';
import customImage from '../../assets/background/goals_background/custom-goal-2.jpg';

const HomeScreen = ({ navigation }) => {
    const [userGoals, setUserGoals] = useState([]);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/myGoals`);
            setUserGoals(response.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        }
    };

    const getBackgroundImage = (type) => {
        switch (type) {
            case 0:
                return propertyImage;
            case 1:
                return vehicleImage;
            case 2:
                return travelImage;
            case 3:
                return customImage;
            default:
                return customImage;
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 0:
                return 'home';
            case 1:
                return 'directions-car';
            case 2:
                return 'flight';
            case 3:
                return 'star';
            default:
                return 'assignment';
        }
    };

    const handleCardPress = (goal) => {
        console.log('Goal pressed:', goal);
    };

    const showDeleteConfirmation = (goal) => {
        setGoalToDelete(goal);
        setDeleteConfirmationVisible(true);
    };

    const deleteGoal = async () => {
        if (!goalToDelete) return;

        try {
            await axios.delete(`${API_BASE_URL}/goal/${goalToDelete._id}`);
            // Remove the deleted goal from state
            setUserGoals(userGoals.filter(goal => goal._id !== goalToDelete._id));
            setSnackbarMessage('Goal deleted successfully');
            setSnackbarVisible(true);
        } catch (error) {
            console.error('Error deleting goal:', error);
            setSnackbarMessage('Error deleting goal');
            setSnackbarVisible(true);
        } finally {
            setDeleteConfirmationVisible(false);
            setGoalToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setGoalToDelete(null);
    };

    const GoalCard = ({ goal }) => (
        <Card style={styles.card}>
            <ImageBackground
                source={getBackgroundImage(goal.goal_type)} // Assuming goal_type corresponds to the type index
                style={styles.image}
                imageStyle={{ borderRadius: 8 }}
            >
                <View style={styles.overlay}>
                    <Card.Content style={styles.cardContent}>
                        <Title style={styles.title}>
                            <Icon name={getIcon(goal.goal_type)} size={24} color="#fff" /> 
                            {goal.goal_description}
                        </Title>
                        <Text style={styles.text}>
                            <Icon name="event" size={20} color="#fff" /> Target Age: {goal.target_age}
                        </Text>
                        <Text style={styles.text}>
                            <Icon name="attach-money" size={20} color="#fff" /> Total Amount: {goal.total_amount}
                        </Text>
                        <IconButton
                            icon="delete"
                            color="#fff"
                            size={20}
                            style={styles.deleteButton}
                            onPress={() => showDeleteConfirmation(goal)}
                        />
                    </Card.Content>
                </View>
            </ImageBackground>
        </Card>
    );

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Button
                    mode="contained"
                    icon="plus"
                    onPress={() => navigation.navigate('New Goal')}
                    style={styles.addButton}
                >
                    Add Goal
                </Button>
                <FlatList
                    data={userGoals}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <GoalCard goal={item} />
                    )}
                />
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    action={{
                        label: 'Close',
                        onPress: () => {
                            // Do something when dismissed
                        },
                    }}
                >
                    {snackbarMessage}
                </Snackbar>
                <Portal>
                    <Dialog visible={deleteConfirmationVisible} onDismiss={cancelDelete}>
                        <Dialog.Title>Confirm Delete</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Are you sure you want to delete this goal?</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={cancelDelete}>Cancel</Button>
                            <Button onPress={deleteGoal}>Delete</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    card: {
        marginBottom: 20,
        borderRadius: 8,
    },
    image: {
        height: 150,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 8,
        justifyContent: 'center',
    },
    cardContent: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        color: '#fff',
    },
    addButton: {
        marginBottom: 20,
    },
    deleteButton: {
        position: 'absolute',
        bottom: -25,
        right: 0,
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
});

export default HomeScreen;
