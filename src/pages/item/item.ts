import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Conduit} from "@bluntsoftware/iglue";


/*
  Generated class for the Item page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-item',
  templateUrl: 'item.html'
})
export class ItemPage {

  product:any;
  selectedVariants:any = {};
  cart_id:number;
  constructor(  public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                private conduit: Conduit,
                public storage: Storage) {


        this.product = this.navParams.get('product');



  }



  ionViewDidLoad() {

  }

  addToCart(product) {
  	let loading = this.loadingCtrl.create({content: 'Adding to cart...'});
  	loading.present();
    let line_item:any = {};
    line_item.product  = product;
    line_item.quantity = 1;

    if (this.product.type === 'product_with_variants'){
      line_item.options = this.selectedVariants;
    }

    let cart_id = localStorage.getItem('cart_id');
    if(!cart_id){
      let cart = {'items':[]};
      cart['items'].push(line_item);
      this.conduit.collection("cart").save(cart).toPromise().then((response)=>{
        localStorage.setItem('cart_id', response._id);
        loading.dismiss();
      })
    }else{
      this.conduit.collection("cart").getById(cart_id)
        .then((cart) => {
          if(!cart['items']){
            cart['items'] = [];
          }
          cart['items'].push(line_item);
          this.conduit.collection("cart").save(cart).toPromise().then((response)=>{
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Added to cart!',
              subTitle: 'Item added to cart',
              buttons: ['Ok']
            });

            alert.present();
          })

        }).catch((error) => {
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'An error has occurred, please retry.',
          buttons: ['Ok']
        });
        alert.present();
      });
    }

  }

  keys(obj) : Array<string> {
    return Object.keys(obj);
  }


  requiredOptionsAreMissing() {



    if (this.product.type === 'product_with_variants') {
      if (Object.keys(this.selectedVariants).length < Object.keys(this.product.variantsDefinition).length)
        return true;
    }

    return false;
  }

}
