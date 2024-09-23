<div class="barra">
  <p>Hola, <span><?php echo $_SESSION['nombre'] ?? null; ?></span></p>

  <a href="/logout" class="cerrar-sesion">Cerrar Sesión</a>
</div>