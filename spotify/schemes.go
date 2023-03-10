package spotify

type UserPlaylists struct {
	Items []Playlist `json:"items"`
}

type Playlist struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type PlaylistTracks struct {
	Id    string          `json:"id"`
	Items []PlaylistTrack `json:"items"`
}

type PlaylistTrack struct {
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
