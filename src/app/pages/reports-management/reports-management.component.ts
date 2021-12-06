import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { ReportService } from "../../services/report/report.service";
import { DatatableComponent } from "@swimlane/ngx-datatable";

@Component({
  selector: 'app-reports-management',
  templateUrl: './reports-management.component.html',
  styleUrls: ['./reports-management.component.scss']
})
export class ReportsManagementComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  user;
  reports;
  modalVisible: boolean;
  tmpReport;

  rows = [];
  columns = [
    { name: 'Name', prop: 'Name' },
    { name: 'Player 1', prop: 'Player_1' },
    { name: 'Player 2', prop: 'Player_2' },
    { name: 'Tournament', prop: 'Tournament' },
    { name: 'Date', prop: 'Date' },
    { name: 'Round', prop: 'Round' },
    { name: 'Note', prop: 'Note' },
    { name: 'Shared', prop: 'Shared' },
    { name: 'Last modified', prop: 'Last_modified' },
    { name: 'Status', prop: 'Status' }
  ];
  temp = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private reportService: ReportService
  ) {
    this.reports = [];
    this.modalVisible = false;
    this.tmpReport = {
      itemName: ''
    }
  }

  ngOnInit(): void {
    this.user =  this.authService.getCurrentUser();
    this.getReports();
  }

  logout(){
    this.authService.logout(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  getReports() {
    // this.reportService.deleteReportsLocal();

    this.reportService.getReports().subscribe((response: any) => {
      this.reports = [];
      response.data.forEach( d => {
        this.reports.push(d);
      });
      console.log(this.reports);

      setTimeout(() => {
        this.renderReports();
      }, 500);
    });
  }

  renderReports(){
    let tmp = [];
    this.reports.forEach(report => {
      tmp.push({
        id: report.id,
        Name: report.itemName,
        Type: report.type.charAt(0).toUpperCase() + report.type.slice(1),
        Note: '',
        Shared: '',
        Last_modified: '',
        Status: ''
      });
    });

    this.rows = tmp;
    this.temp = tmp;
  }

  filterTable(event){
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      let n = d.Name.toLowerCase().indexOf(val) !== -1;
      let t = d.Type.toLowerCase().indexOf(val) !== -1;
      return n || t || !val;
    });

    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  deleteReport(id){
    this.reportService.getReport([id]).subscribe((response) => {
      //@ts-ignore
      this.reportService.deleteReport(response.data).subscribe(
        (data) => {
          this.ngOnInit();
        },
        (err) => {
          console.error(err);
        }
      );
    });
  }

  editReport(id){
    this.reports.forEach(d => {
      if(d.id === id){
        this.tmpReport = d;
        this.modalVisible = true;
      }
    });
  }

  toggleModal(){
    this.modalVisible = !this.modalVisible;
  }

  formSubmit(){
    this.reportService.editReport(this.tmpReport.id, this.tmpReport);
    this.toggleModal();
    this.ngOnInit();
  }

}
