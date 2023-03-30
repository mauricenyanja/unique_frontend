import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms'; // <-- import this
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
// import { MaterialModule } from './material.module';

// import the ButtonModule from PrimeNGangular prime ng i get this error

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    DialogModule,
    InputMaskModule,
    FormsModule,
    // MaterialModule,
  ],
  exports: [ButtonModule], // add ButtonModule to the exports array

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
