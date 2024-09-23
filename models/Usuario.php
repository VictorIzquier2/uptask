<?php

namespace Model;

class Usuario extends ActiveRecord{

  protected static $tabla = 'usuarios';
  protected static $columnasDB = ['id', 'nombre', 'email', 'password', 'token', 'confirmado'];

  public $id;
  public $nombre;
  public $email;
  public $password;
  public $password2;
  public $token;
  public $confirmado;

  public function __construct($args = [])
  {
   $this->id = $args['id'] ?? null;
   $this->nombre = $args['nombre'] ?? '';
   $this->email = $args['email'] ?? '';
   $this->password = $args['password'] ?? '';
   $this->password2 = $args['password2'] ?? '';
   $this->token = $args['token'] ?? '';
   $this->confirmado = $args['confirmado'] ?? 0;
  }

  // Validación 
  public function validarNuevaCuenta(){
    if(!$this->nombre){
      self::$alertas['error'][] = "El Nombre del Usuario es Obligatorio";
    }
    if(!$this->email || !filter_var($this->email, FILTER_VALIDATE_EMAIL)){
      self::$alertas['error'][] = "El Email del Usuario no es válido";
    }
    if(strlen($this->password) < 1){
      self::$alertas['error'][] = "El Password del Usuario es Obligatorio";
    }
    if(strlen($this->password) > 0 && strlen($this->password) < 6){
      self::$alertas['error'][] = "El Password debe contener al menos 6 caracteres";
    }
    if($this->password !== $this->password2){
      self::$alertas['error'][] = "El Password no coincide con el campo 'Repetir Password'";
    }
    return self::$alertas;
  }

  public function validarEmail(){
    if(!$this->email || !filter_var($this->email, FILTER_VALIDATE_EMAIL)){
      self::$alertas['error'][] = "El Email del Usuario no es válido";
    }
    return self::$alertas;
  }

  public function validarPassword(){
    if(strlen($this->password) < 1){
      self::$alertas['error'][] = "El Password del Usuario es Obligatorio";
    }
    if(strlen($this->password) > 0 && strlen($this->password) < 6){
      self::$alertas['error'][] = "El Password debe contener al menos 6 caracteres";
    }
    return self::$alertas;
  }

   public function validarLogin(){
    if(!$this->email || !filter_var($this->email, FILTER_VALIDATE_EMAIL)){
      self::$alertas['error'][] = "El Email del Usuario no es válido";
    }
    if(strlen($this->password) < 1){
      self::$alertas['error'][] = "El Password del Usuario es Obligatorio";
    }
    if(strlen($this->password) > 0 && strlen($this->password) < 6){
      self::$alertas['error'][] = "El Password debe contener al menos 6 caracteres";
    }
    return self::$alertas;
  }

  public function hashPassword(){
    $this->password = password_hash($this->password, PASSWORD_BCRYPT);
  }

  // Generar un token 
  public function crearToken(){
    $this->token = md5( uniqid() );
  }
}

?>