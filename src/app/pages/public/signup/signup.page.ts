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
  sel_ecivil: string = "";
  txt_otro_ecivil: string = "";
  sel_etnia: string = "";
  txt_otra_etnia: string = "";
  sel_discapacidad: string = "";
  txt_tipodis: string = "";
  txt_porcentajedis: string = "";
  txt_ncarnetdis: string = "";
  sel_ocupacion: string = "";
  txt_otra_ocupacion: string = "";
  sel_nacionalidad: string = "51";
  sel_ciudad: string = "15";
  sel_provincia: string = "11";
  txt_parroquia: string = "";
  txt_barrio: string = "";
  txt_calle1: string = "";
  txt_calle2: string = "";
  sel_neducacion: string = "";
  sel_genero: string = "";
  txt_otro_genero: string = "";
  txt_cedula: string = "";
  txt_correo: string = "";
  txt_clave: string = "";
  txt_telefono: string = "";
  sel_tipoced: string="";
  claveType: string = 'password';
  confClaveType: string = 'password';

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
      ecivil: ['', [Validators.required]],
      otroecivil: ['', [Validators.required]],
      etnia: ['', [Validators.required]],
      otraetnia: ['', [Validators.required]],
      discapacidad: ['', [Validators.required]],
      tipodis: [''],
      porcentajedis: [''],
      ncarnetdis: [''],
      ocupacion: ['', [Validators.required]],
      otraocupacion: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      parroquia: ['', [Validators.required]],
      barrio: ['', [Validators.required]],
      calle1: ['', [Validators.required]],
      calle2: ['', [Validators.required]],
      neducacion: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      otrogenero: ['', [Validators.required]],
      correo: ['', Validators.compose([Validators.email, Validators.required])],
      telefono: ['', Validators.compose([Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.required])],
      clave: ['', Validators.compose([Validators.minLength(8), Validators.required])],
      conf_clave: ['', Validators.compose([Validators.minLength(8), Validators.required])]
    });
  }

  
  

  // Sign up
  async registrar() {

    //SI LOS CAMPOS OBLIGATIRIOS ESTAN VACIOS
    if (this.signup_form.value.correo == '' ||this.signup_form.value.tipo_documento == '' || this.signup_form.value.nombres == '' ||this.signup_form.value.apellidos == '' || this.signup_form.value.fecha_nacimiento == '' ||this.signup_form.value.ecivil == '' ||this.signup_form.value.etnia == '' ||this.signup_form.value.discapacidad == '' ||this.signup_form.value.ocupacion == '' ||this.signup_form.value.nacionalidad == '' ||this.signup_form.value.ciudad == '' ||this.signup_form.value.provincia == '' ||this.signup_form.value.parroquia == '' ||this.signup_form.value.parroquia == '' ||this.signup_form.value.barrio == '' ||this.signup_form.value.calle1 == '' ||this.signup_form.value.calle2 == '' ||this.signup_form.value.neducacion == '' ||this.signup_form.value.genero == '' ||  this.signup_form.value.cedula == '' ||this.signup_form.value.correo == '' ||this.signup_form.value.telefono == '' ||this.signup_form.value.clave == '' || this.signup_form.value.conf_clave == '') {
      this.signup_form.value.btn_reg =
      this.authService.showToast('Todos los campos son obligatorios y no pueden estar vacíos');
    }
    
    if (this.signup_form.value.clave !== this.signup_form.value.conf_clave) {
      this.authService.showToast('Las contraseñas no coinciden');
      return;
    }

    if (!this.validateEmail(this.signup_form.value.correo)) {
      this.authService.showToast('El correo electrónico no es válido');
      return;
    }

    if (!this.validatePhoneNumber(this.signup_form.value.telefono)) {
      this.authService.showToast('El número de teléfono no es válido');
      return;
    }
    
    if (this.signup_form.get('cedula').errors && this.signup_form.get('cedula').errors.cedulaEcuatoriana) {
      this.authService.showToast('La cedula no es válida');
      return;
    }
    
    let datos = {
      accion: "n_usuario",
      cedula: this.txt_cedula,
      tipoced: this.sel_tipoced,
      nombre: this.txt_nombre,
      apellido: this.txt_apellido,
      ecivil: this.sel_ecivil,
      otroecivil: this.txt_otro_ecivil,
      etnia: this.sel_etnia,
      otraetnia: this.txt_otra_etnia,
      discapacidad: this.sel_discapacidad,
      tipodis: this.txt_tipodis,
      porcentajedis: this.txt_porcentajedis,
      ncarnetdis: this.txt_ncarnetdis,
      ocupacion: this.sel_ocupacion,
      otraocupacion: this.txt_otra_ocupacion,
      nacionalidad: this.sel_nacionalidad,
      ciudad: this.sel_ciudad,
      provincia: this.sel_provincia,
      parroquia: this.txt_parroquia,
      barrio: this.txt_barrio,
      calle1: this.txt_calle1,
      calle2: this.txt_calle2,
      fecha_nacimiento: this.txt_fecha_nacimiento,
      genero: this.sel_genero,
      otrogenero: this.txt_otro_genero,
      neducacion: this.sel_neducacion,
      telefono: this.txt_telefono,
      correo: this.txt_correo,
      clave: this.txt_clave,
      conf_clave:this.txt_clave
    }
      
    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado == true) {
        this.mostrarMensajeRegistroExitoso();
        this.router.navigate(['/signin']); // Redirecciona al inicio de sesión
      } else {
        this.authService.showToast(res.mensaje);
      }
      
    });
    

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
  togglePasswordVisibility(show: boolean): void {
    this.claveType = show ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(show: boolean): void {
    this.confClaveType = show ? 'text' : 'password';
  }
  
  }
  