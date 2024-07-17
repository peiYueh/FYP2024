import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useTheme, Card, Text, Provider as PaperProvider, Title, Button, IconButton, Snackbar, Portal, Dialog, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { API_BASE_URL } from '../../config'; // Ensure API_BASE_URL is correctly imported
import LoadingIndicator from '../components/loading-component';
import { showMessage } from "react-native-flash-message";
import LottieView from 'lottie-react-native';

// Importing local images
import propertyImage from '../../assets/background/goals_background/property-1.jpg';
import vehicleImage from '../../assets/background/goals_background/vehicle-2.jpg';
import travelImage from '../../assets/background/goals_background/travel.jpg';
import customImage from '../../assets/background/goals_background/custom-goal-2.jpg';

const MyGoals = ({ navigation }) => {
    const theme = useTheme();
    const [userGoals, setUserGoals] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Fetch transactions when the page gains focus
            fetchGoals();
        });
        return unsubscribe;
    }, [navigation]);

    const fetchGoals = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/myGoals`);
            setUserGoals(response.data);
            setLoading(false)
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
        navigation.navigate('View Goal', { goalId: goal._id });
    };

    const renderLoadingIndicator = () => (
        <View style={styles.loadingContainer}>
            <LottieView
                source={{ uri: 'https://lottie.host/6a21c22c-36b8-4fa1-bc75-b73732cafc3a/YpSTs5jeHP.json' }}
                autoPlay
                loop
                style={styles.lottieAnimation}
            />
        </View>
    );

    const showDeleteConfirmation = (goal) => {
        setGoalToDelete(goal);
        setDeleteConfirmationVisible(true);
    };

    const deleteGoal = async () => {
        if (!goalToDelete) return;
        setDeleteConfirmationVisible(false);
        setDeleting(true)
        try {
            await axios.delete(`${API_BASE_URL}/goal/${goalToDelete._id}`);
            // Remove the deleted goal from state
            setUserGoals(userGoals.filter(goal => goal._id !== goalToDelete._id));
            showMessage({
                message: "Goal Deleted!",
                description: "Your goal has been deleted",
                type: "success",
            })
        } catch (error) {
            console.error('Error deleting goal:', error);
            showMessage({
                message: "Error Deleting Goal!",
                description: "Your goal has not been deleted",
                type: "success",
            })
        } finally {
            setDeleting(false)
            setGoalToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmationVisible(false);
        setGoalToDelete(null);
    };

    const GoalCard = ({ goal }) => (
        <TouchableOpacity onPress={() => handleCardPress(goal)}>
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
        </TouchableOpacity>
    );

    return (

        <PaperProvider>
            {loading ? (
                renderLoadingIndicator() // Render loading indicator if data is still fetching
            ) : (
                <>
                    {userGoals.length === 0 ? (
                        <View style={[styles.noDataContainer]}>
                            <Image source={require('../../assets/background/no-goal.png')} style={styles.noDataImage} />
                            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('New Goal')}>
                                <Text style={styles.addButtonText}>Add Goal</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
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
                                {(deleting &&
                                    <LoadingIndicator theme={theme} />
                                )}
                            </View>
                        </>)}
                </>
            )}
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
    lottieAnimation: {
        width: 200,
        height: 200,
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
    addButton: {
        backgroundColor: '#87B6C4',
        paddingHorizontal: 30,
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16
    },
});

export default MyGoals;
