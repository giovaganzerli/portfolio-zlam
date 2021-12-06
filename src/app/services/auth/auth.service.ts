import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth, Storage } from 'aws-amplify';
import { Observable, of } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    isLoggedIn = false;

    constructor() {
        const user = JSON.parse(localStorage.getItem('user'));
        this.isLoggedIn = (user) ? user : false;
    }

    login(user, callback) {
        return Auth.signIn(user).then((response) => {
            // @ts-ignore
            this.isLoggedIn = {
                id: response.attributes.sub,
                hash: response.attributes.sub,
                email: response.attributes.email,
                meta: {
                    name: response.attributes.name,
                    family_name: response.attributes.family_name,
                    picture: response.attributes.picture
                }
            };
            localStorage.setItem('user', JSON.stringify(this.isLoggedIn));
            callback(response);
        }).catch(err => callback(err));
    }

    signin(user, callback) {
        return Auth.signUp(user)
            .then(response => callback(response))
            .catch(err => callback(err));
    }

    validin(user, callback) {
        Auth.confirmSignUp(user.email, user.code, { forceAliasCreation: true })
            .then(response => callback(response))
            .catch(err => callback(err));
    }

    updateUserAttributes(attr, callback){
        Auth.currentAuthenticatedUser()
          .then(user => {
              Auth.updateUserAttributes(user, attr)
                .then(response => callback(response))
                .catch(err => callback(err));
          })
          .catch(err => { callback(err); });
    }

    passwordForgot(user, callback) {
        Auth.forgotPassword(user.email)
            .then(response => callback(response))
            .catch(err => callback(err));
    }

    passwordReset(user, callback) {
        Auth.forgotPasswordSubmit(user.email, user.code, user.password)
            .then(response => callback(response))
            .catch(err => callback(err));
    }

    changePassword(oldPass, newPass, callback){
        Auth.currentAuthenticatedUser()
          .then(user => {
              Auth.changePassword(user, oldPass, newPass)
                .then(data => callback(data))
                .catch(err => callback(err));
          })
          .catch(err => callback(err));
    }

    logout(callback) {
        return Auth.signOut({ global: true })
            .then(response => {
                this.isLoggedIn = false;
                localStorage.clear();
                if (callback) {
                    callback(response);
                }
            }).catch(err => callback(err));
    }

    uploadProfileImage(file, callback){
        let n = file.name.replace(/ /g, "_");
        Storage.put(n, file, {
            level: 'private'
        })
          .then (result => callback(result))
          .catch(err => callback(err));
    }

    getProfilePicture(key, callback){
        Storage.get(key,{
            level: 'private',
            download: false
        })
          .then (result => callback(result))
          .catch(err => callback(err));
    }

    getCurrentUser() {
        let currentUser = {
            id: 0,
            email: '',
            meta: {
                name: '',
                family_name: '',
                picture: '' //questa è la key per reperire l'url dal bucket
            },
            profilePicUrl: ''
        };
        if (this.isLoggedIn && localStorage.getItem('user')) {
            currentUser = JSON.parse(localStorage.getItem('user'));
            if(currentUser.meta.picture){ //aggiorno l'url dell'immagine del profilo
                this.getProfilePicture(currentUser.meta.picture, result => {
                    currentUser.profilePicUrl = result;
                });
            }
        }
        return currentUser;
    }
}
