import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { DatasetService } from "../../services/dataset/dataset.service";
import { ReportService } from "../../services/report/report.service";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef;

  user;
  modalUploadsDataset: boolean;
  modalUpdateUser: boolean;
  modalUpdatePass: boolean;
  currDatasets: number;
  currReports: number;
  userAttributes;
  file;
  oldPass: string;
  newPass: string;
  userPic: string;
  errorMessage: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private datasetService: DatasetService,
    private reportService: ReportService
  ) {
    this.modalUploadsDataset = false;
    this.modalUpdateUser = false;
    this.modalUpdatePass = false;
    this.currDatasets = 0;
    this.currReports = 0;
    this.oldPass = '';
    this.newPass = '';
    this.file = { name: '' };
    this.userPic = '';
    this.errorMessage = '';
  }

  ngOnInit(): void {
    //TODO va trovato un modo per gestire la sessione e controllare se l'utente è autenticato
    this.user =  this.authService.getCurrentUser();
    this.userAttributes = {
      name: this.user.meta.name,
      family_name: this.user.meta.family_name,
      picture: this.user.meta.picture //questa è la key dell'immagine da reperire dal bucket
    };

    this.getDatasets();
    this.getReports();
  }

  logout(){
    this.authService.logout(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  getDatasets() {
    this.datasetService.deleteDatasetsLocal();

    this.datasetService.getDatasets().subscribe((response: any) => {
      this.currDatasets = response.data.match.length;
    });
  }

  getReports() {
    this.reportService.getReports().subscribe((response: any) => {
      this.currReports = response.data.length;
    });
  }

  toggleModalDataset(status) {
    this.modalUploadsDataset = status;
  }

  toggleModalUpdateUser() {
    this.modalUpdateUser = !this.modalUpdateUser;
  }

  toggleModalUpdatePass() {
    this.modalUpdatePass = !this.modalUpdatePass;
  }

  datasetAdd(event){
    //TODO fare qualcosa per segnalarlo all'utente
    console.log(event);
    this.ngOnInit();
  }

  imageSelect(event){
    // console.log(event);
    if(event[0].size > 1000000){
      this.errorMessage = 'File troppo grande, dimensione massima consentita: 1MB';
      this.file = { name: '' };
      this.fileDropEl.nativeElement.value = '';
    }else{
      this.errorMessage = '';
      this.file = event[0];
    }
  }

  submitUpdateUser(){
    if(this.file.name){
      //TODO controllare la grandezza del file
      this.authService.uploadProfileImage(this.file, result => {
        this.userAttributes.picture = result.key;
        this.updateUserMeta();
      });
    }else{
      this.updateUserMeta();
    }
  }

  updateUserMeta(){
    this.authService.updateUserAttributes(this.userAttributes, result => {
      if(result === "SUCCESS"){
        this.user.meta = this.userAttributes;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.modalUpdateUser = false;
        this.ngOnInit();
      }else{
        console.log("qualcosa è andato storto");
      }
    });
  }

  submitUpdatePass(){
    this.authService.changePassword(this.oldPass, this.newPass, result => {
      if(result === "SUCCESS"){
        this.modalUpdatePass = false;
        this.ngOnInit();
      }
    });
  }

}
