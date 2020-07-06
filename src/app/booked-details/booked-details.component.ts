import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import {Router} from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'
import { retry } from "rxjs/operators";
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-booked-details',
  templateUrl: './booked-details.component.html',
  styleUrls: ['./booked-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BookedDetailsComponent implements OnInit {

  constructor(public dialog: MatDialog, private router: Router) { }

  displayedColumns: string[] = ['bookedcount', 'userName', 'bookedroomNo', 'bookedDate', 'bookedfromTime',
  'bookedtoTime', 'boodedReason', 'Status', 'columndelete']; // pagination code


bookedData: bookedDetails[] = [];

dataSource = new MatTableDataSource<bookedDetails>(this.bookedData);
@ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    setTimeout(() => this.dataSource.paginator = this.paginator);
    this.tableData();
  }

  tableData() {
    let bookedArrayData = JSON.parse(localStorage.getItem('itemsArray'));
    this.bookedData = bookedArrayData
    this.dataSource = new MatTableDataSource<bookedDetails>(this.bookedData);
    this.dataSource.paginator = this.paginator
  }

  deleteBookedroom(elm) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: { body: 'Are you sure you want to delete Booked Room?', actions: ['Cancel', 'OK'] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.delete(elm);
      }
    });
  }

  delete(elm) {

    let i = this.bookedData.findIndex(value => {
      return elm.id === value.id;
    });

    this.bookedData.splice(i, 1);
    //console.log(this.bookedData)

    localStorage.setItem('itemsArray', JSON.stringify(this.bookedData));

    this.tableData();

  }

  
  getRoomStatus(item) {

    let current = moment();

    if (current.isAfter(item.endMoment)) {
      return "Finished";
    }

    if (current.isBetween(item.startMoment, item.endMoment, undefined, "[]")) {
      return "In Use"
    }

    return "Booked"

  }
  getStatus(item) {

    let current = moment();

    return current.isBetween(item.startMoment, item.endMoment, undefined, "[]") || current.isAfter(item.endMoment);

  }

  locationBack(){
    this.router.navigate(['createMeetingRoom']);
  }

  genericAlert(title, body) {
    this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: { title: title, body: body, actions: ["Ok"] }
    });
  }

}

export interface bookedDetails {
  id: number;
  bookedcount: number;
  userName: string;
  bookedroomNo: string;
  bookedDate: string;
  bookedfromTime: string;
  bookedtoTime: string;
  boodedReason: string;
  startMoment:any;
  endMoment: any;


}