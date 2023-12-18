import { Injectable, Injector, inject } from '@angular/core';
import { DialogService, ApiClientService, AuthService, EnvironmentVarService, LocalStorageService } from 'shared';
import { BehaviorSubject } from 'rxjs';
import { Company, User } from '../models/CompanyAndUser';
import { IntegrationModel } from '../pages/integration/interfaces';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ConfigService {
  private auth!: AuthService;
  private env!: EnvironmentVarService;
  private api!: ApiClientService;
  private dialog!: DialogService;
  private localStorageService!: LocalStorageService;
  cookie = inject(CookieService);

  constructor(private injector: Injector) {
    this.dialog = injector.get(DialogService);
    this.api = injector.get(ApiClientService);
    this.localStorageService = injector.get(LocalStorageService);

    setTimeout(() => {
      this.auth = injector.get(AuthService);
      this.env = injector.get(EnvironmentVarService);
    });
  }
  public companyInfoSubject$: BehaviorSubject<Company | null> = new BehaviorSubject<Company | null>(null);
  public userInfoSubject$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public integrationSubject$: BehaviorSubject<IntegrationModel[] | null> = new BehaviorSubject<
    IntegrationModel[] | null
  >(null);

  public async fetchUserAndCompanyDetail(): Promise<void> {
    try {
      this.dialog.progress('proress', 'Fetching Information. Please Wait!!!');
      console.log('AppInitializer Config :: Start');
      const company = await this.api.get<Company>('company/');
      const user = await this.api.get<User>('user/me/');
      const integrations = await this.api.get<IntegrationModel[]>('integration/all/');
      this.companyInfoSubject$.next(company);
      this.userInfoSubject$.next(user);
      this.integrationSubject$.next(integrations);
      const checkIntegration = integrations.filter(x => x.enabled);
      // !TO:DO
      // this is not the ideal solution, we know if integration is empty
      // we know what page to redirect and what query param to pass.
      // fix this in future.
      if (checkIntegration.length === 0) {
        this.cookie.set('__needs_help__', 'true', {
          path: '/',
          secure: true,
        });
        // this.localStorageService.setItem('activeMenu', 'integration');
      }
      this.dialog.close();
    } catch (error) {
      this.dialog.close();
      await this.auth.signOut({ removeAuthToken: true });
      window.location.href = this.env.AUTH_BASE;
    }
  }
}

export function initialAppConfig(config: ConfigService) {
  return () => config.fetchUserAndCompanyDetail();
}
