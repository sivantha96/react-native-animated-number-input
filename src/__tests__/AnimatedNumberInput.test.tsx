import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AnimatedNumberInput } from '../index';

describe('AnimatedNumberInput', () => {
  it('renders with initial value', () => {
    const { getByDisplayValue } = render(
      <AnimatedNumberInput value="123.45" onChangeText={() => {}} />,
    );
    expect(getByDisplayValue('123.45')).toBeTruthy();
  });

  it('calls onChangeText when value changes', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <AnimatedNumberInput value="123.45" onChangeText={onChangeText} />,
    );
    fireEvent.changeText(getByDisplayValue('123.45'), '678.90');
    expect(onChangeText).toHaveBeenCalledWith('678.90');
  });
});
