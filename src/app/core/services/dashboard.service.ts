import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private readonly API_URL = environment.apiUrl;

    constructor(private http: HttpClient) { }

    public getDashboardData() {
        return this.http.get(`${this.API_URL}/dashboard`);
    }

}