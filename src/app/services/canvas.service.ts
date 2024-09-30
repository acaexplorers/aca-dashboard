import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private drawing = false;

  constructor() {}

  // Initialize canvas event listeners for drawing
  initCanvasEvents(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
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
  clearCanvas(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}
