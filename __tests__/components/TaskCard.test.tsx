import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TaskCard } from '../../src/components/TaskCard';

const mockTask = {
  id: '1',
  title: 'Estudiar React Native con Testing Library',
  status: 'pending' as const,
};

const mockOnDelete = jest.fn();

describe('TaskCard', () => {
  beforeEach(() => {
    mockOnDelete.mockClear();
  });

  it('muestra el título de la tarea', async () => {
    await render(<TaskCard task={mockTask} onDelete={mockOnDelete} />);
    expect(screen.getByText('Estudiar React Native con Testing Library')).toBeTruthy();
  });

  it('muestra el estado "Pendiente" para tareas pendientes', async () => {
    await render(<TaskCard task={mockTask} onDelete={mockOnDelete} />);
    expect(screen.getByText('○ Pendiente')).toBeTruthy();
  });

  it('muestra el estado "Completada" para tareas completadas', async () => {
    const completedTask = { ...mockTask, status: 'completed' as const };
    await render(<TaskCard task={completedTask} onDelete={mockOnDelete} />);
    expect(screen.getByText('✓ Completada')).toBeTruthy();
  });

  it('llama a onDelete con el id correcto al presionar "Eliminar"', async () => {
    await render(<TaskCard task={mockTask} onDelete={mockOnDelete} />);
    await fireEvent.press(screen.getByText('Eliminar'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});
