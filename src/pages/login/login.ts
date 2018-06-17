import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular'
import { MainPage } from '../pages';
import {Auth} from "@bluntsoftware/iglue";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test'
  };
  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public auth:Auth,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }
  // Attempt to login in through our User service
  doLogin() {
    const that = this;
    this.auth.login(this.account.email,this.account.password).then(
      (account) => {
        that.navCtrl.push(MainPage);
      },
      (err) => {
          // Unable to log in
          let toast = this.toastCtrl.create({
            message:  err.statusText,
            duration: 3000,
            position: 'top'
          });
          toast.present();
    });
  }
}
