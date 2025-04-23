import { registerWebModule, NativeModule } from 'expo';

import { ReactNativeAnimatedNumberInputModuleEvents } from './ReactNativeAnimatedNumberInput.types';

class ReactNativeAnimatedNumberInputModule extends NativeModule<ReactNativeAnimatedNumberInputModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ReactNativeAnimatedNumberInputModule);
