package spotify

type AccessTokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenScope   string `json:"token_scope"`
	Scope        string `json:"scope"`
	ExpiresIn    int64  `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

type errorResponse struct {
}
