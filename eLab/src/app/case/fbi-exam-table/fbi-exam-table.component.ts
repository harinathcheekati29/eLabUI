import {Component,OnInit} from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector : 'fbi-exam-table',
  templateUrl : './fbi-exam-table.template.html',
  styleUrls : ['./fbi-exam-table.component.css']
})
export class FBIExamTable implements OnInit{
  heading;
  data;
  flag = false;
  constructor(){

  }

  ngOnInit(){
    this.heading = {
      tableHeading : 'Examinations',
      mainHeading : ['Type', 'Name', 'Examiner','Start Date/Time', 'Completed Date/Time'],
      addButton : 'Create Exam',
    };
    this.data = [
      {
        Type : 'Shoe/Tire',
        Name : 'Exam Name',
        Examiner : 'Josh Wilson',
        Start : '2017-03-25T21:41:00.000-0400',
        Completed : '2017-03-25T21:41:00.000-0400'
      },
      {
        Type : 'Shoe/Tire',
        Name : 'Exam Name',
        Examiner : 'Josh Wilson',
        Start : '2017-03-25T21:41:00.000-0400',
        Completed : '2017-03-25T21:41:00.000-0400'
      }
    ]
  }

  formatDate(date){
    if(date != '' && date != null)
      return moment(date).format("MMM DD, YYYY HH:mm Z");
    else
      return '--';
  }

  checkFlag(){
    this.flag = !this.flag;
    return this.flag;
  }
    
}