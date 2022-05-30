import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../view-cart/view-cart.component';

@Component({
  selector: 'app-add-list-modal',
  templateUrl: './add-list-modal.component.html',
  styleUrls: ['add-list-modal.component.sass'],
})
export class AddListModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AddListModalComponent>,
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
