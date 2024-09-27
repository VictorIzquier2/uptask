(()=>{
  
  // Botón para mostrar el Modal de Agregar tarea 
  const nuevaTareaBtn = document.querySelector('#agregar-tarea');

  nuevaTareaBtn.addEventListener('click', mostrarFormulario);

  function mostrarFormulario(){
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <form class="formulario nueva-tarea">
        <legend>Añade una nueva tarea</legend>
        <div class="campo">
          <label for="tarea">Tarea</label>
          <input type="text" name="tarea" id="tarea" placeholder="Añadir Tarea al Proyecto Actual" />
        </div>
        <div class="opciones">
          <input type="submit" class="submit-nueva-tarea" value="Añadir Tarea" />
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
        submitFormularioNuevaTarea();
      }
    });

    document.querySelector('body').appendChild(modal);
  }

  function submitFormularioNuevaTarea(){
    const tarea = document.querySelector('#tarea').value.trim();

    if(tarea === ''){
      // Mostrar una alerta de error 
      
      return;
    }
  }

})();
