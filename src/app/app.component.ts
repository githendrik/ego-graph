import { Component, AfterViewInit } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { ApiHttpService, ApiResponse } from './api-http.service';

interface Node {
  id: string;
  label: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  public keyword = '';
  public response$: Observable<any> = of(null);
  public center$: Subject<boolean> = new Subject();
  public zoomToFit$: Subject<boolean> = new Subject();
  public update$: Subject<boolean> = new Subject();

  public nodes: Node[] = [];
  public edges: Edge[] = [];

  constructor(private apiHttpService: ApiHttpService) {}

  ngAfterViewInit(): void {
    document.getElementById('keyword').focus();
  }

  callApi() {
    this.response$ = this.apiHttpService.getRelatedKeywords(this.keyword);

    this.response$.subscribe((response: ApiResponse[]) => {
      const edges = [];
      const nodes = [];

      response.forEach((item) => {
        edges.push({
          source: item.from,
          target: item.to,
          id: `${item.from.replace(' ', '_')}-to-${item.to.replace(' ', '_')}`,
          weight: item.weight,
        });

        if (!nodes.find((node) => node.label === item.from)) {
          nodes.push({
            id: item.from,
            label: item.from,
          });
        }

        if (!nodes.find((node) => node.label === item.to)) {
          nodes.push({
            id: item.to,
            label: item.to,
          });
        }

        this.nodes = nodes;
        this.edges = edges;

        setTimeout(() => {
          this.zoomToFit$.next(true);
          this.center$.next(true);
        }, 500);
      });
    });
  }
}
