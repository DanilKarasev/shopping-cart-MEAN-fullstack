import { Component, OnInit } from '@angular/core';
import { GoodService } from '../../good.service';
import { MatDialog } from '@angular/material/dialog';
import { AddListModalComponent } from '../add-list-modal/add-list-modal.component';
import { AddGoodModalComponent } from '../add-good-modal/add-good-modal.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
          const currentList: Object | undefined = lists.find(
            (el) => el._id === params['listId']
          );
          if (currentList) {
            // @ts-ignore
            this.currentListTitle = currentList.title;
          }
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

  getGoodsData() {
    this.goodService
      .getSpecificGoods(this.listId)
      // @ts-ignore
      .subscribe((goods: Good[]) => {
        // @ts-ignore
        this.sortGoods(goods);
      });
  }

  sortGoods(goodsList: any) {
    const importantGoods = goodsList
      .filter(
        (el: { important: boolean; completed: boolean }) =>
          el.important && !el.completed
      )
      .sort((e: { title: any }) => e.title);
    const completedGoods = goodsList
      .filter((el: { completed: boolean }) => el.completed)
      .sort((e: { title: any }) => e.title);
    const commonGoods = goodsList.filter(
      (el: { important: boolean; completed: boolean }) =>
        !el.important && !el.completed
    );

    this.goods = [
      ...importantGoods.sort(function (
        a: { title: string },
        b: { title: string }
      ) {
        if (a.title.toUpperCase() < b.title.toUpperCase()) {
          return -1;
        }
        if (a.title.toUpperCase() > b.title.toUpperCase()) {
          return 1;
        }
        return 0;
      }),
      ...commonGoods.sort(function (
        a: { title: string },
        b: { title: string }
      ) {
        if (a.title.toUpperCase() < b.title.toUpperCase()) {
          return -1;
        }
        if (a.title.toUpperCase() > b.title.toUpperCase()) {
          return 1;
        }
        return 0;
      }),
      ...completedGoods.sort(function (
        a: { title: string },
        b: { title: string }
      ) {
        if (a.title.toUpperCase() < b.title.toUpperCase()) {
          return -1;
        }
        if (a.title.toUpperCase() > b.title.toUpperCase()) {
          return 1;
        }
        return 0;
      }),
    ];

    // @ts-ignore
    // const sortedGoods = goodsList.sort((a) => {
    //   if (!a.completed) {
    //     return -1;
    //   }
    // });
    // this.goods = sortedGoods
    //   // @ts-ignore
    //   .sort((a, b) => {
    //     if (!a.completed && !b.completed) {
    //       if (a.important && !b.important) {
    //         return -1;
    //       }
    //     }
    //     if (a.completed && b.completed) {
    //       if (a.important) {
    //         return -1;
    //       }
    //     } else a.title - b.title;
    //   });
  }

  onGoodClick(good: Good) {
    this.goodService.completeGood(good).subscribe(() => {
      good.completed = !good.completed;
      this.sortGoods(this.goods);
    });
  }

  onSetAsImportantClick(good: Good) {
    this.goodService.setGoodAsImportant(good).subscribe(() => {
      good.important = !good.important;
      // @ts-ignore
      this.sortGoods(this.goods.sort((a, b) => a.title - b.title));
    });
  }

  onDeleteGoodClick(good: Good) {
    this.goodService.removeGood(good).subscribe(() => {
      this.getGoodsData();
    });
  }

  onDeleteListClick() {
    this.goodService.deleteList(this.listId).subscribe(() => {
      this.router.navigate(['/lists']).then(() => this.getListsData());
    });
  }

  onDeleteAllGoodsClick() {
    this.goodService.removeAllGoods(this.listId).subscribe(() => {
      this.getGoodsData();
    });
  }

  openNewListModal() {
    const dialogRef = this.dialog.open(AddListModalComponent, {
      data: { newListTitle: this.newListTitle },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newListTitle = result.trim();
        this.goodService
          .createList(this.newListTitle)
          // @ts-ignore
          .subscribe((list: List) => {
            // @ts-ignore
            this.goodService.getLists().subscribe((lists: List[]) => {
              this.lists = lists;
              this.newListTitle = '';
              this.currentListTitle = result.trim();
              this.getListsData();
              this.router.navigate(['/lists', list._id]).then(() => {
                this.route.params.subscribe((params: Params) => {
                  const currentList: Object | undefined = lists.find(
                    (el) => el._id === params['listId']
                  );

                  // @ts-ignore
                  this.currentListTitle = currentList?.title;
                });
              });
            });
          });
      }
    });
  }

  editListModal(listId: string) {
    const currentList: any = this.lists.find((list) => list._id === listId);
    const dialogRef = this.dialog.open(EditListModalComponent, {
      data: { listTitleToEdit: currentList.title },
    });
    dialogRef.afterClosed().subscribe((newTitle) => {
      if (newTitle) {
        this.goodService
          .editListTitle(listId, newTitle.trim())
          // @ts-ignore
          .subscribe(() => {
            this.router.navigate(['/lists', this.listId]).then(() => {
              this.getListsData();
              this.currentListTitle = newTitle.trim();
            });
          });
      }
    });
  }

  openNewGoodModal() {
    const dialogRef = this.dialog.open(AddGoodModalComponent, {
      width: '450px',
      data: { newGoodTitle: this.newGoodTitle },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newGoodTitle = result.trim();
        this.goodService
          .createGood(this.listId, this.newGoodTitle)
          // @ts-ignore
          .subscribe(() => {
            this.newGoodTitle = '';
            this.getGoodsData();
          });
      }
    });
  }

  editGoodModal(good: Good) {
    const dialogRef = this.dialog.open(EditGoodModalComponent, {
      width: '450px',
      data: { goodTitleToEdit: good.title },
    });
    dialogRef.afterClosed().subscribe((newTitle) => {
      if (newTitle) {
        this.goodService
          .editGoodTitle(good, newTitle.trim())
          // @ts-ignore
          .subscribe(() => {
            this.getGoodsData();
          });
      }
    });
  }
}
