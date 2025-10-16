import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, finalize, Observable, tap} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MessageService} from "../message.service";
import {BaseService} from "../base.service";
import {UserAccess} from "../generated/auth/model/userAccess";
import {ResponseMessage} from "../generated/auth/model/responseMessage";

export const USER_KEY = "vm-front-user";

@Injectable({providedIn: 'root'})
export class SecurityService extends BaseService {

    private httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        withCredentials: true
    };

    public user: Observable<UserAccess | null>;
    private userSubject: BehaviorSubject<UserAccess | null>;

    private refreshInProgress = false;

    constructor(private http: HttpClient,
                protected override messageService: MessageService) {
        super(messageService);
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem(USER_KEY)!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string): Observable<UserAccess> {
        return this.http.post<UserAccess>(`${environment.securityApiUrl}/authenticate`, { username, password }, this.httpOptions).pipe(
            tap(user => {
                this.info("user logged in");
                localStorage.setItem(USER_KEY, JSON.stringify(user));
                this.userSubject.next(user);
            }),
            catchError(err => {
                this.handleClearToken();
                return this.error(err);
            })
        );
    }

    refresh(): Observable<UserAccess | null> {
        if (this.refreshInProgress) {
            return this.user;
        }

        this.refreshInProgress = true;
        this.userSubject.next(null);

        return this.http.post<UserAccess>(`${environment.securityApiUrl}/authenticate/refresh`, null, this.httpOptions).pipe(
            tap(user => {
                this.info("refreshed access token");
                this.refreshInProgress = false;
                this.userSubject.next(user);
                localStorage.setItem(USER_KEY, JSON.stringify(user));
            }),
            catchError(err => {
                this.handleClearToken();
                return this.error(err);
            })
        );
    }

    logout(): Observable<ResponseMessage> {
        return this.http.post<ResponseMessage>(`${environment.securityApiUrl}/authenticate/logout`, null, this.httpOptions).pipe(
            catchError(err => this.error(err)),
            finalize(() => {
                this.info("user logged out");
                this.handleClearToken();
            })
        );
    }

    private handleClearToken() {
        localStorage.removeItem(USER_KEY);
        this.refreshInProgress = false;
        this.userSubject.next(null);
    }
}
