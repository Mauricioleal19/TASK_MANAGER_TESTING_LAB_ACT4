# Guía de Maestro Cloud (E2E)

Este proyecto usa **[Maestro](https://maestro.mobile.dev)** para pruebas end-to-end sobre el APK compilado, ejecutadas en **Maestro Cloud** (no contra un emulador local). A diferencia de los tests de `TESTING.md` (Jest + MSW, corren contra código fuente), estos flujos corren contra la **app real instalada**, sin backend real disponible.

## 1. Requisitos previos (configuración de máquina, fuera del repo)

Nada de esto vive en el repositorio — es configuración local de cada máquina que vaya a ejecutar `maestro cloud`.

| Qué | Cómo se configura | Notas |
|---|---|---|
| CLI de Maestro | Se instala en `%USERPROFILE%\.maestro\bin` | Agregar esa carpeta al **PATH de usuario** de Windows; si no, PowerShell tira `CommandNotFoundException` al llamar `maestro`. |
| API Key de Maestro Cloud | Variable de entorno `MAESTRO_CLOUD_API_KEY` (nivel Usuario) | El CLI la lee sola — no hace falta pasar `--api-key` en el comando. **Nunca** debe ir en un archivo del repo ni en `app.json`. |
| APK de release | Se compila aparte (Gradle / `expo run:android`) | No hay `eas.json` en este proyecto; el APK se genera manualmente y se referencia con `--app-file`. |

### Verificar que el CLI está disponible
```powershell
maestro --version
```
Si falla con `CommandNotFoundException`, revisa el PATH:
```powershell
Get-Command maestro -ErrorAction SilentlyContinue
[Environment]::GetEnvironmentVariable("PATH","User") -split ';' | Select-String maestro
```

## 2. Ejecutar un flujo

```powershell
maestro cloud --app-file="android/app/build/outputs/apk/release/app-release.apk" --flows=".maestro/crear_tarea.yaml"
```

- `--app-file`: ruta al APK de **release** (no debug — el mock de red descrito en la sección 4 solo se activa en el bundle JS empaquetado, funciona igual en ambos, pero release es lo que se sube a producción).
- `--flows`: ruta a un archivo `.yaml` dentro de `.maestro/`, o al directorio completo para correr todos.

## 3. Qué pasa desde que ejecutas el comando hasta que Maestro Cloud entrega el resultado

1. **El CLI local prepara el envío**
   - Lee `--app-file` y valida que el APK exista en esa ruta.
   - Lee `--flows` y parsea el/los `.yaml`, validando el `appId` (`com.taskmanager.app`).
   - Toma `MAESTRO_CLOUD_API_KEY` del entorno para autenticarse — sin token válido, el upload se rechaza antes de ejecutar nada.

2. **Upload al backend de Maestro Cloud**
   - El CLI sube por HTTPS el **APK** (`app-release.apk`) y el **flujo** (`.yaml`).
   - Maestro Cloud crea una "run" y devuelve un ID/URL de esa ejecución (el link que aparece en la terminal).

3. **Aprovisionamiento del dispositivo**
   - Maestro Cloud levanta un dispositivo real o emulador administrado en su infraestructura (no tu máquina).
   - Instala el APK subido tal cual quedó compilado, con todo su código incluido — incluido el mock de [runtimeFetch.ts](src/mocks/runtimeFetch.ts). El device farm no simula tu backend: corre literalmente la app que compilaste, por eso el mock en runtime es indispensable.

4. **Ejecución del flujo paso a paso**
   - El motor de Maestro interpreta el `.yaml` línea por línea sobre ese dispositivo: `launchApp`, `assertVisible`, `tapOn`, `inputText`, etc.
   - Cada paso actúa sobre la UI real, usando los `testID` de los componentes para ubicar elementos.
   - Si un `assertVisible` o `tapOn` no encuentra su elemento dentro del timeout, ese paso (y la run) se marca como fallido — así se detectó el problema del teclado tapando `input-numero-tarjeta`.
   - Se graban screenshots de cada paso y, opcionalmente, video de toda la corrida.

5. **Recolección de resultados**
   - Al terminar, Maestro Cloud consolida estado por paso, capturas, video, logs de la app y tiempo total, y lo publica en su dashboard web asociado al ID de la run.

6. **El CLI reporta de vuelta a la terminal**
   - Mientras el dispositivo remoto ejecuta, el CLI queda esperando (polling) el resultado.
   - Al finalizar, imprime el resumen (pass/fail por flujo) y el link al reporte detallado.
   - El exit code refleja si el flujo pasó (`0`) o falló (`≠0`) — relevante si esto se conecta a CI en el futuro.

```
Tu terminal (PowerShell)
   │  maestro cloud --app-file=... --flows=...
   ▼
CLI local: valida archivos + autentica con MAESTRO_CLOUD_API_KEY
   ▼
Upload (APK + .yaml) → Maestro Cloud (nube)
   ▼
Maestro Cloud aprovisiona un dispositivo real/emulado
   ▼
Instala el APK real (con runtimeFetch.ts ya compilado adentro)
   ▼
Ejecuta el flujo paso a paso (tapOn/inputText/assertVisible sobre testID reales)
   ▼
Graba screenshots/video + resultado por paso
   ▼
Dashboard de Maestro Cloud (reporte completo)
   ▼
CLI recibe el resultado final → lo imprime en tu terminal
```

## 4. Flujos disponibles (`.maestro/`)

| Archivo | Qué prueba | Origen |
|---|---|---|
| [crear_tarea.yaml](.maestro/crear_tarea.yaml) | Crear una tarea desde cero | Scaffold inicial, ajustado para navegación |
| [crear_y_eliminar_tarea.yaml](.maestro/crear_y_eliminar_tarea.yaml) | Crear una tarea y luego eliminarla | Nuevo — flujo transaccional |
| [flujo_completo_tareas.yaml](.maestro/flujo_completo_tareas.yaml) | Validación de guardado vacío + creación exitosa | Scaffold inicial, ajustado para navegación |
| [flujo_transaccional.yaml](.maestro/flujo_transaccional.yaml) | Checkout completo: datos de usuario, envío y pago | Nuevo — flujo transaccional |

Todos usan `appId: com.taskmanager.app`, que viene de `android.package` / `ios.bundleIdentifier` en [app.json](app.json#L14-L18).

## 5. Qué hace posible que los flujos encuentren elementos en pantalla

### `testID`s en los componentes
Cada `tapOn: { id: "..." }` de un flujo apunta a un `testID` puesto explícitamente en el componente:

| `id` en el flujo | Componente |
|---|---|
| `input-titulo` | [TaskForm.tsx:20](src/components/TaskForm.tsx#L20) |
| `input-nombre`, `input-email`, `input-telefono` | [UserInfoSection.tsx:22-38](src/components/UserInfoSection.tsx#L22-L38) |
| `input-direccion`, `input-ciudad`, `input-codigo-postal` | [ShippingInfoSection.tsx:22-36](src/components/ShippingInfoSection.tsx#L22-L36) |
| `input-titular`, `input-numero-tarjeta`, `input-vencimiento`, `input-cvv` | [PaymentInfoSection.tsx:23-45](src/components/PaymentInfoSection.tsx#L23-L45) |

### `hideKeyboard` entre campos
En `flujo_transaccional.yaml` hay muchos campos apilados verticalmente. El teclado abierto de un campo tapaba el siguiente, y `scrollUntilVisible` no lo encontraba. Se agregó `hideKeyboard` después de cada `inputText`.

## 6. Mock de backend en runtime (release build)

La app llama a `https://api.taskmanager.com`, que **no existe**. En Jest esto se cubre con MSW (`src/mocks/server.ts`), pero un APK de release no corre Jest — necesita su propio mock:

- [src/mocks/runtimeFetch.ts](src/mocks/runtimeFetch.ts) — sobreescribe `global.fetch` para responder `GET/POST /tasks` con datos en memoria, replicando lo que hace MSW en los tests.
- Se activa importándolo una sola vez en [app/_layout.tsx:2](app/_layout.tsx#L2).

Sin este mock, cualquier flujo que cree una tarea fallaba en Maestro Cloud porque la petición real nunca respondía.

## 7. Qué NO está configurado todavía

- **CI**: [.github/workflows/tests.yml](.github/workflows/tests.yml) solo corre `jest --coverage`; no invoca `maestro cloud`. La ejecución en la nube es manual.
- **Build automatizado**: no hay `eas.json` ni script de `package.json` para generar el APK de release; se genera aparte.
- **Secret en CI**: si se automatiza en GitHub Actions, `MAESTRO_CLOUD_API_KEY` debería ir como *repository secret* (`Settings → Secrets → Actions`), nunca hardcodeada.

## 8. Historial relevante

| Commit | Qué cambió |
|---|---|
| `e99df08` Initial commit | Flujos básicos para app de una sola pantalla (sin navegación) |
| `39667b5` Agregando flujo transaccional | App pasa a multi-pantalla; se agregan `crear_y_eliminar_tarea.yaml` y `flujo_transaccional.yaml`; se agregan los `testID` de checkout |
| `1b856d6` Downgrade Expo SDK 54.0.2 | Prerequisito indirecto: hace compilable el APK contra el que corren los flujos |
| `8d3be68` Fix Maestro Cloud E2E flows | Se agrega `runtimeFetch.ts` (mock de red en release) y `hideKeyboard` en el flujo transaccional, para que los 4 flujos pasen contra un build de release real |
