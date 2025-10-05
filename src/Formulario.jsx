import { useState } from 'react';

// 1. Recibimos las props, que incluyen la función onAddTask.
function Formulario(props) {
  // 1. Creamos un estado para guardar el valor del input.
  // Lo inicializamos con una cadena vacía: useState('').
  const [texto, setTexto] = useState('');

  // 2. Creamos el manejador para el evento 'onChange'.
  // Este evento se dispara CADA VEZ que el usuario teclea algo.
  const handleInputChange = (event) => {
    // event.target.value contiene el texto actual del input.
    setTexto(event.target.value);
  };

  // 5. Creamos un manejador para el envío del formulario.
  const handleSubmit = (event) => {
    // Prevenimos que la página se recargue, que es el comportamiento por defecto.
    event.preventDefault(); 

    // Validamos que no se envíe una tarea vacía.
    if (texto.trim() === '') return; 

    // 6. ¡Aquí está la magia! Llamamos a la función que nos pasó el padre (App.jsx).
    props.onAddTask(texto);

    // 7. Limpiamos el campo de texto después de enviar.
    setTexto('');
  };

  return (
    <div className="card">
      {/* 8. Usamos una etiqueta <form> y le asociamos el manejador */}
      <form 
        onSubmit={handleSubmit} 
        style={{ 
          margin: '20px 0',
          display: 'flex',
          maxWidth: '600px',
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
        aria-label="Añadir nueva tarea"
      >
        <div style={{ flex: 1, position: 'relative' }}>
          <label 
            htmlFor="nueva-tarea"
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0
            }}
          >
            Nueva tarea
          </label>
          <input
            id="nueva-tarea"
            type="text"
            value={texto}
            onChange={handleInputChange}
            placeholder="Añade una nueva tarea..."
            aria-required="true"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #4CAF50',
              borderRight: 'none',
              borderRadius: '4px 0 0 4px',
              outline: 'none',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              backgroundColor: '#fff'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2E7D32';
              e.target.style.boxShadow = '0 0 0 3px rgba(46, 125, 50, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#4CAF50';
              e.target.style.boxShadow = 'none';
            }}
            aria-invalid={texto.trim() === '' ? 'true' : 'false'}
            aria-describedby="tarea-help"
          />
          <div 
            id="tarea-help" 
            style={{
              position: 'absolute',
              left: '-9999px',
              width: '1px',
              height: '1px',
              overflow: 'hidden'
            }}
          >
            Escribe el nombre de la tarea y presiona Enter o el botón Añadir
          </div>
        </div>
        
        <button 
          type="submit"
          style={{
            backgroundColor: '#2E7D32',
            color: 'white',
            border: 'none',
            padding: '0 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '0 4px 4px 0',
            transition: 'background-color 0.2s, transform 0.1s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '100px',
            ':hover': {
              backgroundColor: '#1B5E20'
            },
            ':active': {
              transform: 'scale(0.98)'
            },
            ':focus': {
              outline: 'none',
              boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.4)',
              position: 'relative',
              zIndex: 1
            }
          }}
          disabled={!texto.trim()}
          aria-label="Añadir tarea"
        >
          <span aria-hidden="true" style={{ marginRight: '4px' }}>+</span>
          Añadir
        </button>
      </form>
    </div>
  );
}

export default Formulario;
