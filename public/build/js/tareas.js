document.querySelector("#agregar-tarea").addEventListener("click",(function(){const e=document.createElement("div");e.classList.add("modal"),e.innerHTML='\n      <form class="formulario nueva-tarea">\n        <legend>Añade una nueva tarea</legend>\n        <div class="campo">\n          <label for="tarea">Tarea</label>\n          <input type="text" name="tarea" id="tarea" placeholder="Añadir Tarea al Proyecto Actual" />\n        </div>\n        <div class="opciones">\n          <input type="submit" class="submit-nueva-tarea" value="Añadir Tarea" />\n          <button type="button" class="cerrar-modal">Cancelar</button>\n        </div>\n      </form>\n    ',setTimeout((()=>{document.querySelector(".formulario").classList.add("animar")}),0),e.addEventListener("click",(function(a){a.preventDefault(),a.target.classList.contains("cerrar-modal")&&(document.querySelector(".formulario").classList.add("cerrar"),setTimeout((()=>{e.remove()}),300)),a.target.classList.contains("submit-nueva-tarea")&&document.querySelector("#tarea").value.trim()})),document.querySelector("body").appendChild(e)}));