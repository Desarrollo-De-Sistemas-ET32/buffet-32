"use client";

import React from 'react';
import useUserStore from '../stores/useUserStore';

const UserList: React.FC = () => {
  const { users, addUser, removeUser, isLoading, error } = useUserStore();

  const handleAddUser = () => {
    addUser({
      id: Date.now(),
      name: 'Nuevo Usuario',
      email: 'nuevo@ejemplo.com',
      role: 'user',
    });
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
      <button
        onClick={handleAddUser}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Agregar Usuario
      </button>
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between border p-2 rounded"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500">Role: {user.role}</p>
            </div>
            <button
              onClick={() => removeUser(user.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList; 