import React from 'react';
import { View, Text } from 'react-native';
import { LabeledInput } from './LabeledInput';

export interface ShippingInfo {
  direccion: string;
  ciudad: string;
  codigoPostal: string;
}

interface Props {
  values: ShippingInfo;
  onChange: (field: keyof ShippingInfo, value: string) => void;
}

export function ShippingInfoSection({ values, onChange }: Props) {
  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-gray-900">Envío y entrega</Text>
      <LabeledInput
        label="Dirección"
        testID="input-direccion"
        placeholder="Calle 123 #45-67"
        value={values.direccion}
        onChangeText={(t) => onChange('direccion', t)}
      />
      <LabeledInput
        label="Ciudad"
        testID="input-ciudad"
        placeholder="Bogotá"
        value={values.ciudad}
        onChangeText={(t) => onChange('ciudad', t)}
      />
      <LabeledInput
        label="Código postal"
        testID="input-codigo-postal"
        placeholder="110111"
        keyboardType="phone-pad"
        value={values.codigoPostal}
        onChangeText={(t) => onChange('codigoPostal', t)}
      />
    </View>
  );
}
