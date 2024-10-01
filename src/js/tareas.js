(()=>{
  
  const listadoTareas = document.querySelector('#listado-tareas');
  const estados = {
    0: 'Pendiente',
    1: 'Completa'
  }
  let tareas = [];
  let filtradas = [];
  obtenerTareas();
  
  // Botón para mostrar el Modal de Agregar tarea 
  const nuevaTareaBtn = document.querySelector('#agregar-tarea');
  const filtros = document.querySelectorAll('#filtros input[type="radio"');

  filtros.forEach(radio => {
    radio.addEventListener('input', filtrarTareas);
  })

  function filtrarTareas(e){
    const filtro = e.target.value;
    if(filtro !==''){
      filtradas = tareas.filter(tarea => tarea.estado === filtro);
    }else{
      filtradas = [];
    }
    mostrarTareas();
  }

  nuevaTareaBtn.addEventListener('click', ()=>mostrarFormulario());

  async function obtenerTareas(){
    try {
      const proyecto_url = obtenerProyecto();
      const url = `http://localhost:8000/api/tareas?url=${proyecto_url}`;
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();
      tareas = resultado.tareas;

      mostrarTareas();
    } catch (error) {
      console.log('Hubo un error:', error);
    }
  }

  function mostrarTareas(){
    limpiarTareas();
    totalPendientes();
    totalCompletadas();

    const tareasFiltradas = filtradas.length ? filtradas : tareas;

    if(tareasFiltradas.length === 0) {
      const contenedorTareas = document.querySelector('#listado-tareas');
      const textoNoTareas = document.createElement('li');
      textoNoTareas.textContent = 'No Hay Tareas';
      textoNoTareas.classList.add('no-tareas');
      contenedorTareas.appendChild(textoNoTareas);
      return;
    }
    tareasFiltradas.forEach(tarea => {
      const contenedorTarea = document.createElement('li');
      const nombreTarea = document.createElement('p');
      const opcionesDiv = document.createElement('div');
      const btnEstadoTarea = document.createElement('button');
      btnEliminarTarea = document.createElement('button');

      // Contenedor 
      contenedorTarea.dataset.tareaId = tarea.id;
      contenedorTarea.classList.add('tarea');
      // Nombre 
      nombreTarea.textContent = tarea.nombre;
      nombreTarea.ondblclick = ()=> {
        mostrarFormulario(true, {...tarea});
      }
      // Opciones
      opcionesDiv.classList.add('opciones');
      
      /* BOTONES */
      // Botón Estado
      btnEstadoTarea.classList.add('estado-tarea');
      btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`);
      btnEstadoTarea.textContent = estados[tarea.estado];
      btnEstadoTarea.dataset.estadoTarea = tarea.estado;
      btnEstadoTarea.ondblclick = function(){
        cambiarEstadoTarea({...tarea});
      }
      // Botón Eliminar
      btnEliminarTarea.classList.add('eliminar-tarea');
      btnEliminarTarea.dataset.idTarea = tarea.id;
      btnEliminarTarea.textContent= 'Eliminar';
      btnEliminarTarea.ondblclick = ()=>{
        confirmarEliminarTarea({...tarea});
      }

      opcionesDiv.appendChild(btnEstadoTarea);
      opcionesDiv.appendChild(btnEliminarTarea);

      contenedorTarea.appendChild(nombreTarea);
      contenedorTarea.appendChild(opcionesDiv);
      listadoTareas.appendChild(contenedorTarea);
    });
  }

  function totalPendientes(){
    const pendientesRadio = document.querySelector('#pendientes');
    const totalPendientes = tareas.filter(tarea => tarea.estado == "0");

    totalPendientes.length === 0 ? pendientesRadio.disabled = true : pendientesRadio.disabled = false;
    
  }
  
  function totalCompletadas(){
    const completadasRadio = document.querySelector('#completadas');
    const totalCompletadas = tareas.filter(tarea => tarea.estado === "1");

    totalCompletadas.length === 0 ? completadasRadio.disabled = true : completadasRadio.disabled = false;
  }
  

  function mostrarFormulario(editar = false, tarea = {}){
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <form class="formulario nueva-tarea">
        <legend>${editar ? 'Editar Tarea' : 'Añade una nueva tarea'}</legend>
        <div class="campo">
          <label for="tarea">Tarea</label>
          <input type="text" name="tarea" id="tarea" value="${tarea.nombre ? tarea.nombre : ''}" placeholder="${editar ? 'Editar Tarea del Proyecto Actual' : 'Añadir Tarea al Proyecto Actual'}" />
        </div>
        <div class="opciones">
          <input type="submit" class="submit-nueva-tarea" value="${editar ? 'Guardar Cambios' : 'Añadir Tarea'}" />
          <button type="button" class="cerrar-modal">Cancelar</button>
        </div>
      </form>
    `;

    setTimeout(()=>{
      const formulario = document.querySelector('.formulario');
      formulario.classList.add('animar');
    }, 0);

    modal.addEventListener('click', function(e){
      e.preventDefault();

      if(e.target.classList.contains('cerrar-modal')) {
        const formulario = document.querySelector('.formulario');
        formulario.classList.add('cerrar');

        setTimeout(() => { 
          modal.remove();
        }, 300);
      }
      if(e.target.classList.contains('submit-nueva-tarea')){
        const nombreTarea = document.querySelector('#tarea').value.trim();
        if(nombreTarea === ''){
          mostrarAlerta('error', 'El Nombre de la tarea es Obligatorio', document.querySelector('.formulario legend'));
          return;
        }
        if(editar){
          tarea.nombre = nombreTarea;
          actualizarTarea(tarea);
        }else{
          agregarTarea(nombreTarea);
        }
        setTimeout(() => { 
          modal.remove();
        }, 300);
        mostrarTareas();
      }
    });

    document.querySelector('.dashboard').appendChild(modal);
  }

  // Muestra un mensaje en la interfaz 
  function mostrarAlerta(tipo, mensaje, referencia){
    // Previene la creación de múltiples alertas 
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
      alertaPrevia.remove();
    }

    const alerta = document.createElement('div');
    alerta.classList.add('alerta', tipo);
    alerta.textContent = mensaje;

    referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);

    // Eliminar la alerta después de 5 segundos 
    setTimeout(() => {
      alerta.remove();
    }, 2000);
  }

  // Consultar el Servidor para añadir una nueva tarea al proyecto actual 
  async function agregarTarea(tarea){
    // Construir la petición 
    const datos = new FormData();
    datos.append('nombre', tarea);
    datos.append('proyecto_id', obtenerProyecto());

    try {
      const url = 'http://localhost:8000/api/tarea';
      const respuesta = await fetch(url, {
        method: 'POST',
        body: datos
      });
      const resultado = await respuesta.json();
      mostrarAlerta(resultado.tipo, resultado.mensaje, document.querySelector('.formulario legend'));

      if(resultado.tipo === 'exito'){
        const modal = document.querySelector('.modal');
        setTimeout(() =>{
          modal.remove();
        }, 2000);

        // Agregar el objeto de tarea al global de tareas
        const tareaObj = {
          id: String(resultado.id),
          nombre: tarea,
          estado: '0',
          proyecto_id: resultado.proyecto_id
        }
        tareas = [...tareas, tareaObj];
      }

    } catch (error) {
      console.log('Hubo un error:', error);
    }
  }

  function cambiarEstadoTarea(tarea) {
    const nuevoEstado = tarea.estado === "1" ? "0" : "1";
    tarea.estado =  nuevoEstado;
    actualizarTarea(tarea);
  }

  async function actualizarTarea(tarea){

    const {estado, id, nombre, proyecto_id} = tarea;

    const datos = new FormData();
    datos.append('id', id);
    datos.append('nombre', nombre);
    datos.append('estado', estado);
    datos.append('proyecto_id', proyecto_id);
    datos.append('proyecto_url', obtenerProyecto());

    // for(let valor of datos.values()){
    //   console.log(valor);
    // }
    // return;

    try {
      const url = 'http://localhost:8000/api/tarea/actualizar';
      const respuesta = await fetch(url, {
        method: 'POST',
        body: datos
      });
      const resultado = await respuesta.json();

      if(resultado.respuesta.tipo === 'exito'){
        mostrarAlerta(resultado.respuesta.tipo, resultado.respuesta.mensaje, document.querySelector('.contenedor-nueva-tarea'));
          tareas = tareas.map(tareaMemoria => {
            if(tareaMemoria.id === id){
              tareaMemoria.estado = estado;
              tareaMemoria.nombre = nombre;
            }
            return tareaMemoria;
          });
          mostrarTareas();
      }
    } catch (error) {
      console.log('Hubo un error:', error)
    }
  }

  async function eliminarTarea(tarea){
    const {estado, id, nombre, proyecto_id} = tarea;

    const datos = new FormData();
    datos.append('id', id);
    datos.append('nombre', nombre);
    datos.append('estado', estado);
    datos.append('proyecto_id', proyecto_id);
    datos.append('proyecto_url', obtenerProyecto());

    try {
      const url = 'http://localhost:8000/api/tarea/eliminar'
      const respuesta = await fetch(url, {
        method: 'POST',
        body: datos
      });
      const resultado = await respuesta.json();

      if(resultado.resultado){
        mostrarAlerta(resultado.tipo, resultado.mensaje, document.querySelector('.contenedor-nueva-tarea'));
        tareas = tareas.filter(tareaMemoria => tareaMemoria.id !== tarea.id);
        mostrarTareas();
      }

    } catch (error) {
      
    }
  }

  function confirmarEliminarTarea(tarea){
    Swal.fire({
      title: '¿Eliminar Tarea?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) =>{
      if(result.isConfirmed){
        eliminarTarea(tarea);
      }
    });
  }

  function obtenerProyecto() {
    const proyectoParams = new URLSearchParams(window.location.search);
    const proyecto = Object.fromEntries(proyectoParams.entries());
    return proyecto.url;
  }

  function limpiarTareas(){
    const listadoTareas = document.querySelector('#listado-tareas');
    while(listadoTareas.firstChild){
      listadoTareas.removeChild(listadoTareas.firstChild);
    }
  }

})();
