import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../auth.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-business-register',
  templateUrl: './business-register.component.html',
  styleUrls: ['./business-register.component.css']
})
export class BusinessRegisterComponent implements OnInit {

  usernameClasses: string = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
  passwordClasses: string = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  @ViewChild('f') signupForm: NgForm;
  user = {
    username: '',
    password: '',
    name: ''
  }
  submitted: boolean;


  onSubmit() {
    this.submitted = true;
    this.user.username = this.signupForm.value.username;
    this.user.password = this.signupForm.value.password;
    this.user.name = this.signupForm.value.name;

    this.authService.registerBusiness(this.user.username, this.user.password, this.user.name);
  }
}
