import { Injectable } from '@angular/core';
import { MergedUserInfo } from '../../store/app.state';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  public mergedUsers: MergedUserInfo[] = [];

  public allUsers: any[] = [];
}
