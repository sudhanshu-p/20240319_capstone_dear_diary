import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeProfilePageComponent } from './home-profile-page/home-profile-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { RegisterPageComponent } from './auth/register-page/register-page.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { LastStepPageComponent } from './auth/last-step-page/last-step-page.component';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { CreatePageComponent } from './create-page/create-page.component';

const routes: Routes = [
  { path: '', component: HomeProfilePageComponent, data: { "home": true } },
  { path: "search", component: SearchPageComponent },
  { path: "register", component: RegisterPageComponent },
  { path: "login", component: LoginPageComponent },
  { path: "last-step", component: LastStepPageComponent },
  { path: "pages/:url", component: BlogPageComponent },
  { path: "users/:username", component: HomeProfilePageComponent, data: { "home": false } },
  { path: "create", component: CreatePageComponent },
  { path: "**", component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
