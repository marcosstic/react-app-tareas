const API_URL = 'http://localhost:3001/tareas';

// Obtener todas las tareas
export const getTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener las tareas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getTasks:', error);
    throw error;
  }
};

// Crear una nueva tarea
export const createTask = async (task) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Error al crear la tarea');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createTask:', error);
    throw error;
  }
};

// Actualizar una tarea existente
export const updateTask = async (id, task) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar la tarea');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateTask:', error);
    throw error;
  }
};

// Eliminar una tarea
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar la tarea');
    }
    return id; // Devolvemos el ID de la tarea eliminada
  } catch (error) {
    console.error('Error en deleteTask:', error);
    throw error;
  }
};
