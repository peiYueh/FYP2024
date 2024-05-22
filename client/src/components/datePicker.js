import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }

  render() {
    const { selectedStartDate } = this.state;
    const formattedDate = selectedStartDate ? selectedStartDate.toLocaleDateString() : "";

    return (
      <View style={styles.container}>
        <CalendarPicker
          onDateChange={this.onDateChange}
          width={250}
          height={300}
          previousTitle="<"
          nextTitle=">"
          previousTitleStyle={styles.navButton}
          nextTitleStyle={styles.navButton}
          dayShape="square"
          todayBackgroundColor="#ffeb3b"
          selectedDayColor="#1976d2"
          selectedDayTextColor="white"
          textStyle={styles.dayText}
          selectedDayTextStyle={styles.selectedDayText}
          scaleFactor={375}
        />
        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>
            SELECTED DATE: {formattedDate}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  navButton: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: 5,
    borderRadius: 5,
    margin: 5,
  },
  dayText: {
    fontSize: 12,
    color: "#424242",
    margin: 2,
  },
  selectedDayText: {
    fontSize: 12,
    color: "white",
  },
  selectedDateContainer: {
    marginTop: 10,
    padding: 5,
    backgroundColor: "#e3f2fd",
    borderRadius: 5,
  },
  selectedDateText: {
    fontSize: 14,
    color: "#1976d2",
  },
});

export default DatePicker;
