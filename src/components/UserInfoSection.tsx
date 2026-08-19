import React from 'react';
import { View, Text } from 'react-native';
import { LabeledInput } from './LabeledInput';

export interface UserInfo {
  nombre: string;
  email: string;
  telefono: string;
}

interface Props {
  values: UserInfo;
  onChange: (field: keyof UserInfo, value: string) => void;
}

export function UserInfoSection({ values, onChange }: Props) {
  return (
    <View className="gap-3">
      <Text className="text-lg font-bold text-gray-900">Información del usuario</Text>
      <LabeledInput
        label="Nombre completo"
        testID="input-nombre"
        placeholder="Juan Pérez"
        value={values.nombre}
        onChangeText={(t) => onChange('nombre', t)}
      />
      <LabeledInput
        label="Correo electrónico"
        testID="input-email"
        placeholder="juan@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={values.email}
        onChangeText={(t) => onChange('email', t)}
      />
      <LabeledInput
        label="Teléfono"
        testID="input-telefono"
        placeholder="+57 300 000 0000"
        keyboardType="phone-pad"
        value={values.telefono}
        onChangeText={(t) => onChange('telefono', t)}
      />
    </View>
  );
}
