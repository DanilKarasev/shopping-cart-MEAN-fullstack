import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../view-cart/view-cart.component';

@Component({
  selector: 'app-add-good-modal',
  templateUrl: './add-good-modal.component.html',
  styleUrls: ['./add-good-modal.component.sass'],
})
export class AddGoodModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AddGoodModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  noFirstSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
}
