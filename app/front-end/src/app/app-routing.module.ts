import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ItemComponent } from './pages/item/item.component';
import { OrderComponent } from './pages/order/order.component';
import { ShopComponent } from './pages/shop/shop.component';

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "shop", component: ShopComponent },
  { path: "item", component: ItemComponent },
  { path: "order", component: OrderComponent },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
