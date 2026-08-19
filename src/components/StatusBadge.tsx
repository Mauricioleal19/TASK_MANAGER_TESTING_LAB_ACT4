import { Pressable, Text } from "react-native";

// src/components/StatusBadge.tsx
export function StatusBadge({ status }: { status: 'completed' | 'pending' }) {
  const label = status === 'completed' ? 'Completada' : 'Pendiente';
  const icon = status === 'completed' ? '✓' : '○';

  return (
    <Pressable accessibilityLabel={`Estado: ${label}`}>
      <Text>{icon} {label}</Text>
      {/* En caso de que status sea estrictamente igual a 'completed' */}
      {/* ✓ Completada */}

      {/* En caso de que status sea diferente a 'completed' */}
      {/* ○ Pendiente */}
    </Pressable>
  );
}