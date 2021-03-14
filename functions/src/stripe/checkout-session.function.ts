import { stripe } from './client';
import * as functions from 'firebase-functions';
import { db } from '../index';
import { auth } from 'firebase-admin';

const YOUR_DOMAIN = 'https://okr-app-de4fa.web.app';

export const createCheckoutSession = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate(async (user: auth.UserRecord) => {
    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'jpy',
              product_data: {
                name: '開発資金をサポートする',
              },
              unit_amount: 500,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/manage/home`,
        cancel_url: `${YOUR_DOMAIN}/settings`,
      });

      return db
        .doc(`customers/${user.uid}/checkoutSessions/${checkoutSession.id}`)
        .set({
          checkoutSessionId: checkoutSession.id,
          success_url: `${YOUR_DOMAIN}/manage/home`,
          cancel_url: `${YOUR_DOMAIN}/settings`,
        });
    } catch (error) {
      console.error(error);
      throw new functions.https.HttpsError('unknown', error);
    }
  });
