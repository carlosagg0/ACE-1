import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  nombre: string="";
  correo: string="";

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private router: Router) { 
      
    this.authService.getSession('persona').then((res:any)=>{
      this.nombre=res;
      
      });
    this.authService.getSession('correo').then((res:any)=>{
        this.correo=res;
        
        });
      
      
  }

  ngOnInit() {
  }

  // Sign out
  signOut() {
    this.authService.signOut();
  }

}