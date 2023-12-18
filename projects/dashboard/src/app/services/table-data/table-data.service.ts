import { Injectable, inject } from '@angular/core';
import { ApiClientService } from 'shared';
import { URL_GET_USERS } from '../../utils/constants';
import { UserData } from '../../pages/integration/interfaces';

export interface AllUsers {
  merged_users: [];
  users: UserData[];
}

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  private api = inject(ApiClientService);

  all_users: AllUsers = {
    merged_users: [],
    users: [],
  };

  async getAvailableUsers(force = false): Promise<AllUsers | undefined> {
    if (this.all_users.users.length && !force) {
      return this.all_users;
    } else {
      try {
        const all_users = await this.api.get<AllUsers>(URL_GET_USERS);
        this.all_users = all_users;
        return all_users;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    }
  }
}
