import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';

export class User {
    public email: string;
    public password: string;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    formData;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthService
    ) { }

    initFormData() {
        this.formData = {
            status: 0,
            message: '',
            data: new User(),
            response: {}
        };
    }

    onSubmit(data) {

        const user = {
            username: this.formData.data.email,
            password: this.formData.data.password,
        };

        this.formData.status = 1;
        this.formData.message = '';

        this.auth.login(user, (response) => {
            this.formData.response = response;
            console.log(response);
            if (response.hasOwnProperty('username')) {
                this.formData.status = 2;
                this.formData.message = 'Login succesfully.';
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                }, 1000);
            } else {
                this.formData.status = 3;
                this.formData.message = response.message;
            }
        });
    }

    ngOnInit() {
        this.initFormData();
        this.auth.logout(response => console.log('LOGOUT SUCCESFULLY'));
    }

}
