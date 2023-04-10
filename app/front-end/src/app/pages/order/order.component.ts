import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  baseUrl;
  isDisplay = false;
  isAdd = false;
  isCancel = false;
  keyWord = '';
  customers = [];
  shops = [];
  items = [];
  orderItems = [];
  currentCustomer = null;
  inputItem = {};
  shoppingCartItems = [];
  orders = [];
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

  searchItem() {
    this.httpClient.get(`${this.baseUrl}/items/kw/${this.keyWord}`).toPromise().then((items: any) => {
      this.items = items;
    });
  }

  initShop() {
    this.currentCustomer = { cid: '', telephone: '', address: '' };
  }
  initItem() {
    this.inputItem = { name: '', price: '', kw1: '', kw2: '', kw3: '', shop_id: '' };
  }

  checkCustomer() {
    this.httpClient.get(`${this.baseUrl}/customers/${this.currentCustomer.customer_id}`)
      .toPromise().then((currentCustomer: any) => {
        this.currentCustomer = currentCustomer;
      });
    console.log('currentCustomer', this.currentCustomer);
  }

  showSearchPanel() {
    this.isDisplay = true;
    this.isAdd = false;
    this.isCancel = false;
    this.loadAllCustomers();
  }

  loadAllCustomers() {
    setTimeout(() => {
      this.httpClient.get(`${this.baseUrl}/customers`).toPromise().then((customers: any) => {
        this.customers = customers;
      });
    }, 1000);
  }

  loadAllOrders() {
    setTimeout(() => {
      this.httpClient.get(`${this.baseUrl}/orders`).toPromise().then((orders: any) => {
        this.httpClient.get(`${this.baseUrl}/orders/items`).toPromise().then((orderItems: any) => {
          orders.forEach(o => o.details = orderItems.filter(oi => oi.order_id == o.order_id));
          this.orders = orders;
          console.log('orders', orders);
        });

      });
    }, 1000);
  }

  showAddItems() {
    this.isDisplay = false;
    this.isAdd = true;
    this.isCancel = false;
    this.loadAllCustomers();
  }

  showCancelItems() {
    this.isDisplay = false;
    this.isAdd = false;
    this.isCancel = true;
    this.loadAllOrders();
  }

  addItemToCart(item_id) {
    console.log('itemId', item_id);
    if (this.checkItemExist(item_id)) {
      this.orderItems.find(s => s.item_id == item_id).quantity++;
    } else {
      this.orderItems.push({
        item_id,
        quantity: 1
      });
    }
    console.log('this.orderItems', this.orderItems);
    toastr.success('Add item to Shopping Cart Successfully');
  }

  checkItemExist(item_id) {
    return this.orderItems.filter(s => s.item_id == item_id).length > 0
  }

  purchaseItem() {
    console.log('this.orderItems', this.orderItems);
    console.log('this.currentCustomer', this.currentCustomer);
    this.httpClient.post(`${this.baseUrl}/orders`, {
      orders: this.orderItems,
      customer_id: this.currentCustomer.customer_id
    }).toPromise().then((response: any) => {
      this.initItem();
      this.currentCustomer = null;
      toastr.success(response.message);
      this.orderItems = [];
      this.showSearchPanel();
    });
  }

  deleteOrder(o) {
    this.httpClient.delete(`${this.baseUrl}/orders/${o.order_id}`).toPromise().then((response: any) => {
      toastr.success(response.message);
      this.loadAllOrders();
    });
  }
  deleteItem(d) {
    this.httpClient.delete(`${this.baseUrl}/orders/items/${d.oi_id}`).toPromise().then((response: any) => {
      toastr.success(response.message);
      this.loadAllOrders();
    });
  }

}
