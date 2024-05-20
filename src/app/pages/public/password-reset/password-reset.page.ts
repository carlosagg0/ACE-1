import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {
  emeil: string="";

  reset_form: FormGroup;
  current_year: number = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.reset_form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
    });
  }

  async resetPassword() {
    if (this.reset_form.valid) {
      const email = this.reset_form.value.email;
      try {
        // Aquí enviarías la solicitud de recuperación de contraseña al backend
        await this.http.post('URL_DEL_BACKEND/recuperar-contrasena', { email }).toPromise();
        // Manejo exitoso, puedes mostrar un mensaje de éxito o redirigir al usuario a una página de confirmación
        console.log('Solicitud de recuperación de contraseña enviada correctamente.');
      } catch (error) {
        // Manejo de errores, puedes mostrar un mensaje de error al usuario
        console.error('Error al enviar la solicitud de recuperación de contraseña:', error);
      }
    }
  }
}
