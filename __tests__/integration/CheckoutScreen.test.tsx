import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CheckoutScreen } from '../../src/screens/CheckoutScreen';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CheckoutScreen />
    </SafeAreaProvider>
  );

const fill = (testID: string, value: string) =>
  fireEvent.changeText(screen.getByTestId(testID), value);

const fillAll = async (entries: [string, string][]) => {
  for (const [testID, value] of entries) {
    await fill(testID, value);
  }
};

describe('CheckoutScreen - Integración', () => {
  it('muestra error de validación si faltan campos', async () => {
    await renderScreen();
    await fireEvent.press(screen.getByText('Confirmar pago'));
    expect(screen.getByText('Completa todos los campos antes de continuar')).toBeTruthy();
  });

  it('confirma la transacción cuando todos los campos están completos', async () => {
    await renderScreen();

    await fillAll([
      ['input-nombre', 'Juan Pérez'],
      ['input-email', 'juan@correo.com'],
      ['input-telefono', '3000000000'],
      ['input-direccion', 'Calle 123 #45-67'],
      ['input-ciudad', 'Bogotá'],
      ['input-codigo-postal', '110111'],
      ['input-titular', 'Juan Pérez'],
      ['input-numero-tarjeta', '4111111111111111'],
      ['input-vencimiento', '12/28'],
      ['input-cvv', '123'],
    ]);

    await fireEvent.press(screen.getByText('Confirmar pago'));

    await waitFor(() => {
      expect(screen.getByText('Transacción completada exitosamente')).toBeTruthy();
    });
  });
});
