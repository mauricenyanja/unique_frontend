import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms'; // <-- import this
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { QrCodeModule } from 'ng-qrcode';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { MessageService } from 'primeng/api';
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
    QrCodeModule,
    TabMenuModule,
    TabViewModule,
    MessagesModule,
    // MaterialModule,
    ToastModule

  ],
  exports: [ButtonModule,QrCodeModule,  TabMenuModule,
    TabViewModule,MessagesModule], // add ButtonModule to the exports array

  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
