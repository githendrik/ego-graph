import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ApiHttpService } from './api-http.service';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgxFileDropModule,
    BrowserAnimationsModule,
    NgxGraphModule
  ],
  providers: [
      ApiHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
