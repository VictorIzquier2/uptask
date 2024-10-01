<?php

namespace Controllers;

use Model\Proyecto;
use Model\Usuario;
use MVC\Router;

class DashboardController{
  public static function index(Router $router){
    session_start();
    isAuth();

    $id = $_SESSION['id'];

    $proyectos = Proyecto::belongsTo('propietario_id', $id);

    $router->render('dashboard/index', [
      'titulo' => 'Proyectos',
      'proyectos' => $proyectos
    ]);
  }

  public static function crear_proyecto(Router $router){
    session_start();
    isAuth();

    $alertas = [];

    if($_SERVER['REQUEST_METHOD'] === "POST"){
      $proyecto = new Proyecto($_POST);

      // Validación 
      $alertas = $proyecto->validarProyecto();

      if(empty($alertas)){
        // Generar una URL única
        $proyecto->url = md5(uniqid());

        // Almacenar el creador del proyecto
        $proyecto->propietario_id = $_SESSION['id'];

        // Guardar el proyecto 
        $proyecto->guardar();

        // Redireccionar 
        header('Location: /proyecto?url=' . $proyecto->url);
      }
    }

    $router->render('dashboard/crear-proyecto', [
      'alertas' => $alertas,
      'titulo' => 'Crear Proyecto'
    ]);
  }

  public static function proyecto(Router $router){
    session_start();
    isAuth();

    $token = $_GET['url'];
    if(!$token) header('Location: /dashboard');

    // Revisar que la persona que visita el proyecto, es quien lo creo 
    $proyecto = Proyecto::where('url', $token);
    if($proyecto->propietario_id !== $_SESSION['id']){
      header('Location: /dashboard');      
    };

    $router->render('dashboard/proyecto', [
      'titulo' => $proyecto->proyecto
    ]);
  }

  public static function perfil(Router $router){
    session_start();
    isAuth();

    $alertas = [];
    
    $usuario = Usuario::find($_SESSION['id']);

    if($_SERVER['REQUEST_METHOD'] === "POST"){
      $usuario->sincronizar($_POST);
      $alertas = $usuario->validarPerfil();

      if(empty($alertas)){

        //  Verificar email 
        $existeUsuario = Usuario::where('email', $usuario->email);
        if($existeUsuario && $existeUsuario->id !== $usuario->id){
          // Mostrar un mensaje de error 
          Usuario::setAlerta('error', 'Email No válido, Cuenta Ya Registrada');
        }else{
          // Guardar Usuario 
          $usuario->guardar();
          
          Usuario::setAlerta('exito', 'Guardado Correctamente');
          $alertas = $usuario->getAlertas();
          // Asignar nombre nuevo a la barra
        }
        $alertas = $usuario->getAlertas();
      }
    }

    $router->render('dashboard/perfil', [
      'titulo' => 'Perfil',
      'usuario' => $usuario,
      'alertas' => $alertas
    ]);
  }

  public static function cambiar_password(Router $router){
    session_start();
    isAuth();

    $alertas = [];
    
    $usuario = Usuario::find($_SESSION['id']);

    if($_SERVER['REQUEST_METHOD'] === "POST"){
      $usuario = Usuario::find($_SESSION['id']);
      
      // Sincronizar con los datos del usuario
      $usuario->sincronizar($_POST);
      
      $alertas = $usuario->nuevoPassword();

      if(empty($alertas)){

        //  Verificar el password actual 
        $resultado = $usuario->comprobarPassword();
        if($resultado){
          // Asignar el nuevo password
          $usuario->password = $usuario->password_nuevo;
          // Eliminar propiedades No necesarias
          unset($usuario->password_actual);
          unset($usuario->password_nuevo);
          unset($usuario->password2);
          // Hashear el nuevo password
          $usuario->hashPassword();
          // Actualizar
          $resultado = $usuario->guardar();
          if($resultado){
            Usuario::setAlerta('exito', 'Nuevo Password Guardado Correctamente');
          }
        } else{
          Usuario::setAlerta('error', 'El Password Actual no es correcto');
        }
        $alertas = $usuario->getAlertas();
      }
    }

    $router->render('dashboard/cambiar-password', [
      'titulo' => 'Cambiar Password',
      'usuario' => $usuario,
      'alertas' => $alertas
    ]);
  }
}

?>