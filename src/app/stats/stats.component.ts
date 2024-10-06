import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.scss"],
})
export class StatsComponent implements OnInit {
  viewMode: string = "cards"; // Default to card view
  mockStudents: any[] = []; // Mock data for students (table data)
  mockCardStudents: any[] = []; // Data for the card view
  filteredStudents: any[] = []; // Filtered students for table view
  filteredCardStudents: any[] = []; // Filtered students for card view
  searchTerm: string = ""; // Search term for filtering
  displayedColumns: string[] = [
    "name",
    "day",
    "addedOn",
    "studied",
    "added",
    "level",
  ]; // Define table columns
  selectedWeek: string = ""; // Selected week from date picker
  weeks: string[] = [
    "07/17/24–07/23/24",
    "07/10/24–07/16/24",
    "07/03/24–07/09/24",
  ]; // Mock weeks

  constructor() {
    console.log("on stats component initialized");
  }

  ngOnInit(): void {
    // Initialize mock data for students
    const students = [
      { name: "John Doe", days: this.getMockDaysData() },
      { name: "Jane Smith", days: this.getMockDaysData() },
      { name: "Arley", days: this.getMockDaysData() },
    ];

    // Preprocess the data for both table and card views
    this.mockStudents = this.prepareTableData(students); // Prepare data for the table view
    this.filteredStudents = [...this.mockStudents]; // Initially show all students for table view
    this.mockCardStudents = this.prepareCardData(students); // Prepare data for card view
    this.filteredCardStudents = [...this.mockCardStudents]; // Initially show all students for card view

    this.selectedWeek = this.weeks[0]; // Set default selected week
  }

  // Mock days data for each student
  getMockDaysData() {
    return [
      {
        day: "Wednesday",
        studied: 46,
        added: 0,
        level: "Intermediate",
        addedOn: "Wed",
      },
      {
        day: "Thursday",
        studied: 16,
        added: 0,
        level: "Advanced",
        addedOn: "Mon",
      },
      {
        day: "Friday",
        studied: 4,
        added: 0,
        level: "Beginner",
        addedOn: "Sat",
      },
      {
        day: "Saturday",
        studied: 28,
        added: 1,
        level: "Intermediate",
        addedOn: "Sat",
      },
      {
        day: "Sunday",
        studied: 4,
        added: 0,
        level: "Advanced",
        addedOn: "Sun",
      },
      {
        day: "Monday",
        studied: 51,
        added: 0,
        level: "Intermediate",
        addedOn: "Mon",
      },
      {
        day: "Tuesday",
        studied: 4,
        added: 0,
        level: "Beginner",
        addedOn: "Tue",
      },
    ];
  }

  // Flatten the student data to make it easy to display in a table
  prepareTableData(students: any[]): any[] {
    const allRows = [];
    students.forEach((student) => {
      student.days.forEach((day) => {
        allRows.push({
          name: student.name,
          day: day.day,
          studied: day.studied,
          added: day.added,
          level: day.level,
          addedOn: day.addedOn,
        });
      });
    });
    return allRows;
  }

  // Prepare summarized data for the card view
  prepareCardData(students: any[]): any[] {
    return students.map((student) => {
      const totalStudied = student.days.reduce(
        (acc: number, day: any) => acc + day.studied,
        0
      );
      const totalAdded = student.days.reduce(
        (acc: number, day: any) => acc + day.added,
        0
      );
      return {
        name: student.name,
        totalStudied,
        totalAdded,
        days: student.days, // Keep day data for collapsible details
      };
    });
  }

  // Filter students based on search term
  filterStudents() {
    if (this.searchTerm.trim() === "") {
      // If the search term is empty, reset both lists to show all students
      this.filteredStudents = [...this.mockStudents]; // For table view
      this.filteredCardStudents = [...this.mockCardStudents]; // For card view
    } else {
      // Filter for the table view
      this.filteredStudents = this.mockStudents.filter((student) =>
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      // Filter for the card view
      this.filteredCardStudents = this.mockCardStudents.filter((student) =>
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // Switch between table and card views
  switchView(view: string) {
    this.viewMode = view;
  }

  ngDoCheck(): void {
    // This runs every time Angular checks for changes
    console.log("Current View Mode:", this.viewMode);
  }
}
