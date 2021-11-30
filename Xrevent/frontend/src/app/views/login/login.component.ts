import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Main-Services/AuthService';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  selectedListId: string;
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLoginButtonClicked(email: string, password: string) {
    this.authService.login(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200) {
        this.router.navigate(['/dashboard']);
      }
      console.log(res);
      
    });
  }
}
