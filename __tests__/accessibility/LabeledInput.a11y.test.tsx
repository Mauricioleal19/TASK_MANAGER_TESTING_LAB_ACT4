/**
 * __tests__/accessibility/LabeledInput.a11y.test.tsx
 *
 * Tipo de prueba: ACCESIBILIDAD (jest-native sobre @testing-library/react-native).
 *
 * LabeledInput es el campo de texto reutilizado por las 10 preguntas del
 * flujo transaccional (UserInfoSection, ShippingInfoSection,
 * PaymentInfoSection). Antes de esta prueba, el <TextInput> no exponía
 * accessibilityLabel: el <Text> con la etiqueta visual ("Nombre completo",
 * "Correo electrónico", etc.) es solo decorativo para un lector de pantalla,
 * que no lo asocia automáticamente con el input de al lado. Se corrigió en
 * src/components/LabeledInput.tsx pasando `label` como accessibilityLabel
 * por defecto (sobreescribible vía props si un caller necesita otro texto).
 *
 * Estas pruebas verifican, con getByLabelText (el mismo mecanismo que usa
 * VoiceOver/TalkBack para anunciar un control), que ese enlace existe.
 */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { LabeledInput } from '../../src/components/LabeledInput';

describe('LabeledInput - Accesibilidad', () => {
  it('expone el texto de la etiqueta como accessibilityLabel del campo', async () => {
    await render(<LabeledInput label="Correo electrónico" testID="input-email" />);

    const input = screen.getByLabelText('Correo electrónico');
    expect(input).toBeTruthy();
  });

  it('permite sobreescribir el accessibilityLabel por defecto cuando se pasa uno explícito', async () => {
    await render(
      <LabeledInput
        label="CVV"
        testID="input-cvv"
        accessibilityLabel="Código de seguridad de la tarjeta, 3 dígitos"
      />
    );

    expect(screen.getByLabelText('Código de seguridad de la tarjeta, 3 dígitos')).toBeTruthy();
    expect(screen.queryByLabelText('CVV')).toBeNull();
  });
});
