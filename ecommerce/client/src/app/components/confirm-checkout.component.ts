import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartStore } from '../cart.store';
import { map, Observable, reduce } from 'rxjs';
import { LineItem } from '../models';
import { ProductService } from '../product.service';

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

  protected form!: FormGroup
  protected cart$: Observable<LineItem[]> = this.cartStore.getItems
  protected total$!: Observable<number>

  ngOnInit(): void {
    this.form = this.createForm()
    this.total$ = this.processTotal()
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

  }
}
