import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  baseUrl;
  isDisplay = false;
  isAdd = false;
  shops = [];
  items = [];
  currentShop = null;
  inputItem = {};
  constructor(private httpClient: HttpClient, private nbService: NavbarService) { }

  ngOnInit(): void {
    this.initItem();
    setTimeout(() => {
      this.baseUrl = this.nbService.baseUrl;
      console.log('baseUrl', this.baseUrl);
    }, 1000);
    $(".mdb-select").materialSelect();
    $('.select-wrapper').css("margin-top", 0);
  }
  initShop() {
    this.currentShop = { name: '', rating: '', location: '', shop_id: '' };
  }
  initItem() {
    this.inputItem = { name: '', price: '', kw1: '', kw2: '', kw3: '', shop_id: '' };
  }

  checkShop() {
    this.httpClient.get(`${this.baseUrl}/items/shop/${this.currentShop.shop_id}`).toPromise().then((items: any) => {
      this.items = items;
      console.log('items', items);
    });
    console.log('currentShop', JSON.stringify(this.currentShop));
  }

  showAllShops() {
    this.isDisplay = true;
    this.isAdd = false;
    this.loadAllShops();
  }

  loadAllShops() {
    setTimeout(() => {
      this.httpClient.get(`${this.baseUrl}/shops`).toPromise().then((shops: any) => {
        this.shops = shops;
        console.log('shops', shops);
      });
    }, 1000);
  }

  showAddItems() {
    this.isDisplay = false;
    this.isAdd = true;
    this.loadAllShops();
  }

  addItem() {

    this.inputItem = { ...this.inputItem, shop_id: this.currentShop.shop_id };
    console.log('this.inputItem', this.inputItem);
    this.httpClient.post(`${this.baseUrl}/items`, this.inputItem).toPromise().then((response: any) => {
      this.initItem();
      toastr.success(response.message);
      this.checkShop();
      this.showAllShops();
    });
  }

}
