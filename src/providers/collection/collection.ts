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
        let val = params[k];
        if(val instanceof Object){
          val = JSON.stringify(val);
        }
        reqOpts.params = reqOpts.params.set(k, val);
      }
    }

    return this.http.get(this.url + '/' + this.endpoint, reqOpts);
  }

  get(id:string,reqOpts?: any){
    return this.http.get(this.url + '/' + this.endpoint + '/' + id, reqOpts);
  }

  save(item: any,reqOpts?: any) {
    return this.http.post(this.url + '/' + this.endpoint, item, reqOpts);
  }

  remove(id: string,reqOpts?: any) {
    return this.http.delete(this.url + '/' + this.endpoint + "/" + id, reqOpts);
  }

}
