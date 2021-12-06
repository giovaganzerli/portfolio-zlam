import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

export class User {
    public email: string;
    public code: string;
    public password: string;
}

@Component({
    selector: 'app-pw-reset',
    templateUrl: './pw-reset.component.html',
    styleUrls: ['./pw-reset.component.scss']
})
export class PwResetComponent implements OnInit {

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

        this.auth.passwordReset(this.formData.data, (response) => {
            this.formData.response = response;
            if (response === undefined) {
                this.formData.status = 2;
                this.formData.message = 'Password successfully reset.';
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
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
