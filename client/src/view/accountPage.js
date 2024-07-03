import * as React from 'react';
import { View, ImageBackground, Text, StyleSheet, TextInput } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IncomeExpenseChart from '../components/income-expense-chart';

const AccountPage = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [isEditMode, setIsEditMode] = React.useState(false); // State to toggle edit mode

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <ImageBackground
                    source={require('../../assets/background/card-background-2.png')}
                    style={styles.cardBackground}
                    imageStyle={{ borderRadius: 20 }}
                >
                    <Text style={styles.infoHeader}>John Doe</Text>
                    <View style={styles.infoContainer}>
                        <View style={styles.infoRow}>
                            <Icon name="email" size={24} color="black" style={styles.icon} />
                            {isEditMode ? (
                                <TextInput
                                    style={styles.infoText}
                                    placeholder="johndoe@example.com"
                                    autoFocus={true}
                                />
                            ) : (
                                <Text style={styles.infoText}>johndoe@example.com</Text>
                            )}
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="cake" size={24} color="black" style={styles.icon} />
                            {isEditMode ? (
                                <TextInput
                                    style={styles.infoText}
                                    placeholder="01-Jan-1990"
                                />
                            ) : (
                                <Text style={styles.infoText}>01-Jan-1990</Text>
                            )}
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="wc" size={24} color="black" style={styles.icon} />
                            {isEditMode ? (
                                <TextInput
                                    style={styles.infoText}
                                    placeholder="Male"
                                />
                            ) : (
                                <Text style={styles.infoText}>Male</Text>
                            )}
                        </View>
                    </View>
                    <IconButton
                        icon={isEditMode ? 'content-save' : 'pencil'}
                        size={isEditMode ? 25 : 25}
                        onPress={toggleEditMode}
                        style={styles.editButton}
                    />
                </ImageBackground>
            </View>
            <IncomeExpenseChart/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'top',
        alignItems: 'center',
    },
    card: {
        margin: 15,
        padding: 2,
        borderRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        height: 250
    },
    infoContainer: {
        alignItems: 'flex-start', // Adjusted alignment for text input
        paddingLeft: '10%'
    },
    infoRow: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center', // Center items vertically
    },
    icon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 20,
        flex: 1, // Take full width of parent
    },
    infoHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 5,
    },
});

export default AccountPage;
