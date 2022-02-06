import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../auth.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-business-login',
  templateUrl: './business-login.component.html',
  styleUrls: ['./business-login.component.css']
})
export class BusinessLoginComponent implements OnInit {

  usernameClasses: string = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
  passwordClasses: string = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  @ViewChild('f') signupForm: NgForm;
  user = {
    username: '',
    password: ''
  }
  submitted: boolean;


  onSubmit() {
    this.submitted = true;
    this.user.username = this.signupForm.value.username;
    this.user.password = this.signupForm.value.password;

    this.authService.loginBusiness(this.user.username, this.user.password);
  }
}
