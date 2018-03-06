import { HttpClient, HttpParams } from '@angular/common/http';
import {Injectable} from "@angular/core";

@Injectable()
export class Collection {

  constructor(public endpoint:string,public http: HttpClient,public url:string) {

  }

  query(params?: any,reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }
    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    return this.http.get<any>(this.url + '/' + this.endpoint, reqOpts).share();
  }

  getById(id:string){

  }

  save(item: any,reqOpts?: any) {
    return this.http.post(this.url + '/' + this.endpoint, item, reqOpts).share();
  }

  remove(item: any,reqOpts?: any) {
    return this.http.delete(this.url + '/' + this.endpoint, reqOpts);
  }

}
