import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useTheme, Text, DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import styles from '../styles';
import AddLiabilityModal from '../components/AddLiabilityModal'; // Import your modal component

const MyLiabilityPage = () => {
    const theme = useTheme();
    const navigation = useNavigation();

    // Liability table
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPageList] = useState([4]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

    const [items, setItems] = useState([
        { key: 1, name: 'Study Loan', amount: 356, lastPayment: '9/4/2024' },
        { key: 2, name: 'Mortgage Loans', amount: 262, lastPayment: '9/3/2024' },
        { key: 3, name: 'Home Equity Loans.', amount: 159, lastPayment: '9/2/2024' },
        { key: 4, name: 'Personal Loans', amount: 305, lastPayment: '9/1/2024' },
        { key: 5, name: 'Study Loan', amount: 356, lastPayment: '9/12/2023' },
        { key: 6, name: 'Mortgage Loans', amount: 262, lastPayment: '9/2/2023' },
        { key: 7, name: 'Home Equity Loans.', amount: 159, lastPayment: '9/2/2023' },
        { key: 8, name: 'Personal Loans', amount: 305, lastPayment: '9/2/2023' },
    ]);

    const [showModal, setShowModal] = useState(false);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const handleRowPress = (key) => {
        console.log(`Item Key: ${key}`);
    };

    const handleAddLiability = (liabilityData) => {
        // Assuming here that 'key' should be unique, you should implement logic to generate a unique key
        const newKey = items.length + 1;
        const newItem = { ...liabilityData, key: newKey };
        setItems([...items, newItem]);
        Alert.alert('Success', 'Liability added successfully');
    };

    return (
        <ScrollView contentContainerStyle={[styles.scrollViewContent, { backgroundColor: theme.colors.background }]}>
            <View style={styles.totalLiabilityContainer}>
                <Text style={styles.subHeading}>Total Liabilities</Text>
                <Text style={styles.heading}>RM 35, 000</Text>
            </View>
            <DataTable style={{ width: '90%', paddingTop: 10 }}>
                <DataTable.Header style={{ backgroundColor: '#D5E5EB', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <DataTable.Title style={{ flex: 3 }} textStyle={{ fontWeight: 'bold' }}>Liability</DataTable.Title>
                    <DataTable.Title style={{ flex: 2 }} textStyle={{ fontWeight: 'bold' }} numeric>Remaining Amount</DataTable.Title>
                </DataTable.Header>

                {items.slice(from, to).map((item) => (
                    <TouchableOpacity key={item.key} onPress={() => handleRowPress(item.key)}>
                        <DataTable.Row style={{ backgroundColor: theme.colors.inverseOnSurface }}>
                            <DataTable.Cell style={{ flex: 3 }}>{item.name}</DataTable.Cell>
                            <DataTable.Cell style={{ flex: 2 }} numeric>RM {item.amount}</DataTable.Cell>
                        </DataTable.Row>
                    </TouchableOpacity>
                ))}
                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(items.length / itemsPerPage)}
                    onPageChange={(page) => setPage(page)}
                    label={`${from + 1}-${to} of ${items.length}`}
                    numberOfItemsPerPage={itemsPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                    style={{ backgroundColor: "#D5E5EB", borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                />
            </DataTable>
            <TouchableOpacity style={[styles.addLiabilityButton, { backgroundColor: theme.colors.tertiaryContainer, borderColor: theme.colors.tertiary }]} onPress={() => setShowModal(true)}>
                <Icon name="add-chart" size={24} color={theme.colors.tertiary} />
                <Text style={styles.filterButtonText}>Add New Liability</Text>
            </TouchableOpacity>

            <AddLiabilityModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleAddLiability}
            />

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
