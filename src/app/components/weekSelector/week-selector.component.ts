import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-week-selector',
  templateUrl: './week-selector.component.html',
  styleUrls: ['./week-selector.component.css']
})
export class WeekSelectorComponent implements OnInit {
  @Input() selectedWeek: Date = new Date();
  @Output() weekChange = new EventEmitter<{start: Date, end: Date}>();

  currentMonth = moment();
  calendarDays: any[] = [];
  isExpanded: boolean = false; // Add this property for collapse/expand state

  ngOnInit() {
    this.generateCalendar();
  }

  // Add toggle method
  toggleCalendar() {
    this.isExpanded = !this.isExpanded;
  }

  generateCalendar() {
    const startOfMonth = this.currentMonth.clone().startOf('month');
    const endOfMonth = this.currentMonth.clone().endOf('month');
    
    // Start from the Wednesday before the first day of the month
    const calendarStart = startOfMonth.clone();
    while (calendarStart.day() !== 3) { // 3 = Wednesday
      calendarStart.subtract(1, 'day');
    }

    // End at the Tuesday after the last day of the month
    const calendarEnd = endOfMonth.clone();
    while (calendarEnd.day() !== 2) { // 2 = Tuesday
      calendarEnd.add(1, 'day');
    }

    this.calendarDays = [];
    const current = calendarStart.clone();

    while (current.isSameOrBefore(calendarEnd)) {
      const selectedWeekRange = this.getCustomWeekRange(this.selectedWeek);
      
      this.calendarDays.push({
        date: current.clone(),
        isCurrentMonth: current.month() === this.currentMonth.month(),
        isInSelectedWeek: current.isBetween(selectedWeekRange.start, selectedWeekRange.end, 'day', '[]'),
        isWeekStart: current.day() === 3, // Wednesday
        isWeekEnd: current.day() === 2,   // Tuesday
      });

      current.add(1, 'day');
    }
  }

  getCustomWeekRange(date: Date): { start: Date, end: Date } {
    const momentDate = moment(date);
    const dayOfWeek = momentDate.day();
    const daysFromWednesday = (dayOfWeek + 4) % 7;
    
    const wednesday = momentDate.clone().subtract(daysFromWednesday, 'days');
    const tuesday = wednesday.clone().add(6, 'days');
    
    return { start: wednesday.toDate(), end: tuesday.toDate() };
  }

  selectWeek(date: moment.Moment) {
    this.selectedWeek = date.toDate();
    const range = this.getCustomWeekRange(this.selectedWeek);
    this.weekChange.emit(range);
    this.generateCalendar();
  }

  getSelectedWeekText(): string {
    const range = this.getCustomWeekRange(this.selectedWeek);
    const start = moment(range.start).format('MMM DD');
    const end = moment(range.end).format('MMM DD, YYYY');
    return `${start} - ${end}`;
  }

  previousMonth() {
    this.currentMonth.subtract(1, 'month');
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth.add(1, 'month');
    this.generateCalendar();
  }
}