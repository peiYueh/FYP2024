import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native';
import { useTheme, DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import styles from '../styles';
import { API_BASE_URL } from '../../config';

import AddLiabilityModal from '../components/AddLiabilityModal'; // Import your modal component

const MyLiabilityPage = () => {
    const theme = useTheme();
    const navigation = useNavigation();

    // State for liabilities
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLiabilities = async () => {
        try {
            const response = await axios.get(API_BASE_URL + '/liabilities');
            // Parse and sort transactions by date
            console.log("Response" + response)
            const fetchedItems = response.data.map((item, index) => ({
                key: index + 1,
                name: item.liability_name,
                amount: item.liability_amount,
                details: item,
                remaining_amount: item.remaining_amount,
                overall_amount: item.overall_amount
            })).sort((a, b) => b.remaining_amount - a.remaining_amount);
            setItems(fetchedItems);
        } catch (error) {
            console.error('Error fetching liabilities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Fetch transactions when the page gains focus
            fetchLiabilities();
        });
        return unsubscribe;
    }, [navigation]);

    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4); // Default items per page

    // Function to handle page change
    const handlePageChange = (page) => {
        setPage(page);
    };

    // Function to handle items per page change
    const handleItemsPerPageChange = (itemsPerPage) => {
        setItemsPerPage(itemsPerPage);
        setPage(0); // Reset page to 0 when items per page changes
    };

    const handleAddLiability = (newLiability) => {
        // Generate a unique key for the new liability
        newLiability.key = items.length + 1;

        // Update items state with the new liability
        setItems([...items, newLiability]);
    };

    const handleRowPress = (item) => {
        navigation.navigate('Liability Detail', { liability: item.details });
    };

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);
    const displayedItems = items.slice(from, to);

    // Calculate the number of empty rows needed to fill the table
    const emptyRows = Array.from({ length: itemsPerPage - displayedItems.length });
    const calculateTotalLiability = () => {
        return items.reduce((total, item) => total + item.remaining_amount, 0);
    };

    return (
        <ScrollView contentContainerStyle={[styles.scrollViewContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.totalLiabilityContainer}>
                <Text style={[styles.subHeading, {alignItems:'center'}]}>Total Liabilities</Text>
                <Text style={[styles.heading, {paddingTop: 0}]}>RM {calculateTotalLiability().toLocaleString()}</Text>
            </View>

            <View style={{ position: 'relative', width: '90%', paddingTop: 10 }}>
                <View style={{ height: 300, backgroundColor: theme.colors.surface, borderRadius: 10 }}>
                    <DataTable>
                        <DataTable.Header style={{ backgroundColor: '#D5E5EB', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                            <DataTable.Title style={{ flex: 3 }} textStyle={{ fontWeight: 'bold' }}>Liability</DataTable.Title>
                            <DataTable.Title style={{ flex: 2 }} textStyle={{ fontWeight: 'bold' }} numeric>Remaining Amount</DataTable.Title>
                        </DataTable.Header>

                        <ScrollView>
                            {loading && (
                                <View style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 1,
                                }}>
                                    <ActivityIndicator size="large" color={theme.colors.primary} />
                                </View>
                            )}
                            {displayedItems.length > 0 ? (
                                displayedItems.map((item) => (
                                    <TouchableOpacity key={item.key} onPress={() => handleRowPress(item)}>
                                        <DataTable.Row style={{ backgroundColor: theme.colors.inverseOnSurface }}>
                                            <DataTable.Cell style={{ flex: 3 }}>{item.name}</DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 2 }} numeric>
                                                {item.remaining_amount === 0 ? 'Cleared' : `RM ${item.remaining_amount}`}
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={{ padding: 10, alignItems: 'center' }}>
                                    <Image
                                        source={require('../../assets/background/no-liability.png')}
                                        style={{ width: 320, height: 150 }}
                                    />
                                    <Text style={{ textAlign: 'center', color: theme.colors.text, marginTop: 10 }}>
                                        You have no liabilities currently.
                                    </Text>
                                </View>
                            )}
                            {displayedItems.length > 0 && emptyRows.map((_, index) => (
                                <DataTable.Row key={`empty-${index}`} style={{ backgroundColor: theme.colors.inverseOnSurface }}>
                                    <DataTable.Cell style={{ flex: 3 }} />
                                    <DataTable.Cell style={{ flex: 2 }} numeric />
                                </DataTable.Row>
                            ))}
                        </ScrollView>
                    </DataTable>

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(items.length / itemsPerPage)}
                        onPageChange={handlePageChange}
                        label={`${from + 1}-${to} of ${items.length}`}
                        numberOfItemsPerPageList={[4, 8, 12, 16]} // Optional: Specify different items per page options
                        onItemsPerPageChange={handleItemsPerPageChange}
                        style={{ backgroundColor: "#D5E5EB", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                    />
                </View>
            </View>

            {/* Add new liability button */}
            <TouchableOpacity style={[styles.addLiabilityButton, { backgroundColor: theme.colors.tertiaryContainer, borderColor: theme.colors.tertiary }]} onPress={() => setShowModal(true)}>
                <Icon name="add-chart" size={24} color={theme.colors.tertiary} />
                <Text style={styles.filterButtonText}>Add New Liability</Text>
            </TouchableOpacity>

            {/* AddLiabilityModal */}
            <AddLiabilityModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAddLiability} // Pass handleAddLiability function to AddLiabilityModal
            />

            {/* Swiper for liability facts */}
            <View style={styles.liabilityFact}>
                <Swiper
                    showsPagination={true}
                    autoplay={true}
                    autoplayTimeout={30}
                    loop={true}
                    style={styles.swiperContainer}
                >
                    <View style={styles.slide}>
                        <Image source={require('../../assets/liability-card/fact-card-1.png')} style={styles.image} />
                    </View>
                    <View style={styles.slide}>
                        <Image source={require('../../assets/liability-card/fact-card-2.png')} style={styles.image} />
                    </View>
                    <View style={styles.slide}>
                        <Image source={require('../../assets/liability-card/fact-card-3.png')} style={styles.image} />
                    </View>
                </Swiper>
            </View>
        </ScrollView>
    );
};

export default MyLiabilityPage;
