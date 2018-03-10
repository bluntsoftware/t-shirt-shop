import { Component } from '@angular/core';
import {NavController, NavParams, AlertController, ModalController, IonicPage} from 'ionic-angular';

import { ItemPage } from '../item/item';
import { CartPage } from '../cart/cart';

import {ProductCreatePage} from "../product-create/product-create";
import {Shop} from "../../providers/shop/shop-service";

/*
  Generated class for the Products page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage {

  products:Array<any>;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private shop: Shop,
      private alertCtrl: AlertController,
      public modalCtrl: ModalController) {

      this.list();

  }
  ionViewDidLoad() {
  }
  list(){
    var promise:any;
    if (this.navParams.get('query')){
      promise = this.shop.client.products.query(this.navParams.get('query')).toPromise();
    } else {
      promise = this.shop.client.products.query().toPromise();
    }

    promise
      .then((response) => {
        console.log(response);
        this.products = response.rows;
      })
      .catch((error) => {
        let alert = this.alertCtrl.create({
          title: 'Oops',
          subTitle: 'Unable to load products, please check your internet connection.',
          buttons: ['Ok']
        });

        alert.present();
      })
  }
  getItems(ev) {
    let val = ev.target.value;
    let listParams = {rows:12,page:1,defaultsearchoper:"icn"};
    listParams['filterByFields'] =  {'name':{'$regex' : '^'+val, '$options' : 'i'}};//starts with incase sensitive
    this.shop.client.products.query(listParams).subscribe((resp) => {
      this.products = resp['rows'];
    });
  }
  addProduct() {
    let addModal = this.modalCtrl.create('ProductCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.shop.client.products.save(item).subscribe((resp) => {
          this.list();
        });
      }
    });
    addModal.present();
  }


  viewItemDetails(product){
  	// Showing single product details
  	this.navCtrl.push(ItemPage,{
  		product : product
  	})
  }

  viewCart() {
    this.navCtrl.push(CartPage)
  }

}
