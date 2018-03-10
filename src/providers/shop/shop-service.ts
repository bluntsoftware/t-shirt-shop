import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ConduitService} from "../api/conduit-service";

@Injectable()
export class Shop extends ConduitService{
  url: string = 'http://jerb.bluntsoftware.com/FilesRUS';
  constructor(public http: HttpClient){
    super(http);
    this.client.carts = this.collection('cart');
    this.client.products = this.collection('product');
    this.client.categories = this.collection('category');
    this.client.tags = this.collection('tags');
  }

  defaultItem: any = {
    "name": "Burt Bear",
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt is a Bear.",
  };

}
