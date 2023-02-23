package spotify

type AccessTokenResponse struct {
	AccessToken  string `json:"accessToken"`
	TokenScope   string `json:"tokenScope"`
	Scope        string `json:"scope"`
	ExpiresIn    int64  `json:"expiresIn"`
	RefreshToken string `json:"refreshToken"`
}

type errorResponse struct {
}
