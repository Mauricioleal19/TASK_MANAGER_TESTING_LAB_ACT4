import '../global.css';
import '../src/mocks/runtimeFetch';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="todo" options={{ title: 'Flujo Todo List' }} />
      <Stack.Screen name="checkout" options={{ title: 'Flujo Transaccional' }} />
    </Stack>
  );
}
