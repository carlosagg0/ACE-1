import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})

  export class EditPage implements OnInit {

    edit_profile_form: FormGroup;
  submit_attempt: boolean = false;

    nombre: string="";
    correo: string="";
  
    constructor(
      private authService: AuthService,
      private loadingController: LoadingController,
      
      private formBuilder: FormBuilder,
      private navController: NavController,
      private toastService: ToastService,
      private actionSheetController: ActionSheetController,
      private router: Router) { 
        
      this.authService.getSession('persona').then((res:any)=>{
        this.nombre=res;
        
        });
      this.authService.getSession('correo').then((res:any)=>{
          this.correo=res;
          
          });
        
        
    }

  ngOnInit() {
    
    

    // Setup form
    this.edit_profile_form = this.formBuilder.group({
      nombre: ['', Validators.required],
      name_last: ['', Validators.required]
    });

    // DEBUG: Prefill inputs

    this.edit_profile_form.get('nom_persona').setValue('');
    this.edit_profile_form.get('ape_persona').setValue('');
    
  }

  // Update profile picture
  async updateProfilePicture() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Choose existing picture or take new',
      cssClass: 'custom-action-sheet',
      buttons: [
        {
          text: 'Choose from gallery',
          icon: 'images',
          handler: () => {
            // Put in logic ...
          }
        },
        {
          text: 'Take picture',
          icon: 'camera',
          handler: () => {
            // Put in logic ...
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }]
    });
    await actionSheet.present();
  }

  // Submit form
  submit() {

    this.submit_attempt = true;

    // If form valid
    if (this.edit_profile_form.valid) {

      // Save form ...

      // Display success message and go back
      this.toastService.presentToast('Success', 'Profile saved', 'top', 'success', 2000);
      this.navController.back();

    } else {

      // Display error message
      this.toastService.presentToast('Error', 'Please fill in all required fields', 'top', 'danger', 2000);
    }
  }

}
