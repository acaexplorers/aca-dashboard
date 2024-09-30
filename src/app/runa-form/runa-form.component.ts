import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CanvasService } from "../services/canvas.service";

@Component({
  selector: "app-runa-form",
  templateUrl: "./runa-form.component.html",
  styleUrls: ["./runa-form.component.scss"],
})
export class RunaFormComponent implements OnInit {
  runaForm: FormGroup;
  weeks: string[] = [
    "09/25/24-10/01/24",
    "09/18/24-09/24/24",
    // Add the rest of your week options here...
  ];

  @ViewChild("canvas", { static: true }) canvas: ElementRef<HTMLCanvasElement>; // Reference to the canvas element
  private ctx: CanvasRenderingContext2D; // Context for the canvas

  constructor(private fb: FormBuilder, private canvasService: CanvasService) {} // Inject the CanvasService

  questions: string[] = [
    "What is your current level and band in the ACA program?",
    "How many points did you earn this week?",
    "How much Explorers Gold (ExG) did you contribute this week?",
    "How many Braindumps did you contribute? (e.g., Audios, Translations, Forum Posts)",
    "In what ways did you contribute to current and future Explorers through your ACA project?",
    "What idea do you have to improve your ACA project this week?",
    "How many days did you post this week? (out of 7)",
    "What is your current Explorers Gold balance?",
    "What is your Black Band streak out of 100 days?",
    "What is your Blue Band streak out of 100 days?",
    "Are you currently in Club 100 this week?",
    "What is your added streak in days?",
    "What is your average study rate in cards per day?",
    "How many new cards did you add to your study deck last week?",
    "Which Habit Action do you most need to improve from your Habit Tracker?",
    "Which statistic do you most need to improve?",
    "Which statistic are you most proud of?",
    "Which Habit Action are you most proud of from your Habit Tracker?",
    "What is your i+1 moment for this week?",
    "How will you celebrate your success this week?",
  ];

  answers: string[] = [];

  ngOnInit(): void {
    // Initialize the form with the necessary controls
    this.runaForm = this.fb.group({
      week: ["09/25/24-10/01/24"], // Default value
      level: [""],
      band: [""],
      scholarOrExplorer: [""],
      pointsEarned: [0],
      exgContributed: [0],
      braindumpsContributed: [0],
      audios: [0],
      translations: [0],
      forumPosts: [0],
      projectContribution: [""],
      unfinishedBusiness: [""],
      newBusiness: [""],
      announcements: [""],
      signature: [""],
    });

    // Initialize the canvas context
    this.ctx = this.canvas.nativeElement.getContext("2d");

    // Use the CanvasService to initialize canvas drawing events
    this.canvasService.initCanvasEvents(this.canvas.nativeElement, this.ctx);
  }

  // Clear the canvas signature
  clearSignature(): void {
    this.canvasService.clearCanvas(this.canvas.nativeElement);
  }

  handleAnswers(answers: string[]): void {
    this.answers = answers; // Get the answers from the questionnaire
    console.log("Received answers:", this.answers);
  }

  onSubmit(): void {
    if (this.runaForm.valid) {
      const formData = this.runaForm.value;
      console.log("Form Submitted", formData);
      // You can handle the form submission logic here
    }
  }
}
