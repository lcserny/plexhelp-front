import {Injectable} from '@angular/core';
import {UserRegistration} from "../generated/auth/model/userRegistration";
import {catchError, Observable} from "rxjs";
import {UserResponse} from "../generated/auth/model/userResponse";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders, HttpStatusCode} from "@angular/common/http";
import {BaseService} from "../base.service";
import {MessageService} from "../message.service";
import {UserData} from "../generated/auth/model/userData";
import {PaginatedUsers} from "../generated/auth/model/paginatedUsers";
import {NameValuePair} from "../generated/auth/model/nameValuePair";

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {

    private httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        withCredentials: true
    };

    constructor(private http: HttpClient, protected override messageService: MessageService) {
        super(messageService);
    }

    register(userReg: UserRegistration): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${environment.securityApiUrl}/users`, userReg, this.httpOptions).pipe(
            map((user) => {
                this.log("user registered");
                return user;
            }),
            catchError(this.handleError<UserResponse>("register", {
                error: Error.name,
                message: `Could not register user with name ${userReg.username}`,
                statusCode: HttpStatusCode.BadRequest,
            }))
        );
    }

    getUser(userId: string): Observable<UserData | UserResponse> {
        return this.http.get<UserData>(`${environment.securityApiUrl}/users/${userId}`, this.httpOptions).pipe(
            map((user) => {
                this.log("user retrieved");
                return user;
            }),
            catchError(this.handleError<UserResponse>("getUser", {
                error: Error.name,
                message: `Could not get user with ID ${userId}`,
                statusCode: HttpStatusCode.BadRequest,
            }))
        );
    }

    updateUser(userId: string, userData: UserData): Observable<UserData | UserResponse> {
        return this.http.put<UserData>(`${environment.securityApiUrl}/users/${userId}`, userData, this.httpOptions).pipe(
            map((user) => {
                this.log("user updated");
                return user;
            }),
            catchError(this.handleError<UserResponse>("updateUser", {
                error: Error.name,
                message: `Could not update user data for user with ID ${userId}`,
                statusCode: HttpStatusCode.BadRequest,
            }))
        );
    }

    getAllUsers(page: number, perPage: number): Observable<PaginatedUsers | UserResponse> {
        return this.http.get<PaginatedUsers>(`${environment.securityApiUrl}/users?page=${page}&perPage=${perPage}`, this.httpOptions).pipe(
            map((users) => {
                this.log("all users retrieved");
                return users;
            }),
            catchError(this.handleError<UserResponse>("getAllUsers", {
                error: Error.name,
                message: `Could not get all users for page ${page} and perPage ${perPage}`,
                statusCode: HttpStatusCode.BadRequest,
            }))
        );
    }

    search(searchFields: NameValuePair[]): Observable<UserData[]> {
        return this.http.post<UserData[]>(`${environment.securityApiUrl}/users/search`, searchFields, this.httpOptions).pipe(
            map((users) => {
                this.log("users searched");
                return users;
            }),
            catchError(this.handleError<UserData[]>("search", []))
        );
    }
}
