// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDn9iFnVkalY34LDtOZN8EIfESlYVDihtA',
    authDomain: 'okr-app-de4fa.firebaseapp.com',
    databaseURL: 'https://okr-app-de4fa.firebaseio.com',
    projectId: 'okr-app-de4fa',
    storageBucket: 'okr-app-de4fa.appspot.com',
    messagingSenderId: '104962990037',
    appId: '1:104962990037:web:a6c1523b55ee08e88ea75c',
    measurementId: 'G-YHBESMER0K',
  },
  stripe: {
    publicKey:
      'pk_test_51IQhd5CAsdWUt7GbLUEwKC0uMlpZAsblK1aGUFepqTSqfpkbt1dXnARZrDIvz1hHC4EKRIcFWVB68ObCwTCsR9yx00T0ZSu7lH',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
