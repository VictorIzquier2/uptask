<div class="contenedor reestablecer">
  <?php include_once __DIR__ . '/../templates/nombre-sitio.php'; ?>

  <div class="contenedor-sm">

    <?php include_once __DIR__ . '/../templates/alertas.php'; ?>

    <?php if($mostrar): ?>
    
    <p class="descripcion-pagina">Coloca tu nuevo password</p>

    <form class="formulario" method="POST">
            
      <div class="campo">
        <label for="password">Password:</label>
        <input type="password" name="password" id="password" placeholder="Tu Password" value="">
      </div>

      <input type="submit" value="Guardar Password" class="boton">        
    </form>

    <?php endif; ?>

    <div class="acciones">
      <a href="/crear">¿Aún no tienes una cuenta? obtener una</a>
      <a href="/olvide">¿Olvidaste tu Password?</a>
    </div>
  </div><!--.contenedor-sm-->
</div>