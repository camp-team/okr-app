import { stripe } from './client';
import * as functions from 'firebase-functions';

const YOUR_DOMAIN = 'https://okr-prod.web.app/';

export const createCheckoutSession = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('permission-denied', 'not user');
    }
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

      return checkoutSession.id;
    } catch (error) {
      console.error(error);
      throw new functions.https.HttpsError('unknown', error);
    }
  });
