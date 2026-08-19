import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACCESOS: { href: string; titulo: string; descripcion: string; className: string }[] = [
  {
    href: '/todo',
    titulo: 'Flujo Todo List',
    descripcion: 'Crear, completar y eliminar tareas',
    className: 'bg-blue-600 active:bg-blue-700',
  },
  {
    href: '/checkout',
    titulo: 'Flujo Transaccional',
    descripcion: 'Datos de usuario, envío y pago',
    className: 'bg-emerald-600 active:bg-emerald-700',
  },
];

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 justify-center gap-4 bg-gray-50 p-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
    >
      <Text className="mb-2 text-3xl font-bold text-gray-900">Task Manager</Text>
      {ACCESOS.map((a) => (
        <Link key={a.href} href={a.href as Href} asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={a.titulo}
            className={`rounded-2xl p-6 ${a.className}`}
          >
            <Text className="text-xl font-semibold text-white">{a.titulo}</Text>
            <Text className="mt-1 text-sm text-white/80">{a.descripcion}</Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}
