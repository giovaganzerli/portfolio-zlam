import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataExchangeService {

    // NB: il BehaviorSubject serve a creare la sync del dato
    private reportSelectedBehavior = new BehaviorSubject([{
        id: 0,
        itemName: 'Nuovo Report',
        type: '',
        data: {
            basic: {
                notes: [],
                rows: []
            },
            alert: {
                notes: [],
                rows: []
            },
            kpis: {
                notes: [],
                rows: []
            },
            ta: {
                notes: [],
                rows: []
            },
            custom: {
                notes: [],
                rows: []
            }
        }
    }]);
    private resultsDataBehavior = new BehaviorSubject({
        filters: false,
        match: [],
        smartdata: false,
        report: false
    });
    private dataViewBehavior = new BehaviorSubject([]);
    private simulationBehavior = new BehaviorSubject({
        type: '',
        elements: '',
        data: ''
    });
    private simulationFiltersHistoryBehavior = new BehaviorSubject([]);
    private fullScreenBehavior = new BehaviorSubject(false);

    // NB: Questi sono i dati comuni che verranno modificati in questo service e usati nei vari componenti
    // dataReportSelected è il tipo di report selezionato
    reportSelected = this.reportSelectedBehavior.asObservable();
    // dataResults sono i risultati e i filtri applicati al momento, sono quelli più utili per il simulatore del campo
    resultsData = this.resultsDataBehavior.asObservable();
    // dataDataview contiene i dati che vengono passati dal dataView al Report
    dataDataview = this.dataViewBehavior.asObservable();
    // dataSimulation contiene i dati che vengono passati dal Simulation al Report e alla Dashboard per aggiornare i risultati dello smartdata
    dataSimulation = this.simulationBehavior.asObservable();
    // Questa serve per capire l'ultimo common filter selezionato in modo da mandarlo al simulation-stats.component per creare la history
    simulationFiltersHistory = this.simulationFiltersHistoryBehavior.asObservable();
    // Questa serve per fare il toggle del full screen
    fullScreen = this.fullScreenBehavior.asObservable();

    constructor() { }

    // NB: questa funzione permette di settare il valore della variabile
    setSelectedReportData(data: any) {
        this.reportSelectedBehavior.next(data);
    }

    setResultsData(data: any) {
        this.resultsDataBehavior.next(data);
    }

    setDataviewData(data: any) {
        this.dataViewBehavior.next(data);
    }

    setSimulationData(data: any) {
        this.simulationBehavior.next(data);
    }

    setSimulationFiltersHistoryData(data: any) {
        this.simulationFiltersHistoryBehavior.next(data);
    }

    setFullScreen(data: any) {
        this.fullScreenBehavior.next(data);
    }
}
