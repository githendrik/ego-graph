import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface ApiResponse {
  from: string;
  to: string;
  weight: number;
}

export interface TransformedResponse extends ApiResponse {
  fromId: string;
  toId: string;
}

@Injectable()
export class ApiHttpService {
  constructor(private httpClient: HttpClient) {}

  getRelatedKeywords(keyword: string): Observable<TransformedResponse[]> {
    return this.httpClient
      .post<ApiResponse[]>('/.netlify/functions/google-query', keyword)
      .pipe(
        map((response: ApiResponse[]) => {
          const mergedPairs: TransformedResponse[] = [];
          response.forEach((pair) => {
            const alreadyPresent = mergedPairs.find(mp => mp.from === pair.to && mp.to === pair.from)
            if (alreadyPresent) {
              alreadyPresent.weight += pair.weight;
            } else {
              mergedPairs.push({
                ...pair,
                fromId: 'id-' + pair.from.replace(/[\W_]+/g, '_'),
                toId: 'id-' + pair.to.replace(/[\W_]+/g, '_')
              });
            }
          });
          return mergedPairs;
        })
        );
  }
}
