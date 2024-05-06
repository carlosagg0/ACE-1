<?php
include_once('config.php');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: PUT,GET,POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization, Accept, X-Requested-With, x-xsrf-token');
header('Content-Type: application/json; charset=utf-8');

$respuesta = "";
$post = json_decode(file_get_contents("php://input"), true);

if(isset($post['accion'])) {
    if ($post['accion'] == 'login') {
        if(isset($post['usuario']) && isset($post['clave']) && !empty($post['usuario']) && !empty($post['clave'])) {
            $usuario = mysqli_real_escape_string($mysqli, $post['usuario']);
            $clave_md5 = md5($post['clave']); // Encriptar la contraseña con MD5
            $sentencia = sprintf("SELECT * FROM persona WHERE ci_persona='%s' AND clave_persona='%s'", $usuario, $clave_md5);
            $rs = mysqli_query($mysqli, $sentencia);
            
            if (mysqli_num_rows($rs) > 0) {
                $row = mysqli_fetch_array($rs);
                $datos[0] = array(
                    'codigo' => $row['cod_persona'],
                    'nombre' => $row['nom_persona'],
                    'apellido' => $row['ape_persona']
                );
                $respuesta = json_encode(array('estado' => true, 'persona' => $datos));
            } else {
                $respuesta = json_encode(array('estado' => false, 'mensaje' => "Usuario o clave incorrecto"));
            }
        
        }
        echo $respuesta;
    }

    if ($post['accion'] == 'n_usuario') {
        if(isset($post['cedula']) && isset($post['nombre']) && isset($post['apellido']) && isset($post['correo']) && isset($post['telefono']) && isset($post['clave'])
           && !empty($post['cedula']) && !empty($post['nombre']) && !empty($post['apellido']) && !empty($post['correo']) && !empty($post['telefono']) && !empty($post['clave'])) {
            $clave_md5 = md5($post['clave']); // Encriptar la contraseña con MD5
            $sentencia = sprintf("INSERT INTO persona (ci_persona, nom_persona, ape_persona, correo_persona, telefono_persona, clave_persona, cod_rol_persona) VALUES ('%s','%s','%s','%s','%s','%s',2)",
                $post['cedula'], $post['nombre'], $post['apellido'], $post['correo'], $post['telefono'], $clave_md5);
            $rs = mysqli_query($mysqli, $sentencia);
            
            if ($rs) {
                $respuesta = json_encode(array('estado' => true, 'mensaje1' => "Usuario creado satisfactoriamente."));
            } else {
                $respuesta = json_encode(array('estado' => false, 'mensaje1' => "Error al crear el usuario."));
            }
        } else {
            $respuesta = json_encode(array('estado' => false, 'mensaje1' => "Todos los campos son obligatorios y no pueden estar vacíos"));
        }
        echo $respuesta;
    }
} else {
    $respuesta = json_encode(array('estado' => false, 'mensaje1' => "Acción no especificada"));
    echo $respuesta;
}
?>
