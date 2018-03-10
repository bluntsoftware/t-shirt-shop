import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import {ProductCreatePage} from "./product-create";
import {IonicPageModule} from "ionic-angular";

@NgModule({
  declarations: [
    ProductCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ProductCreatePage),
    TranslateModule.forChild()
  ],
  exports: [
    ProductCreatePage
  ]
})
export class ProductCreatePageModule { }
