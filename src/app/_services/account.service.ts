import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import {Student} from '@app/student';
import { users } from '@app/users';


@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    public student:Student;



    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password, index) {

        // this.http.get('http://localhost:9000/userinfo')
        //    .subscribe((userInfo: Array<users>) => {
        //      //  alert("get");
        //         this.allUsers=userInfo;

        //    });

        //alert("username account service: "+ username);
        

        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password, index })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    // login(username, password, ID) {
    //     alert("account.service login")

    //     return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password, ID})
    //         // .pipe(map(user => {
    //         //     // store user details and jwt token in local storage to keep user logged in between page refreshes

    //         //     // localStorage.setItem('user', JSON.stringify(user));
    //         //     // this.userSubject.next(user);
    //         //     // return user;
    //         //     alert("account.service login")
    //         // }));
    // }

    // adminRegistration(vcode){
    //     alert("admin registration function")
    //     return this.http.post<User>(`${environment.apiUrl}/users/authenticateAdmin`, { vcode })
    // }

    // includes paramters of vcode and the user's information

    adminRegistration(vcode, user: User){ 
        return this.http.post<User>(`${environment.apiUrl}/users/authenticateAdmin`, { vcode,user })
    } 

    forgotPasswordCheck(username, password, confirmPassword){
        return this.http.post<User>(`${environment.apiUrl}/users/checkPasswordMatch`, {username,password,confirmPassword })
    }

    
    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }


    register(user: User, userID) {
        return this.http.post(`${environment.apiUrl}/users/register`, { user,userID });
    }

    addUser(user: User) {
        return this.http.post(`${environment.apiUrl}/users/addUser`, { user });
    }


    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    // delete(studentID: number) {
    //     return this.http.delete(`${environment.apiUrl}/users/${studentID}`)
    //         .pipe(map(x => {
    //             // auto logout if the logged in user deleted their own record
    //             if (studentID == this.student.studentID) {
    //                 this.logout();
    //             }
    //             return x;
    //         }));
    // }
}