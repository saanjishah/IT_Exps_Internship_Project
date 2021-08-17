import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '@app/_models';
import { users } from '@app/users';

// array in local storage for registered users
let localUsers = JSON.parse(localStorage.getItem('users')) || [];



@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    allUsers: Array<User>= [];

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;



        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    //return newLogin();
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users/addUser') && method === 'POST':
                        return addUser();
                case url.endsWith('/users/authenticateAdmin') && method === 'POST':
                 //   alert("authenticate admin in fake-backend.ts");
                    return authenticateAdmin();   
                case url.endsWith('/users/checkPasswordMatch') && method === 'POST':
                    return checkPasswordMatch();   
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return;
                   // return deleteUser();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function checkPasswordMatch(){

            //alert("checkPassword");

            const {username,password, confirmPassword } = body;
            if(password!=confirmPassword){
                return error('Password fields must match. Please try again.');
            }else{
                const user = localUsers.find(x => x.username === username);
                // user.password=password;
              //  alert("username: "+ username);
                // this.http.get('http://localhost:9000/users/:username')
                // .subscribe((userList: Array<User>) => {
                // this.allUsers = userList;   //assign 
                // alert("get username");
                // });

                // this.http.put('http://localhost:9000/users/'+ username + password)
                //         .subscribe(() => {
                //             alert("put username");
                //         //this.getAllCourses();
                // }); 


                // for(var i=0;i<this.allUsers.length;i++){
                //     if(this.allUsers[i].username== username){
                //         this.http.put('http://localhost:9000/users/'+ username + password)
                //         .subscribe(() => {
                //             alert("put username");
                //         //this.getAllCourses();
                //         }); 
                //     }
                // }

                
                

            //const user = users.find(x => x.email === email);

            // return ok({
            //     //user.password=password
            // })

            }
        }

        // function newLogin(){
        //     const { username, password, ID } = body;

        //     //const user = users.find(x => x.username === username && x.password === password);
        //     alert("Student ID fakebackend: "+ ID)
        //     return ok({
        //         token: 'fake-jwt-token'
        //     })
        // }

        function authenticate() { // authenticate login using info stored in database. 
            const { username, password, index } = body;
            // for(var i=0;i<users.length;i++){
            //     alert("fb Name: "+ users[i].firstName);
            //     alert("fb user ID: "+ users[i].id);
            //     // if(users[i].id==undefined){
            //     //     deleteUser();
            //     //     alert(users[i].firstName);
            //     // }
            // }
            const user = localUsers.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

// Checks if the verifcation code is equal to "admin"
// if verification code is correct, checks if username already exists

        function authenticateAdmin() {
            const { vcode, user } = body; 
            //alert("inside authenticateAdmin function!");
            if (vcode!="admin"){
                return error('Verification code is incorrect');
            } else{
                if (localUsers.find(x => x.username === user.username)) {
                    return error('Username "' + user.username + '" is already taken')
                } else{
                    user.id = 0;
                    localUsers.push(user);
                    localStorage.setItem('users', JSON.stringify(localUsers));
                    return ok();

                }     
            }

            // alert("Authenticate admin second checkpoint    vcode: "+ vcode);

            // const user = body

            // if (users.find(x => x.username === user.username)) {
            //     return error('Username "' + user.username + '" is already taken')
            // } else{
            //     user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            //     users.push(user);
            //     localStorage.setItem('users', JSON.stringify(users));
            //     return ok();

            // }

            
        }
///////////////////////////////////////////////////////////

        function register() {
            //const user = body
            const {user, userID } = body; 
            //alert("userID fakebackend: "+ userID);

            if (localUsers.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }
            user.role=1;
            //user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            user.id = userID;

            localUsers.push(user);
            localStorage.setItem('users', JSON.stringify(localUsers));
            return ok();
        }

        function addUser() {
            //const user = body
            const {user } = body; 
          //  alert("userID fakebackend: "+ userID);

            // if (users.find(x => x.firstName === user.firstName)) {
            //     return error('Username "' + user.username + '" is already taken')
            // }
            //user.role=1;
            //user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            
            //user.id = userID;

            localUsers.push(user);
            localStorage.setItem('users', JSON.stringify(localUsers));
            return ok();
        }


        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(localUsers);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = localUsers.find(x => x.id === idFromUrl());
            return ok(user);
        }
/////////////// Just added this right now////////////////////////
        // function getUserByRole() {
        //     if (!isLoggedIn()) return unauthorized();

        //     const user = users.find(x => x.role === idFromUrl());
        //     return ok(user);
        // }
//////////////////////////////////////////////////////////////////


        function updateUser() {
            // if (!isLoggedIn()) return unauthorized();

            // let params = body;
            // let user = users.find(x => x.id === idFromUrl());

            // // only update password if entered
            // if (!params.password) {
            //     delete params.password;
            // }

            // // update and save user
            // Object.assign(user, params);
            // localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function deleteUser() {
//             this.http.delete('http://localhost:9000/students/'+data.id)
//      .subscribe(() => {
//   this.getAllStudents();
//      });
            //alert("fake backend");
            // users = users.filter(x => x.id !== undefined);
            // localStorage.setItem('users', JSON.stringify(users));
            return ok();
            // if (!isLoggedIn()) return unauthorized();

            // users = users.filter(x => x.id !== idFromUrl());
            // localStorage.setItem('users', JSON.stringify(users));
            // return ok();
        }



        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};