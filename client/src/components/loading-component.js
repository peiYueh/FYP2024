import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const LoadingIndicator = ({ theme }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 100 }}>
      <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10, padding: 20 }}>
        <ActivityIndicator size={200} color={theme.colors.onSecondary}/>
      </View>
    </View>
  );
};

export default LoadingIndicator;