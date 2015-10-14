/**
 * Created by Andrew on 9/13/2015.
 */
var albumInfo = {

    fetchTrackArt: function(songId, title, artist) {
        var apiUrl = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=4cb074e4b8ec4ee9ad3eb37d6f7eb240&artist=" + artist + "&track=" + title + "&format=json";
        var defaultReturnValue = null;
        var returnValue = defaultReturnValue;
        $.getJSON(apiUrl, function(data) {
            if (data != null) {
                returnValue = data;
                if (data.track !== undefined) {
                   if ( data.track.album !== undefined) {
                       var url = data.track.album.image[3]["#text"];
                       albumInfo.updateAlbumArt(songId, url);
                   }
                }

            }
        });

    },
    fetchAlbumArt: function(artist, album, total) {
        var apiUrl = "http://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=4cb074e4b8ec4ee9ad3eb37d6f7eb240&artist=" + artist + "&album=" + album + "&format=json";
        var defaultReturnValue = null;
        var returnValue = defaultReturnValue;
        $.getJSON(apiUrl, function(data) {
            if (data != null) {
                returnValue = data;
                if (data.album !== undefined) {
                    if ( data.album.image !== undefined) {
                        var url =  data.album.image[4]["#text"];
                        albumInfo.updateAlbumSort(album, url, total);
                    }
                } else {
                    albumInfo.updateAlbumSort(album, "assets/img/noalbumart.png", total);
                }

            }
        });

    },
    updateAlbumSort: function (album, data, totalSongs) {
        if (!utils.isEmpty(data)) {
            var id = artistInfo.makeId();
            var sortedAlbum = '<div id={0} class="toggle-panel"> <a href="#panelAlbums"> <li> <img src="{1}" /> <h3>{2}</h3> <p>{3} songs</p> </li> </a> </div>'.format(id, data, album, totalSongs);
            $('#albumSortList').append(sortedAlbum);
            $('.toggle-panel a').on('click', function (event) {
                var href = $(this).attr('href');
                event.preventDefault();
                $(href).addClass('is-visible');
            });
            $('.cd-panel').on('click', function (event) {
                if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
                    $('.cd-panel').removeClass('is-visible');
                    event.preventDefault();
                }
            });
            aurousScript("#" + id).on("click", function (e) {
                e.preventDefault();
                songCollection.sortByAlbum(album);
            });
        }
    },
    updateAlbumArt: function (id, data) {
        if (!utils.isEmpty(data)) {
            aurousScript("#currentAlbumArt").attr("src", data);
            updateDatabaseArt(data, id);
        }
    }
};