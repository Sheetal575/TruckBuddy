import { LoginSearchReq } from '../models/login/loginReq.class';
import { Login } from '../models/login/login.class';
import { ProfileSearchReq } from '../models/profile/profile-search-req.class';
import { Profile } from '../models/profile/profile.class';
import { Observable } from 'rxjs';
import { RestService } from '../core/rest-service/rest.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
export class LoginService{

    path: string = 'login';
    constructor(private restService: RestService){}

     customSearchLogin(loginSearchReq: LoginSearchReq): Observable<Login[]>{
        return this.restService.post<Login[]>(this.path+"/search",loginSearchReq);
     }

     getLogin(loginId: string): Observable<Login>{
        return this.restService.get<Login>(this.path,loginId);
     }

    createLogin(login:Login): Observable<Login>{
        return this.restService.post<Login>(this.path,login);
     }

     updateLogin(login:Login): Observable<Login>{
         if(login != null && login.id != null){
             return this.restService.put<Profile>(this.path,login.id,login);
         }
        throw 'Invalid data. ID not found '+JSON.stringify(login);
     }

    deleteLogin(id:string): Observable<Login>{
        return this.restService.delete<Login>(this.path,id);
    }
}