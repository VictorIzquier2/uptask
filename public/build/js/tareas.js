(()=>{const e=document.querySelector("#listado-tareas"),t={0:"Pendiente",1:"Completa"};let a=[],o=[];!async function(){try{const e=`http://localhost:8000/api/tareas?url=${l()}`,t=await fetch(e),o=await t.json();a=o.tareas,i()}catch(e){console.log("Hubo un error:",e)}}();const n=document.querySelector("#agregar-tarea");function r(e){const t=e.target.value;o=""!==t?a.filter((e=>e.estado===t)):[],i()}function i(){!function(){const e=document.querySelector("#listado-tareas");for(;e.firstChild;)e.removeChild(e.firstChild)}(),function(){const e=document.querySelector("#pendientes"),t=a.filter((e=>"0"==e.estado));0===t.length?e.disabled=!0:e.disabled=!1}(),function(){const e=document.querySelector("#completadas"),t=a.filter((e=>"1"===e.estado));0===t.length?e.disabled=!0:e.disabled=!1}();const n=o.length?o:a;if(0===n.length){const e=document.querySelector("#listado-tareas"),t=document.createElement("li");return t.textContent="No Hay Tareas",t.classList.add("no-tareas"),void e.appendChild(t)}n.forEach((o=>{const n=document.createElement("li"),r=document.createElement("p"),u=document.createElement("div"),m=document.createElement("button");btnEliminarTarea=document.createElement("button"),n.dataset.tareaId=o.id,n.classList.add("tarea"),r.textContent=o.nombre,r.ondblclick=()=>{c(!0,{...o})},u.classList.add("opciones"),m.classList.add("estado-tarea"),m.classList.add(`${t[o.estado].toLowerCase()}`),m.textContent=t[o.estado],m.dataset.estadoTarea=o.estado,m.ondblclick=function(){!function(e){const t="1"===e.estado?"0":"1";e.estado=t,s(e)}({...o})},btnEliminarTarea.classList.add("eliminar-tarea"),btnEliminarTarea.dataset.idTarea=o.id,btnEliminarTarea.textContent="Eliminar",btnEliminarTarea.ondblclick=()=>{!function(e){Swal.fire({title:"¿Eliminar Tarea?",showCancelButton:!0,confirmButtonText:"Sí",cancelButtonText:"No"}).then((t=>{t.isConfirmed&&async function(e){const{estado:t,id:o,nombre:n,proyecto_id:r}=e,c=new FormData;c.append("id",o),c.append("nombre",n),c.append("estado",t),c.append("proyecto_id",r),c.append("proyecto_url",l());try{const t="http://localhost:8000/api/tarea/eliminar",o=await fetch(t,{method:"POST",body:c}),n=await o.json();n.resultado&&(d(n.tipo,n.mensaje,document.querySelector(".contenedor-nueva-tarea")),a=a.filter((t=>t.id!==e.id)),i())}catch(e){}}(e)}))}({...o})},u.appendChild(m),u.appendChild(btnEliminarTarea),n.appendChild(r),n.appendChild(u),e.appendChild(n)}))}function c(e=!1,t={}){const o=document.createElement("div");o.classList.add("modal"),o.innerHTML=`\n      <form class="formulario nueva-tarea">\n        <legend>${e?"Editar Tarea":"Añade una nueva tarea"}</legend>\n        <div class="campo">\n          <label for="tarea">Tarea</label>\n          <input type="text" name="tarea" id="tarea" value="${t.nombre?t.nombre:""}" placeholder="${e?"Editar Tarea del Proyecto Actual":"Añadir Tarea al Proyecto Actual"}" />\n        </div>\n        <div class="opciones">\n          <input type="submit" class="submit-nueva-tarea" value="${e?"Guardar Cambios":"Añadir Tarea"}" />\n          <button type="button" class="cerrar-modal">Cancelar</button>\n        </div>\n      </form>\n    `,setTimeout((()=>{document.querySelector(".formulario").classList.add("animar")}),0),o.addEventListener("click",(function(n){if(n.preventDefault(),n.target.classList.contains("cerrar-modal")){document.querySelector(".formulario").classList.add("cerrar"),setTimeout((()=>{o.remove()}),300)}if(n.target.classList.contains("submit-nueva-tarea")){const n=document.querySelector("#tarea").value.trim();if(""===n)return void d("error","El Nombre de la tarea es Obligatorio",document.querySelector(".formulario legend"));e?(t.nombre=n,s(t)):async function(e){const t=new FormData;t.append("nombre",e),t.append("proyecto_id",l());try{const o="http://localhost:8000/api/tarea",n=await fetch(o,{method:"POST",body:t}),r=await n.json();if(d(r.tipo,r.mensaje,document.querySelector(".formulario legend")),"exito"===r.tipo){const t=document.querySelector(".modal");setTimeout((()=>{t.remove()}),2e3);const o={id:String(r.id),nombre:e,estado:"0",proyecto_id:r.proyecto_id};a=[...a,o]}}catch(e){console.log("Hubo un error:",e)}}(n),setTimeout((()=>{o.remove()}),300),i()}})),document.querySelector(".dashboard").appendChild(o)}function d(e,t,a){const o=document.querySelector(".alerta");o&&o.remove();const n=document.createElement("div");n.classList.add("alerta",e),n.textContent=t,a.parentElement.insertBefore(n,a.nextElementSibling),setTimeout((()=>{n.remove()}),2e3)}async function s(e){const{estado:t,id:o,nombre:n,proyecto_id:r}=e,c=new FormData;c.append("id",o),c.append("nombre",n),c.append("estado",t),c.append("proyecto_id",r),c.append("proyecto_url",l());try{const e="http://localhost:8000/api/tarea/actualizar",r=await fetch(e,{method:"POST",body:c}),s=await r.json();"exito"===s.respuesta.tipo&&(d(s.respuesta.tipo,s.respuesta.mensaje,document.querySelector(".contenedor-nueva-tarea")),a=a.map((e=>(e.id===o&&(e.estado=t,e.nombre=n),e))),i())}catch(e){console.log("Hubo un error:",e)}}function l(){const e=new URLSearchParams(window.location.search);return Object.fromEntries(e.entries()).url}document.querySelectorAll('#filtros input[type="radio"').forEach((e=>{e.addEventListener("input",r)})),n.addEventListener("click",(()=>c()))})();