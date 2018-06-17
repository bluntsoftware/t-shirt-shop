import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { OrderCompleteModalPage } from '../order-complete-modal/order-complete-modal';

import { ModalController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import {Conduit} from "@bluntsoftware/iglue";



/**
 * Generated class for the CheckoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  step : number;

  cart : any = {items : []};

  currentStep : string;

  address : any;

  braintreeNonce : string;

  constructor(
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    //private braintreeClient: BraintreeProvider,
    public alertCtrl  :AlertController,
    public conduit: Conduit) {

    // Initial step counter
    this.step = 0;
    this.currentStep = "Address";


    // Available steps
    //"Address",
    //"Payment",
    //"Review"

    this.address = {
      full_name : "John Doe",
      country : " Italy",
      state : "Marche",
      city : "Ancona",
      postal_code : "123",
      email  :"john.doe@example.com",
      address1 : "Fake Street"
    };


    let cart_id = localStorage.getItem('cart_id');
    this.conduit.collection("cart").getById(cart_id)
    .then((response) => {
      this.cart = response;
    })
    .catch((error) =>{
      let alert = this.alertCtrl.create({
          title: 'Oops',
          subTitle: 'An error has occurred, unable to load order items.',
          buttons: ['Ok']
        });

        alert.present();
    })

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
    var that : any = this;
    var braintreeIntegrationConfig : any = {
        id: "payment-form",
        hostedFields: {
          number: {
            selector: "#credit-card-number"
          },
          cvv: {
            selector: "#cvv"
          },
          expirationDate: {
            selector: "#expiration-date"
          },
          styles: {
            // Style all elements
            'input': {
               'background-color':'red',
              'font-size': '16px',
              'color': '#3A3A3A',
              'height':  '32px',
              'border' : '1px solid #ccc',

            },

            // Styling a specific field
            '.number': {
              'background-color':'red',
              'border' : '1px solid #ccc',
              'height':  '32px'
            },

            // Styling element state
            ':focus': {
              'color': 'blue'
            },
            '.valid': {
              'color': 'green'
            },
            '.invalid': {
              'color': 'red'
            }
          }
        },
        onPaymentMethodReceived : function(response) {
          // We received the nonce from Braintree
          // we store it into a class propertu
          that.braintreeNonce = response.nonce;
        }
      };

   /* this.conduit.client.payments.braintree.createClientToken()
    .then ( (response) => {
      // We got the Braintree Token from Marketcloud
      this.braintreeClient.braintreeClient.setup(response.data.clientToken, "custom", braintreeIntegrationConfig);
    })
    .catch( (error) => {
      alert("An error has occurred, payment gateway not available");
      console.log(error);
    })
*/


  }


  validateAddress() {
    return true;
  }

  validatePayment() {
    return true;
  }


  proceedToNextStep() {

    if (this.currentStep === "Address") {
      this.currentStep = "Review";
      return;
    }

    if (this.currentStep === "Review") {
      // We fetch the payment nonce from braintree

      // Lets get the submit button, its hidden for style purposes
      var btn : any = document.querySelector('input#submitButton');
      // trigger the click event
      btn.click();

      this.currentStep = "Payment";

      return;

    }

    if (this.currentStep === "Payment") {
      // We validate the payment and the address

      //if validation returns true, then we create the order



    }



  }

  completeCheckout() {
      if (true === this.validateAddress() && true === this.validatePayment()){

        let loading = this.loadingCtrl.create({
          content: "Completing checkout, please wait..."
        });

        loading.present();
        let cart_id = localStorage.getItem('cart_id');
        return this.conduit.collection("order").save({
          shipping_address : this.address,
          billing_address : this.address,
          cart_id :  cart_id
        })
        .then( (response) => {


        })
        .then( (response) => {
            // Here you can move your user into the order complete view
            loading.dismiss();

            // The modal will show "Order complete"
            let myModal = this.modalCtrl.create(OrderCompleteModalPage);

            // Emptying the view stack
            this.navCtrl.popToRoot()
            .then( () => {
              myModal.present();
            })
            .catch( (error) => {
              console.log("An error has occurred while navigating back to the root view",error)
            })

         })
        .catch( (response) => {
          console.log("An error has occurred creating the order",response);
          loading.dismiss();
        })
      }
  }

}
