export class LoginRequest {
    userId: string;
    password: string;
}

export class LoginResponse {
    token: string;
    userId: string;
    id: string;
}
