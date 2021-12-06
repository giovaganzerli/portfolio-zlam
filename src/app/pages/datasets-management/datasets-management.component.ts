import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { DatasetService } from "../../services/dataset/dataset.service";
import { DatatableComponent } from "@swimlane/ngx-datatable";

@Component({
  selector: 'app-datasets-management',
  templateUrl: './datasets-management.component.html',
  styleUrls: ['./datasets-management.component.scss']
})
export class DatasetsManagementComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  user;
  datasets;
  isEditing: boolean;
  tmpDataset;

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
    private datasetService: DatasetService
  ) {
    this.datasets = [];
    this.isEditing = false;
  }

  ngOnInit(): void {
    this.user =  this.authService.getCurrentUser();
    this.getDatasets();
    this.tmpDataset = false;
  }

  logout(){
    this.authService.logout(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  getDatasets() {
    this.datasetService.deleteDatasetsLocal();

    this.datasetService.getDatasets().subscribe((response: any) => {
      this.datasets = [];
      response.data.match.forEach( d => {
        this.datasets.push(d);
      });

      setTimeout(() => {
        this.renderDatasets();
      }, 500);
    });
  }

  renderDatasets(){
    let tmp = [];
    this.datasets.forEach(dataset => {
      tmp.push({
        Name: dataset.itemName,
        Player_1: dataset.player.player_1.itemName,
        Player_2: dataset.player.player_2.itemName,
        Tournament: dataset.tournament.name.itemName,
        Date: dataset.match.date.formatted,
        Round: dataset.match.round.itemName,
        Note: dataset.description,
        Last_modified: '',
        Status: '',
        id: dataset.id
      });
    });

    this.rows = tmp;
    this.temp = tmp;
  }

  filterTable(event){
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      let n = d.Name.toLowerCase().indexOf(val) !== -1;
      let p1 = d.Player_1.toLowerCase().indexOf(val) !== -1;
      let p2 = d.Player_2.toLowerCase().indexOf(val) !== -1;
      let t = d.Tournament.toLowerCase().indexOf(val) !== -1;
      let r = d.Tournament.toLowerCase().indexOf(val) !== -1;
      return n || p1 || p2 || r || t || !val;
    });

    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  deleteDataset(id){
    this.datasetService.getDataset([id]).subscribe((response) => {
      //@ts-ignore
      this.datasetService.deleteDataset(response.data).subscribe(
        data => {
          this.ngOnInit();
        }
      );
    });
  }

  editDataset(id){
    this.datasets.forEach(d => {
      if(d.id === id){
        this.tmpDataset = d;
        this.isEditing = true;
      }
    });
  }

  uploadNewDataset(){
    this.isEditing = true;
  }

  uploadDatasetSubmit(event){
    this.ngOnInit();
  }

  toggleModal(status) {
    this.isEditing = status;
  }

}
