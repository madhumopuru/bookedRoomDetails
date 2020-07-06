import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

import {Router} from '@angular/router';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-createmeetingroom',
  templateUrl: './createmeetingroom.component.html',
  styleUrls: ['./createmeetingroom.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreatemeetingroomComponent implements OnInit {
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

  constructor(public dialog: MatDialog, private router: Router) { }


  bookedRoomArry = []

 
  ngOnInit() {
    
  }
 
 
  visibleDate() {
    if (this.minimumstarttime != undefined) {
      this.timedisable = false;
    }
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

    // this.count = this.count + 1;
    // params["bookedcount"] = this.count;

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

    //this.bookedRoomArry.push(params);

   // this.tableData();
   localStorage.setItem("bookedDate", this.bookingDateForm.value);
   localStorage.setItem("bookedFromTime", this.fromtimeForm.value);
   localStorage.setItem("bookedToTime", this.totimeForm.value);


   var oldItems = JSON.parse(localStorage.getItem('itemsArray')) || [];

   oldItems.push(params);

   localStorage.setItem('itemsArray', JSON.stringify(oldItems));
   var bookedArrayData = JSON.parse(localStorage.getItem('itemsArray'));

    console.log(bookedArrayData);

    this.router.navigate(['meetingRoomDetails']);

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: { body: "Successfully you have booked Room", actions: ["OK"] }
    });

  }
  

  getRooms() {

    var bookedToTime = localStorage.getItem("bookedToTime");
    var bookedFromTime = localStorage.getItem("bookedFromTime");
    var bookedDate = localStorage.getItem("bookedDate");

    let starttime = moment(bookedFromTime, 'hh:mm a');

    let startMoment = moment(bookedDate)
      .hour(starttime.hour())
      .minute(starttime.minute());

    let endtime = moment(bookedToTime, 'hh:mm a');

    let endMoment = moment(bookedDate)
      .hour(endtime.hour())
      .minute(endtime.minute());

    if (bookedDate === null || bookedFromTime === null || bookedToTime === null) {
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

  

  genericAlert(title, body) {
    this.dialog.open(AlertDialogComponent, {
      minWidth: '250px',
      data: { title: title, body: body, actions: ["Ok"] }
    });
  }

}

export interface roomName {
  value: string;
}