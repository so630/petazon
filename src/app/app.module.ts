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

const routes: Routes = [
  {path: '', component: LandingPageComponent}
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
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
