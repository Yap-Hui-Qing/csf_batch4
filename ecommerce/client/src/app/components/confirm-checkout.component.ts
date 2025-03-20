import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartStore } from '../cart.store';
import { map, Observable, reduce } from 'rxjs';
import { LineItem, Order } from '../models';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-checkout',
  templateUrl: './confirm-checkout.component.html',
  styleUrl: './confirm-checkout.component.css'
})
export class ConfirmCheckoutComponent implements OnInit {

  // TODO Task 3
  private fb = inject(FormBuilder)
  private cartStore = inject(CartStore)
  private productSvc = inject(ProductService)
  private router = inject(Router)

  protected form!: FormGroup
  protected cart$: Observable<LineItem[]> = this.cartStore.getItems
  protected total$!: Observable<number>
  protected items!: LineItem[]

  ngOnInit(): void {
    this.form = this.createForm()
    this.total$ = this.processTotal()
    this.cart$.subscribe(
      (list) => this.items = list
    )
  }

  protected createForm(): FormGroup {
    return this.fb.group({
      name: this.fb.control<string>('', [ Validators.required ]),
      address: this.fb.control<string>('', [ Validators.required, Validators.minLength(3)]),
      priority: this.fb.control<boolean>(false),
      comments: this.fb.control<string>('')
    })
  }

  protected processTotal() {
    return this.cart$.pipe(
      map(cart => cart.reduce(
        (total: number, li: LineItem) => total + (li.price * li.quantity), 0)
      )
    );
  }

  protected checkout(){
    const order: Order = {
      name: this.form.value['name'],
      address: this.form.value['address'],
      priority: this.form.value['priority'],
      comments: this.form.value['comments'],
      cart: {lineItems: this.items}
    }
    console.info('>>> checkout order: ',order)
    this.productSvc.checkout(order).then(
      (result) => {
        alert(`Your order id is ${result.orderId}`)
        this.cartStore.clearCart()
        this.router.navigate(['/'])
      }
    )
    .catch (
      (err) => {
        const errorMessage = err.error?.message
        alert(errorMessage)
        return
      }
    )
  }
}
