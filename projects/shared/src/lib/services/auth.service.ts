import { inject, Injectable } from '@angular/core';
import { initializeApp, FirebaseError } from 'firebase/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
  OAuthProvider,
  User,
  signInWithCustomToken,
} from 'firebase/auth';
import { CookieService } from 'ngx-cookie-service';
import { EnvironmentVarService } from '../environment-var.service';

export interface IAuthResult {
  user?: UserCredential;
  error?: string;
}

interface SignOutArgs {
  removeAuthToken?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth!: Auth;
  private env = inject(EnvironmentVarService);
  private cookie = inject(CookieService);
  private authProviders: { [key: string]: any } = {
    google: new GoogleAuthProvider(),
    microsoft: new OAuthProvider('microsoft.com'),
  };

  currentFbUser: User | null = null;
  private authListenerOpen = true;
  /**
   * This is a flag to indicate if the user, just looged in for first time and needs help.
   */
  public needsHelp = false;
  constructor() {
    const app = initializeApp(this.env.FIREBASE_CONFIG);
    this.firebaseAuth = getAuth(app);

    console.log('AuthService::listeningIdTokenChange');
    // this.firebaseAuth.onIdTokenChanged(async user => {
    //   this.currentFbUser = user;
    //   if (user && this.authListenerOpen) {
    //     console.log('AuthService::idTokenChanged');
    //     const tokenResult = await user.getIdTokenResult();
    //     this.setCookies(tokenResult);
    //   }
    // });
  }

  async getNewAuthToken(force = false) {
    const newToken = await this.currentFbUser?.getIdTokenResult(force);
    this.setCookies(newToken);
  }

  async signInwithCustomToken(token: string) {
    const user = await signInWithCustomToken(this.firebaseAuth, token);
    this.currentFbUser = user.user;
    await this.getNewAuthToken();
  }

  async getIdToken() {
    const refreshToken = await this.currentFbUser?.getIdToken(true);
    const date = new Date();
    date.setHours(date.getHours() + 1);
    this.setCookies({ token: refreshToken, exprirationTime: date.toISOString() });
  }

  setCookies(tokenResult: any) {
    const expirationTime = new Date(Date.parse(tokenResult.expirationTime));
    this.cookie.set('__auth__', tokenResult.token, {
      expires: expirationTime,
      path: '/',
      secure: true,
    });
    if (this.cookie.get('__remember_me__') === 'disabled') {
      const expirationTime = new Date(Date.parse(tokenResult.expirationTime));
      const storedObj = {
        value: tokenResult.token,
        expirationTime: expirationTime,
      };
      this.cookie.set('__expiry__', tokenResult.expirationTime, {});
      sessionStorage.setItem('__auth__', JSON.stringify(storedObj));
    }
  }

  getCookies() {
    // if (this.cookie.get('__remember_me__') === 'enabled') {
    //   console.log(this.cookie.get('__auth__'));
    //   return this.cookie.get('__auth__');
    // } else {
    //   const storedObj = sessionStorage.getItem('__auth__');
    //   if (storedObj) {
    //     const storedObjParsed = JSON.parse(storedObj);
    //     if (new Date(storedObjParsed.expirationTime) > new Date()) {
    //       return storedObjParsed.value;
    //     } else {
    //       sessionStorage.removeItem('__auth__');
    //       return null;
    //     }
    //   } else {
    //     {
    //       // when we transfer session between webapp, we save
    //       // auth token in cookie for a bit, check if it avialable there.
    //       const tempCookie = this.cookie.get('__auth__');
    //       if (tempCookie) {
    //         const expiry = this.cookie.get('__expiry__');
    //         const expirationTime = new Date(Date.parse(expiry));
    //         const storedObj = {
    //           value: tempCookie,
    //           expirationTime: expirationTime,
    //         };
    //         sessionStorage.setItem('__auth__', JSON.stringify(storedObj));
    //         this.cookie.delete('__auth__');
    //         this.cookie.delete('__expiry__');
    //         return tempCookie;
    //       } else {
    //         sessionStorage.removeItem('__auth__');
    //         return null;
    //       }
    //     }
    //   }
    // }
    return this.cookie.get('__auth__');
  }

  async signIn(email: string, password: string, rememberMe?: true): Promise<IAuthResult> {
    try {
      if (rememberMe) {
        this.cookie.set('__remember_me__', 'enabled');
      } else {
        this.cookie.set('__remember_me__', 'disabled');
      }
      const result = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      this.currentFbUser = result.user;
      await this.getNewAuthToken();
      return { user: result };
    } catch (error) {
      return { error: (error as FirebaseError).message };
    }
  }

  public async register(email: string, password: string): Promise<IAuthResult> {
    try {
      const result = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);
      this.currentFbUser = result.user;
      await this.getNewAuthToken();
      return { user: result };
    } catch (error) {
      return { error: (error as FirebaseError).message };
    }
  }

  async signOut(args?: SignOutArgs) {
    console.log('AuthService::singOut Start');
    this.authListenerOpen = false;
    console.log('AuthService::singOut process');
    await this.firebaseAuth.signOut();
    this.cookie.delete('__expiry__', '/', undefined, true);
    this.cookie.delete('__remember_me__', '/', undefined, true);
    this.cookie.delete('__auth__', '/', undefined, true);
    localStorage.removeItem('activeMenu');
    if (args?.removeAuthToken) {
      this.cookie.delete('__auth__', '/', undefined, true);
    }
    this.authListenerOpen = true;
    console.log('AuthService::singOut done');
  }

  /**
   * Social Auth Sign In Method, this method will open a popup to authenticate with the provider.
   * Extend the authProviders object to add more providers in the future.
   * @param provider String with the name of the provider ex: google, microsoft
   * @returns Error message or UserCredential
   */
  public async socialAuthSignIn(provider: string) {
    try {
      const result = await signInWithPopup(this.firebaseAuth, this.authProviders[provider]);
      this.currentFbUser = result.user;
      await this.getNewAuthToken();
      return { user: result };
    } catch (error) {
      return (error as FirebaseError).message;
    }
  }
}
