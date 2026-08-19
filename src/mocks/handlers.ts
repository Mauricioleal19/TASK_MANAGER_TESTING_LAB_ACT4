import { http, HttpResponse } from 'msw';
import { Task } from '../types';

const API_URL = 'https://api.taskmanager.com';

// ponytail: la "API falsa" es un array en memoria; resetTasks lo limpia entre tests
let tasks: Task[] = [];

export const resetTasks = () => {
  tasks = [];
};

export const handlers = [
  http.post(`${API_URL}/tasks`, async ({ request }) => {
    const { title } = (await request.json()) as { title: string };
    const task: Task = { id: String(tasks.length + 1), title, status: 'pending' };
    tasks.push(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  http.get(`${API_URL}/tasks`, () => HttpResponse.json(tasks)),
];
