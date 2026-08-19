import { Task } from '../types';

// ponytail: no hay backend real; intercepta fetch() a mano en runtime para que
// la app funcione sola (los tests siguen usando MSW en src/mocks/server.ts, sin tocar).
const API_URL = 'https://api.taskmanager.com';

let tasks: Task[] = [];
const originalFetch = global.fetch;

global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : (input as Request).url ?? String(input);
  const method = (init?.method ?? 'GET').toUpperCase();

  if (url === `${API_URL}/tasks` && method === 'GET') {
    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (url === `${API_URL}/tasks` && method === 'POST') {
    const { title } = JSON.parse((init?.body as string) ?? '{}');
    const task: Task = { id: String(tasks.length + 1), title, status: 'pending' };
    tasks.push(task);
    return new Response(JSON.stringify(task), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return originalFetch(input, init);
}) as typeof fetch;
