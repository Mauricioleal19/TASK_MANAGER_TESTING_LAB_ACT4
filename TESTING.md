# Guía de Testing

Este proyecto usa **Jest** (vía `jest-expo`) + **@testing-library/react-native** + **MSW** (Mock Service Worker) + **Zod**. Referencia rápida de qué hace cada función usada en `__tests__/`.

## Estructura de un test

- **`describe(nombre, fn)`** — agrupa tests relacionados (un archivo puede tener varios).
- **`it(nombre, fn)`** — define un caso de prueba individual. `test` es un alias.
- **`beforeEach(fn)` / `afterEach(fn)` / `beforeAll(fn)` / `afterAll(fn)`** — hooks que corren antes/después de cada test o de toda la suite. Se usan aquí para resetear mocks (`mockOnDelete.mockClear()`) y para levantar/apagar el servidor mock de MSW (`jest.setup.js`).

## Assertions (`expect`)

`expect(valor).matcher()` compara un resultado con lo esperado y falla el test si no coincide.

| Matcher | Para qué sirve |
|---|---|
| `.toBe(x)` | Igualdad estricta (`===`), para primitivos. |
| `.toEqual(x)` | Igualdad profunda (estructura), para objetos/arrays. |
| `.toBeNull()` | Verifica que el valor sea `null`. |
| `.toBeTruthy()` | Verifica que el valor sea "verdadero" (útil junto con `getByText`, que lanza si no encuentra el elemento). |
| `.toContain(x)` | El array/string contiene `x`. |
| `.toHaveLength(n)` | El array/string tiene longitud `n`. |
| `.toThrow()` | La función lanza un error al ejecutarla. |
| `.toHaveBeenCalledWith(...)` | Un mock (`jest.fn()`) fue llamado con esos argumentos. |
| `.toHaveBeenCalledTimes(n)` | Un mock fue llamado exactamente `n` veces. |
| `.not.toHaveBeenCalled()` | El mock no fue llamado nunca. |

## Mocks

- **`jest.fn()`** — crea una función falsa que registra sus llamadas (usada como `onSubmit`, `onDelete`, `onConfirm`, etc. para verificar que un componente llama al callback correcto sin depender de lógica real).
- **`mock.mockClear()`** — limpia el historial de llamadas del mock entre tests, para que un test no "vea" llamadas de otro (`__tests__/components/TaskCard.test.tsx`).

## Renderizado de componentes (`@testing-library/react-native`)

- **`render(<Componente />)`** — monta un componente en un árbol de prueba (como si fuera una pantalla real) y permite consultarlo después.
- **`screen`** — objeto global que expone los métodos de búsqueda (`getByText`, etc.) sobre lo último renderizado, sin tener que guardar la referencia de `render`.
- **Consultas (`getBy*` / `queryBy*`)**:
  - `getByText(texto)` — busca un elemento por su texto visible; **lanza error** si no lo encuentra (úsalo cuando el elemento *debe* existir).
  - `queryByText(texto)` — igual, pero devuelve `null` en vez de lanzar (úsalo cuando quieres afirmar que **no** existe, ej. `expect(...).toBeNull()`).
  - `getByPlaceholderText(texto)` — busca un `TextInput` por su placeholder.
  - `getByLabelText(texto)` — busca por `accessibilityLabel` (clave para tests de accesibilidad).
  - `getByRole(rol)` — busca por rol de accesibilidad (`button`, etc.).
- **`fireEvent.changeText(input, texto)`** — simula que el usuario escribe en un campo.
- **`fireEvent.press(elemento)`** — simula un tap/click.
- **`waitFor(fn)`** — reintenta `fn` (con sus `expect` dentro) hasta que pase o se agote el timeout; necesario para asserts sobre efectos asíncronos (ej. esperar un mensaje de confirmación tras guardar).

## Hooks (`renderHook`, `act`)

- **`renderHook(() => miHook())`** — "monta" un custom hook fuera de un componente visual, devolviendo `result.current` con lo que el hook retorna.
- **`act(fn)`** — envuelve actualizaciones de estado (ej. llamar `addTask(...)`) para que React procese los cambios antes de que el test siga y lea `result.current` actualizado.

## Contract testing (Zod)

- **`Schema.safeParse(dato)`** — valida un dato contra un esquema Zod sin lanzar excepción; devuelve `{ success, data | error }`. Se usa en `__tests__/contract/taskApi.contract.test.ts` para comprobar que la respuesta de la API (real o mockeada) cumple el contrato esperado (tipos correctos, campos requeridos, valores de enum válidos).

## Mocking de red (MSW)

- **`setupServer(...handlers)`** (`src/mocks/server.ts`) — crea un servidor que intercepta peticiones HTTP en Node durante los tests.
- **`server.listen()` / `server.resetHandlers()` / `server.close()`** (en `jest.setup.js`) — arrancan la intercepción antes de la suite, la resetean entre tests (para que un test no filtre handlers a otro) y la apagan al final.

## Tipos de test en este proyecto

- **Unitarios** (`utils/`, `hooks/useCounter`) — funciones puras o hooks simples, sin dependencias externas.
- **De componentes** (`components/`) — renderizan un componente aislado y verifican su salida/interacción.
- **De integración** (`integration/CreateTaskScreen.test.tsx`) — renderizan una pantalla completa con sus dependencias (navegación, contexto) para probar un flujo de usuario.
- **De contrato** (`contract/`) — validan que los datos que entran/salen cumplen el esquema acordado con el backend.
- **De accesibilidad** (`accessibility/`) — verifican `accessibilityLabel`/`role` para que la app sea usable con lectores de pantalla.
