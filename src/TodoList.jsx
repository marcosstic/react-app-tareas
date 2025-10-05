import React from 'react'; // Ya no necesita useState
import TodoItem from './TodoItem';

// 1. El componente ahora recibe 'props'.
function TodoList(props) {
  // 2. Extraemos el array de tareas de las props que nos pasa el padre (App.jsx).
  const { tareas } = props;

  return (
    <div className="card">
      <h2>Mi Lista de Tareas</h2>
      <ul>
        {/* 3. Aquí está la magia: Mapeamos el array de datos a componentes */}
        {
          tareas.map(tarea => (
            // 4. Para cada 'tarea' en el array, creamos un componente TodoItem.
            // Le pasamos el texto, el ID y la función onDelete.
            <TodoItem 
              key={tarea.id} 
              id={tarea.id} 
              texto={tarea.texto} 
              completada={tarea.completada}
              onDelete={props.onDelete}
              onToggleComplete={props.onToggleComplete}
              onUpdate={props.onUpdate}
              animate={tarea.animate}
            />
          ))
        }
      </ul>
    </div>
  );
}

export default TodoList;
