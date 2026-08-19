import { TaskSchema, TaskListSchema } from '../../src/schemas/taskSchema';

describe('API Contract - Tasks', () => {
  it('la respuesta de GET /tasks cumple con el esquema esperado', () => {
    const apiResponse = [
      { id: '1', title: 'Tarea 1', status: 'pending' },
      { id: '2', title: 'Tarea 2', status: 'completed' },
    ];
    const result = TaskListSchema.safeParse(apiResponse);
    expect(result.success).toBe(true);
  });

  it('detecta cuando la API devuelve un campo con tipo incorrecto', () => {
    const invalidResponse = { id: 123, title: 'Test', status: 'pending' };
    const result = TaskSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });

  it('detecta cuando la API omite un campo requerido', () => {
    const incompleteResponse = { id: '1', status: 'pending' };
    const result = TaskSchema.safeParse(incompleteResponse);
    expect(result.success).toBe(false);
  });

  it('detecta cuando la API envía un status inválido', () => {
    const invalidStatus = { id: '1', title: 'Test', status: 'archived' };
    const result = TaskSchema.safeParse(invalidStatus);
    expect(result.success).toBe(false);
  });
});
