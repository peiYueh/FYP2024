import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Text, useTheme } from 'react-native-paper';
import styles from '../styles';

const calculateStepValue = (maxValue) => {
    // Customize this function based on how you want to calculate the step value
    return Math.ceil(maxValue / 5); // Example: dividing the max value by 5
};

const TransactionLinechart = ({ incomeData, expensesData, maxIncome, maxExpense, theme }) => {
    // Calculate optimized step values
    const incomeStepValue = calculateStepValue(maxIncome);

    return (
        <View>
            <LineChart
                width={280}
                data={incomeData}
                data2={expensesData}
                height={100}
                spacing={40}
                initialSpacing={20}
                color1={theme.colors.primary}
                color2={theme.colors.error}
                textColor1={'#191C1D'}
                yAxisThickness={0}
                dataPointsHeight={3}
                dataPointsWidth={3}
                dataPointsColor1={theme.colors.primary}
                dataPointsColor2={theme.colors.error}
                textFontSize={10}
                maxValue={maxIncome}
                mostNegativeValue={maxExpense}
                stepValue={incomeStepValue} // Use income step value
                xAxisLabelTextStyle={{ fontSize: 10 }}
                yAxisTextStyle={{ fontSize: 10 }}
                rulesType="solid"
                isAnimated
                animationDuration={1000}
                animationDuration2={1000}
                areaChart
                startFillColor={theme.colors.primary}
                endFillColor={theme.colors.primary}
                startFillColor2={'#BA1A1A'}
                endFillColor2={'#BA1A1A'}
                startOpacity={0.4}
                endOpacity={0.1}
                focusEnabled
                showTextOnFocus
                endSpacing={15}
                showValuesAsDataPointsText
                overflowBottom
                textShiftX={-10}
                textShiftY={15}
                noOfSections={5}
                noOfSectionsBelowXAxis={5}
                // xAxisLabelsVerticalShift={80}
            />
        </View>
    );
};

export default TransactionLinechart;
