import { requireNativeView } from 'expo';
import * as React from 'react';

import { ReactNativeAnimatedNumberInputViewProps } from './ReactNativeAnimatedNumberInput.types';

const NativeView: React.ComponentType<ReactNativeAnimatedNumberInputViewProps> =
  requireNativeView('ReactNativeAnimatedNumberInput');

export default function ReactNativeAnimatedNumberInputView(props: ReactNativeAnimatedNumberInputViewProps) {
  return <NativeView {...props} />;
}
