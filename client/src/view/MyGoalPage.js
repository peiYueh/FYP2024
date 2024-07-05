// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, Text, Provider as PaperProvider, Title, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { API_BASE_URL } from '../../config';
import axios from 'axios';

// Importing local images
import propertyImage from '../../assets/background/goals_background/property-1.jpg';
import vehicleImage from '../../assets/background/goals_background/vehicle-2.jpg';
import travelImage from '../../assets/background/goals_background/travel.jpg';
import customImage from '../../assets/background/goals_background/custom-goal-2.jpg';

const HomeScreen = ({ navigation }) => {

    const [userGoals, setUserGoals] = useState(null);

    const fetchGoals = async () => {
        try {
            const response = await axios.get(API_BASE_URL + '/myGoals');
            console.log("HI")
            console.log(response.data)
            setUserGoals(response.data);
            // setDataFetched(true);
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Fetch transactions when the page gains focus
            fetchGoals();
        });

        // Clean up subscription on unmount
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        fetchGoals();
    }, []);

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

    const GoalCard = ({ goal }) => (
        <TouchableOpacity onPress={() => handleCardPress(goal)}>
            <Card style={styles.card}>
                <ImageBackground
                    source={getBackgroundImage(goal.goal_type)}
                    style={styles.image}
                    imageStyle={{ borderRadius: 8 }}
                >
                    <View style={styles.overlay}>
                        <Card.Content style={styles.cardContent}>
                            <Title style={styles.title}>
                                <Icon name={getIcon(goal.type)} size={24} color="#fff" /> 
                                {goal.goal_description}
                            </Title>
                            <Text style={styles.text}>
                                <Icon name="event" size={20} color="#fff" /> Target Age: {goal.target_age}
                            </Text>
                            <Text style={styles.text}>
                                <Icon name="attach-money" size={20} color="#fff" /> Total Amount: {goal.total_mount}
                            </Text>
                        </Card.Content>
                    </View>
                </ImageBackground>
            </Card>
        </TouchableOpacity>
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
});

export default HomeScreen;
