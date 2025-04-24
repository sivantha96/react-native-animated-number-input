# react-native-animated-number-input

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-animated-number-input"><img src="https://img.shields.io/npm/v/react-native-animated-number-input.svg?style=flat-square" alt="npm version" /></a>
  <a href="https://github.com/sivantha96/react-native-animated-number-input/blob/main/LICENSE"><img src="https://img.shields.io/github/license/sivantha96/react-native-animated-number-input?style=flat-square" alt="license" /></a>
  <!-- Add your CI badge here if available -->
  <img src="https://img.shields.io/badge/coverage-pending-lightgrey?style=flat-square" alt="coverage" />
</p>

A performant, animated, and auto-sizing number input for React Native and Expo. Supports both Expo Managed and Bare workflows.

---

<!-- GIF or screenshot demo -->
<p align="center">
  <img src="https://raw.githubusercontent.com/sivantha96/react-native-animated-number-input/main/demo.gif" alt="Animated Number Input Demo" width="350" />
</p>

---

## ✨ Features

- Animated digit transitions
- Auto font-size adjustment based on container width
- Supports decimal and thousand separators
- Prefix and suffix support
- Custom animation duration and styles
- Works in both Expo and Bare React Native
- Written in TypeScript

---

## 🚀 Installation

```sh
npm install react-native-animated-number-input
# or
yarn add react-native-animated-number-input
```

**Peer dependencies:**

- `react-native-reanimated` (v3+)
- `react-native`
- `react`

---

## 📦 Usage

```tsx
import { AnimatedNumberInput } from 'react-native-animated-number-input';

export default function MyScreen() {
  const [value, setValue] = React.useState('1234.56');
  return (
    <AnimatedNumberInput
      value={value}
      onChangeText={setValue}
      precision={2}
      maxFontSize={48}
      containerStyle={{ width: 200 }}
      prefix="$"
      suffix=" USD"
      decimalSeparator=","
      thousandSeparator="."
      animationDuration={200}
      placeholder="Enter a number"
      textStyle={{ color: '#222', fontWeight: 'bold' }}
    />
  );
}
```

---

## 🛠 API Reference

### `<AnimatedNumberInput />`

A fully controlled, animated, auto-sizing number input component.

#### Props

| Prop                | Type                                                      | Default                                   | Description                                                                              |
| ------------------- | --------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `value`             | `string`                                                  | **Required**                              | The current value of the input (controlled).                                             |
| `onChangeText`      | `(value: string) => void`                                 | **Required**                              | Callback when the value changes.                                                         |
| `textStyle`         | `TextStyle`                                               | `{}`                                      | Style for the input text.                                                                |
| `containerStyle`    | `ViewStyle`                                               | `{}`                                      | Style for the container.                                                                 |
| `decimalSeparator`  | `string`                                                  | `'.'`                                     | Character to use as the decimal separator.                                               |
| `thousandSeparator` | `string`                                                  | `','`                                     | Character to use as the thousand separator.                                              |
| `prefix`            | `string`                                                  | `undefined`                               | String to display before the number (e.g., currency symbol).                             |
| `suffix`            | `string`                                                  | `undefined`                               | String to display after the number (e.g., unit).                                         |
| `precision`         | `number`                                                  | `2`                                       | Number of decimal places to allow.                                                       |
| `animationDuration` | `number`                                                  | `100`                                     | Duration of digit transition animations in milliseconds.                                 |
| `maxFontSize`       | `number`                                                  | `64`                                      | Maximum font size for the digits.                                                        |
| `exiting`           | `EntryOrExitLayoutType` (Reanimated animation)            | `FadeOutDown.duration(animationDuration)` | Animation for exiting digits.                                                            |
| `entering`          | `EntryOrExitLayoutType` (Reanimated animation)            | `FadeInDown.duration(animationDuration)`  | Animation for entering digits.                                                           |
| `placeholder`       | `string`                                                  | `undefined`                               | Placeholder text when the value is empty.                                                |
| ...TextInputProps   | All other `TextInput` props except `value`/`onChangeText` |                                           | You can pass any other valid `TextInput` prop (e.g., `autoFocus`, `keyboardType`, etc.). |

#### Example with all features

```tsx
<AnimatedNumberInput
  value={value}
  onChangeText={setValue}
  precision={2}
  maxFontSize={48}
  containerStyle={{ width: 200 }}
  prefix="$"
  suffix=" USD"
  decimalSeparator=","
  thousandSeparator="."
  animationDuration={200}
  placeholder="Enter a number"
  textStyle={{ color: '#222', fontWeight: 'bold' }}
  autoFocus
/>
```

---

## 🧪 Example App

See the [`example/`](./example) folder for a working Expo + Bare React Native demo. The example demonstrates:

- Animated transitions
- Auto font sizing
- Prefix/suffix
- Custom separators
- Placeholder
- Custom styles

---

## 🤝 Contributing

PRs and issues welcome! Please open an issue or submit a pull request.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release notes.

---

## 🧑‍💻 Code of Conduct

This project follows a [Code of Conduct](./CODE_OF_CONDUCT.md) to foster an open and welcoming community.

---

## 📄 License

MIT © Sivantha Paranavithana
