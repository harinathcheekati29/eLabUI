import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { routing } from './fbi-exam.routes';
import { EvidenceTable } from './evidence-table/evidence-table.component';
import { NoteTable } from './note-table/note-table.component';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    routing,
  ],
  exports: [

  ],
  declarations:[
    EvidenceTable,
    NoteTable
  ],
  providers: [
    
  ]
})
export class QdetailsModule {

}
