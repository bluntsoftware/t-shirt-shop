import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import {IonicPage, NavController, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-product-create',
  templateUrl: 'product-create.html'
})
export class ProductCreatePage {
  @ViewChild('fileInput') fileInput;
  isReadyToSave: boolean;
  form: FormGroup;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, fb: FormBuilder, public camera: Camera) {
    this.form = fb.group({
      images:fb.array([]),
      name: ['', Validators.required],
      price: [''],
      _id:['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.get("images").value.push('data:image/jpg;base64,' + data );
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      this.form.get("images").value.push((readerEvent.target as any).result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }
  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }
}
