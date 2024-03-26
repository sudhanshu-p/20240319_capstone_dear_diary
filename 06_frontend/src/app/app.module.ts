import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeProfilePageComponent } from './home-profile-page/home-profile-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatMenuModule} from '@angular/material/menu';
import { SearchPageComponent } from './search-page/search-page.component';
import { BlogShowcaseComponentComponent } from './blog-showcase-component/blog-showcase-component.component';
import { RegisterPageComponent } from './auth/register-page/register-page.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { LastStepPageComponent } from './auth/last-step-page/last-step-page.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
