/**
 * __tests__/integration/CreateTaskScreen.test.tsx
 *
 * Tipo de prueba: INTEGRACIÓN (React Testing Library + MSW).
 *
 * A diferencia de una prueba unitaria, aquí NO se mockean el componente
 * CreateTaskScreen, el hook useCreateTask ni el servicio taskService: todos
 * se ejecutan con su implementación real. Lo único que se simula es la
 * frontera del sistema (la petición HTTP hacia https://api.taskmanager.com)
 * mediante MSW, que intercepta la llamada a nivel de red sin reemplazar
 * ningún módulo interno de la aplicación (mocking selectivo).
 *
 * Esto permite detectar bugs de integración que una prueba unitaria no
 * vería: por ejemplo, que el formulario invoque el hook con los argumentos
 * correctos, que el hook arme bien la petición y que la pantalla reaccione
 * al estado (success/error) actualizando la interfaz.
 *
 * Escenarios cubiertos (criterio de evaluación de la Unidad 3):
 *   1. Éxito (happy path)      -> MSW responde 201 con la tarea creada.
 *   2. Error del servidor      -> MSW responde 500.
 *   3. Datos vacíos            -> el usuario intenta guardar sin título.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { http, HttpResponse } from 'msw';
import { server } from '../../src/mocks/server';
import { CreateTaskScreen } from '../../src/screens/CreateTaskScreen';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <CreateTaskScreen />
    </SafeAreaProvider>
  );

describe('CreateTaskScreen - Integración', () => {
  // useCreateTask persiste las tareas en AsyncStorage; sin limpiarlo, una
  // tarea creada en un test "sobrevive" al siguiente render y contamina
  // los escenarios de error/datos vacíos con estado de una prueba anterior.
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  // Prueba de integración (escenario: éxito / happy path).
  // Verifica el flujo completo dentro de la pantalla: el usuario escribe un
  // título -> TaskForm llama a useCreateTask.submit -> el hook llama a
  // taskService.createTask -> MSW responde 201 -> la pantalla muestra el
  // banner de confirmación. Todas las capas internas son reales; solo la
  // respuesta del servidor está simulada.
  it('crea una tarea exitosamente y muestra confirmación', async () => {
    await renderScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Estudiar pruebas de integración'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Tarea creada exitosamente')).toBeTruthy();
    });
  });

  // Prueba de integración (escenario: error del servidor).
  // Sobrescribe el handler de MSW solo para este test para que POST /tasks
  // devuelva 500, y valida que la pantalla maneje el rechazo de la promesa
  // mostrando el banner de error y SIN agregar la tarea fallida a la lista
  // (efecto colateral que solo se detecta con el componente real montado).
  it('muestra el banner de error si la API falla', async () => {
    server.use(
      http.post('https://api.taskmanager.com/tasks', () => new HttpResponse(null, { status: 500 }))
    );
    await renderScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText('Escribe el título de la tarea'),
      'Tarea que no se guarda'
    );
    await fireEvent.press(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Error al crear la tarea')).toBeTruthy();
    });
    expect(screen.queryByText('Tarea que no se guarda')).toBeNull();
  });

  // Prueba de integración (escenario: datos vacíos).
  // Registra un espía sobre el handler POST /tasks de MSW para comprobar
  // que, cuando el usuario presiona "Guardar" sin escribir un título, la
  // validación real de TaskForm detiene el flujo ANTES de llegar a la red:
  // no se dispara la petición HTTP, no aparece ningún banner (ni éxito ni
  // error) y la lista permanece en su estado vacío ("No hay tareas aún").
  it('no crea una tarea ni llama a la API cuando el título está vacío', async () => {
    const requestSpy = jest.fn();
    server.events.on('request:start', ({ request }) => {
      if (request.method === 'POST') requestSpy(request.url);
    });

    await renderScreen();

    expect(screen.getByText('No hay tareas aún')).toBeTruthy();

    await fireEvent.press(screen.getByText('Guardar'));

    expect(requestSpy).not.toHaveBeenCalled();
    expect(screen.queryByText('Tarea creada exitosamente')).toBeNull();
    expect(screen.queryByText('Error al crear la tarea')).toBeNull();
    expect(screen.getByText('No hay tareas aún')).toBeTruthy();
  });
});
