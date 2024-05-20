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
                    'cedula' => $row['ci_persona'],
                    'nombre' => $row['nom_persona'],
                    'apellido' => $row['ape_persona'],
                    'correo' => $row['correo_persona'],
                );
                $respuesta = json_encode(array('estado' => true, 'persona' => $datos));
            } else {
                $respuesta = json_encode(array('estado' => false, 'mensaje' => "Usuario o clave incorrecto"));
            }
        
        }
        echo $respuesta;
    }


    if ($post['accion'] == 'n_usuario') {
        if (isset($post['cedula']) && isset($post['tipoced']) && isset($post['nombre']) && isset($post['apellido']) && isset($post['etnia']) && isset($post['discapacidad']) && isset($post['tipodis']) && isset($post['porcentajedis']) && isset($post['ncarnetdis']) && isset($post['ocupacion']) && isset($post['nacionalidad']) && isset($post['ciudad']) && isset($post['provincia']) && isset($post['parroquia']) && isset($post['barrio']) && isset($post['calle1']) && isset($post['calle2']) && isset($post['neducacion']) && isset($post['genero']) && isset($post['correo']) && isset($post['telefono']) && isset($post['clave'])
            && !empty($post['cedula']) && !empty($post['nombre']) && !empty($post['apellido']) && !empty($post['correo']) && !empty($post['telefono']) && !empty($post['clave'])) {
    
            // Reemplazar el valor de etnia si es "otro"
            if ($post['etnia'] === 'otro') {
                $post['etnia'] = $post['otraetnia'];
            }
            // Reemplazar el valor de estado civil si es "otro"
            if ($post['ecivil'] === 'otro') {
                $post['ecivil'] = $post['otroecivil'];
            }
            // Reemplazar el valor de ocupacion si es "otro"
            if ($post['ocupacion'] === 'otro') {
                $post['ocupacion'] = $post['otraocupacion'];
            }
            // Reemplazar el valor de genero si es "otro"
            if ($post['genero'] === 'otro') {
                $post['genero'] = $post['otrogenero'];
            }
    
            $clave_md5 = md5($post['clave']); // Encriptar la contraseña con MD5
    
            $sentencia = sprintf("INSERT INTO persona (ci_persona, cod_tipoced_persona, nom_persona, ape_persona, fecha_nacimiento, edad_persona, ecivil_persona, etnia_persona, dis_persona, tipo_dis_persona, porcentaje_dis_persona, ncarnet_dis_persona, ocupacion_persona, cod_nacionalidad_persona, cod_ciudad_persona, cod_provincia_persona, parroquia_persona, barrio_persona, calle1_persona, calle2_persona, neducacion_persona, genero_persona, correo_persona, telefono_persona, clave_persona, cod_rol_persona) 
                VALUES ('%s', %s, '%s', '%s', '%s', TIMESTAMPDIFF(YEAR, '%s', CURDATE()), '%s', '%s', '%s', '%s', '%s', '%s', '%s', %s, %s, %s, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', 2);",
                $post['cedula'], $post['tipoced'], $post['nombre'], $post['apellido'], $post['fecha_nacimiento'], $post['fecha_nacimiento'], $post['ecivil'], $post['etnia'], $post['discapacidad'], $post['tipodis'], $post['porcentajedis'], $post['ncarnetdis'], $post['ocupacion'], $post['nacionalidad'], $post['ciudad'], $post['provincia'], $post['parroquia'], $post['barrio'], $post['calle1'], $post['calle2'], $post['neducacion'], $post['genero'], $post['correo'], $post['telefono'], $clave_md5);
    
            $rs = mysqli_query($mysqli, $sentencia);
    
            if ($rs) {
                $respuesta = json_encode(array('estado' => true, 'mensaje1' => "Usuario creado satisfactoriamente."));
            } else {
                $respuesta = json_encode(array('estado' => false, 'mensaje1' => "Error al crear el usuario."));
            }
    
            echo $respuesta;
        }
    }
    
} else {
    $respuesta = json_encode(array('estado' => false, 'mensaje' => "Acción no especificada"));
    echo $respuesta;
}


