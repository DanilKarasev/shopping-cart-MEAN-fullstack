import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ViewCartComponent } from './components/view-cart/view-cart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

import { BrowserModule } from '@angular/platform-browser';
import { AddListModalComponent } from './components/add-list-modal/add-list-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddGoodModalComponent } from './components/add-good-modal/add-good-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { EditGoodModalComponent } from './components/edit-good-modal/edit-good-modal.component';
import { EditListModalComponent } from './components/edit-list-modal/edit-list-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewCartComponent,
    AddListModalComponent,
    AddGoodModalComponent,
    EditGoodModalComponent,
    EditListModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
