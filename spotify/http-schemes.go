package spotify

type AccessTokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenScope   string `json:"token_scope"`
	Scope        string `json:"scope"`
	ExpiresIn    int64  `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

type UserProfileResponse struct {
	Id          string `json:"id"`
	DisplayName string `json:"display_name"`
	Images      []struct {
		Url string `json:"url"`
	} `json:"images"`
}

type UserPlaylistsResponse struct {
	Limit int            `json:"limit"`
	Next  string         `json:"next"`
	Total int            `json:"total"`
	Items []UserPlaylist `json:"items"`
}

type apiErrorResponse struct {
	Error struct {
		Status  int    `json:"status"`
		Message string `json:"message"`
	}
}
