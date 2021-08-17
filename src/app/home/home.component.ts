import { Component, OnInit } from '@angular/core'; // Just added OnInIt here

import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { CertGeneratorLog } from '@app/certgeneratorlog';


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit{ // Just added implements OnInit here
    user: User;
    isEnabled= true;  /// Just added if router link is avaliable or not.
    id: any;

    certificateList: Array<CertGeneratorLog>=[];
    constructor(private accountService: AccountService, private route: ActivatedRoute, private router: Router, private http: HttpClient) {
        this.user = this.accountService.userValue;
    }

    ////// Just added function to check if user is student or admin

    ngOnInit(){  
        
        //this.id = this.route.snapshot.params['ID'];
        // alert("Home component: "+this.id);

        // alert("Id: " + this.id);
        //     if(this.id==0){
        //         this.isEnabled=true;
        //     } else{
        //         this.isEnabled=false;
        //     }

           // alert("Id: " + this.user.id)
        if(this.user.id=='0'){
            this.isEnabled=true;
        } else{
            this.isEnabled=false;
            this.http.get('http://localhost:9000/certificate/certgeneratorlog/' + this.user.id)
            .subscribe((certificates: Array<CertGeneratorLog>) => {
               this.certificateList = certificates;   //assign 

            //    for(var i=0;i<this.certificateList.length;i++){
            //       //  alert(this.certificateList[i].CertificateURL);
            //    }
            });
     
        }
}

    // getUserID(userID: Number){
    //     this.id = this.route.snapshot.params['ID'];
    //     alert("userIDhome: "+ this.id);

    // }
    
    
    /////////////////////////////////////////////////

    // manageUsersOption(){
    //     alert("Id: " + this.user.id)
    //     if(this.user.id=='0'){
    //         this.isEnabled=true;
    //     } else{
    //         this.isEnabled=false;
    //     }
         
   
}