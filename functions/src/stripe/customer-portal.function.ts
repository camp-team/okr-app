import { stripe } from './client';
import * as functions from 'firebase-functions';
import { db } from '../index';

// portal session object のURL取得
export const getStripeCustomerPortalURL = functions
  .region('asia-northeast1')
  .https.onCall(async (data: any, context: any) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('permission-denied', 'not user');
    }

    const customer: any = (
      await db.doc(`customers/${context.auth.uid}`).get()
    ).data();

    try {
      const result = await stripe.billingPortal.sessions.create({
        customer: customer.customerId,
      });

      return result.url;
    } catch (error) {
      console.error(error);
      throw new functions.https.HttpsError('unknown', error);
    }
  });
