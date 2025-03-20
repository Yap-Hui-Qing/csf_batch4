import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Cart, LineItem } from "./models";
import { createMayBeForwardRefExpression } from "@angular/compiler";

const INIT: Cart = {
       lineItems: [] 
    }

@Injectable()
// TODO Task 2
// Use the following class to implement your store
export class CartStore extends ComponentStore<Cart> {

    constructor(){
        super(INIT)
    }
    
    // task 2.2
    // addProduct(newProduct)
    readonly addProduct = this.updater<LineItem>(
        (cart: Cart, newProduct: LineItem) => {
            return {
                lineItems: [...cart.lineItems, newProduct]
            }
        }
    )

    // task 2.3
    readonly countItems = this.select<number>(
        (cart: Cart) => {
            const prodIds = new Set(cart.lineItems.map(li => li.prodId))
            return prodIds.size
        }  
    )

    readonly getItems = this.select<LineItem[]>(
        (cart: Cart) => cart.lineItems
    )

    readonly clearCart = this.updater(
        (cart: Cart) => {
            return {
                ...cart,
                lineItems: []
            }
        }
    )

}
