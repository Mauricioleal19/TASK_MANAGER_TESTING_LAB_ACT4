/**
 * __tests__/accessibility/ConfirmDeleteDialog.a11y.test.tsx
 *
 * Tipo de prueba: ACCESIBILIDAD (jest-native sobre @testing-library/react-native).
 *
 * Complementa __tests__/components/ConfirmDeleteDialog.test.tsx (que prueba
 * comportamiento) verificando específicamente las propiedades accesibles del
 * diálogo de confirmación: que el contenedor quede marcado como modal para
 * el lector de pantalla (accessibilityViewIsModal, agregado en
 * src/components/ConfirmDeleteDialog.tsx) y que sus dos acciones destructivas
 * ("Cancelar" / "Confirmar eliminación") sean anunciables y enfocables por
 * separado, con etiquetas que dejan claro qué hace cada botón sin ambigüedad.
 */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ConfirmDeleteDialog } from '../../src/components/ConfirmDeleteDialog';

const noop = () => {};

describe('ConfirmDeleteDialog - Accesibilidad', () => {
  it('marca el contenedor del diálogo como modal para el lector de pantalla', async () => {
    await render(
      <ConfirmDeleteDialog visible taskTitle="Estudiar" onConfirm={noop} onCancel={noop} />
    );

    const modalContainer = screen.getByTestId('confirm-delete-dialog');
    expect(modalContainer.props.accessibilityViewIsModal).toBe(true);
  });

  it('expone "Cancelar" y "Confirmar eliminación" como botones independientes con accessibilityLabel propio', async () => {
    await render(
      <ConfirmDeleteDialog visible taskTitle="Estudiar" onConfirm={noop} onCancel={noop} />
    );

    expect(screen.getByLabelText('Cancelar')).toBeTruthy();
    expect(screen.getByLabelText('Confirmar eliminación')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
