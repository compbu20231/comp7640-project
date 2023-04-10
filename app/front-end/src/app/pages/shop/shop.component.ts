declare var toastr: any;
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  baseUrl;
  isDisplay = false;
  isAdd = false;
  shops = [];
  inputShop = {};
  constructor(private httpClient: HttpClient, private nbService: NavbarService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.baseUrl = this.nbService.baseUrl;
      console.log('baseUrl', this.baseUrl);
    }, 1000);
    this.initShop();
  }
  initShop() {
    this.inputShop = { sname: '', rating: '', location: '' };
  }

  showAllShops() {
    this.isDisplay = true;
    this.isAdd = false;
    setTimeout(() => {
      this.httpClient.get(`${this.baseUrl}/shops`).toPromise().then((shops: any) => {
        this.shops = shops;
      });
    }, 1000);
  }

  showAddShop() {
    this.isDisplay = false;
    this.isAdd = true;
    console.log('inputShop', this.inputShop);
  }

  addShop() {
    this.httpClient.post(`${this.baseUrl}/shops`, this.inputShop).toPromise().then((response: any) => {
      this.initShop();
      toastr.success(response.message);
      this.showAllShops();
    });


  }

}
