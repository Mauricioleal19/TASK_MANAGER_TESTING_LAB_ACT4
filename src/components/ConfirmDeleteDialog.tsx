import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

interface ConfirmDeleteDialogProps {
  visible: boolean;
  taskTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteDialog({
  visible,
  taskTitle,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View
        testID="confirm-delete-dialog"
        className="flex-1 items-center justify-center bg-black/40 p-6"
        // Contiene el foco del lector de pantalla dentro del diálogo mientras
        // está visible, para que VoiceOver/TalkBack no navegue al contenido
        // de la pantalla que quedó debajo (iOS: accessibilityViewIsModal).
        accessibilityViewIsModal
      >
        <View className="w-full max-w-sm rounded-xl bg-white p-5">
          <Text className="text-lg font-bold text-gray-900">Eliminar tarea</Text>
          <Text className="mt-2 text-sm text-gray-600">
            ¿Seguro que quieres eliminar {taskTitle ? `"${taskTitle}"` : 'esta tarea'}? Esta acción no
            se puede deshacer.
          </Text>
          <View className="mt-5 flex-row justify-end gap-3">
            <Pressable
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
              className="rounded-lg px-4 py-2 active:bg-gray-100"
            >
              <Text className="text-base font-medium text-gray-600">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel="Confirmar eliminación"
              className="rounded-lg bg-red-600 px-4 py-2 active:bg-red-700"
            >
              <Text className="text-base font-semibold text-white">Eliminar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
