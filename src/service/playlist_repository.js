import { database } from './firebase';
import { onValue, ref, remove, set } from 'firebase/database';

class PlaylistRepository {
  syncPlaylist(userId, onUpdate) {
    const listRef = ref(database, `playlists/${userId}`);
    onValue(listRef, (snapshot) => {
      const value = snapshot.val();
      value && onUpdate(value);
    });
  }
  saveSong(userId, playlist, song) {
    const listRef = ref(
      database,
      `playlists/${userId}/${playlist.id}/songs/${song.id}`
    );
    set(listRef, song);
  }
  makePlaylist(userId, playlist) {
    const listRef = ref(database, `playlists/${userId}/${playlist.id}/`);
    set(listRef, playlist);
  }
  removeUserPlaylists(userId) {
    const listRef = ref(database, `playlists/${userId}/`);
    remove(listRef);
  }
  removePlaylist(userId, playlist) {
    const listRef = ref(database, `playlists/${userId}/${playlist.id}/`);
    remove(listRef, playlist);
  }
  removeSong(userId, playlist, song) {
    const listRef = ref(
      database,
      `playlists/${userId}/${playlist.id}/songs/${song.id}`
    );
    remove(listRef, playlist);
  }
  updateSong() {}
}

export default PlaylistRepository;
