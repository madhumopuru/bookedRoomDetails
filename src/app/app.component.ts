import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'
import { retry } from "rxjs/operators";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'bookMeeting';
  minimumstarttime;
  endtimee;
  timedisable = true;
  minimumDate = new Date();

  roomNames: roomName[] = [
    { value: "Room Number-1" },
    { value: "Room Number-2" },
    { value: "Room Number-3" },
    { value: "Room Number-4" },
    { value: "Room Number-5" },
    { value: "Room Number-6" },
    { value: "Room Number-7" },
    { value: "Room Number-8" },
    { value: "Room Number-9" },
    { value: "Room Number-10" },
  ];



  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  userNameForm = new FormControl();
  bookingroomNameForm = new FormControl();
  bookingDateForm = new FormControl();
  totimeForm = new FormControl();
  fromtimeForm = new FormControl();
  reasonForm = new FormControl();

  constructor(public dialog: MatDialog) { }
  bookedRoomArry = []

  displayedColumns: string[] = ['bookedcount', 'userName', 'bookedroomNo', 'bookedDate', 'bookedfromTime',
    'bookedtoTime', 'boodedReason', 'Status', 'columndelete']; // pagination code


  bookedData: bookedDetails[] = [];

  dataSource = new MatTableDataSource<bookedDetails>(this.bookedData);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  count = 0;
  ngOnInit() {
    setTimeout(() => this.dataSource.paginator = this.paginator);
  }
  tableData() {
    // let result = JSON.parse(localStorage.getItem('itemsArray'));
    // this.bookedData = result
    this.dataSource = new MatTableDataSource<bookedDetails>(this.bookedRoomArry);
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

    let i = this.bookedRoomArry.findIndex(value => {
      return elm.id === value.id;
    });

    this.bookedRoomArry.splice(i, 1);

    this.tableData();
  }


  visibleDate() {
    if (this.minimumstarttime != undefined) {
      this.timedisable = false;
    }
  }

  genericAlert(title, body) {
    this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: { title: title, body: body, actions: ["Ok"] }
    });
  }

  submitBooking() {

    let params = {};

    if (!this.userNameForm.valid) {
      this.genericAlert("Invalid User Name", "Please Enter User Name");
      return;
    }
    params["userName"] = this.userNameForm.value;
    if (this.bookingDateForm.value === null) {
      this.genericAlert("Invalid Date", "Please Select Date");
      return;
    }

    let dt_evaluate: string = this.bookingDateForm.value;
    let dt_evaluate_date: Date = new Date(dt_evaluate);
    params["bookedDate"] = moment(dt_evaluate_date).format("YYYY-MM-DD");

    if (this.fromtimeForm.value === null) {
      this.genericAlert("Invalid From Time", "Please Select From Time");
      return;
    }
    params["bookedfromTime"] = this.fromtimeForm.value;

    if (this.totimeForm.value === null) {
      this.genericAlert("Invalid To Time", "Please Select To Time");
      return;
    }


    var startTime = moment(this.fromtimeForm.value, 'hh:mm a');
    var endTime = moment(this.totimeForm.value, 'hh:mm: a');
    var totalHours = (endTime.diff(startTime, 'hours'));
    var totalMinutes = endTime.diff(startTime, 'minutes');
    var clearMinutes = totalMinutes % 60;
    let totalminiut = totalHours * 60 + clearMinutes
    if (30 > totalminiut) {
      this.genericAlert("Invalid Booking Time", "Booking Time Minimum 30 Minitues");
      return;
    }

    params["bookedtoTime"] = this.totimeForm.value;

    if (!this.bookingroomNameForm.valid) {
      this.genericAlert("Invalid Booking Room", "Please Select Room No");
      return;
    }

    params["bookedroomNo"] = this.bookingroomNameForm.value;

    if (!this.reasonForm.valid) {
      this.genericAlert("Invalid Reason", "Please Select Reason");
      return;
    }
    params["boodedReason"] = this.reasonForm.value;

    this.count = this.count + 1;
    params["bookedcount"] = this.count;

    let starttime = moment(this.fromtimeForm.value, 'hh:mm a');

    let startMoment = moment(this.bookingDateForm.value)
      .hour(starttime.hour())
      .minute(starttime.minute());

    let endtime = moment(this.totimeForm.value, 'hh:mm a');

    let endMoment = moment(this.bookingDateForm.value)
      .hour(endtime.hour())
      .minute(endtime.minute());

    params["startMoment"] = startMoment;
    params["endMoment"] = endMoment;
    params["id"] = new Date().getTime();

    this.bookedRoomArry.push(params);

    this.tableData();

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: { body: "Successfully you have booked Room", actions: ["OK"] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "OK") {
        this.clearForm()
      }
      else {
        this.clearForm()
      }
    });
  }
  clearForm() {
    this.userNameForm = new FormControl();
    this.bookingroomNameForm = new FormControl();
    this.bookingDateForm = new FormControl();
    this.totimeForm = new FormControl();
    this.fromtimeForm = new FormControl();
    this.reasonForm = new FormControl();
    this.minimumstarttime;
    this.endtimee
    this.timedisable = true;

  }
  getRooms() {

    let starttime = moment(this.fromtimeForm.value, 'hh:mm a');

    let startMoment = moment(this.bookingDateForm.value)
      .hour(starttime.hour())
      .minute(starttime.minute());

    let endtime = moment(this.totimeForm.value, 'hh:mm a');

    let endMoment = moment(this.bookingDateForm.value)
      .hour(endtime.hour())
      .minute(endtime.minute());

    if (this.bookingDateForm.value === null || this.fromtimeForm.value === null || this.totimeForm.value === null) {
      return [];
    }

    let room = this.roomNames.filter(value => {

      let i = this.bookedRoomArry.findIndex(item => {

        return (item.bookedroomNo === value.value) && (startMoment.isBetween(item.startMoment, item.endMoment, undefined, "[]") ||
          endMoment.isBetween(item.startMoment, item.endMoment, undefined, "[]"));

      });

      return !(i > -1);

    });

    return room;

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

}

export interface roomName {
  value: string;
}



export interface bookedDetails {
  bookedcount: number;
  userName: string;
  bookedroomNo: string;
  bookedDate: string;
  bookedfromTime: string;
  bookedtoTime: string;
  boodedReason: string;

}