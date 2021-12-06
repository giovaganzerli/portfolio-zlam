import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

export class User {
    public email: string;
}

@Component({
    selector: 'app-pw-forgot',
    templateUrl: './pw-forgot.component.html',
    styleUrls: ['./pw-forgot.component.scss']
})
export class PwForgotComponent implements OnInit {

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

        this.formData.status = 1;
        this.formData.message = '';

        this.auth.passwordForgot(this.formData.data, (response) => {
            this.formData.response = response;
            console.log(response);
            if (response.hasOwnProperty('CodeDeliveryDetails')) {
                this.formData.status = 2;
                this.formData.message = 'Request sent successfully. We have sent you an email with a code that will allow you to reset your password.';
                setTimeout(() => {
                    this.router.navigate(['/auth/password-reset']);
                }, 3000);
            } else {
                this.formData.status = 3;
                this.formData.message = response.message;
            }
        });
    }

    ngOnInit(): void {
        this.initFormData();
        this.auth.logout(response => console.log('LOGOUT SUCCESFULLY'));
    }

}
