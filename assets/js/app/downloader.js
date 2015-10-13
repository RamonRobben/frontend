/**
 * Created by Andrew on 10/5/2015.
 */
var downloader = {
     downloadSong: function(songName, artist, remoteUrl) {
         if (typeof downloadSongAsync == 'function') {
             var extension = remoteUrl.split('.').pop();
             var fileName = songName + "-" + artist + "." + extension;
            downloadSongAsync(remoteUrl, fileName);
          alertify.success("Downloading " + fileName);
         }
     },
    downloadToPlaylist: function(songName, artist, remoteUrl, playlistId) {
        if (typeof downloadSongAsync == 'function') {
            var extension = remoteUrl.split('.').pop();
            var fileName = songName + "-" + artist + "." + extension;
            downloadSongAsync(remoteUrl, fileName, playlistId);
            alertify.success("Downloading " + fileName);
        }
    }

};