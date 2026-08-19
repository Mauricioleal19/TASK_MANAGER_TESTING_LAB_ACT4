import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, InputAccessoryView, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserInfoSection, UserInfo } from '../components/UserInfoSection';
import { ShippingInfoSection, ShippingInfo } from '../components/ShippingInfoSection';
import { PaymentInfoSection, PaymentInfo } from '../components/PaymentInfoSection';
import { KEYBOARD_ACCESSORY_ID } from '../components/LabeledInput';

const emptyUser: UserInfo = { nombre: '', email: '', telefono: '' };
const emptyShipping: ShippingInfo = { direccion: '', ciudad: '', codigoPostal: '' };
const emptyPayment: PaymentInfo = { titular: '', numeroTarjeta: '', vencimiento: '', cvv: '' };

const allFilled = (...groups: object[]) =>
  groups.every((g) => Object.values(g).every((v) => String(v).trim().length > 0));

export function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(emptyUser);
  const [shipping, setShipping] = useState(emptyShipping);
  const [payment, setPayment] = useState(emptyPayment);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const submit = () => {
    if (!allFilled(user, shipping, payment)) {
      setStatus('error');
      return;
    }
    setStatus('success');
  };

  return (
    <>
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerClassName="gap-5 p-4"
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <UserInfoSection values={user} onChange={(f, v) => setUser((s) => ({ ...s, [f]: v }))} />
      <ShippingInfoSection
        values={shipping}
        onChange={(f, v) => setShipping((s) => ({ ...s, [f]: v }))}
      />
      <PaymentInfoSection
        values={payment}
        onChange={(f, v) => setPayment((s) => ({ ...s, [f]: v }))}
      />

      {status === 'error' && (
        <Text className="rounded-lg bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
          Completa todos los campos antes de continuar
        </Text>
      )}
      {status === 'success' && (
        <Text className="rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-800">
          Transacción completada exitosamente
        </Text>
      )}

      <Pressable
        onPress={submit}
        accessibilityRole="button"
        className="rounded-lg bg-emerald-600 py-3 active:bg-emerald-700"
      >
        <Text className="text-center text-base font-semibold text-white">Confirmar pago</Text>
      </Pressable>

      <View className="h-2" />
    </ScrollView>
    {Platform.OS === 'ios' && (
      <InputAccessoryView nativeID={KEYBOARD_ACCESSORY_ID}>
        <View className="flex-row justify-end border-t border-gray-200 bg-gray-100 px-4 py-2">
          <Pressable onPress={() => Keyboard.dismiss()} accessibilityRole="button">
            <Text className="text-base font-semibold text-blue-600">Listo</Text>
          </Pressable>
        </View>
      </InputAccessoryView>
    )}
    </>
  );
}
