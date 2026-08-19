import React, { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';

interface TaskFormProps {
  onSubmit: (title: string) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title);
    setTitle('');
  };

  return (
    <View className="gap-3">
      <TextInput
        testID="input-titulo"
        placeholder="Escribe el título de la tarea"
        placeholderTextColor="#9ca3af"
        value={title}
        onChangeText={setTitle}
        accessibilityLabel="Título de la tarea"
        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900"
      />
      <Pressable
        onPress={handleSubmit}
        accessibilityRole="button"
        className="rounded-lg bg-blue-600 py-3 active:bg-blue-700"
      >
        <Text className="text-center text-base font-semibold text-white">Guardar</Text>
      </Pressable>
    </View>
  );
}
