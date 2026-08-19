import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
}

export function TaskList({ tasks, onDelete = () => {}, onToggle = () => {} }: TaskListProps) {
  if (tasks.length === 0) {
    return <Text className="py-6 text-center text-base text-gray-500">No hay tareas aún</Text>;
  }

  return (
    <View>
      <Text className="mb-2 text-sm font-medium text-gray-500">
        {tasks.length === 1 ? '1 tarea' : `${tasks.length} tareas`}
      </Text>
      <FlatList
        data={tasks}
        // sin esto el ScrollView se come el primer tap en una tarjeta mientras el teclado está abierto
        keyboardShouldPersistTaps="handled"
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TaskCard task={item} onDelete={onDelete} onToggle={onToggle} />}
      />
    </View>
  );
}
