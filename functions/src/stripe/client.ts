import * as functions from 'firebase-functions';
import Stripe from 'stripe';

// 環境変数のkeyの取得
export const stripe = new Stripe(functions.config().stripe.key, {
  apiVersion: '2020-08-27',
});
