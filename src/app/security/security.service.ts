import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, finalize, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MessageService} from "../message.service";
import {BaseService} from "../base.service";
import {UserAccess} from "../generated/auth/model/userAccess";
import {map} from "rxjs/operators";

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
            map(user => {
                this.log("user logged in");

                localStorage.setItem(USER_KEY, JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }),
            catchError(this.handleErrorWith<UserAccess>("login", () => this.handleClearToken()))
        );
    }

    refresh(): Observable<UserAccess | null> {
        if (this.refreshInProgress) {
            return this.user;
        }

        this.refreshInProgress = true;
        this.userSubject.next(null);

        return this.http.post<UserAccess>(`${environment.securityApiUrl}/authenticate/refresh`, null, this.httpOptions).pipe(
            map(user => {
                this.log("refreshed access token");

                this.refreshInProgress = false;
                this.userSubject.next(user);
                localStorage.setItem(USER_KEY, JSON.stringify(user));
                return user;
            }),
            catchError(this.handleErrorWith<UserAccess>("refresh", () => {
                this.handleClearToken();
            }))
        );
    }

    logout(): Observable<string> {
        return this.http.post<string>(`${environment.securityApiUrl}/authenticate/logout`, null, this.httpOptions).pipe(
            catchError(this.handleError<string>("logout")),
            finalize(() => {
                this.log("user logged out");
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
