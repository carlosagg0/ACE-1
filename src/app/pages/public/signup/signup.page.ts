import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  txt_nombre: string = "";
  txt_apellido: string = "";
  txt_cedula: string = "";
  txt_correo: string = "";
  txt_clave: string = "";
  txt_telefono: string = "";

  current_year: number = new Date().getFullYear();

  signup_form: FormGroup;
  submit_attempt: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    // Setup form
    this.signup_form = this.formBuilder.group({
      cedula: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      correo: ['', Validators.compose([Validators.email, Validators.required])],
      telefono: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      clave: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      conf_clave: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  // Sign up
  async registrar() {
    let datos = {
      accion: "n_usuario",
      cedula: this.txt_cedula,
      nombre: this.txt_nombre,
      apellido: this.txt_apellido,
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
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^[0-9]{10}$/; // Asumiendo que el número de teléfono tiene 10 dígitos
    return phoneRegex.test(phoneNumber);
  }
  
  }

