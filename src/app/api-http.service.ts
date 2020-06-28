import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface ApiResponse {
  from: string;
  to: string;
  weight: number;
}

@Injectable()
export class ApiHttpService {
  constructor(private httpClient: HttpClient) {}

  getRelatedKeywords(keyword: string): Observable<ApiResponse[]> {
    return this.httpClient
      .post<ApiResponse[]>('/.netlify/functions/google-query', keyword)
      .pipe(
        map((response: ApiResponse[]) => {
          const mergedPairs: ApiResponse[] = [];
          response.forEach((pair) => {
            const alreadyPresent = mergedPairs.find(mp => mp.from === pair.to && mp.to === pair.from)
            if (alreadyPresent) {
              alreadyPresent.weight += pair.weight;
            } else {
              mergedPairs.push(pair);
            }
          });
          return mergedPairs;
        })
        );
  }
}
