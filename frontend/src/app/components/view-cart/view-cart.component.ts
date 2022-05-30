import { Component, OnInit } from '@angular/core';
import { GoodService } from '../../good.service';
import { MatDialog } from '@angular/material/dialog';
import { AddListModalComponent } from '../add-list-modal/add-list-modal.component';
import { AddGoodModalComponent } from '../add-good-modal/add-good-modal.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { List } from '../../models/list.model';
import { Good } from '../../models/good.model';
import { EditGoodModalComponent } from '../edit-good-modal/edit-good-modal.component';
import { EditListModalComponent } from '../edit-list-modal/edit-list-modal.component';

export interface DialogData {
  newListTitle: string;
  newGoodTitle: string;
  listTitleToEdit: string;
  goodTitleToEdit: string;
}

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.sass'],
})
export class ViewCartComponent implements OnInit {
  lists: List[];
  goods: Good[];

  listId: string;
  currentListTitle: string;

  newListTitle: string;
  newGoodTitle: string;

  constructor(
    private goodService: GoodService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // @ts-ignore
    this.goodService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
      this.route.params.subscribe((params: Params) => {
        if (params['listId']) {
          let currentList: Object | undefined = lists.find(
            (el) => el._id === params['listId']
          );
          // @ts-ignore
          this.currentListTitle = currentList?.title;
        }
      });
    });

    this.route.params.subscribe((params: Params) => {
      if (params['listId']) {
        this.listId = params['listId'];
        this.getGoodsData();
      }
    });
  }

  getListsData() {
    // @ts-ignore
    this.goodService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
    });
  }

  loadCurrentListTitle() {
    let currentList: Object | undefined = this.lists.find(
      (el) => el._id === this.listId
    );
    // @ts-ignore
    this.currentListTitle = currentList.title;
  }

  // setListTitleClick() {
  //   let currentList: Object | undefined = this.lists.find(
  //     (el) => el._id === this.listId
  //   );
  //   console.log(this.currentListTitle);
  //   // @ts-ignore
  //   this.currentListTitle = currentList.title;
  // }

  getGoodsData() {
    this.goodService
      .getSpecificGoods(this.listId)
      // @ts-ignore
      .subscribe((goods: Good[]) => {
        this.goods = goods;
      });
  }

  onGoodClick(good: Good) {
    this.goodService.completeGood(good).subscribe(() => {
      good.completed = !good.completed;
    });
  }

  onSetAsImportantClick(good: Good) {
    this.goodService.setGoodAsImportant(good).subscribe(() => {
      good.important = !good.important;
    });
  }

  onDeleteGoodClick(good: Good) {
    this.goodService.removeGood(good).subscribe(() => {
      this.router
        .navigate(['/lists', this.listId])
        .then(() => this.getGoodsData());
    });
  }

  onDeleteListClick() {
    this.goodService.deleteList(this.listId).subscribe(() => {
      this.router.navigate(['/lists']).then(() => this.getListsData());
    });
  }

  openNewListModal() {
    const dialogRef = this.dialog.open(AddListModalComponent, {
      data: { newListTitle: this.newListTitle },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.newListTitle = result.trim();
      // @ts-ignore
      this.goodService.createList(this.newListTitle).subscribe((list: List) => {
        this.router.navigate(['/lists', list._id]).then(() => {
          this.newListTitle = '';
          this.getListsData();
          this.currentListTitle = result.trim();
        });
      });
    });
  }

  editListModal(listId: string) {
    const currentList: any = this.lists.find((list) => list._id === listId);
    const dialogRef = this.dialog.open(EditListModalComponent, {
      data: { listTitleToEdit: currentList.title },
    });
    dialogRef.afterClosed().subscribe((newTitle) => {
      this.goodService
        .editListTitle(listId, newTitle.trim())
        // @ts-ignore
        .subscribe(() => {
          this.router.navigate(['/lists', this.listId]).then(() => {
            this.getListsData();
            this.currentListTitle = newTitle.trim();
          });
        });
    });
  }

  openNewGoodModal() {
    const dialogRef = this.dialog.open(AddGoodModalComponent, {
      width: '450px',
      data: { newGoodTitle: this.newGoodTitle },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.newGoodTitle = result.trim();
      this.goodService
        .createGood(this.listId, this.newGoodTitle)
        // @ts-ignore
        .subscribe(() => {
          this.newGoodTitle = '';
          this.getGoodsData();
        });
    });
  }

  editGoodModal(good: Good) {
    const dialogRef = this.dialog.open(EditGoodModalComponent, {
      width: '450px',
      data: { goodTitleToEdit: good.title },
    });
    dialogRef.afterClosed().subscribe((newTitle) => {
      this.goodService
        .editGoodTitle(good, newTitle.trim())
        // @ts-ignore
        .subscribe(() => {
          this.getGoodsData();
        });
    });
  }
}
