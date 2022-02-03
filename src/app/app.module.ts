import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import { Routes, RouterModule } from "@angular/router";
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeroComponent } from './landing-page/hero/hero.component';
import { NavbarComponent } from './landing-page/hero/navbar/navbar.component';
import { FeaturesComponent } from './landing-page/features/features.component';
import { CardComponent } from './landing-page/features/card/card.component';
import { BusinessesComponent } from './landing-page/businesses/businesses.component';
import { BussinessCardComponent } from './landing-page/businesses/bussiness-card/bussiness-card.component';
import { FooterComponent } from './landing-page/footer/footer.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import {HttpClientModule} from "@angular/common/http";
import { RegisterComponent } from './auth/register/register.component';
import {AuthService} from "./auth/auth.service";
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { UserDropdownComponent } from './user-dropdown/user-dropdown.component';
import { HeaderStatsComponent } from './header-stats/header-stats.component';
import { CardStatsComponent } from './card-stats/card-stats.component';
import { HomeComponent } from './marketplace/home/home.component';
import { ItemCardComponent } from './marketplace/item-card/item-card.component';

const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'marketplace', children: [
      {path: 'home', component: HomeComponent}
    ]}
];

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeroComponent,
    NavbarComponent,
    FeaturesComponent,
    CardComponent,
    BusinessesComponent,
    BussinessCardComponent,
    FooterComponent,
    SignInComponent,
    RegisterComponent,
    DashboardComponent,
    AdminNavbarComponent,
    UserDropdownComponent,
    HeaderStatsComponent,
    CardStatsComponent,
    HomeComponent,
    ItemCardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
