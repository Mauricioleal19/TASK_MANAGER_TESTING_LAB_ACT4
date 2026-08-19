/**
 * __tests__/accessibility/TaskCard.a11y.test.tsx
 *
 * Tipo de prueba: ACCESIBILIDAD (jest-native sobre @testing-library/react-native).
 *
 * No valida logica de negocio (eso ya lo cubre __tests__/components/TaskCard.test.tsx)
 * sino las propiedades accesibles que un lector de pantalla (VoiceOver/TalkBack)
 * necesita para anunciar correctamente cada control de la tarjeta: etiquetas
 * descriptivas (accessibilityLabel), roles (accessibilityRole) y que cada
 * accion sea un elemento enfocable independiente. getByLabelText/getByRole se
 * usan a proposito porque son las mismas consultas que "veria" un lector de
 * pantalla, a diferencia de getByText que solo mira el texto visible.
 */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TaskCard } from '../../src/components/TaskCard';

const mockTask = {
  id: '1',
  title: 'Estudiar accesibilidad',
  status: 'pending' as const,
};

describe('TaskCard - Accesibilidad', () => {
  // Verifica que el boton de eliminar no dependa del texto visible ("Eliminar")
  // sino de un accessibilityLabel que incluye el titulo de la tarea, para que
  // el usuario sepa CUAL tarea va a borrar sin tener que ver la pantalla.
  it('el botón de eliminar tiene un accessibilityLabel descriptivo', async () => {
    await render(<TaskCard task={mockTask} onDelete={jest.fn()} />);
    const deleteButton = screen.getByLabelText('Eliminar tarea Estudiar accesibilidad');
    expect(deleteButton).toBeTruthy();
  });

  // Verifica que "marcar como completada" y "eliminar" sean dos elementos con
  // accessibilityRole="button" distintos, para que la navegacion por gestos
  // (deslizar) del lector de pantalla los recorra uno por uno.
  it('los controles de la tarjeta son botones enfocables por separado', async () => {
    await render(<TaskCard task={mockTask} onDelete={jest.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  // Verifica que el estado (pendiente/completada) se exprese como texto real
  // en el arbol de accesibilidad, no solo como color, para que sea perceptible
  // por un usuario con daltonismo o que dependa de un lector de pantalla.
  it('el estado de la tarea es anunciado al lector de pantalla', async () => {
    await render(<TaskCard task={mockTask} onDelete={jest.fn()} />);
    expect(screen.getByText('○ Pendiente')).toBeTruthy();
  });
});
