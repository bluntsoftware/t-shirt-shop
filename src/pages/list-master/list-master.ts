import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Item } from '../../models/item';

import {MainPage} from "../pages";
import {Collection, Conduit} from "@bluntsoftware/iglue";




@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  collection: Collection;
  currentItems:any[];

  constructor(public navCtrl: NavController, public conduit: Conduit, public modalCtrl: ModalController) {
    this.collection = this.conduit.collection("items");
    this.list();
  }
  list(){
    this.collection.query().subscribe((resp) => {
      this.currentItems = resp['rows'];
    });
  }
  getItems(ev) {
    let val = ev.target.value;
    let listParams = {rows:12,page:1,defaultsearchoper:"icn"};
    listParams['filterByFields'] =  {'name':{'$regex' : '^'+val, '$options' : 'i'}};//starts with incase sensitive
    this.collection.query(listParams).subscribe((resp) => {
      this.currentItems = resp['rows'];
    });
  }
  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.collection.save(item).subscribe((resp) => {
           this.list();
        });
      }
    });
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.collection.remove(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}
