// eslint.config.js
// Configuración de ESLint (flat config, ESLint 9) para el proyecto Task Manager.
//
// Extiende la configuración base de Expo (eslint-config-expo/flat) y agrega
// eslint-plugin-jsx-a11y, usado en la Unidad 3 como herramienta ESTÁTICA y
// PREVENTIVA de accesibilidad: analiza el JSX sin ejecutar la aplicación y
// advierte sobre componentes que carecen de propiedades accesibles.
const expoConfig = require('eslint-config-expo/flat');
const jsxA11y = require('eslint-plugin-jsx-a11y');

module.exports = [
  ...expoConfig,
  jsxA11y.flatConfigs.recommended,
  {
    rules: {
      // 'recommended' asume elementos HTML (<img>, <a>, <button>...).
      // En React Native los componentes son View/Text/Pressable, así que
      // se baja a 'warn' para que el análisis quede documentado sin romper
      // el build por reglas pensadas para el DOM web.
      'jsx-a11y/accessible-emoji': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
    },
  },
  {
    // Archivos de configuración de Node (no código de la app): quedan fuera
    // del alcance de esta verificación de accesibilidad.
    ignores: [
      'node_modules/**',
      'coverage/**',
      'android/**',
      '.expo/**',
      '*.config.js',
      'jest.setup.js',
    ],
  },
];
