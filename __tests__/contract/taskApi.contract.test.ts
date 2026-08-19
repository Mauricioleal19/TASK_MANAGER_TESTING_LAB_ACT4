/**
 * __tests__/contract/taskApi.contract.test.ts
 *
 * Tipo de prueba: CONTRATO DE API (Zod, sin red real ni MSW).
 *
 * El contrato es el acuerdo entre la app (consumidor) y el backend
 * (proveedor) sobre la forma de los datos: qué campos existen, sus tipos y
 * los valores permitidos. Estas pruebas no hacen ninguna petición HTTP —
 * toman objetos JSON literales que representan posibles respuestas del
 * servidor y los validan contra el esquema definido en
 * src/schemas/taskSchema.ts (TaskSchema / TaskListSchema). Si el backend
 * cambiara la forma de su respuesta (p. ej. renombrar `title` a `taskName`,
 * o dejar de mandar `status`), estas pruebas lo detectarían sin necesidad de
 * levantar la app.
 *
 * Endpoints cubiertos: GET /tasks (lista) y POST /tasks (tarea creada) — ver
 * src/services/taskService.ts y src/mocks/handlers.ts, que devuelven ambos
 * la misma forma de Task.
 */
import { TaskSchema, TaskListSchema } from '../../src/schemas/taskSchema';

describe('API Contract - Tasks', () => {
  // Escenario válido — GET /tasks.
  it('la respuesta de GET /tasks cumple con el esquema esperado', () => {
    const apiResponse = [
      { id: '1', title: 'Tarea 1', status: 'pending' },
      { id: '2', title: 'Tarea 2', status: 'completed' },
    ];
    const result = TaskListSchema.safeParse(apiResponse);
    expect(result.success).toBe(true);
  });

  // Escenario válido — POST /tasks (tarea recién creada, tal como la
  // devuelve el handler de src/mocks/handlers.ts).
  it('la respuesta de POST /tasks (tarea creada) cumple con el esquema esperado', () => {
    const createdTask = { id: '3', title: 'Nueva tarea', status: 'pending' };
    const result = TaskSchema.safeParse(createdTask);
    expect(result.success).toBe(true);
  });

  // Escenario inválido — tipo de dato incorrecto en un campo.
  it('detecta cuando la API devuelve un campo con tipo incorrecto', () => {
    const invalidResponse = { id: 123, title: 'Test', status: 'pending' };
    const result = TaskSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });

  // Escenario inválido — falta un campo requerido por el contrato.
  it('detecta cuando la API omite un campo requerido', () => {
    const incompleteResponse = { id: '1', status: 'pending' };
    const result = TaskSchema.safeParse(incompleteResponse);
    expect(result.success).toBe(false);
  });

  // Escenario inválido — valor fuera del enum acordado para `status`.
  it('detecta cuando la API envía un status inválido', () => {
    const invalidStatus = { id: '1', title: 'Test', status: 'archived' };
    const result = TaskSchema.safeParse(invalidStatus);
    expect(result.success).toBe(false);
  });
});
