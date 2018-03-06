import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Item } from '../../models/item';
import {Collection} from "../../providers/collection/collection";
import {CollectionFactory} from "../../providers/collection/collection_factory";
import {MainPage} from "../pages";


@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  collection: Collection;
  currentItems:any[];

  constructor(public navCtrl: NavController, public collection_factory: CollectionFactory, public modalCtrl: ModalController) {
    this.collection = this.collection_factory.collection("items");
    this.list();
  }
  list(){
    this.collection.query().subscribe((resp) => {
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
      console.log(item);
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
