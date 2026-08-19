import { render, screen } from '@testing-library/react-native';
import { StatusBadge } from '../../src/components/StatusBadge';

describe('StatusBadge - Verificacion de textos', () => {
  it('muestra el estado "✓ Completada" correctamente', async () => {
    await render(<StatusBadge status="completed" />);
    expect(screen.getByText('✓ Completada')).toBeTruthy();
  });

  it('muestra el estado "○ Pendiente" correctamente', async () => {
    await render(<StatusBadge status="pending" />);
    expect(screen.getByText('○ Pendiente')).toBeTruthy();
  });
});
