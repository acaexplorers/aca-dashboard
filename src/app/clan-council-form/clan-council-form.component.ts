import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-clan-council-form',
  templateUrl: './clan-council-form.component.html',
  styleUrls: ['./clan-council-form.component.css']
})
export class ClanCouncilFormComponent implements OnInit {
  councilForm: FormGroup;

  @ViewChild('canvas1', { static: true }) canvas1: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas2', { static: true }) canvas2: ElementRef<HTMLCanvasElement>;

  private ctx1: CanvasRenderingContext2D;
  private ctx2: CanvasRenderingContext2D;
  private drawing = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.councilForm = this.fb.group({
      clan_id: ['11'],
      meeting_title: [''],
      meeting_date: [''],
      meeting_start_time: [''],
      president: [''],
      librarian: [''],
      secretary: [''],
      tracker: [''],
      treasurer: [''],
      advisors: [''],
      members: [''],
      minute_reviewer: [''],
      reports: [''],
      u_b: [''],
      n_b: [''],
      announcements: [''],
      meeting_title1: ['English Warriors of Colombia'],
      meeting_end_time: [''],
      chair_sign: [''],
      secre_sign: ['']
    });

    // Get the canvas contexts
    this.ctx1 = this.canvas1.nativeElement.getContext('2d');
    this.ctx2 = this.canvas2.nativeElement.getContext('2d');

    // Initialize event listeners for both canvases
    this.initCanvasEvents(this.canvas1.nativeElement, this.ctx1);
    this.initCanvasEvents(this.canvas2.nativeElement, this.ctx2);
  }

  // Initialize canvas event listeners for drawing
  private initCanvasEvents(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    // Mouse events for drawing
    canvas.addEventListener('mousedown', (e) => this.startDrawing(e, canvas, ctx));
    canvas.addEventListener('mousemove', (e) => this.draw(e, canvas, ctx));
    canvas.addEventListener('mouseup', () => this.stopDrawing());
    canvas.addEventListener('mouseout', () => this.stopDrawing());

    // Touch events for drawing on mobile
    canvas.addEventListener('touchstart', (e) => this.startDrawing(e, canvas, ctx));
    canvas.addEventListener('touchmove', (e) => this.draw(e, canvas, ctx));
    canvas.addEventListener('touchend', () => this.stopDrawing());
  }

  // Start drawing
  private startDrawing(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    event.preventDefault();
    this.drawing = true;

    // Start the drawing path
    ctx.beginPath();

    // Get the mouse or touch position
    const pos = this.getPosition(event, canvas);
    ctx.moveTo(pos.x, pos.y);
  }

  // Draw on the canvas
  private draw(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    event.preventDefault();
    if (!this.drawing) return;

    // Get the current position
    const pos = this.getPosition(event, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Stop drawing
  private stopDrawing(): void {
    this.drawing = false;
  }

  // Get the position of the mouse or touch event relative to the canvas
  private getPosition(event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    let x: number;
    let y: number;

    if (event instanceof MouseEvent) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    }

    return { x, y };
  }

  // Clear the canvas
  clearCanvas(canvasId: string): void {
    const canvas = this[canvasId].nativeElement;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Submit the form
  onSubmit(): void {
    if (this.councilForm.valid) {
      console.log('Form submitted', this.councilForm.value);
      // Handle form submission logic here
    }
  }
}