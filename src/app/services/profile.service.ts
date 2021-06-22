import { ProfileSearchReq } from './../models/profile/profile-search-req.class';
import { Profile } from './../models/profile/profile.class';
import { RestService } from './../core/rest-service/rest.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
export class ProfileService{

    path: string = 'profile';
    constructor(private restService: RestService){}

    getProfile(id: string): Observable<Profile>{
       return this.restService.get<Profile>(this.path,id);
    }

    getProfileImagePath(id: string): string{
       return this.restService.getImageUrl()+id;
    }

    searchProfile(profileSearchReq: ProfileSearchReq): Observable<Profile[]>{
        return this.restService.search<Profile[]>(this.path,profileSearchReq);
     }

     customSearchProfile(profileSearchReq: ProfileSearchReq): Observable<Profile[]>{
        return this.restService.post<Profile[]>(this.path+"/search",profileSearchReq);
     }

    createProfile(profile:Profile): Observable<Profile>{
        return this.restService.post<Profile>(this.path,profile);
     }

     updateProfile(profile:Profile): Observable<Profile>{
         if(profile != null && profile.id != null){
             return this.restService.put<Profile>(this.path,profile.id,profile);
         }
        throw 'Invalid data. ID not found '+JSON.stringify(profile);
     }

    deleteProfile(id:string): Observable<Profile>{
        return this.restService.delete<Profile>(this.path,id);
    }
}