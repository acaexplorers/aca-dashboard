import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CanvasService } from "../services/canvas.service";

@Component({
  selector: "app-clan-council-form",
  templateUrl: "./clan-council-form.component.html",
  styleUrls: ["./clan-council-form.component.css"],
})
export class ClanCouncilFormComponent implements OnInit {
  councilForm: FormGroup;

  @ViewChild("canvas1", { static: true })
  canvas1: ElementRef<HTMLCanvasElement>;
  @ViewChild("canvas2", { static: true })
  canvas2: ElementRef<HTMLCanvasElement>;

  private ctx1: CanvasRenderingContext2D;
  private ctx2: CanvasRenderingContext2D;
  private drawing = false;

  constructor(private fb: FormBuilder, private canvasService: CanvasService) {}

  ngOnInit(): void {
    this.councilForm = this.fb.group({
      clan_id: ["11"],
      meeting_title: [""],
      meeting_date: [""],
      meeting_start_time: [""],
      president: [""],
      librarian: [""],
      secretary: [""],
      tracker: [""],
      treasurer: [""],
      advisors: [""],
      members: [""],
      minute_reviewer: [""],
      reports: [""],
      u_b: [""],
      n_b: [""],
      announcements: [""],
      meeting_title1: ["English Warriors of Colombia"],
      meeting_end_time: [""],
      chair_sign: [""],
      secre_sign: [""],
    });

    // Get the canvas contexts
    this.ctx1 = this.canvas1.nativeElement.getContext("2d");
    this.ctx2 = this.canvas2.nativeElement.getContext("2d");

    // Initialize event listeners for both canvases
    this.canvasService.initCanvasEvents(this.canvas1.nativeElement, this.ctx1);
    this.canvasService.initCanvasEvents(this.canvas2.nativeElement, this.ctx2);
  }
  
  clearCanvas(canvasId: string): void {
    const canvas = this[canvasId].nativeElement;
    this.canvasService.clearCanvas(canvas);
  }

  // Submit the form
  onSubmit(): void {
    if (this.councilForm.valid) {
      console.log("Form submitted", this.councilForm.value);
      // Handle form submission logic here
    }
  }
}
