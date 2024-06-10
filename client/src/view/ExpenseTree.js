import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Sample transaction data
const transactionData = {
  id: 123456,
  date: '2024-06-10',
  expenses: {
    groceries: {
      fruits: 20,
      vegetables: 30,
      snacks: 15
    },
    entertainment: {
      movie: 25,
      dinner: 40
    },
    bills: {
      rent: 500,
      utilities: 100
    }
  }
};

const ExpenseNode = ({ label, amount, children }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.node}>
      <TouchableOpacity onPress={toggleExpand}>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
      {expanded && children && (
        <View style={styles.children}>
          {children}
        </View>
      )}
      <Text style={styles.amount}>{amount}</Text>
    </View>
  );
};

const renderNode = (label, amount, children) => (
  <ExpenseNode label={label} amount={amount} children={children} />
);

const renderTree = (data) => {
  return Object.entries(data).map(([label, children]) => {
    if (typeof children === 'object') {
      const amount = Object.values(children).reduce((acc, val) => acc + val, 0);
      return renderNode(label, amount, renderTree(children));
    } else {
      return renderNode(label, children);
    }
  });
};

const ExpenseTree = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction ID: {transactionData.id}</Text>
      <View style={styles.tree}>
        {renderTree(transactionData.expenses)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tree: {
    flexDirection: 'row', // Display nodes horizontally
    flexWrap: 'wrap', // Allow nodes to wrap to the next row
  },
  node: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  amount: {
    marginTop: 5,
  },
  children: {
    marginTop: 5,
  },
});

export default ExpenseTree;
