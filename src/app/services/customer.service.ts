import { Injectable, NgZone } from '@angular/core';
import { Customer } from 'functions/src/interfaces/customer';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import Stripe from 'stripe';
import { AngularFireFunctions } from '@angular/fire/functions';
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  customerPortalURL: string;
  customer$: Observable<Customer> = this.afAuth.user.pipe(
    switchMap((user) => {
      if (user) {
        return this.db.doc<Customer>(`customers/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );
  stripeCustomer: Stripe.Customer;
  private stripeCustomerSource$: Observable<
    Stripe.Customer
  > = this.customer$.pipe(
    switchMap((customer) => {
      if (customer) {
        const callable = this.fns.httpsCallable('getStripeCustomer');
        return callable(null);
      } else {
        return (this.customerPortalURL = null);
      }
    }),
    tap((customer: Stripe.Customer) => {
      if (customer) {
        this.getStripeCustomerPortalURL();
      } else {
        this.customerPortalURL = null;
      }
    })
  );

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private fns: AngularFireFunctions,
    private ngZone: NgZone
  ) {
    this.stripeCustomerSource$.subscribe((customer) => {
      this.stripeCustomer = customer;
    });
  }

  async getStripeCustomerPortalURL() {
    const callable = this.fns.httpsCallable('getStripeCustomerPortalURL');
    this.ngZone.run(async () => {
      this.customerPortalURL = await callable({})
        .toPromise()
        .catch((error) => {
          console.error(error);
        });
    });
  }

  async checkoutSession() {
    const callable = this.fns.httpsCallable('createCheckoutSession');
    return callable({})
      .toPromise()
      .catch((error) => {
        console.error(error);
      });
  }
}
