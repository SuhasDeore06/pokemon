import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { HttpClientModule } from '@angular/common/http';
import { CardsComponent } from './cards/cards.component';
import { PopupComponent } from './popup/popup.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TemplateComponent } from './template/template.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CardsComponent,
    PopupComponent,
    PaginationComponent,
    TemplateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
