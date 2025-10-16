import {Injectable} from '@angular/core';
import {UserRegistration} from "../generated/auth/model/userRegistration";
import {catchError, Observable, tap} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BaseService, Pageable} from "../base.service";
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
            tap(message => this.info(message)),
            catchError(err => this.error(err))
        );
    }

    getUser(userId: string): Observable<UserData> {
        return this.http.get<UserData>(`${environment.securityApiUrl}/users/${userId}`, this.httpOptions).pipe(
            tap(user => this.info(`user retrieved: ${user.username}`)),
            catchError(err => this.error(err))
        );
    }

    updateUser(userId: string, userData: UserData): Observable<UserData> {
        return this.http.put<UserData>(`${environment.securityApiUrl}/users/${userId}`, userData, this.httpOptions).pipe(
            tap(user => this.info(`user updated: ${user.username}`)),
            catchError(err => this.error(err))
        );
    }

    getAllUsers(pageable: Pageable, username?: string, firstName?: string, lastName?: string): Observable<PaginatedUsers> {
        const usernameFilter = username ? `&username=${username}` : "";
        const firstNameFilter = firstName ? `&firstName=${firstName}` : "";
        const lastNameFilter = lastName ? `&lastName=${lastName}` : "";

        return this.http.get<PaginatedUsers>(`${environment.securityApiUrl}/users?page=${pageable.page}&perPage=${pageable.perPage}${usernameFilter}${firstNameFilter}${lastNameFilter}`, this.httpOptions).pipe(
            tap(page => this.info(`${page.data.length} user(s) retrieved`)),
            catchError(err => this.error(err))
        );
    }
}
