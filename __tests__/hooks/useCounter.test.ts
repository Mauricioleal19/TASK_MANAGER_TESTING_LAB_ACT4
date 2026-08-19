import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '../../src/hooks/useCounter';

describe('useCounter', () => {
  it('inicia con el valor por defecto (0)', async () => {
    const { result } = await renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('inicia con el valor proporcionado', async () => {
    const { result } = await renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('incrementa el contador en 1', async () => {
    const { result } = await renderHook(() => useCounter());
    await act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  it('decrementa el contador en 1', async () => {
    const { result } = await renderHook(() => useCounter(5));
    await act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(4);
  });

  it('reinicia el contador al valor inicial', async () => {
    const { result } = await renderHook(() => useCounter(10));
    await act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(12);

    await act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(10);
  });
});
