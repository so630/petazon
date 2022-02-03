import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import { Observable, throwError } from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

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

    this.authService.login(this.user.username, this.user.password);
  }
}
