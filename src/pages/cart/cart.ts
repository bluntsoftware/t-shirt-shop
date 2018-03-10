import { Component } from '@angular/core';
import { NavController, NavParams,AlertController  } from 'ionic-angular';



import {CheckoutPage} from '../checkout/checkout';
import {Shop} from "../../providers/shop/shop-service";
 /*
  Generated class for the Cart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  cart:any = { items:[]};
  constructor(	public navCtrl: NavController,
  				public navParams: NavParams,
  				public alertCtrl: AlertController,
  				public shop: Shop) {
  }

  ionViewDidLoad() {
    let cart_id = localStorage.getItem('cart_id');
    if(!cart_id){
      this.shop.client.carts.save(this.cart).toPromise().then((response)=>{
        this.cart = response;
         localStorage.setItem('cart_id',response._id);
      });
    }else{
      this.shop.client.carts.getById(cart_id)
        .then((response) => {
          this.cart = response;
        })
        .catch((error) =>{
          let alert = this.alertCtrl.create({
            title: 'Oops',
            subTitle: 'An error has occurred, unable to load the cart.',
            buttons: ['Ok']
          });
          alert.present();
        })
    }
  }

  private updateQuantity(index,amount){
  	if (this.cart.items[index].quantity + amount > 0) {
      this.cart.items[index].quantity += amount;
  	} else if (this.cart.items[index].quantity + amount === 0) {
      this.cart.items.splice(index,1);
  	}
    this.shop.client.carts.save(this.cart).toPromise().then((response)=>{

    });
  }

  increaseQuantity(index) {
  	return this.updateQuantity(index,1);
  }

  decreaseQuantity(index) {
  	return this.updateQuantity(index,-1);
  }

  getCartTotal() {
  	if (this.cart.items.length === 0)
  		return 0;

  	return this.cart.items.map((item) => {
  		if (item.price_discount)
  			return item.quantity*item.price_discount;
  		else
  			return item.quantity*item.price;
  	}).reduce((a,b) => {
  		return a+b;
  	});
  }


  proceedToCheckout() {
    // Showing single product details
    this.navCtrl.push(CheckoutPage);
  }

}
