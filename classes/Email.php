<?php

namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email{
  protected $email;
  protected $nombre;
  protected $token;

  public function __construct($email, $nombre, $token)
  {
    $this->email = $email;
    $this->nombre = $nombre;
    $this->token = $token;
  }

  public function enviarConfirmacion(){

    // Crear el objeto de email 
      $mail = new PHPMailer();
      $mail->isSMTP();
      $mail->Host = 'smtp.mailtrap.io';
      $mail->SMTPAuth = true;
      $mail->Port = '587';
      $mail->Username = '5dd1e1d367f3a5';
      $mail->Password = '91c9f874fa04c1';

      $mail->setFrom('cuentas@uptask.com', 'UpTask');
      $mail->addAddress($this->email, $this->nombre);
      $mail->Subject = 'Confirma tu cuenta';

      // Set HTML 
      $mail->isHTML(TRUE);
      $mail->CharSet = 'UTF-8';

      $contenido = "<html>";
      $contenido .= "<p><strong>Hola " . $this->nombre . "</strong>. Has creado tu cuenta en UpTask, solo debes confirmarla presionando el siguiente enlace</p>";
      $contenido .= "<p>Presiona aquí: <a href= 'http://localhost:8000/confirmar?token=" . $this->token . "'>Confirmar Cuenta</a></p>";
      $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje</p>";
      $contenido .= "</html>";
      $mail->Body = $contenido;

      // Enviar el mail 
      $mail->send();
  }

  public function enviarInstrucciones(){

    // Crear el objeto de email 
      $mail = new PHPMailer();
      $mail->isSMTP();
      $mail->Host = 'smtp.mailtrap.io';
      $mail->SMTPAuth = true;
      $mail->Port = '587';
      $mail->Username = '5dd1e1d367f3a5';
      $mail->Password = '91c9f874fa04c1';

      $mail->setFrom('cuentas@uptask.com', 'UpTask');
      $mail->addAddress($this->email, $this->nombre);
      $mail->Subject = 'Reestablece tu Password';

      // Set HTML 
      $mail->isHTML(TRUE);
      $mail->CharSet = 'UTF-8';

      $contenido = "<html>";
      $contenido .= "<p><strong>Hola " . $this->nombre . "</strong>. Parece que has olvidado tu password, sigue el siguiente enlace para recuperarlo</p>";
      $contenido .= "<p>Presiona aquí: <a href= 'http://localhost:8000/reestablecer?token=" . $this->token . "'>Reestablecer Password</a></p>";
      $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje</p>";
      $contenido .= "</html>";
      $mail->Body = $contenido;

      // Enviar el mail 
      $mail->send();
  }
}

?>