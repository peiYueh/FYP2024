// HomeScreen.js
import React from 'react';
import { FlatList, View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Card, Text, Provider as PaperProvider, Title, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Importing local images
import propertyImage from '../../assets/background/goals_background/property-1.jpg';
import vehicleImage from '../../assets/background/goals_background/vehicle-2.jpg';
import travelImage from '../../assets/background/goals_background/travel.jpg';
import customImage from '../../assets/background/goals_background/custom-goal-2.jpg';

const HomeScreen = ({ navigation }) => {
  const goals = [
    { id: '1', name: 'Buy a house', type: 'property', targetAge: 35, totalAmount: 300000 },
    { id: '2', name: 'Buy a car', type: 'vehicle', targetAge: 30, totalAmount: 20000 },
    { id: '3', name: 'Travel to Japan', type: 'travel', targetAge: 28, totalAmount: 5000 },
    { id: '4', name: 'Start a business', type: 'custom', targetAge: 40, totalAmount: 100000 },
    // Add more goals as needed
  ];

  const getBackgroundImage = (type) => {
    switch(type) {
      case 'property':
        return propertyImage;
      case 'vehicle':
        return vehicleImage;
      case 'travel':
        return travelImage;
      case 'custom':
        return customImage;
      default:
        return customImage;
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'property':
        return 'home';
      case 'vehicle':
        return 'directions-car';
      case 'travel':
        return 'flight';
      case 'custom':
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
          source={getBackgroundImage(goal.type)} 
          style={styles.image}
          imageStyle={{ borderRadius: 8 }}
        >
          <View style={styles.overlay}>
            <Card.Content style={styles.cardContent}>
              <Title style={styles.title}>
                <Icon name={getIcon(goal.type)} size={24} color="#fff" /> {goal.name}
              </Title>
              <Text style={styles.text}>
                <Icon name="event" size={20} color="#fff" /> Target Age: {goal.targetAge}
              </Text>
              <Text style={styles.text}>
                <Icon name="attach-money" size={20} color="#fff" /> Total Amount: {goal.totalAmount}
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
          data={goals}
          keyExtractor={(item) => item.id}
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
