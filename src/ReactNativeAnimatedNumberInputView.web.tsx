import * as React from 'react';

import { ReactNativeAnimatedNumberInputViewProps } from './ReactNativeAnimatedNumberInput.types';

export default function ReactNativeAnimatedNumberInputView(props: ReactNativeAnimatedNumberInputViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
