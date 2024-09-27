<?php include_once __DIR__ . '/header-dashboard.php'?>

<?php if(count($proyectos) > 0):?>
  <ul class="listado-proyectos">
    <?php foreach($proyectos as $proyecto) : ?>
      <li class="proyecto">
        <a href="proyecto?url=<?php echo $proyecto->url; ?>"><?php echo $proyecto->proyecto?></a>
      </li>
    <?php endforeach; ?>
  </ul><!--.listado-proyectos-->
  <?php else: ?>
    <p class="no-proyectos">No Hay Proyectos Aún. <a href="/crear-proyecto">Comienza creando uno</a></p>
<?php endif; ?>

<?php include_once __DIR__ . '/footer-dashboard.php'?>