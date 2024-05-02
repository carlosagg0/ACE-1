import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import {Storage} from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  server: string="http://localhost/WsMunicipioIonic/ws_gad.php"
  constructor(
    public http:HttpClient,
    public toastCtrl:ToastController,
    private router: Router
  ) { }

  postData (body:any){
    let head=new HttpHeaders({'Content-Type':'application/json, charset:utf-8'});
    let options={
      headers:head
    }   
    return this.http.post(this.server, JSON.stringify(body), options);
  }

  async creatSession(id:string, valor:string)
  {
    await Storage.set({
      key: id,
      value:valor
    });
  }
  async closeSession(){
    await Storage.clear();
  }
  async getSession(id:string){
    const item=await Storage.get({
      key:id,
    });
    return item.value;
  }

  
/*
  // Get user session
  async getSession() {

    // ...
    // put auth session here
    // ...

    // Sample only - remove this after real authentication / session
    let session = {
      email: 'john.doe@mail.com'
    }

    return false;
    // return session;
  }
*/
  // Sign in
  async signIn(email: string, password: string) {
    // Sample only - remove this after real authentication / session
    let sample_user = {
      email: email,
      password: password
    }

    return sample_user;
  }

  // Sign up
  async signUp(email: string, password: string) {
    // Sample only - remove this after real authentication / session
    let sample_user = {
      email: email,
      password: password
    }

    return sample_user;
  }

  // Sign out
  async signOut() {
    // ...
    // clean subscriptions / local storage etc. here
    // ...

    // Navigate to sign-in
    this.router.navigateByUrl('/signin');
  }
  async showToast(mensaje:string){
    const toast=await this.toastCtrl.create({
      message:mensaje,
      duration: 500,
      position: 'top',
      color: 'danger'
    });
    toast.present();
}
async showToast1(mensaje1:string){
  const toast2 = await this.toastCtrl.create({
    message: mensaje1,
    duration: 500,
    position: 'bottom', // Cambia 'top' a 'bottom' según tus necesidades
    color: 'warning-tint' // Cambia el color según tus necesidades
  });
  toast2.present();
}
async showToast2(mensaje2:string){
  const toast2 = await this.toastCtrl.create({
    message: mensaje2,
    duration: 500,
    position: 'top', // Cambia 'top' a 'bottom' según tus necesidades
    color: 'success' // Cambia el color según tus necesidades
  });
  toast2.present();
}
}