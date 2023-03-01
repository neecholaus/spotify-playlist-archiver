package spotify

type UserPlaylists struct {
	Items []UserPlaylist `json:"items"`
}

type UserPlaylist struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}
