<div class="contenedor olvide">
  <?php include_once __DIR__ . '/../templates/nombre-sitio.php'; ?>

  <div class="contenedor-sm">

    <?php include_once __DIR__ . '/../templates/alertas.php'; ?>

    <p class="descripcion-pagina">Recupera tu Acceso UpTask</p>

    <form action="/olvide" class="formulario" method="POST">
      <div class="campo">
        <label for="email">Email:</label>
        <input type="email" name="email" id="email" placeholder="Tu Email" value="">
      </div>

      <input type="submit" value="Enviar Instrucciones" class="boton">        
    </form>

    <div class="acciones">
      <a href="/">¿Ya tienes una cuenta? Iniciar Sesión</a>
      <a href="/crear">¿Aún no tienes una cuenta? obtener una</a>
    </div>
  </div><!--.contenedor-sm-->
</div>