import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

export class User {
    public email: string;
    public code: string;
}

@Component({
    selector: 'app-validin',
    templateUrl: './validin.component.html',
    styleUrls: ['./validin.component.scss']
})
export class ValidinComponent implements OnInit {

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

        this.auth.validin(this.formData.data, (response) => {
            this.formData.response = response;
            if (response === 'SUCCESS') {
                this.formData.status = 2;
                this.formData.message = 'Account succesfully verified.';
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
