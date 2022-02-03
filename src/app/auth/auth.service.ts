import {HttpClient, HttpResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class AuthService {

  authPromise: Observable<HttpResponse<boolean>>;
  auth: boolean;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  login(username, password) {
    this.http.post('http://localhost:5000/login', {
      username: username,
      password: password
    }, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      console.log(res.body)
      // @ts-ignore
      if (res.body.auth) {
        // @ts-ignore
        this.cookieService.set('session', res.body.user._id, new Date().getTime() + 2 * 60 * 60 * 1000)
        // @ts-ignore
        localStorage.setItem('user', JSON.stringify(res.body.user))
        this.router.navigate(['/dashboard'])
      }
    });
  }

  register(username, password, name) {
    this.http.post('http://localhost:5000/register', {
      username: username,
      password: password,
      name: name
    }, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(res => {
      console.log(res.body);
      // @ts-ignore
      if (res.body.auth) {
        // @ts-ignore
        this.cookieService.set('session', res.body.user._id, new Date().getTime() + 2 * 60 * 60 * 1000);
        // @ts-ignore
        localStorage.setItem('user', JSON.stringify(res.body.user))
        this.router.navigate(['/dashboard'])
      }
    });


  }

  logout() {
    this.cookieService.delete('session')
    localStorage.removeItem('user')
    this.router.navigate(['/']);

  }
}
