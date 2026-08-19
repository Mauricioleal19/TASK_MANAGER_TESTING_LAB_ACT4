import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCreateTask } from '../../src/hooks/useCreateTask';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('useCreateTask', () => {
  it('alterna el estado de una tarea entre pendiente y completada', async () => {
    const { result } = await renderHook(() => useCreateTask());

    await act(async () => {
      await result.current.submit('Tarea 1');
    });
    const id = result.current.tasks[0].id;
    expect(result.current.tasks[0].status).toBe('pending');

    await act(() => {
      result.current.toggleTask(id);
    });
    expect(result.current.tasks[0].status).toBe('completed');

    await act(() => {
      result.current.toggleTask(id);
    });
    expect(result.current.tasks[0].status).toBe('pending');
  });

  it('persiste las tareas y las recarga en un nuevo montaje', async () => {
    const first = await renderHook(() => useCreateTask());
    await act(async () => {
      await first.result.current.submit('Persistente');
    });
    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'tasks',
        expect.stringContaining('Persistente')
      )
    );

    const second = await renderHook(() => useCreateTask());
    await waitFor(() => expect(second.result.current.tasks).toHaveLength(1));
    expect(second.result.current.tasks[0].title).toBe('Persistente');
  });
});
