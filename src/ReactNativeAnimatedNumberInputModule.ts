import { NativeModule, requireNativeModule } from 'expo';

import { ReactNativeAnimatedNumberInputModuleEvents } from './ReactNativeAnimatedNumberInput.types';

declare class ReactNativeAnimatedNumberInputModule extends NativeModule<ReactNativeAnimatedNumberInputModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeAnimatedNumberInputModule>('ReactNativeAnimatedNumberInput');
