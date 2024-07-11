import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import styles from '../styles'
const LoadingIndicator = ({ theme }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 100 }}>
      <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10, padding: 20 }}>
        <LottieView
          source={{ uri: 'https://lottie.host/4541e937-db92-44e9-8259-1d5639b0c753/f8dM1ZZh1C.json' }}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>
    </View>
  );
};

export default LoadingIndicator;