/**
 * __perf__/TaskList.perf-test.tsx
 *
 * Tipo de prueba: RENDIMIENTO (Reassure).
 *
 * A diferencia de las pruebas funcionales (que verifican QUÉ hace el
 * componente), esta prueba mide CUÁNTO TARDA en renderizarse: ejecuta el
 * montaje de TaskList con 100 tareas varias veces dentro de Jest y calcula
 * estadísticas de duración (media, desviación, conteo de renders). No hace
 * ningún `expect` — Reassure no falla el test por un umbral fijo, sino que
 * compara el resultado contra una medición base (baseline) para detectar
 * regresiones de rendimiento entre versiones del código.
 *
 * Se ejecuta con `npm run perf` (CLI de Reassure), no con `npm test`: vive
 * fuera de __tests__/ y usa el sufijo .perf-test.tsx a propósito para que
 * Jest normal no la recoja (correrla 10+ veces por medición volvería lenta
 * la suite funcional).
 *
 * Métrica clave que cubre (Unidad 4, punto 2 de la actividad): tiempo de
 * renderizado de una lista con volumen realista de datos. Es la contraparte
 * "en Jest, sin emulador" de medir el tiempo de arranque en un dispositivo
 * real (esa segunda métrica se documenta con Maestro Cloud, ver
 * .maestro/tiempo_arranque.yaml).
 */
import React from 'react';
import { measureRenders } from 'reassure';
import { TaskList } from '../src/components/TaskList';

test(
  'TaskList renderiza 100 tareas en tiempo aceptable',
  async () => {
    const tasks = Array.from({ length: 100 }, (_, i) => ({
      id: String(i),
      title: `Tarea ${i}`,
      status: 'pending' as const,
    }));

    await measureRenders(<TaskList tasks={tasks} />);
  },
  // Reassure repite el render ~10 veces para calcular estadísticas; con 100
  // elementos eso supera el timeout por defecto de Jest (5000ms).
  60000
);
