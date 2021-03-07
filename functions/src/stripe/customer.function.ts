import { db } from '../index';
import { stripe } from './client';
import Stripe from 'stripe';
import * as functions from 'firebase-functions';
import { auth } from 'firebase-admin';

// stripeに顧客情報を追加
export const createStripeCustomer = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate(async (user: auth.UserRecord) => {
    const customer: Stripe.Customer = await stripe.customers.create({
      name: user.displayName,
      email: user.email,
    });

    return db.doc(`customers/${user.uid}`).set({
      userId: user.uid,
      customerId: customer.id,
    });
  });
