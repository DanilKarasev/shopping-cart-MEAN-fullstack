import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../view-cart/view-cart.component';

@Component({
  selector: 'app-edit-good-modal',
  templateUrl: './edit-good-modal.component.html',
  styleUrls: ['../add-good-modal/add-good-modal.component.sass'],
})
export class EditGoodModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EditGoodModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  noFirstSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
}
