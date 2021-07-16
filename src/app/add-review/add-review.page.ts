import { Component, OnInit, ApplicationRef } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';

import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/providers/loading/loading.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.page.html',
  styleUrls: ['./add-review.page.scss'],
})
export class AddReviewPage implements OnInit {

  rating = null;
  nonce;
  errorMessage = '';
  id;
  formData = { name: '', email: '', description: '' };

  ratingStars = [
    { value: '1', fill: 'star-outline' },
    { value: '2', fill: 'star-outline' },
    { value: '3', fill: 'star-outline' },
    { value: '4', fill: 'star-outline' },
    { value: '5', fill: 'star-outline' }
  ];
  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public config: ConfigService,
    private activatedRoute: ActivatedRoute,
    public loading: LoadingService,
    public shared: SharedDataService,
    private applicationRef: ApplicationRef,
    private toastCtrl: ToastController
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.formData.name = this.shared.customerData.first_name + " " + this.shared.customerData.last_name;
    this.formData.email = this.shared.customerData.email;
  }

  addComment() {
    var dat: { [k: string]: any } = {};
    dat.products_id = this.id;
    dat.customers_id = this.shared.customerData.customers_id;
    dat.customers_name = this.formData.name
    dat.reviews_rating = this.rating;
    dat.languages_id = this.config.langId;
    dat.reviews_text = this.formData.description;

    this.loading.show();
    console.log('post review == ', dat)
    this.config.postHttp('givereview', dat).then((data: any) => {
      console.log('add review == ', data)
      this.loading.hide();
      if (data.success == 1) {
        this.showToast(data.message);
        this.navCtrl.pop();
      }
    });

  }

  selectRating(value) {
    this.rating = value;
    for (let v of this.ratingStars) {
      if (v.value <= value) v.fill = 'star';
      else v.fill = 'star-outline';
    }
    this.applicationRef.tick();
  }
  disbaleButton() {
    //this.applicationRef.tick();
    if (this.rating == null) { return true; }
    else if (this.formData.description == "") { return true; }
    else if (this.formData.name == "") { return true; }
    else if (this.formData.email == "") { return true; }
    else { return false; }
  }
  ngOnInit() {
  }

  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      mode: 'ios',
      duration: 2000
    });
    toast.present();
  }

}
