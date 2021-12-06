import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

export class User {
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
}

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

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
            attributes: {
                name: this.formData.data.firstName,
                family_name: this.formData.data.lastName,
                picture: '../../../assets/icons/svg/page-profile/icon-profile.svg'
            }
        };

        this.formData.status = 1;
        this.formData.message = '';

        this.auth.signin(user, (response) => {
            this.formData.response = response;
            if (response.hasOwnProperty('user')) {
                this.formData.status = 2;
                this.formData.message = 'Account succesfully created. Check your email inbox and use the code we just sent you to activate your account.';
                setTimeout(() => {
                    this.router.navigate(['/auth/validin']);
                }, 3000);
            } else {
                this.formData.status = 3;
                this.formData.message = response.message;
            }
        });
    }

    ngOnInit(): void {
        this.initFormData();
        this.auth.logout(false);
    }

}
