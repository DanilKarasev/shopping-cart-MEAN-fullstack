import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Good } from './models/good.model';

@Injectable({
  providedIn: 'root',
})
export class GoodService {
  constructor(private webReqService: WebRequestService) {}

  getLists() {
    return this.webReqService.get('lists');
  }

  createList(title: string) {
    //Web request to create a list
    return this.webReqService.post('lists', { title });
  }

  editListTitle(listId: string, newTitle: string) {
    return this.webReqService.patch(`lists/${listId}`, {
      title: newTitle,
    });
  }

  deleteList(id: string) {
    return this.webReqService.delete(`lists/${id}`);
  }

  getSpecificGoods(listId: string) {
    return this.webReqService.get(`lists/${listId}/goods`);
  }

  createGood(listId: string, title: string) {
    return this.webReqService.post(`lists/${listId}/goods`, { title });
  }

  completeGood(good: Good) {
    return this.webReqService.patch(`lists/${good._listId}/goods/${good._id}`, {
      completed: !good.completed,
    });
  }

  setGoodAsImportant(good: Good) {
    return this.webReqService.patch(`lists/${good._listId}/goods/${good._id}`, {
      important: !good.important,
    });
  }

  editGoodTitle(good: Good, newTitle: string) {
    return this.webReqService.patch(
      `lists/${good?._listId}/goods/${good?._id}`,
      {
        title: newTitle,
      }
    );
  }

  removeGood(good: Good) {
    return this.webReqService.delete(`lists/${good._listId}/goods/${good._id}`);
  }
}
