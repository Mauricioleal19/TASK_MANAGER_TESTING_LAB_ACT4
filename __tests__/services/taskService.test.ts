import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import { createTask, fetchTasks } from '../../src/services/taskService';

const API_URL = 'https://api.taskmanager.com';

describe('taskService contra la API falsa', () => {
  it('crea la tarea con lo que responde la API', async () => {
    const task = await createTask('Comprar pan');
    expect(task).toMatchObject({ title: 'Comprar pan', status: 'pending' });
  });

  it('la tarea creada aparece en el GET', async () => {
    await createTask('Comprar pan');
    await expect(fetchTasks()).resolves.toHaveLength(1);
  });

  it('lanza error cuando POST /tasks falla', async () => {
    server.use(http.post(`${API_URL}/tasks`, () => new HttpResponse(null, { status: 500 })));
    await expect(createTask('X')).rejects.toThrow('Error al crear la tarea');
  });

  it('lanza error cuando GET /tasks falla', async () => {
    server.use(http.get(`${API_URL}/tasks`, () => new HttpResponse(null, { status: 500 })));
    await expect(fetchTasks()).rejects.toThrow('Error al obtener las tareas');
  });
});
