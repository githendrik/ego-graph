import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiHttpService {
    constructor(private httpClient: HttpClient) {}

    getDummy() {
        return this.httpClient.get('/api/dummy');
    }

    getInterestOverTime(keyword: string, startDate: string, endDate: string) {
        return this.httpClient.post('/.netlify/functions/google-trends-node-api', { startDate, endDate, keyword });
    }
}
