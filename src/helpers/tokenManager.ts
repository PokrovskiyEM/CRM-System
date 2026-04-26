class TokenManager {
  #accessToken: string | null = null;

  getToken(): string | null {
    return this.#accessToken
  }

  setToken(token: string): void {
    this.#accessToken = token
  }

  clearToken(): void {
    this.#accessToken = null
  }
}

export const tokenManager = new TokenManager()