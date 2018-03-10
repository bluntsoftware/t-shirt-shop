import 'rxjs/add/operator/map';
import {HttpClient, HttpParams} from "@angular/common/http";

export class ConduitService {
  url: string = 'http://localhost/glue';
  conduit:string = '/conduit/rest';
  collections = new Map<string, Collection>();
  client:any ={

  };
  _user: any;
  constructor(public http: HttpClient) {

  }
  login(accountInfo: any) {
    let seq = this.http.post(this.url +'/app/authentication/login', accountInfo).share();
    seq.subscribe((res: any) => {
        console.log(res);
    }, err => {
        console.error('ERROR', err);
    });
    return seq;
  };
  signup(accountInfo: any) {
    let seq = this.http.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }
  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }


  collection(endpoint:string): Collection{
    let collection:Collection = this.collections.get(endpoint);
    if(collection == null){
      collection = new Collection(endpoint,this.http,this.url+ this.conduit);
      this.collections.set(endpoint,collection);
    }
    return collection;
  };
}

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
