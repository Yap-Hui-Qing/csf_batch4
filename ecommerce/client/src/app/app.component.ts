
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import { CartStore } from './cart.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  // NOTE: you are free to modify this component

  private router = inject(Router)
  private cart = inject(CartStore)

  itemCount!: number

  ngOnInit(): void {
    this.cart.countItems.subscribe(
      (num) => {
        this.itemCount = num
      }
    )
  }

  // task 2.4
  disableCheckout(): boolean {
    if (this.itemCount === 0){
      return true
    }
    return false
  }

  checkout(): void {
    if (this.itemCount === 0){
      alert("Your cart is empty")
      return
    }
    this.router.navigate([ '/checkout' ])
  }
}
