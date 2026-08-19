describe('Configuración del entorno', () => {
  it('Jest está funcionando correctamente', () => {
    expect(1 + 1).toBe(2);
  });

  it('Los matchers básicos funcionan', () => {
    const tasks = ['Comprar leche', 'Estudiar React Native'];
    expect(tasks).toContain('Comprar leche');
    expect(tasks).toHaveLength(2);
  });
});
