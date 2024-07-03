import { PieChart } from "react-native-gifted-charts";
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image  } from 'react-native';
import axios from 'axios'; // Import axios if not already
import { API_BASE_URL } from '../../config';

const ExpenseDistributionChart = () => {
    const [focusedIndex, setFocusedIndex] = useState(0);

    const spendingData = [
        { label: "Needs", value: 40, color: '#004AAD', gradientCenterColor: '#3366CC', index: 0, focused: focusedIndex === 0 },
        { label: "Wants", value: 16, color: '#5271FF', gradientCenterColor: '#8F80F3', index: 1, focused: focusedIndex === 1 },
        { label: "Savings", value: 10, color: '#38B6FF', gradientCenterColor: '#FF7F97', index: 2, focused: focusedIndex === 2 },
    ];

    const renderDot = color => {
        return (
            <View
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 10,
                }}
            />
        );
    };

    const renderLegendComponent = () => {
        return (
            <View style={{ justifyContent: 'center', padding: 10, flex:1 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                    {renderDot('#004AAD')}
                    <Text style={{ color: '#005A75' }}>Needs Spending</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                    {renderDot('#5271FF')}
                    <Text style={{ color: '#005A75' }}>Wants Spending</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                    }}>
                    {renderDot('#38B6FF')}
                    <Text style={{ color: '#005A75' }}>Savings</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.card}>
            <Text style={{ color: '#005A75', fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                My Spending Structure
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {renderLegendComponent()}
                <View style={{ alignItems: 'center' }}>
                    <PieChart
                        data={spendingData}
                        donut
                        showGradient
                        focusOnPress
                        radius={80}
                        innerRadius={60}
                        innerCircleColor={'#F4F9FB'}
                        onPress={(dataRow) => {
                            setFocusedIndex(dataRow.index)
                        }}
                        centerLabelComponent={() => {
                            return (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    {spendingData[focusedIndex] ? (
                                        <>
                                            <Text style={{ fontSize: 22, color: '#005A75', fontWeight: 'bold' }}>
                                                {spendingData[focusedIndex].value}%
                                            </Text>
                                            <Text style={{ fontSize: 14, color: '#005A75' }}>
                                                {spendingData[focusedIndex].label}
                                            </Text>
                                        </>
                                    ) : (
                                        <Image
                                            source={require('../../assets/Image/spending.png')} // Make sure to replace with the correct path
                                            style={{ width: 50, height: 50 }}
                                        />
                                    )}
                                </View>
                            );
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#F4F9FB',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    }
})

export default ExpenseDistributionChart;
