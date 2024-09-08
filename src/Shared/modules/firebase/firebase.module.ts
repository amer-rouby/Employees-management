// // src/app/firebase/firebase.module.ts
// import { NgModule } from '@angular/core';
// import { importProvidersFrom } from '@angular/core';
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { provideFirestore, getFirestore } from '@angular/fire/firestore';
// import { provideStorage, getStorage } from '@angular/fire/storage';
// import { provideFunctions, getFunctions } from '@angular/fire/functions';
// import { environment } from '../../../environments/environment';


// @NgModule({
//   providers: [
//     importProvidersFrom([
//       provideFirebaseApp(() => initializeApp(environment)),
//       provideAuth(() => getAuth()),
//       provideFirestore(() => getFirestore()),
//       provideStorage(() => getStorage()),
//       provideFunctions(() => getFunctions()),
//     ])
//   ]
// })
// export class FirebaseModule { }