/*
if($post['accion']=='lcontactos')
{
    $sentencia=sprintf("SELECT * from contacto where persona_cod_persona='%s'",$post['cod_persona']);
    //echo $sentencia;
    $rs=mysqli_query($mysqli,$sentencia);
    if(mysqli_num_rows($rs)>0)
    {
        while($row=mysqli_fetch_array($rs)) 
        {
            $datos[]=array(
                'codigo'=>$row['cod_contacto'],
                'nombre'=>$row['nom_contacto'],
                'apellido'=>$row['ape_contacto'],
                'telefono'=>$row['telefono_contacto']
            );
        }
        $respuesta=json_encode(array('estado'=>true, 'datos'=>$datos));
    }
    else
    {
        $respuesta=json_encode(array('estado'=>false,'mensaje'=>"No se encontraron registro de contactos para esta persona"));
    }
    echo $respuesta;
}
*/
if ($post['accion']=='actnombre'){
    $sentencia=sprintf("UPDATE persona SET nom_persona = '%s', ape_persona = '%s'  WHERE ci_persona ='%s'",$post['nombre'],$post['apellido'],$post['cedula']);
    $rs=mysqli_query($mysqli,$sentencia);
    
    if($rs)
    {
        $respuesta = json_encode(array('estado'=>true, 'mensaje2'=>'Se actualizaron los datos.'));
    }
    else
    {
        $error=$mysqli->error;
        $respuesta=json_encode(array('estado'=>false, 'mensaje'=>'Error al actualizar los datos.'));
    }
    echo $respuesta;
}

if($post['accion']=='lnacionalidad')
{
    $sentencia=sprintf("SELECT * from nacionalidades");
    $rs=mysqli_query($mysqli,$sentencia);
    if(mysqli_num_rows($rs)>0)
    {
        while($row=mysqli_fetch_array($rs)) 
        {
            $datos[]=array(
                'codigo'=> $row['cod_nacionalidad'],
                'nombre'=> $row['nombre_nacionalidad']
            );
        }
        $respuesta=json_encode(array('estado'=>true, 'datos'=>$datos));
    }
    else
    {
        $respuesta=json_encode(array('estado'=>false,'mensaje'=>"No se encontraron registro de contactos para esta persona"));
    }
    echo $respuesta;
}

if($post['accion']=='lciudad')
{
    $sentencia=sprintf("SELECT * from ciudades");
    $rs=mysqli_query($mysqli,$sentencia);
    if(mysqli_num_rows($rs)>0)
    {
        while($row=mysqli_fetch_array($rs)) 
        {
            $datos[]=array(
                'codigo'=> $row['cod_ciudad'],
                'nombre'=> $row['nombre_ciudad']
            );
        }
        $respuesta=json_encode(array('estado'=>true, 'datos'=>$datos));
    }
    else
    {
        $respuesta=json_encode(array('estado'=>false,'mensaje'=>"No se encontraron datos"));
    }
    echo $respuesta;
}

if($post['accion']=='lprovincia')
{
    $sentencia=sprintf("SELECT * from provincias");
    $rs=mysqli_query($mysqli,$sentencia);
    if(mysqli_num_rows($rs)>0)
    {
        while($row=mysqli_fetch_array($rs)) 
        {
            $datos[]=array(
                'codigo'=> $row['cod_provincia'],
                'nombre'=> $row['nombre_provincia']
            );
        }
        $respuesta=json_encode(array('estado'=>true, 'datos'=>$datos));
    }
    else
    {
        $respuesta=json_encode(array('estado'=>false,'mensaje'=>"No se encontraron registro de contactos para esta persona"));
    }
    echo $respuesta;
}



?>