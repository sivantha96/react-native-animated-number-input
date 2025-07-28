import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AnimatedNumberInput } from 'react-native-animated-number-input';
import { ZoomIn, ZoomOut } from 'react-native-reanimated';

export default function App(): React.JSX.Element {
  const [value, setValue] = useState('123');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Text style={styles.header}>{'Animated\nNumber Input\nDemo'}</Text>
        <View style={styles.demoContainer}>
          <AnimatedNumberInput
            autoFocus
            options={{
              prefix: '$',
              decimalSeparator: '.',
              groupSeparator: ',',
              precision: 2,
            }}
            maxFontSize={60}
            textStyle={styles.textStyle}
            placeholder="Enter a number"
            animationDuration={200}
            onChangeText={(text, rawText) => {
              setValue(text);
            }}
            entering={ZoomIn}
            exiting={ZoomOut}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});
