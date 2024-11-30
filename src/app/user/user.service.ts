import {Injectable} from '@angular/core';
import {UserRegistration} from "../generated/auth/model/userRegistration";
import {catchError, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders, HttpStatusCode} from "@angular/common/http";
import {BaseService} from "../base.service";
import {MessageService} from "../message.service";
import {UserData} from "../generated/auth/model/userData";
import {PaginatedUsers} from "../generated/auth/model/paginatedUsers";

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {

    private httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        withCredentials: true
    };

    constructor(private http: HttpClient, protected override messageService: MessageService) {
        super(messageService);
    }

    register(userReg: UserRegistration): Observable<string> {
        return this.http.post<string>(`${environment.securityApiUrl}/users`, userReg, this.httpOptions).pipe(
            map((user) => {
                this.log("user registered");
                return user;
            }),
            catchError(this.handleError<string>("register"))
        );
    }

    getUser(userId: string): Observable<UserData> {
        return this.http.get<UserData>(`${environment.securityApiUrl}/users/${userId}`, this.httpOptions).pipe(
            map((user) => {
                this.log("user retrieved");
                return user;
            }),
            catchError(this.handleError<UserData>("getUser"))
        );
    }

    updateUser(userId: string, userData: UserData): Observable<UserData> {
        return this.http.put<UserData>(`${environment.securityApiUrl}/users/${userId}`, userData, this.httpOptions).pipe(
            map((user) => {
                this.log("user updated");
                return user;
            }),
            catchError(this.handleError<UserData>("updateUser"))
        );
    }

    getAllUsers(page: number, perPage: number, username?: string, firstName?: string, lastName?: string): Observable<PaginatedUsers> {
        const usernameFilter = username ? `&username=${username}` : "";
        const firstNameFilter = firstName ? `&firstName=${firstName}` : "";
        const lastNameFilter = lastName ? `&lastName=${lastName}` : "";

        return this.http.get<PaginatedUsers>(`${environment.securityApiUrl}/users?page=${page}&perPage=${perPage}${usernameFilter}${firstNameFilter}${lastNameFilter}`, this.httpOptions).pipe(
            map((users) => {
                this.log("all users retrieved");
                return users;
            }),
            catchError(this.handleError<PaginatedUsers>("getAllUsers"))
        );
    }
}
