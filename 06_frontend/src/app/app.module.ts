import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeProfilePageComponent } from './home-profile-page/home-profile-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatMenuModule } from '@angular/material/menu';
import { SearchPageComponent } from './search-page/search-page.component';
import { BlogShowcaseComponentComponent } from './blog-showcase-component/blog-showcase-component.component';
import { RegisterPageComponent } from './auth/register-page/register-page.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { LastStepPageComponent } from './auth/last-step-page/last-step-page.component';
import { HttpClientModule } from '@angular/common/http';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarkdownModule } from 'ngx-markdown';
import { CreatePageComponent } from './create-page/create-page.component';
import { CommonModule } from '@angular/common';
import firebase from 'firebase/app'
import { getMessaging } from 'firebase/messaging';
import {FirebaseConfig} from './firebase-config'

// Initialize Firebase
const app = firebase.initializeApp(FirebaseConfig);

// Initialize Firebase Messaging
const messaging = getMessaging(app);


@NgModule({
  declarations: [
    AppComponent,
    HomeProfilePageComponent,
    NavbarComponent,
    FooterComponent,
    ErrorPageComponent,
    SearchPageComponent,
    BlogShowcaseComponentComponent,
    RegisterPageComponent,
    LoginPageComponent,
    LastStepPageComponent,
    BlogPageComponent,
    SnackbarComponent,
    CreatePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MarkdownModule.forRoot()
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
