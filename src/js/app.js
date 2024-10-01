const mobileMenuBtn = document.querySelector('#mobile-menu');
const cerrarMenuBtn = document.querySelector('#cerrar-menu');
const sidebar = document.querySelector('.sidebar');
const anchoPantalla = document.body.clientWidth;

if(mobileMenuBtn){
  mobileMenuBtn.addEventListener('click', ()=> {
    sidebar.classList.toggle('mostrar');
  });
}

if(cerrarMenuBtn) {
  cerrarMenuBtn.addEventListener('click', ()=> {
    sidebar.classList.add('ocultar');
    setTimeout(()=> {
      sidebar.classList.remove('mostrar');
      sidebar.classList.remove('ocultar');
    }, 1000)
  })
}

// Elimina la clase de mostrar en un tamaño de tablet o mayores
window.addEventListener('resize', ()=> {
  if(anchoPantalla >= 768){
    sidebar.classList.remove('mostrar');
  }
})
