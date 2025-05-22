import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string; type: string },
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  getIcon(): string {
    // Dynamically select the icon based on the type of message
    switch (this.data.type) {
      case "success":
        return "check_circle";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  }

  getColor(): string {
    // Dynamically select the color based on the type of message
    switch (this.data.type) {
      case "success":
        return "green";
      case "error":
        return "red";
      case "warning":
        return "orange";
      default:
        return "blue";
    }
  }
}
