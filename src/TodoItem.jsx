import React, { useState } from 'react';

// Este componente solo se preocupa de cómo se ve UNA tarea.
// Recibe el texto de la tarea y su estado de completado como props.
const TodoItem = (props) => {
  const { 
    id, 
    texto, 
    completada, 
    onDelete, 
    onToggleComplete,
    onUpdate
  } = props;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(texto);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (editedText.trim()) {
      onUpdate(id, editedText);
      setIsEditing(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditedText(texto);
      setIsEditing(false);
    }
  };

  // Función que se ejecutará al hacer clic en el botón de eliminar.
  const handleDelete = (e) => {
    e.stopPropagation(); // Evita que el evento se propague al contenedor
    props.onDelete(props.id);
  };

  // Función que se ejecutará al cambiar el estado del checkbox
  const handleToggleComplete = () => {
    props.onToggleComplete(props.id);
  };

  // Determinar la clase de animación basada en las props
  const getAnimationClass = () => {
    if (props.animate === 'exit') return 'task-exit';
    if (props.animate === 'enter') return 'task-enter';
    if (props.animate === 'pulse') return 'task-complete';
    return '';
  };

  return (
    <div 
      role="listitem"
      aria-label={`Tarea: ${texto}, ${completada ? 'completada' : 'pendiente'}`}
      className={`task-item ${getAnimationClass()}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        margin: '5px 0',
        backgroundColor: completada ? '#f0f0f0' : 'white',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        opacity: props.animate === 'exit' ? 0 : 1,
        transform: props.animate === 'exit' ? 'translateX(100%)' : 'translateX(0)'
      }}
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleComplete(id);
        }
      }}
      onAnimationEnd={() => {
        // Limpiar la clase de animación después de que termine
        if (props.animate === 'pulse') {
          // Aquí podríamos limpiar la propiedad de animación si fuera necesario
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          id={`task-${id}`}
          checked={completada}
          onChange={() => onToggleComplete(id)}
          aria-label={completada ? 'Marcar como pendiente' : 'Marcar como completada'}
          style={{
            marginRight: '10px',
            cursor: 'pointer',
            transform: 'scale(1.2)'
          }}
        />
        
        {isEditing ? (
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{
              flex: 1,
              padding: '5px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px',
              fontFamily: 'inherit'
            }}
          />
        ) : (
          <label 
            htmlFor={`task-${id}`}
            onClick={(e) => {
              // Evitar que el clic en la etiqueta active el checkbox cuando estamos editando
              if (isEditing) e.preventDefault();
              else handleEdit();
            }}
            style={{
              flex: 1,
              textDecoration: completada ? 'line-through' : 'none',
              color: completada ? '#666' : '#222',
              fontSize: '16px',
              wordBreak: 'break-word',
              padding: '8px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
              backgroundColor: 'transparent',
              display: 'block',
              lineHeight: '1.4'
            }}
            onMouseOver={e => !completada && !isEditing && (e.target.style.backgroundColor = '#f5f5f5')}
            onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleEdit();
              }
            }}
            tabIndex="0"
            role="button"
            aria-label={`Editar tarea: ${texto}`}
          >
            {texto}
          </label>
        )}
        
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            marginLeft: '5px',
            transition: 'all 0.2s',
            opacity: isEditing ? 0.5 : 1,
            pointerEvents: isEditing ? 'none' : 'auto',
            minWidth: '80px',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={e => !isEditing && (e.target.style.backgroundColor = '#b71c1c')}
          onMouseOut={e => e.target.style.backgroundColor = '#d32f2f'}
          onFocus={e => !isEditing && (e.target.style.backgroundColor = '#b71c1c')}
          onBlur={e => e.target.style.backgroundColor = '#d32f2f'}
          title="Eliminar tarea"
          aria-label={`Eliminar tarea: ${texto}`}
          disabled={isEditing}
          tabIndex={isEditing ? -1 : 0}
        >
          <span role="img" aria-hidden="true">🗑️</span> Eliminar
        </button>
        
        <button
          onClick={isEditing ? handleSave : handleEdit}
          style={{
            backgroundColor: isEditing ? '#4CAF50' : '#f0f0f0',
            color: isEditing ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '14px',
            marginLeft: '5px',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.target.style.opacity = '0.9'}
          onMouseOut={e => e.target.style.opacity = '1'}
          title={isEditing ? 'Guardar cambios' : 'Editar tarea'}
        >
          {isEditing ? 'Guardar' : 'Editar'}
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
