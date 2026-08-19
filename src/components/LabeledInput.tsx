import React from 'react';
import { View, Text, TextInput, TextInputProps, Platform } from 'react-native';

// iOS: barra "Listo" sobre el teclado para poder cerrarlo (el number-pad no se cierra solo).
export const KEYBOARD_ACCESSORY_ID = 'checkout-keyboard-accessory';

interface LabeledInputProps extends TextInputProps {
  label: string;
}

export function LabeledInput({ label, ...rest }: LabeledInputProps) {
  return (
    <View className="gap-1">
      <Text className="text-sm font-medium text-gray-700">{label}</Text>
      <TextInput
        placeholderTextColor="#9ca3af"
        inputAccessoryViewID={Platform.OS === 'ios' ? KEYBOARD_ACCESSORY_ID : undefined}
        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
        accessibilityLabel={label}
        {...rest}
      />
    </View>
  );
}
