import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ResolveStart } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'zlam';

    public currRoute = {
        data: {
            title: '',
            slug: ''
        }
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) { }

    initCurrRouteData() {
        const $this = this;
        this.router.events.pipe(
            filter(event => event instanceof ResolveStart),
            map(event => {
                let data = null;
                let route = event['state'].root;

                while (route) {
                    data = route.data || data;
                    route = route.firstChild;
                }

                return data;
            }),
        ).subscribe(data => {
            $this.currRoute.data.title = data.title;
            $this.currRoute.data.slug = data.slug;
        });
    }

    ngOnInit(): void {
        this.initCurrRouteData();
    }
}
