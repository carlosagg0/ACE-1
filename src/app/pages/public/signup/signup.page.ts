import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  codigo: string = '';
  nacionalidades: any = [];
  ciudades: any = [];
  provincias: any = [];
  txt_nombre: string = "";
  txt_apellido: string = "";
  txt_fecha_nacimiento="";
  txt_edad: string = "";
  sel_ecivil: string = "";
  sel_etnia: string = "";
  sel_discapacidad: string = "";
  txt_tipodis: string = "";
  txt_porcentajedis: string = "";
  txt_ncarnetdis: string = "";
  sel_ocupacion: string = "";
  sel_nacionalidad: string = "";
  sel_ciudad: string = "";
  sel_provincia: string = "";
  txt_parroquia: string = "";
  txt_barrio: string = "";
  txt_calle1: string = "";
  txt_calle2: string = "";
  sel_neducacion: string = "";
  sel_genero: string = "";
  txt_cedula: string = "";
  txt_correo: string = "";
  txt_clave: string = "";
  txt_telefono: string = "";
  sel_tipoced: string="";

  current_year: number = new Date().getFullYear();

  signup_form: FormGroup;
  submit_attempt: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) { 
    this.authService.getSession('persona').then((res: any) => {
      this.lnacionalidades(this.codigo),
      this.lciudades(this.codigo)
      this.lprovincias(this.codigo)
    });
  }

  ngOnInit() {
    // Setup form
    this.signup_form = this.formBuilder.group({
      tipo_documento: ['', Validators.required], // Agregamos el campo de tipo de documento
      cedula_extranjera: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      cedula: ['', Validators.compose([Validators.minLength(10), Validators.required, this.cedulaEcuatorianaValidator()])],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      ecivil: ['', [Validators.required]],
      etnia: ['', [Validators.required]],
      discapacidad: ['', [Validators.required]],
      tipodis: ['', [Validators.required]],
      porcentajedis: ['', [Validators.required]],
      ncarnetdis: ['', [Validators.required]],
      ocupacion: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      parroquia: ['', [Validators.required]],
      barrio: ['', [Validators.required]],
      calle1: ['', [Validators.required]],
      calle2: ['', [Validators.required]],
      neducacion: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      correo: ['', Validators.compose([Validators.email, Validators.required])],
      telefono: ['', Validators.compose([Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.required])],
      clave: ['', Validators.compose([Validators.minLength(8), Validators.required])],
      conf_clave: ['', Validators.compose([Validators.minLength(8), Validators.required])]
    });
  }

  // Sign up
  async registrar() {
    let datos = {
      accion: "n_usuario",
      cedula: this.txt_cedula,
      tipoced: this.sel_tipoced,
      nombre: this.txt_nombre,
      apellido: this.txt_apellido,
      ecivil: this.sel_ecivil,
      etnia: this.sel_etnia,
      discapacidad: this.sel_discapacidad,
      tipodis: this.txt_tipodis,
      porcentajedis: this.txt_porcentajedis,
      ncarnetdis: this.txt_ncarnetdis,
      ocupacion: this.sel_ocupacion,
      nacionalidad: this.sel_nacionalidad,
      ciudad: this.sel_ciudad,
      provincia: this.sel_provincia,
      parroquia: this.txt_parroquia,
      barrio: this.txt_barrio,
      calle1: this.txt_calle1,
      calle2: this.txt_calle2,
      fecha_nacimiento: this.txt_fecha_nacimiento,
      genero: this.sel_genero,
      neducacion: this.sel_neducacion,
      edad: this.txt_edad,
      telefono: this.txt_telefono,
      correo: this.txt_correo,
      clave: this.txt_clave,
    }
    

    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado == true) {
        this.mostrarMensajeRegistroExitoso();
        this.router.navigate(['/signin']); // Redirecciona al inicio de sesión
      } else {
        this.authService.showToast1(res.mensaje1);
      }
      
    });
    
    



    // If email or password empty
    if (this.signup_form.value.correo == '' || this.signup_form.value.clave == '' || this.signup_form.value.password_repeat == '') {
      this.signup_form.value.btn_reg =
        this.toastService.presentToast('Error', 'Todos los campos son obligatorios y no pueden estar vacíos', 'top', 'danger', 500);
    }
    else if (!this.validateEmail(this.signup_form.value.correo)) {
      this.toastService.presentToast('Error', 'El correo electrónico no es válido', 'top', 'danger', 4000);
      return; // Detener el proceso de registro si el correo electrónico no es válido
    }
    else if (!this.validatePhoneNumber(this.signup_form.value.telefono)) {
      this.toastService.presentToast('Error', 'El número de teléfono no es válido', 'top', 'danger', 4000);
      return; // Detener el proceso de registro si el número de teléfono no es válido
    }

    // If passwords do not match
    else if (this.signup_form.value.clave != this.signup_form.value.conf_clave) {
      this.toastService.presentToast('Error', 'Las contraseñas no coinciden', 'top', 'danger', 4000);
    }
  }

  async mostrarMensajeRegistroExitoso() {
    const toast = await this.toastService.presentToast('Éxito', '¡Se ha registrado correctamente!', 'top', 'success', 3000);
  }
  validateEmail(correo: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo);
  }
  validatePhoneNumber(telefono: string): boolean {
    const phoneRegex = /^[0-9]{10}$/; // Asumiendo que el número de teléfono tiene 10 dígitos
    return phoneRegex.test(telefono);
  }
  cedulaEcuatorianaValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const cedula = control.value;
      if (cedula.length === 10) {
        const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let suma = 0;
        for (let i = 0; i < coeficientes.length; i++) {
          let resultado = parseInt(cedula.charAt(i)) * coeficientes[i];
          if (resultado > 9) {
            resultado -= 9;
          }
          suma += resultado;
        }
        const digitoVerificador = (suma % 10 === 0) ? 0 : (10 - (suma % 10));
        if (parseInt(cedula.charAt(9)) !== digitoVerificador) {
          return { 'cedulaEcuatoriana': true };
        }
      }
      return null;
    };
  }

  lnacionalidades(codigo: string){
    let datos = {
      accion:"lnacionalidad"
    }
    this.authService.postData(datos).subscribe((res:any) => {
      if(res.estado == true) {
        this.nacionalidades = res.datos
      } else {
        this.nacionalidades.showToast(res.mensaje)
      }
    });
  }
  lciudades(codigo: string){
    let datos = {
      accion:"lciudad"
    }
    this.authService.postData(datos).subscribe((res:any) => {
      if(res.estado == true) {
        this.ciudades = res.datos
      } else {
        this.ciudades.showToast(res.mensaje)
      }
    });
  }
  lprovincias(codigo: string){
    let datos = {
      accion:"lprovincia"
    }
    this.authService.postData(datos).subscribe((res:any) => {
      if(res.estado == true) {
        this.provincias = res.datos
      } else {
        this.provincias.showToast(res.mensaje)
      }
    });
  }
  
  
  }