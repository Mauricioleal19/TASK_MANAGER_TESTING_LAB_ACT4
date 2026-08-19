import { filterTasksByStatus } from '../../src/utils/filterTasks';
import { Task } from '../../src/types';

const mockTasks: Task[] = [
  { id: '1', title: 'Comprar leche', status: 'pending' },
  { id: '2', title: 'Estudiar React Native', status: 'completed' },
  { id: '3', title: 'Hacer ejercicio', status: 'pending' },
  { id: '4', title: 'Leer documentación de Jest', status: 'completed' },
];

describe('filterTasksByStatus', () => {
  it('devuelve solo las tareas con el estado indicado', () => {
    const result = filterTasksByStatus(mockTasks, 'completed');
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Estudiar React Native');
  });

  it('devuelve un arreglo vacío cuando no hay coincidencias', () => {
    const result = filterTasksByStatus(mockTasks, 'archived');
    expect(result).toEqual([]);
  });

  it('devuelve todas las tareas cuando el estado es "all"', () => {
    const result = filterTasksByStatus(mockTasks, 'all');
    expect(result).toHaveLength(4);
  });

  it('lanza un error cuando el estado es inválido', () => {
    // @ts-expect-error probando entrada inválida en runtime
    expect(() => filterTasksByStatus(mockTasks, 'invalido')).toThrow();
  });
});
