import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import * as moment from 'moment-timezone';
import * as $ from 'jquery';
import { Location } from '@angular/common';
import { FbiNotesService } from '../api-kit/notes/fbi-notes.service';

@Component({
    selector : 'fbi-note',
    templateUrl : './fbi-note.page.html',
    styleUrls : ['./fbi-note.component.css']
})
export class FBINotePage implements OnInit{
    path : 'view' | 'new' = 'new';
    type : 'Shoe' | 'Tire' = 'Tire';

    assessmentModel = 0;
    assessmentOptions = [];

    conductedBy = 0;
    conductedOptions = [];

    startDate = { date: '', month: '', year: '', hours: '', mins: '',secs: '', zone: '' };
    startDateError: boolean = false;

    requestType = [];
    requestOptions = [];

    methodModel = 0;
    methodOptions = [];

    id : number;
    examId : number;
    textData : any;
    markComplete : boolean = false;
    tableDetailKnown = [];
    tableDetailQues = [];
    now = moment();

    constructor( private router: Router, private route: ActivatedRoute, private location: Location, private note : FbiNotesService){

    }
    

    ngOnInit(){
        this.determinePath();
        this.determineType();

        this.assessmentModel = 0;
        this.assessmentOptions = [
            {value : 0, label : 'Select Option'},
            {value : 1, label : 'Initial Assessment'}
        ];

        this.route.params.subscribe(param => {
            this.id = param['id'];
            this.examId = param['examId'];
            //console.log("Note id " + this.id);
            //console.log("Exam id " + this.examId);
        });

        
        


        this.startDate = {
            date: this.now._d.getDate(),
            month: this.now._d.getMonth() + 1,
            year: this.now._d.getFullYear(),
            hours: this.now._d.getHours(),
            mins: this.now._d.getMinutes(),
            secs: this.now._d.getSeconds(),
            zone: moment().format('Z')
        }        
        
        this.populateForm();
        this.getNoteDetails();
    }
    
    determinePath() {
        if (/\/view/.test(this.router.url)) {
            this.path = 'view';
        }
    }

    determineType(){
        if (/\/shoe/.test(this.router.url)) {
            this.type = 'Shoe';
        }
    }

    mapLabelAndValue(val){
        return {label: val.value, value: val.id};
    }

    validateDate() {
        if(this.startDate.year != '' || this.startDate.month != '' || this.startDate.date != ''){
            this.startDate.hours = this.now._d.getHours();
            this.startDate.mins = this.now._d.getMinutes();
            this.startDate.secs = this.now._d.getSeconds();
            this.startDate.zone = moment().format('Z');

            if (!moment(this.startDate.year + '-' + this.startDate.month + '-' + this.startDate.date + 'T' + this.startDate.hours + ":" + this.startDate.mins + this.startDate.zone, "YYYY-MM-DDTHH:mmZ").isValid()) {
                this.startDateError = true;
            }
            else {
                this.startDateError = false;
            }
        }

    }

    onSave(){
        this.validateDate();
        if(this.startDateError === false){
            this.location.back();
            window.scrollTo(0,0);
        }
    }

    onCancel(){
        this.location.back();
        window.scrollTo(0,0);
    }

    populateForm(){
        this.note.getDropDown('Conducted by').subscribe(res => {
            this.conductedOptions = res.map(this.mapLabelAndValue);
            this.conductedOptions.unshift({value : 0, label : "Select Option"});
        });
        this.note.getDropDown('Request Type',this.type).subscribe(res =>{
            this.requestOptions = res.map(this.mapLabelAndValue);            
        });
        this.note.getDropDown('Method',this.type).subscribe(res => {
            this.methodOptions = res.map(this.mapLabelAndValue);
            this.methodOptions.unshift({value : 0, label : 'Select Option'});
        });
    }

    getNoteDetails(){
       if(this.path != 'new'){
            this.note.getNoteById(this.id).subscribe( res => {
                //console.log(res);
                this.conductedBy = res.noteData.conductedBy;
                this.startDate.date = moment(res.createdDate).format("DD");
                this.startDate.month = moment(res.createdDate).format("MM");
                this.startDate.year = moment(res.createdDate).format("YYYY");
                this.methodModel = res.noteData.method;
                this.textData = res.noteMessage;
                this.markComplete = res.markedComplete;
            });

            this.note.getNoteDetails(this.examId,1,this.type).subscribe( res => {
                //console.log(res);
                if(this.type =='Shoe' && res.length > 0){
                    //console.log(res[0].shoeNotes);
                    res[0].shoeNotes.forEach(note => {
                        //console.log(note.knowns);
                        if(note.initialAssessmentNote.id == this.id){
                            //console.log("Now");
                            this.tableDetailKnown = note.knowns;
                            this.tableDetailQues = note.questions;
                        }   
                        
                    });
                }
                else if(this.type =='Tire' && res.length > 0){
                    //this.tableDetail = res[0].tireNotes;
                    res[0].tireNotes.forEach(note => {
                        if(note.initialAssessmentNote.id == this.id){
                            this.tableDetailKnown = note.knowns;
                            this.tableDetailQues = note.questions;
                        }
                    });
                }
            });
            this.assessmentModel = 1;
       }            
    }

    postNote(enter : string){

               
        let objPost : any = {
            caseId : 1,
            examId : this.examId,
            markedComplete : this.markComplete,
            noteType : 1,
            itemType : this.type,
            noteMessage : this.textData,
            createdDate : "",
            noteData : {
                conductedBy : this.conductedBy,
                method : this.methodModel,
                requestType: this.requestType
            }
        }

        if(this.startDateError == false){
            if(this.startDate.year != '' || this.startDate.month != '' || this.startDate.date != ''){
                objPost.createdDate = this.startDate.year + '-' + this.startDate.month + '-' + this.startDate.date + 'T' + this.startDate.hours + ":" + this.startDate.mins +":" +this.startDate.secs + this.startDate.zone;
            }
        }

        if(this.path == 'view'){
            objPost.id = this.id;
        }

        if(enter == 'save'){
            
        }

    } 
        
}