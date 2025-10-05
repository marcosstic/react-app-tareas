import { useState, useEffect } from 'react';
import Formulario from './Formulario.jsx';
import TodoList from './TodoList.jsx';
import * as taskService from './services/taskService';
import './App.css';
import './animations.css';

function App() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el filtro actual
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'pendientes', 'completadas'
  const [highContrast, setHighContrast] = useState(false);
  
  // Efecto para alternar la clase de alto contraste
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);
  
  // Cargar tareas al iniciar
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await taskService.getTasks();
        setTareas(tasks);
        setError(null);
      } catch (err) {
        console.error('Error al cargar tareas:', err);
        setError('Error al cargar las tareas. Por favor, recarga la página.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Función para añadir tareas, que se pasará al formulario.
  const handleAddTask = async (textoTarea) => {
    try {
      const nuevaTarea = {
        texto: textoTarea,
        completada: false,
        animate: 'enter'
      };
      
      const tareaGuardada = await taskService.createTask(nuevaTarea);
      setTareas([...tareas, { ...tareaGuardada, animate: 'enter' }]);
    } catch (err) {
      console.error('Error al crear la tarea:', err);
      setError('Error al crear la tarea. Por favor, inténtalo de nuevo.');
    }
  };

  // Función para alternar el estado de completado de una tarea con animación
  const toggleTaskCompletion = async (idTarea) => {
    try {
      const tareaActual = tareas.find(t => t.id === idTarea);
      if (!tareaActual) return;
      
      const tareaActualizada = await taskService.updateTask(idTarea, {
        ...tareaActual,
        completada: !tareaActual.completada,
        animate: 'pulse'
      });
      
      setTareas(tareas.map(t => 
        t.id === idTarea ? { ...tareaActualizada, animate: 'pulse' } : t
      ));
    } catch (err) {
      console.error('Error al actualizar la tarea:', err);
      setError('Error al actualizar la tarea. Por favor, inténtalo de nuevo.');
    }
  };

  // Función para eliminar tareas con animación
  const handleDeleteTask = async (idAEliminar) => {
    try {
      // Primero actualizamos el estado para la animación
      setTareas(tareas.map(tarea => 
        tarea.id === idAEliminar ? { ...tarea, animate: 'exit' } : tarea
      ));
      
      // Luego eliminamos la tarea después de la animación
      setTimeout(async () => {
        try {
          await taskService.deleteTask(idAEliminar);
          setTareas(tareas.filter(tarea => tarea.id !== idAEliminar));
        } catch (err) {
          console.error('Error al eliminar la tarea:', err);
          setError('Error al eliminar la tarea. Por favor, inténtalo de nuevo.');
          // Revertir el estado si hay un error
          setTareas(tareas);
        }
      }, 300);
    } catch (err) {
      console.error('Error al eliminar la tarea:', err);
      setError('Error al eliminar la tarea. Por favor, inténtalo de nuevo.');
    }
  };

  // Función para actualizar el texto de una tarea
  const updateTask = async (id, nuevoTexto) => {
    try {
      const tareaActual = tareas.find(t => t.id === id);
      if (!tareaActual) return;
      
      const tareaActualizada = await taskService.updateTask(id, {
        ...tareaActual,
        texto: nuevoTexto
      });
      
      setTareas(tareas.map(t => 
        t.id === id ? tareaActualizada : t
      ));
    } catch (err) {
      console.error('Error al actualizar la tarea:', err);
      setError('Error al actualizar la tarea. Por favor, inténtalo de nuevo.');
    }
  };

  // Filtrar tareas según el estado del filtro
  const tareasFiltradas = tareas.filter(tarea => {
    if (filtro === 'pendientes') return !tarea.completada;
    if (filtro === 'completadas') return tarea.completada;
    return true; // 'todas' - no filtramos nada
  });

  // Mostrar mensaje de carga o error
  if (loading) {
    return (
      <div className="App">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`App ${highContrast ? 'high-contrast' : ''}`}>
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '10px',
          margin: '10px 0',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {error}
          <button 
            onClick={() => setError(null)}
            style={{
              marginLeft: '10px',
              background: 'none',
              border: 'none',
              color: '#c62828',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>
        </div>
      )}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h1 style={{ margin: 0 }}>Mi Aplicación de Tareas</h1>
        <button
          onClick={() => setHighContrast(!highContrast)}
          style={{
            padding: '8px 16px',
            backgroundColor: highContrast ? '#ffff00' : '#2E7D32',
            color: highContrast ? '#000' : '#fff',
            border: '2px solid',
            borderColor: highContrast ? '#ffff00' : '#2E7D32',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            ':hover': {
              opacity: 0.9
            },
            ':focus': {
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.4)'
            }
          }}
          aria-label={`Modo ${highContrast ? 'normal' : 'alto contraste'}`}
          title={`Cambiar a modo ${highContrast ? 'normal' : 'alto contraste'}`}
        >
          <span aria-hidden="true">
            {highContrast ? '☀️' : '🌙'}
          </span>
          {highContrast ? 'Modo normal' : 'Alto contraste'}
        </button>
      </div>
      
      {/* El formulario recibe la función para poder añadir tareas. */}
      <Formulario onAddTask={handleAddTask} />

      {/* Contenedor de filtros */}
      <div 
        role="tablist" 
        aria-label="Filtrar tareas"
        style={{ 
          margin: '20px 0',
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '0 10px'
        }}
      >
        {[
          { id: 'todas', label: 'Todas' },
          { id: 'pendientes', label: 'Pendientes' },
          { id: 'completadas', label: 'Completadas' }
        ].map((opcion) => {
          const isSelected = filtro === opcion.id;
          return (
            <button
              key={opcion.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`tabpanel-${opcion.id}`}
              id={`tab-${opcion.id}`}
              onClick={() => setFiltro(opcion.id)}
              style={{
                padding: '10px 18px',
                border: '2px solid',
                borderColor: isSelected ? '#2E7D32' : '#e0e0e0',
                borderRadius: '20px',
                background: isSelected ? '#2E7D32' : '#f5f5f5',
                color: isSelected ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: isSelected ? '600' : 'normal',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                minWidth: '100px',
                ':focus': {
                  outline: 'none',
                  boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.4)',
                  position: 'relative',
                  zIndex: 1
                },
                ':hover': {
                  background: isSelected ? '#1B5E20' : '#e8f5e9',
                  borderColor: isSelected ? '#1B5E20' : '#c8e6c9'
                },
                ':active': {
                  transform: 'scale(0.98)'
                }
              }}
            >
              {opcion.label}
              <span className="sr-only">
                {isSelected ? ' seleccionado' : ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mostrar el contador de tareas */}
      <p style={{ textAlign: 'center', color: '#666', margin: '10px 0' }}>
        {tareasFiltradas.length} tarea{tareasFiltradas.length !== 1 ? 's' : ''} {
          filtro === 'todas' ? 'en total' : 
          filtro === 'pendientes' ? 'pendientes' : 'completadas'
        }
      </p>

      {/* Pasamos las tareas filtradas al componente TodoList */}
      <div style={{ marginTop: '20px' }}>
        <TodoList 
          tareas={tareasFiltradas} 
          onDelete={handleDeleteTask} 
          onToggleComplete={toggleTaskCompletion}
          onUpdate={updateTask}
        />
      </div>
    </div>
  );
}

export default App;
