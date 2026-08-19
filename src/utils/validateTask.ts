export function validateTaskTitle(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return 'El título es obligatorio';
  }
  if (title.trim().length < 3) {
    return 'El título debe tener al menos 3 caracteres';
  }
  if (title.trim().length > 100) {
    return 'El título no puede exceder los 100 caracteres';
  }
  return null; // null indica que no hay errores
}
