import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// SERVICES
import { AuthService } from '../auth/auth.service';
import { GeneralService } from '../general/general.service';
import { SmartdataService } from '../smartdata/smartdata.service';
import { ReportService } from '../report/report.service';

@Injectable({
    providedIn: 'root'
})
export class FiltersService {

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private generalService: GeneralService,
        private smartdataService: SmartdataService,
        private reportService: ReportService
    ) { }

    getFormats() {
        const formats = [
            { id: 'dartfish', itemName: 'Dartfish' }
        ];
        return formats;
    }

    setPlayers(playersData) {
        const localPlayers = (localStorage.getItem('players')) ? JSON.parse(localStorage.getItem('players')) : [];
        const players = [];
        playersData.forEach((player) => {
            players.push({
                id: player.id,
                itemName: player.itemName,
                meta: {
                    first_name: player.meta.first_name,
                    last_name: player.meta.last_name,
                    country: this.generalService.findIntoArrayofObject(player.meta.country, this.getCountries(), 'id'),
                    thumb: this.getPlayerThumb(player)
                }
            });
        });
        localStorage.setItem('players', JSON.stringify(this.generalService.mergeObjectsInUnique([...localPlayers, ...players], 'id')));
    }

    getPlayers() {
        return (localStorage.getItem('players')) ? JSON.parse(localStorage.getItem('players')) : [];
    }

    deletePlayers() {
        localStorage.removeItem('players');
    }

    getPlayersThumb() {
        const thumbs = {
            'Matteo Berrettini': 'https://i.ibb.co/kQzVwJG/Matteo-Berrettini.jpg',
            'Andrey Rublev': 'https://i.ibb.co/61r2WLc/MUNICH-GERMANY-APRIL-28-Andrey-Rublev-of-Russia-plays-a-fore-hand-during-his-quaterfinal-qualificati.jpg'
        };
        return thumbs;
    }

    getPlayerThumb(player) {
        const thumbs = this.getPlayersThumb();
        let thumb = '';
        if (thumbs.hasOwnProperty(player.meta.first_name + ' ' + player.meta.last_name)) {
            thumb = thumbs[player.meta.first_name + ' ' + player.meta.last_name];
        } else {
            // thumb = (type === 'opp') ? 'https://zlam.mastechsrl.com/assets/icons/svg/icon-player_2.svg' : 'https://zlam.mastechsrl.com/assets/icons/svg/icon-player_1.svg';
        }
        return thumb;
    }

    setTournamentsSurface(dataSurface) {
        const surfaces = (localStorage.getItem('tournament-surfaces')) ? JSON.parse(localStorage.getItem('tournament-surfaces')) : [
            { id: 'clay', itemName: 'Clay' },
            { id: 'grass', itemName: 'Grass' },
            { id: 'hard', itemName: 'Hard' },
            { id: 'carpet', itemName: 'Carpet' }
        ];
        // tslint:disable-next-line:max-line-length
        localStorage.setItem('tournament-surfaces', JSON.stringify(this.generalService.mergeObjectsInUnique([...surfaces, ...dataSurface], 'id')));
    }

    getTournamentsSurface() {
        return (localStorage.getItem('tournament-surfaces')) ? JSON.parse(localStorage.getItem('tournament-surfaces')) : [];
    }

    deleteTournamentsSurface() {
        localStorage.removeItem('tournament-surfaces');
    }

    setTournamentsEnv(dataEnv) {
        const envs = (localStorage.getItem('tournament-envs')) ? JSON.parse(localStorage.getItem('tournament-envs')) : [
            { id: 'indoor', itemName: 'Indoor'},
            { id: 'outdoor', itemName: 'Outdoor' }
        ];
        localStorage.setItem('tournament-envs', JSON.stringify(this.generalService.mergeObjectsInUnique([...envs, ...dataEnv], 'id')));
    }

    getTournamentsEnv() {
        return (localStorage.getItem('tournament-envs')) ? JSON.parse(localStorage.getItem('tournament-envs')) : [];
    }

    deleteTournamentsEnv() {
        localStorage.removeItem('tournament-envs');
    }

    setTournamentsName(dataTournament) {
        const tournaments = (localStorage.getItem('tournament-names')) ? JSON.parse(localStorage.getItem('tournament-names')) : [];
        /*dataTournament.forEach((tournament, i) => {
            dataTournament[i].meta.city = 'Rome';
            dataTournament[i].meta.country = 'Italy';
        });*/
        // tslint:disable-next-line:max-line-length
        localStorage.setItem('tournament-names', JSON.stringify(this.generalService.mergeObjectsInUnique([...tournaments, ...dataTournament], 'id')));
    }

    getTournamentsName() {
        return  (localStorage.getItem('tournament-names')) ? JSON.parse(localStorage.getItem('tournament-names')) : [];
    }

    deleteTournamentsName() {
        localStorage.removeItem('tournament-names');
    }

    setMatchesRound(dataRound) {
        const rounds = (localStorage.getItem('match-rounds')) ? JSON.parse(localStorage.getItem('match-rounds')) : [
            { id: 'q', itemName: 'Q' },
            { id: 'r128', itemName: 'R128' },
            { id: 'r64', itemName: 'R64' },
            { id: 'r32', itemName: 'R32' },
            { id: 'r16', itemName: 'R16' },
            { id: 'qf', itemName: 'QF' },
            { id: 'sf', itemName: 'SF' },
            { id: 'f', itemName: 'F' },
            { id: 'rr', itemName: 'RR' },
            { id: '1r', itemName: '1R' },
            { id: '2r', itemName: '2R' },
            { id: '3r', itemName: '3R' },
            { id: '4r', itemName: '4R' }
        ];
        localStorage.setItem('match-rounds', JSON.stringify(this.generalService.mergeObjectsInUnique([...rounds, ...dataRound], 'id')));
    }

    getMatchesRound() {
        return (localStorage.getItem('match-rounds')) ? JSON.parse(localStorage.getItem('match-rounds')) : [];
    }

    deleteMatchesRound() {
        localStorage.removeItem('match-rounds');
    }

    setMatchesDate(dataDate) {
        const dates = (localStorage.getItem('match-dates')) ? JSON.parse(localStorage.getItem('match-dates')) : [];
        dataDate.forEach((date, i) => {
            if (date) {
                this.generalService.pushObjectsInUnique({
                    id: moment(date, 'YYYY-MM-DD').format('YYYYMMDD'),
                    year: moment(date, 'YYYY-MM-DD').format('YYYY'),
                    month: moment(date, 'YYYY-MM-DD').format('M'),
                    day: moment(date, 'YYYY-MM-DD').format('D'),
                    formatted: moment(date, 'YYYY-MM-DD').format('YYYY/MM/DD'),
                    formatted_2: moment(date, 'YYYY-MM-DD').format('MMMM Do YYYY')
                }, dates, 'id');
            }
        });
        localStorage.setItem('match-dates', JSON.stringify(dates));
    }

    getMatchesDate() {
        return (localStorage.getItem('match-dates')) ? JSON.parse(localStorage.getItem('match-dates')) : [];
    }

    deleteMatchesDate() {
        localStorage.removeItem('match-dates');
    }

    getCountries() {
        // tslint:disable-next-line:max-line-length
        return [{itemName: 'Afghanistan', id: 'AF'}, {itemName: 'Åland Islands', id: 'AX'}, {itemName: 'Albania', id: 'AL'}, {itemName: 'Algeria', id: 'DZ'}, {itemName: 'American Samoa', id: 'AS'}, {itemName: 'AndorrA', id: 'AD'}, {itemName: 'Angola', id: 'AO'}, {itemName: 'Anguilla', id: 'AI'}, {itemName: 'Antarctica', id: 'AQ'}, {itemName: 'Antigua and Barbuda', id: 'AG'}, {itemName: 'Argentina', id: 'AR'}, {itemName: 'Armenia', id: 'AM'}, {itemName: 'Aruba', id: 'AW'}, {itemName: 'Australia', id: 'AU'}, {itemName: 'Austria', id: 'AT'}, {itemName: 'Azerbaijan', id: 'AZ'}, {itemName: 'Bahamas', id: 'BS'}, {itemName: 'Bahrain', id: 'BH'}, {itemName: 'Bangladesh', id: 'BD'}, {itemName: 'Barbados', id: 'BB'}, {itemName: 'Belarus', id: 'BY'}, {itemName: 'Belgium', id: 'BE'}, {itemName: 'Belize', id: 'BZ'}, {itemName: 'Benin', id: 'BJ'}, {itemName: 'Bermuda', id: 'BM'}, {itemName: 'Bhutan', id: 'BT'}, {itemName: 'Bolivia', id: 'BO'}, {itemName: 'Bosnia and Herzegovina', id: 'BA'}, {itemName: 'Botswana', id: 'BW'}, {itemName: 'Bouvet Island', id: 'BV'}, {itemName: 'Brazil', id: 'BR'}, {itemName: 'British Indian Ocean Territory', id: 'IO'}, {itemName: 'Brunei Darussalam', id: 'BN'}, {itemName: 'Bulgaria', id: 'BG'}, {itemName: 'Burkina Faso', id: 'BF'}, {itemName: 'Burundi', id: 'BI'}, {itemName: 'Cambodia', id: 'KH'}, {itemName: 'Cameroon', id: 'CM'}, {itemName: 'Canada', id: 'CA'}, {itemName: 'Cape Verde', id: 'CV'}, {itemName: 'Cayman Islands', id: 'KY'}, {itemName: 'Central African Republic', id: 'CF'}, {itemName: 'Chad', id: 'TD'}, {itemName: 'Chile', id: 'CL'}, {itemName: 'China', id: 'CN'}, {itemName: 'Christmas Island', id: 'CX'}, {itemName: 'Cocos (Keeling) Islands', id: 'CC'}, {itemName: 'Colombia', id: 'CO'}, {itemName: 'Comoros', id: 'KM'}, {itemName: 'Congo', id: 'CG'}, {itemName: 'Congo, The Democratic Republic of the', id: 'CD'}, {itemName: 'Cook Islands', id: 'CK'}, {itemName: 'Costa Rica', id: 'CR'}, {itemName: 'Cote D\'Ivoire', id: 'CI'}, {itemName: 'Croatia', id: 'HR'}, {itemName: 'Cuba', id: 'CU'}, {itemName: 'Cyprus', id: 'CY'}, {itemName: 'Czech Republic', id: 'CZ'}, {itemName: 'Denmark', id: 'DK'}, {itemName: 'Djibouti', id: 'DJ'}, {itemName: 'Dominica', id: 'DM'}, {itemName: 'Dominican Republic', id: 'DO'}, {itemName: 'Ecuador', id: 'EC'}, {itemName: 'Egypt', id: 'EG'}, {itemName: 'El Salvador', id: 'SV'}, {itemName: 'Equatorial Guinea', id: 'GQ'}, {itemName: 'Eritrea', id: 'ER'}, {itemName: 'Estonia', id: 'EE'}, {itemName: 'Ethiopia', id: 'ET'}, {itemName: 'Falkland Islands (Malvinas)', id: 'FK'}, {itemName: 'Faroe Islands', id: 'FO'}, {itemName: 'Fiji', id: 'FJ'}, {itemName: 'Finland', id: 'FI'}, {itemName: 'France', id: 'FR'}, {itemName: 'French Guiana', id: 'GF'}, {itemName: 'French Polynesia', id: 'PF'}, {itemName: 'French Southern Territories', id: 'TF'}, {itemName: 'Gabon', id: 'GA'}, {itemName: 'Gambia', id: 'GM'}, {itemName: 'Georgia', id: 'GE'}, {itemName: 'Germany', id: 'DE'}, {itemName: 'Ghana', id: 'GH'}, {itemName: 'Gibraltar', id: 'GI'}, {itemName: 'Greece', id: 'GR'}, {itemName: 'Greenland', id: 'GL'}, {itemName: 'Grenada', id: 'GD'}, {itemName: 'Guadeloupe', id: 'GP'}, {itemName: 'Guam', id: 'GU'}, {itemName: 'Guatemala', id: 'GT'}, {itemName: 'Guernsey', id: 'GG'}, {itemName: 'Guinea', id: 'GN'}, {itemName: 'Guinea-Bissau', id: 'GW'}, {itemName: 'Guyana', id: 'GY'}, {itemName: 'Haiti', id: 'HT'}, {itemName: 'Heard Island and Mcdonald Islands', id: 'HM'}, {itemName: 'Holy See (Vatican City State)', id: 'VA'}, {itemName: 'Honduras', id: 'HN'}, {itemName: 'Hong Kong', id: 'HK'}, {itemName: 'Hungary', id: 'HU'}, {itemName: 'Iceland', id: 'IS'}, {itemName: 'India', id: 'IN'}, {itemName: 'Indonesia', id: 'ID'}, {itemName: 'Iran, Islamic Republic Of', id: 'IR'}, {itemName: 'Iraq', id: 'IQ'}, {itemName: 'Ireland', id: 'IE'}, {itemName: 'Isle of Man', id: 'IM'}, {itemName: 'Israel', id: 'IL'}, {itemName: 'Italy', id: 'IT'}, {itemName: 'Jamaica', id: 'JM'}, {itemName: 'Japan', id: 'JP'}, {itemName: 'Jersey', id: 'JE'}, {itemName: 'Jordan', id: 'JO'}, {itemName: 'Kazakhstan', id: 'KZ'}, {itemName: 'Kenya', id: 'KE'}, {itemName: 'Kiribati', id: 'KI'}, {itemName: 'Korea, Democratic People\'S Republic of', id: 'KP'}, {itemName: 'Korea, Republic of', id: 'KR'}, {itemName: 'Kuwait', id: 'KW'}, {itemName: 'Kyrgyzstan', id: 'KG'}, {itemName: 'Lao People\'S Democratic Republic', id: 'LA'}, {itemName: 'Latvia', id: 'LV'}, {itemName: 'Lebanon', id: 'LB'}, {itemName: 'Lesotho', id: 'LS'}, {itemName: 'Liberia', id: 'LR'}, {itemName: 'Libyan Arab Jamahiriya', id: 'LY'}, {itemName: 'Liechtenstein', id: 'LI'}, {itemName: 'Lithuania', id: 'LT'}, {itemName: 'Luxembourg', id: 'LU'}, {itemName: 'Macao', id: 'MO'}, {itemName: 'Macedonia, The Former Yugoslav Republic of', id: 'MK'}, {itemName: 'Madagascar', id: 'MG'}, {itemName: 'Malawi', id: 'MW'}, {itemName: 'Malaysia', id: 'MY'}, {itemName: 'Maldives', id: 'MV'}, {itemName: 'Mali', id: 'ML'}, {itemName: 'Malta', id: 'MT'}, {itemName: 'Marshall Islands', id: 'MH'}, {itemName: 'Martinique', id: 'MQ'}, {itemName: 'Mauritania', id: 'MR'}, {itemName: 'Mauritius', id: 'MU'}, {itemName: 'Mayotte', id: 'YT'}, {itemName: 'Mexico', id: 'MX'}, {itemName: 'Micronesia, Federated States of', id: 'FM'}, {itemName: 'Moldova, Republic of', id: 'MD'}, {itemName: 'Monaco', id: 'MC'}, {itemName: 'Mongolia', id: 'MN'}, {itemName: 'Montserrat', id: 'MS'}, {itemName: 'Morocco', id: 'MA'}, {itemName: 'Mozambique', id: 'MZ'}, {itemName: 'Myanmar', id: 'MM'}, {itemName: 'Namibia', id: 'NA'}, {itemName: 'Nauru', id: 'NR'}, {itemName: 'Nepal', id: 'NP'}, {itemName: 'Netherlands', id: 'NL'}, {itemName: 'Netherlands Antilles', id: 'AN'}, {itemName: 'New Caledonia', id: 'NC'}, {itemName: 'New Zealand', id: 'NZ'}, {itemName: 'Nicaragua', id: 'NI'}, {itemName: 'Niger', id: 'NE'}, {itemName: 'Nigeria', id: 'NG'}, {itemName: 'Niue', id: 'NU'}, {itemName: 'Norfolk Island', id: 'NF'}, {itemName: 'Northern Mariana Islands', id: 'MP'}, {itemName: 'Norway', id: 'NO'}, {itemName: 'Oman', id: 'OM'}, {itemName: 'Pakistan', id: 'PK'}, {itemName: 'Palau', id: 'PW'}, {itemName: 'Palestinian Territory, Occupied', id: 'PS'}, {itemName: 'Panama', id: 'PA'}, {itemName: 'Papua New Guinea', id: 'PG'}, {itemName: 'Paraguay', id: 'PY'}, {itemName: 'Peru', id: 'PE'}, {itemName: 'Philippines', id: 'PH'}, {itemName: 'Pitcairn', id: 'PN'}, {itemName: 'Poland', id: 'PL'}, {itemName: 'Portugal', id: 'PT'}, {itemName: 'Puerto Rico', id: 'PR'}, {itemName: 'Qatar', id: 'QA'}, {itemName: 'Reunion', id: 'RE'}, {itemName: 'Romania', id: 'RO'}, {itemName: 'Russian Federation', id: 'RU'}, {itemName: 'RWANDA', id: 'RW'}, {itemName: 'Saint Helena', id: 'SH'}, {itemName: 'Saint Kitts and Nevis', id: 'KN'}, {itemName: 'Saint Lucia', id: 'LC'}, {itemName: 'Saint Pierre and Miquelon', id: 'PM'}, {itemName: 'Saint Vincent and the Grenadines', id: 'VC'}, {itemName: 'Samoa', id: 'WS'}, {itemName: 'San Marino', id: 'SM'}, {itemName: 'Sao Tome and Principe', id: 'ST'}, {itemName: 'Saudi Arabia', id: 'SA'}, {itemName: 'Senegal', id: 'SN'}, {itemName: 'Serbia and Montenegro', id: 'CS'}, {itemName: 'Seychelles', id: 'SC'}, {itemName: 'Sierra Leone', id: 'SL'}, {itemName: 'Singapore', id: 'SG'}, {itemName: 'Slovakia', id: 'SK'}, {itemName: 'Slovenia', id: 'SI'}, {itemName: 'Solomon Islands', id: 'SB'}, {itemName: 'Somalia', id: 'SO'}, {itemName: 'South Africa', id: 'ZA'}, {itemName: 'South Georgia and the South Sandwich Islands', id: 'GS'}, {itemName: 'Spain', id: 'ES'}, {itemName: 'Sri Lanka', id: 'LK'}, {itemName: 'Sudan', id: 'SD'}, {itemName: 'SuriitemName', id: 'SR'}, {itemName: 'Svalbard and Jan Mayen', id: 'SJ'}, {itemName: 'Swaziland', id: 'SZ'}, {itemName: 'Sweden', id: 'SE'}, {itemName: 'Switzerland', id: 'CH'}, {itemName: 'Syrian Arab Republic', id: 'SY'}, {itemName: 'Taiwan, Province of China', id: 'TW'}, {itemName: 'Tajikistan', id: 'TJ'}, {itemName: 'Tanzania, United Republic of', id: 'TZ'}, {itemName: 'Thailand', id: 'TH'}, {itemName: 'Timor-Leste', id: 'TL'}, {itemName: 'Togo', id: 'TG'}, {itemName: 'Tokelau', id: 'TK'}, {itemName: 'Tonga', id: 'TO'}, {itemName: 'Trinidad and Tobago', id: 'TT'}, {itemName: 'Tunisia', id: 'TN'}, {itemName: 'Turkey', id: 'TR'}, {itemName: 'Turkmenistan', id: 'TM'}, {itemName: 'Turks and Caicos Islands', id: 'TC'}, {itemName: 'Tuvalu', id: 'TV'}, {itemName: 'Uganda', id: 'UG'}, {itemName: 'Ukraine', id: 'UA'}, {itemName: 'United Arab Emirates', id: 'AE'}, {itemName: 'United Kingdom', id: 'GB'}, {itemName: 'United States', id: 'US'}, {itemName: 'United States Minor Outlying Islands', id: 'UM'}, {itemName: 'Uruguay', id: 'UY'}, {itemName: 'Uzbekistan', id: 'UZ'}, {itemName: 'Vanuatu', id: 'VU'}, {itemName: 'Venezuela', id: 'VE'}, {itemName: 'Viet Nam', id: 'VN'}, {itemName: 'Virgin Islands, British', id: 'VG'}, {itemName: 'Virgin Islands, U.S.', id: 'VI'}, {itemName: 'Wallis and Futuna', id: 'WF'}, {itemName: 'Western Sahara', id: 'EH'}, {itemName: 'Yemen', id: 'YE'}, {itemName: 'Zambia', id: 'ZM'}, {itemName: 'Zimbabwe', id: 'ZW'}];
    }

    getScorePoints() {
        const points = [
            { id: 1, itemName: '0-0' },
            { id: 2, itemName: '15-0' },
            { id: 3, itemName: '15 all' },
            { id: 4, itemName: '30-15' },
            { id: 5, itemName: '15-30' },
            { id: 6, itemName: '0-30' },
            { id: 7, itemName: '30-0' },
            { id: 8, itemName: '40-30' },
            { id: 9, itemName: '30-40' },
            { id: 10, itemName: 'Deuce' },
            { id: 11, itemName: 'Adv. In' },
            { id: 12, itemName: 'Adv. Out' }
        ];
        return points;
    }

    getScorePointsTie() {
        const points = [
            { id: 0, itemName: '0-0' },
            { id: 1, itemName: '1-0' },
            { id: 2, itemName: '0-1' },
            { id: 3, itemName: '1 all' },
            { id: 4, itemName: '2-1' },
            { id: 5, itemName: '1-2' },
            { id: 6, itemName: '2 all' },
            { id: 7, itemName: '3-2' },
            { id: 8, itemName: '2-3' },
            { id: 9, itemName: '3 all' },
            { id: 10, itemName: '4-3' },
            { id: 11, itemName: '3-4' },
            { id: 12, itemName: '4 all' },
            { id: 13, itemName: '5-4' },
            { id: 14, itemName: '4-5' },
            { id: 15, itemName: '5 all' },
            { id: 16, itemName: '6-5' },
            { id: 17, itemName: '5-6' },
            { id: 18, itemName: '6 all' },
            { id: 19, itemName: '7-6' },
            { id: 20, itemName: '6-7' },
            { id: 21, itemName: '7 all' }
        ];
        return points;
    }

    getScoreGame() {
        const games = [
            { id: 1, itemName: '0-0' },
            { id: 2, itemName: '1-0' },
            { id: 3, itemName: '0-1' },
            { id: 4, itemName: '1-1' },
            { id: 5, itemName: '2-1' },
            { id: 6, itemName: '1-2' },
            { id: 7, itemName: '2-2' },
            { id: 8, itemName: '3-2' },
            { id: 9, itemName: '2-3' },
            { id: 10, itemName: '3-3' },
            { id: 11, itemName: '4-3' },
            { id: 12, itemName: '3-4' },
            { id: 13, itemName: '4-4' },
            { id: 14, itemName: '5-4' },
            { id: 15, itemName: '4-5' },
            { id: 16, itemName: '5-5' },
            { id: 17, itemName: '6-5' },
            { id: 18, itemName: '5-6' },
            { id: 19, itemName: '7-7' }
        ];
        return games;
    }

    getScoreSet() {
        const sets = [
            { id: 1, itemName: '0-0' },
            { id: 2, itemName: '1-0' },
            { id: 3, itemName: '0-1' },
            { id: 4, itemName: '1-1' },
            { id: 5, itemName: '2-1' },
            { id: 6, itemName: '1-2' },
            { id: 7, itemName: '2-2' },
            { id: 8, itemName: '3-2' },
            { id: 9, itemName: '2-3' },
            { id: 10, itemName: '3-3' },
            { id: 11, itemName: '4-3' },
            { id: 12, itemName: '3-4' },
            { id: 13, itemName: '4-4' },
            { id: 14, itemName: '5-4' },
            { id: 15, itemName: '4-5' },
            { id: 16, itemName: '5-5' },
            { id: 17, itemName: '6-5' },
            { id: 18, itemName: '5-6' },
            { id: 19, itemName: '7-7' }
        ];
        return sets;
    }

    deleteFiltersLocal() {
        this.deletePlayers();
        this.deleteMatchesDate();
        this.deleteTournamentsSurface();
        this.deleteTournamentsEnv();
        this.deleteTournamentsName();
        this.deleteMatchesRound();
    }

    getMatches(id, report, dataFilters, override = 0) {

        const request = {
            user: this.authService.getCurrentUser(),
            params: {
                metadata: {
                    user_id: 0,
                    player: {
                        ref_player: {
                            id: []
                        },
                        opp_player: {
                            id: []
                        }
                    },
                    match: {
                        override_filters: 0,
                        id: [],
                        round: [],
                        date: {
                            from: '',
                            to: ''
                        },
                    },
                    tournament: {
                        id: [],
                        surface: [],
                        env: []
                    },
                    smartdata: {
                        type: [],
                        aggregation: [],
                        override_columns: []
                    },
                    report: {
                        type: [],
                        aggregation: []
                    }
                }
            },
            body: [],
            response: {
                status: false,
                message: '',
                data: {
                    match: [],
                    filters: {},
                    smartdata: {},
                    report: {}
                }
            },
        };

        request.params.metadata.user_id = request.user.id;

        request.params.metadata.match.override_filters = override;
        request.params.metadata.match.id = [...id];

        if (dataFilters) {

            request.params.metadata.player.ref_player.id = dataFilters.player.player_1.map(value => value.id);
            request.params.metadata.player.opp_player.id = dataFilters.player.player_2.map(value => value.id);
            request.params.metadata.tournament.id = dataFilters.tournament.name.map(value => value.id);
            request.params.metadata.tournament.surface = dataFilters.tournament.surface.map(value => value.itemName);
            request.params.metadata.tournament.env = dataFilters.tournament.env.map(value => value.itemName);
            request.params.metadata.match.round = dataFilters.match.round.map(value => value.itemName);

            if (dataFilters.match.date.from) {
                // tslint:disable-next-line:max-line-length
                request.params.metadata.match.date.from = moment(dataFilters.match.date.from.singleDate.formatted, 'YYYY/MM/DD').format('YYYY-MM-DD');
            }

            if (dataFilters.match.date.to) {
                // tslint:disable-next-line:max-line-length
                request.params.metadata.match.date.to = moment(dataFilters.match.date.to.singleDate.formatted, 'YYYY/MM/DD').format('YYYY-MM-DD');
            }

            request.params.metadata.smartdata.type = [];
            if (dataFilters.smartdata.hasOwnProperty('columns') && dataFilters.smartdata.columns.length) {
                request.params.metadata.smartdata.type = ['override'];
                request.params.metadata.smartdata.override_columns = dataFilters.smartdata.columns;
            } else {
                dataFilters.smartdata.type.forEach((type, i) => {
                    request.params.metadata.smartdata.type.push(type.id);
                });
            }

            request.params.metadata.smartdata.aggregation = dataFilters.smartdata.aggregation.map(value => value.id);

            Object.keys(dataFilters.common).forEach((common: any, i) => {
                if (dataFilters.common[common].values.length) {
                    request.params.metadata[common] = dataFilters.common[common].values.map(value => value.itemName);
                }
            });

            request.params.metadata.report.type = (report) ? ['custom'] : [];
        }

        if (dataFilters && dataFilters.common.hasOwnProperty('serve_side') && dataFilters.common.serve_side.values.length) {

            dataFilters.common.serve_side.values.forEach((side) => {
                dataFilters.common.serve_outcome.values.forEach((outcome) => {

                    const formData = new FormData();
                    const params = {metadata: {}};

                    Object.keys(request.params.metadata).forEach((key) => {
                        if (key === 'serve_side') {
                            params.metadata[key] = [side.itemName];
                        } else if (key === 'serve_outcome') {
                            params.metadata[key] = [outcome.itemName];
                        } else {
                            params.metadata[key] = request.params.metadata[key];
                        }
                    });

                    Object.keys(dataFilters.field[side.id]).forEach((field) => {
                        params.metadata[field] = [];
                        if (dataFilters.field[side.id][field].values.length) {
                            if (outcome.id === 'in' ||
                                (outcome.id === 'ace' && field !== 'return_type' && field !== 'return_contact' && field !== 'return_contact_depth') ||
                                (outcome.id === 'fault' && field !== 'return_type')) {
                                params.metadata[field] = dataFilters.field[side.id][field].values.map(value => value.itemName);
                            }
                        }
                    });

                    Object.keys(params).forEach((key) => {
                        formData.append(key, JSON.stringify(params[key]));
                    });

                    request.body.push(formData);
                });
            });

        } else {

            const formData = new FormData();

            Object.keys(request.params).forEach((key) => {
                formData.append(key, JSON.stringify(request.params[key]));
            });

            request.body.push(formData);
        }

        const requests = [];
        request.body.forEach((body) => {
            requests.push(this.http.post(environment.apiUrl + '/analytics', body));
        });
        return forkJoin(requests)
            .pipe(
                map((response: any) => {
                    if (response && response.length) {

                        const data = {
                            filters: {},
                            smartdata: {},
                            report: {}
                        };

                        request.response.status = true;
                        request.response.message = '';

                        // tslint:disable-next-line:variable-name
                        response.forEach((_response) => {
                            if (_response.hasOwnProperty('filters')) {
                                if (!Object.keys(data.filters).length) {
                                    data.filters = {..._response.filters};
                                }
                                if (!Object.keys(data.smartdata).length) {
                                    data.smartdata = {..._response.smartdata};
                                } else {
                                    Object.keys(data.smartdata).forEach((key) => {
                                        data.smartdata[key].push(..._response.smartdata[key]);
                                    });
                                }
                                if (!Object.keys(data.report).length) {
                                    data.report = {..._response.report};
                                }
                            }
                        });

                        if (dataFilters.player.player_1.length && dataFilters.smartdata.type.length) {
                            if (dataFilters.smartdata.type[0].id === 'serve' || dataFilters.smartdata.type[0].id === 'third_shot') {
                                Object.keys(data.smartdata).forEach((key) => {
                                    data.smartdata[key] = data.smartdata[key].filter((item) => {
                                        return item.server !== 'na' && (item.server !== 'opp' && parseInt(item.server, 10) === dataFilters.player.player_1[0].id);
                                    });
                                });
                            } else if (dataFilters.smartdata.type[0].id === 'return' || dataFilters.smartdata.type[0].id === 'fourth_shot') {
                                Object.keys(data.smartdata).forEach((key) => {
                                    data.smartdata[key] = data.smartdata[key].filter((item) => {
                                        return item.server !== 'na' && (item.server === 'opp' || parseInt(item.server, 10) !== dataFilters.player.player_1[0].id);
                                    });
                                });
                            } else if (dataFilters.smartdata.type[0].id === 'final_shot' || dataFilters.smartdata.type[0].id === 'final_shot_rally_length') {
                                Object.keys(data.smartdata).forEach((key) => {
                                    data.smartdata[key] = data.smartdata[key].filter((item) => {
                                        return item.final_shooter !== 'na' && (item.final_shooter !== 'opp' && parseInt(item.final_shooter, 10) === dataFilters.player.player_1[0].id);
                                    });
                                });
                            }
                        }

                        request.response.data = {
                            match: [],
                            filters: this.getMatchFilters(data.filters),
                            smartdata: (data.smartdata && Object.keys(data.smartdata).length) ? data.smartdata : false,
                            report: {}
                        };

                        // @ts-ignore
                        data.filters.match.forEach((match) => {
                            // @ts-ignore
                            const cover = (data.report.hasOwnProperty('cover')) ? this.generalService.findIntoArrayofObject(match.id, data.report.cover, 'match_id') : false;
                            request.response.data.match.push(this.getMatchData(match.meta, cover));
                        });

                        if (report.length && data.report.hasOwnProperty('custom')) {
                            // @ts-ignore
                            request.response.data.report = this.getReportData(data.report.custom[0]);
                        }

                        if (!Object.keys(request.response.data.report).length) {
                            request.response.data.report = false;
                        }

                    } else {
                        request.response.status = false;
                        // tslint:disable-next-line:max-line-length
                        request.response.message = (response.hasOwnProperty('message')) ? response.message : 'Unknown error occurred. Retry!';
                    }
                    return request.response;
                })
            );
    }

    getMatchData(dataMatchSelected, dataMatchCover) {

        // tslint:disable-next-line:max-line-length
        const localMatch = (localStorage.getItem('dataset-' + dataMatchSelected.id)) ? JSON.parse(localStorage.getItem('dataset-' + dataMatchSelected.id)) : false;
        if (localMatch && !dataMatchCover) {
            return localMatch;
        } else if (localMatch && dataMatchCover) {

            // @ts-ignore
            localMatch.match.winner = dataMatchCover.winner_id;

            dataMatchCover.sets.forEach((set) => {
                localMatch.match.set.push({
                    id: set.set_num,
                    itemName: 'Set ' + set.set_num,
                    score: {
                        player_ref: set.ref_player_game_score,
                        player_opp: set.opp_player_game_score
                    },
                    // @ts-ignore
                    winner: set.winner_id
                });
            });

            return localMatch;
        }

        const dataMatch = {
            id: dataMatchSelected.id,
            itemName: dataMatchSelected.itemName,
            description: dataMatchSelected.description,
            player: {
                player_1: {},
                player_2: {}
            },
            match: {
                round: {},
                set: [],
                date: {},
                winner: ''
            },
            tournament: {
                name: {},
                surface: {},
                env: {}
            }
        };

        dataMatch.player.player_1 = this.generalService.findIntoArrayofObject(dataMatchSelected.player_1_id, this.getPlayers(), 'id');
        dataMatch.player.player_2 = this.generalService.findIntoArrayofObject(dataMatchSelected.player_2_id, this.getPlayers(), 'id');
        dataMatch.tournament.surface = this.generalService.findIntoArrayofObject(dataMatchSelected.surface, this.getTournamentsSurface(), 'itemName');
        dataMatch.tournament.env = this.generalService.findIntoArrayofObject(dataMatchSelected.env, this.getTournamentsEnv(), 'itemName');
        dataMatch.tournament.name = this.generalService.findIntoArrayofObject(dataMatchSelected.tournament_id, this.getTournamentsName(), 'id');
        dataMatch.match.round = this.generalService.findIntoArrayofObject(dataMatchSelected.round, this.getMatchesRound(), 'itemName');
        dataMatch.match.date = this.generalService.findIntoArrayofObject(moment(dataMatchSelected.date, 'YYYY-MM-DD').format('YYYYMMDD'), this.getMatchesDate(), 'id');

        return dataMatch;
    }

    getMatchFilters(filtersSelected) {

        const dataFilters = {
            player: {
                player_1: [],
                player_2: [],
                all: []
            },
            match: {
                round: [],
                date: [],
            },
            tournament: {
                name: [],
                surface: [],
                env: []
            },
            score: {
                points: {
                    player_1: [],
                    player_1_tie: [],
                    player_2: [],
                    player_2_tie: [],
                },
                game: {
                    player_1: [],
                    player_2: []
                },
                set: {
                    player_1: [],
                    player_2: []
                }
            },
            smartdata: {
                type: [],
                aggregation: []
            }
        };

        dataFilters.player.player_1 = filtersSelected.player.ref_player;
        dataFilters.player.player_2 = filtersSelected.player.opp_player;
        dataFilters.player.all = this.generalService.mergeObjectsInUnique([...dataFilters.player.player_1, ...dataFilters.player.player_2], 'id');

        dataFilters.tournament.name = filtersSelected.tournament;
        dataFilters.tournament.surface = filtersSelected.surface;
        dataFilters.tournament.env = filtersSelected.env;

        dataFilters.match.round = filtersSelected.round;

        dataFilters.match.date.push({
            id: moment(filtersSelected.date.from, 'YYYY-MM-DD').format('YYYYMMDD'),
            year: moment(filtersSelected.date.from, 'YYYY-MM-DD').format('YYYY'),
            month: moment(filtersSelected.date.from, 'YYYY-MM-DD').format('M'),
            day: moment(filtersSelected.date.from, 'YYYY-MM-DD').format('D')
        });
        dataFilters.match.date.push({
            id: moment(filtersSelected.date.to, 'YYYY-MM-DD').format('YYYYMMDD'),
            year: moment(filtersSelected.date.to, 'YYYY-MM-DD').format('YYYY'),
            month: moment(filtersSelected.date.to, 'YYYY-MM-DD').format('M'),
            day: moment(filtersSelected.date.to, 'YYYY-MM-DD').format('D')
        });

        dataFilters.score.points.player_1 = dataFilters.score.points.player_2 = this.getScorePoints();
        dataFilters.score.points.player_1_tie = dataFilters.score.points.player_2_tie = this.getScorePointsTie();
        dataFilters.score.game.player_1 = dataFilters.score.game.player_2 = this.getScoreGame();
        dataFilters.score.set.player_1 = dataFilters.score.set.player_2 = this.getScoreSet();

        dataFilters.smartdata.type = this.smartdataService.getSmartdataTypes();

        dataFilters.smartdata.aggregation = this.smartdataService.getSmartdataAggregations();

        return dataFilters;
    }

    getReportData(reportSelectedData) {

        let report = {};

        report = this.reportService.getReportsSettings(reportSelectedData);

        return report;
    }

    setFiltersHistory(history, type, filter, side = '') {
        if (!filter.values.length) {
            // tslint:disable-next-line:variable-name
            history = history.filter((_history) => {
                return _history.field !== filter.id || (_history.field === filter.id && _history.side !== side);
            });
        } else {
            // tslint:disable-next-line:variable-name
            history = history.filter((_history) => {
                return (_history.field !== filter.id) || (_history.field === filter.id && (_history.side !== side || !this.generalService.findIntoArrayofObject(_history.value, filter.values, 'id')));
            });
            const histories = this.generalService.findIntoArrayofObject(filter.id, history, 'field');
            filter.values.forEach((value) => {
                if (!histories || (histories && !this.generalService.findIntoArrayofObject(value.id, histories, 'id'))) {
                    history.push({
                        type: 'common',
                        side: side,
                        field: filter.id,
                        value: value.id
                    });
                }
            });
        }
        return history;
    }
}
