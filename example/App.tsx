import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  AnimatedNumberInput,
  CharWidthProvider,
} from 'react-native-animated-number-input';

export default function App(): React.JSX.Element {
  const [value, setValue] = useState('123');

  const handleError = (error: Error) => {
    console.error('AnimatedNumberInput Error:', error);
    // In a real app, you might want to report this to an error tracking service
  };

  return (
    <CharWidthProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <Text style={styles.header}>{'Animated\nNumber Input\nDemo'}</Text>
          <View style={styles.demoContainer}>
            <AnimatedNumberInput
              onChangeText={setValue}
              number={value}
              textStyle={{ color: 'red', fontSize: 40 }}
              containerStyle={{
                width: '100%',
                justifyContent: 'flex-end',
              }}
              separatorAnimation="swap"
              separator="comma"
              animationConfig={{
                type: 'spring',
                damping: 20,
                stiffness: 120,
              }}
              prefix="$"
              placeholder="0.00"
              accessibilityConfig={{
                announceChanges: true,
                customAccessibilityLabel: 'Currency input field',
                customAccessibilityHint: 'Enter amount in dollars',
              }}
              enablePerformanceMonitoring={true}
              onError={handleError}
              fallbackComponent={
                <Text style={styles.errorFallback}>
                  Unable to load number input
                </Text>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </CharWidthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 50,
    fontWeight: '300',
    marginBottom: 48,
    textAlign: 'right',
    width: '90%',
  },
  demoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    paddingLeft: 30,
  },
  textStyle: {
    color: '#222',
    fontWeight: '800',
  },
  errorFallback: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f44336',
  },
});
