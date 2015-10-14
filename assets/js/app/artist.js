/**
 * Created by Andrew on 10/1/2015.
 */
var artistInfo = {

    fetchArtistArt: function(artist, totalSongs) {
        var encodedArtist = encodeURIComponent(artist);
        var apiUrl = "http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=4cb074e4b8ec4ee9ad3eb37d6f7eb240&artist=" + encodedArtist + "&format=json";
        var defaultReturnValue = null;
        var returnValue = defaultReturnValue;
        $.getJSON(apiUrl, function(data) {
            if (data != null) {
                returnValue = data;
                if (data.artist !== undefined) {
                    if ( data.artist.image !== undefined) {

                        var url = data.artist.image[3]["#text"];

                        artistInfo.updateArtistSort(artist, url, totalSongs);
                    }
                } else {
                    artistInfo.updateArtistSort(artist, "assets/img/noalbumart.png", totalSongs);
                }

            }
        });

    },
    makeId: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    updateArtistSort: function (artist, data, totalSongs) {
        if (!utils.isEmpty(data)) {
            var id = artistInfo.makeId();
            var sortedArtist = '<div id={0} class="toggle-panel"> <a href="#panelArtists"> <li> <img src="{1}" /> <h3>{2}</h3> <p>{3} songs</p> </li> </a> </div>'.format(id, data, artist, totalSongs);
           // var sortedArtist = '<a id={0} href="" class="cd-btn"> <li> <img src="{1}" /> <h3>{2}</h3> <p>{3} songs</p> </li> </a>'.format( id, data, artist, totalSongs);
            $('#artistSortList').append(sortedArtist);
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
                 songCollection.sortByArtist(artist);
            });
        }
    }

};