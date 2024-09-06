// TODO: move this to security-openapi-spec generated
export class UserAccess {

    constructor(public accessToken: string) {
    }
}

export class UserRegistration {

    constructor(public username: string, public password: string) {
    }

    firstName?: string;
    lastName?: string;
}

export class UserResponse {
    result: string = "";
    error: boolean = false;
}
