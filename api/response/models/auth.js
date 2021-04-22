class AuthResponse {
    constructor(ttl, message) {
        this.ttl = ttl;
        this.message = message;
    }
}

class TokenResponse {
    constructor(token, refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
    }
}

module.exports = {
    AuthResponse: AuthResponse,
    TokenResponse: TokenResponse,
};
