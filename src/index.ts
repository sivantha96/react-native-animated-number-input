// Reexport the native module. On web, it will be resolved to ReactNativeAnimatedNumberInputModule.web.ts
// and on native platforms to ReactNativeAnimatedNumberInputModule.ts
export { default } from './ReactNativeAnimatedNumberInputModule';
export { default as ReactNativeAnimatedNumberInputView } from './ReactNativeAnimatedNumberInputView';
export * from  './ReactNativeAnimatedNumberInput.types';
