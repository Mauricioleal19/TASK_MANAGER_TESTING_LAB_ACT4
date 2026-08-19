import React from 'react';
import { View, Text } from 'react-native';
import { LabeledInput } from './LabeledInput';

export interface PaymentInfo {
  titular: string;
  numeroTarjeta: string;
  vencimiento: string;
  cvv: string;
}

interface Props {
  values: PaymentInfo;
  onChange: (field: keyof PaymentInfo, value: string) => void;
}

export function PaymentInfoSection({ values, onChange }: Props) {
  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-gray-900">Medio de pago</Text>
      <LabeledInput
        label="Titular de la tarjeta"
        testID="input-titular"
        placeholder="Juan Pérez"
        value={values.titular}
        onChangeText={(t) => onChange('titular', t)}
      />
      <LabeledInput
        label="Número de tarjeta"
        testID="input-numero-tarjeta"
        placeholder="4111 1111 1111 1111"
        keyboardType="phone-pad"
        value={values.numeroTarjeta}
        onChangeText={(t) => onChange('numeroTarjeta', t)}
      />
      <LabeledInput
        label="Vencimiento (MM/AA)"
        testID="input-vencimiento"
        placeholder="12/28"
        value={values.vencimiento}
        onChangeText={(t) => onChange('vencimiento', t)}
      />
      <LabeledInput
        label="CVV"
        testID="input-cvv"
        placeholder="123"
        keyboardType="phone-pad"
        secureTextEntry
        value={values.cvv}
        onChangeText={(t) => onChange('cvv', t)}
      />
    </View>
  );
}
