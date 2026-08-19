import { validateTaskTitle } from '../../src/utils/validateTask';

describe('validateTaskTitle', () => {
  describe('cuando el título es válido', () => {
    it('retorna null para un título con longitud válida', () => {
      expect(validateTaskTitle('Comprar leche')).toBeNull();
    });

    it('retorna null para un título con exactamente 3 caracteres', () => {
      expect(validateTaskTitle('Abc')).toBeNull();
    });

    it('retorna null para un título con exactamente 100 caracteres', () => {
      const titulo100 = 'A'.repeat(100);
      expect(validateTaskTitle(titulo100)).toBeNull();
    });
  });

  describe('cuando el título es inválido', () => {
    it('retorna mensaje de error para un string vacío', () => {
      expect(validateTaskTitle('')).toBe('El título es obligatorio');
    });

    it('retorna mensaje de error para un string con solo espacios', () => {
      expect(validateTaskTitle('   ')).toBe('El título es obligatorio');
    });

    it('retorna mensaje de error para un título con menos de 3 caracteres', () => {
      expect(validateTaskTitle('Ab')).toBe('El título debe tener al menos 3 caracteres');
    });

    it('retorna mensaje de error para un título con más de 100 caracteres', () => {
      const titulo101 = 'A'.repeat(101);
      expect(validateTaskTitle(titulo101)).toBe('El título no puede exceder los 100 caracteres');
    });
  });
});
