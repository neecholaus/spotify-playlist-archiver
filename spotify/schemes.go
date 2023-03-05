package spotify

type UserPlaylists struct {
	Items []UserPlaylist `json:"items"`
}

type UserPlaylist struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type PlaylistItems struct {
	Items []PlaylistItem `json:"items"`
}

type PlaylistItem struct {
	AddedAt string `json:"added_at"`
	Track   struct {
		Name    string `json:"name"`
		Artists []struct {
			Name string `json:"name"`
		}
		Album struct {
			Name string `json:"name"`
		}
	}
}
