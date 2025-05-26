import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
  animations: [
    trigger('iconAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('250ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { 
      message: string; 
      type: string;
      title?: string;
      confirmText?: string;
      showCancel?: boolean;
    },
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  closeDialog(result: boolean = false): void {
    this.dialogRef.close(result);
  }

  getIcon(): string {
    switch (this.data.type) {
      case "success":
        return "check_circle";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "help";
    }
  }

  getIconClass(): string {
    return `dialog-icon dialog-icon--${this.data.type}`;
  }

  getDialogClass(): string {
    return `dialog-container dialog-container--${this.data.type}`;
  }

  getTitle(): string {
    return this.data.title || this.data.type.charAt(0).toUpperCase() + this.data.type.slice(1);
  }

  getConfirmText(): string {
    return this.data.confirmText || 'OK';
  }
}