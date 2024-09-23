<?php

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController{

  public static function login(Router $router){

    $alertas = [];
  
    if($_SERVER['REQUEST_METHOD'] === "POST"){
      $auth = new Usuario($_POST);
      
      $alertas = $auth->validarLogin();

      if(empty($alertas)){
        // verificar que el usuario exista 
        $usuario = Usuario::where('email', $auth->email);
        
        if(!$usuario || !$usuario->confirmado) {
          Usuario::setAlerta('error', 'El Usuario no existe o no ha sido confirmado');
        } else{
          // El usuario existe 
          if(password_verify($_POST['password'], $usuario->password)){
            // Iniciar la sesión
            session_start();
            $_SESSION['id'] = $usuario->id;
            $_SESSION['nombre'] = $usuario->nombre;
            $_SESSION['email'] = $usuario->email;
            $_SESSION['login'] = true;

            // Redireccionar 
            header('Location: /dashboard');
          }else{
            Usuario::setAlerta('error', 'Password Incorrecto');
          }
        }
        
      }
    }
    $alertas = Usuario::getAlertas();

    // Render a la vista
    $router->render('auth/login', [
      'titulo' => 'Iniciar Sesión',
      'alertas' => $alertas
    ]);
  }

  public static function logout(){
    session_start();

    $_SESSION = [];
    header('Location: /');

  }

  public static function crear(Router $router){
    $alertas = [];
    $usuario = new Usuario;

    if($_SERVER['REQUEST_METHOD'] === "POST"){
      
      $usuario->sincronizar($_POST);
      
      $alertas = $usuario->validarNuevaCuenta();
      
      if(empty($alertas)){ 
        $existeUsuario = Usuario::where('email', $usuario->email);

        if($existeUsuario){
          Usuario::setAlerta('error', 'El Usuario ya está registrado');
          $alertas = Usuario::getAlertas();
        }else{
          // Hashear el password 
          $usuario->hashPassword();

          // Eliminar password2 
          unset($usuario->password2);

          // Generar el Token 
          $usuario->crearToken();;

          // Crear un nuevo Usuario 
          $resultado = $usuario->guardar();

          // Enviar email 
          $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
          $email->enviarConfirmacion();

          if($resultado){
            header('Location: /mensaje');
          }
        }
      }
    }

    // Render a la vista 
    $router->render('auth/crear', [
      'titulo' => 'Crear tu cuenta en UpTask',
      'usuario' => $usuario,
      'alertas' => $alertas
    ]);
  }

  public static function olvide(Router $router){

    $alertas = [];

    if($_SERVER['REQUEST_METHOD'] === "POST"){
      $usuario = new Usuario($_POST);
      $alertas = $usuario->validarEmail();

      if(empty($alertas)){

        // Buscar el usuario
        $usuario = Usuario::where('email', $usuario->email);
        if($usuario && $usuario->confirmado){
          // Quitar password2 
          unset($usuario->password2);

          // Generar un nuevo token 
          $usuario->crearToken();          

          // Actualizar el usuario 
          $usuario->guardar();

          // Enviar el email 
          $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
          $email->enviarInstrucciones();

          // Imprimir la alerta 
          Usuario::setAlerta('exito', 'Hemos enviado las instrucciones enviadas a tu email');
        } else{
          Usuario::setAlerta('error', 'El usuario no existe o no está confirmado');
        }
      }
    }
    $alertas = Usuario::getAlertas();

    // Render a la vista 
    $router->render('auth/olvide', [
      'titulo' => 'Olvidé mi Password',
      'alertas' => $alertas
    ]);
  }

  public static function reestablecer(Router $router){

    $alertas = [];
    $token = s($_GET['token']);
    $mostrar = true;
    
    if(!$token) header('Location: /');

    // Identificar el usuario con este token 
    $usuario = Usuario::where('token', $token);

    if(empty($usuario)){
      Usuario::setAlerta('error', 'Token No Válido');
      $mostrar = false;
    }

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
      // Añadir el nuevo password 
      $usuario->sincronizar($_POST);
      
      // Validar el password 
      $alertas = $usuario->validarPassword();
      
      if(empty($alertas)){
        // Hashear el nuevo password 
        $usuario->hashPassword();

        // Eliminar password2 
        unset($usuario->password2);
        
        // Eliminar el Token
        $usuario->token = null;        

        // Guardar el usuario 
        $resultado = $usuario->guardar();

        // Redireccionar 
        if($resultado){
          header('Location: /');
        }
      }
    }
    
    $alertas = Usuario::getAlertas();

    // Render a la vista 
    $router->render('auth/reestablecer', [
      'titulo' => 'Reestablecer Password',
      'alertas' => $alertas,
      'mostrar' => $mostrar
    ]);
  }

  public static function mensaje(Router $router){
    
    $router->render('/auth/mensaje', [
      'titulo' => 'Cuenta Creada con Éxito'
    ]);
  }

  public static function confirmar(Router $router){

    $token = s($_GET['token']);

    if(!$token) header('Location: /');

    // Encontrar al usuario con este Token 
    $usuario = Usuario::where('token', $token);

    if(empty($usuario)){
      Usuario::setAlerta('error', 'Token No Válido');
    } else{
      // Confirmar la cuenta 
      $usuario->confirmado = 1;
      $usuario->token = null;
      unset($usuario->password2);

      // Guardar en la BD
      $usuario->guardar();
      Usuario::setAlerta('exito', 'Cuenta Comprobada Correctamente');
    }
    $alertas = Usuario::getAlertas();
    
    $router->render('/auth/confirmar', [
      'titulo' => 'Confirma tu cuente UpTask',
      'alertas' => $alertas
    ]);
  }
}

?>