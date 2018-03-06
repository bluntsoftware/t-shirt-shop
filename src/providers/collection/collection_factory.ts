import { Injectable } from '@angular/core';
import { Collection } from "./collection";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class CollectionFactory {
  url: string = 'http://localhost/glue/conduit/rest';
  collections = new Map<string, Collection>();

  constructor(public http: HttpClient){
  }

  collection(endpoint:string): Collection{
     let collection:Collection = this.collections.get(endpoint);
     if(collection == null){
       collection = new Collection(endpoint,this.http,this.url);
       this.collections.set(endpoint,collection);
     }
     return collection;
  }
}
