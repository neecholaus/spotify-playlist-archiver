package spotify

type AccessToken struct {
	AccessToken  string `json:"access_token"`
	TokenScope   string `json:"token_scope"`
	Scope        string `json:"scope"`
	ExpiresIn    int64  `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
}

type UserProfile struct {
	Id          string      `json:"id"`
	DisplayName string      `json:"display_name"`
	Images      []UserImage `json:"images"`
}

type UserImage struct {
	Url string `json:"url"`
}

type UserPlaylists struct {
	Limit int            `json:"limit"`
	Next  string         `json:"next"`
	Total int            `json:"total"`
	Items []UserPlaylist `json:"items"`
}

type UserPlaylist struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type apiErrorResponse struct {
	Error struct {
		Status  int    `json:"status"`
		Message string `json:"message"`
	}
}
