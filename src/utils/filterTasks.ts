import { Task, TaskStatus } from '../types';

export type FilterStatus = TaskStatus | 'all' | 'archived';

const VALID: FilterStatus[] = ['pending', 'completed', 'all', 'archived'];

export function filterTasksByStatus(tasks: Task[], status: FilterStatus): Task[] {
  if (!VALID.includes(status)) {
    throw new Error(`Estado inválido: ${status}`);
  }
  if (status === 'all') return tasks;
  return tasks.filter((t) => t.status === status);
}
