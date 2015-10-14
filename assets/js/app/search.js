/**
 * Created by Andrew on 8/27/2015.
 */

function search(query) {
    coreSearch(query);
    aurousScript("#discoverIntro").remove();
    aurousScript("#alertError").hide();
    aurousScript("#loading").show();
    aurousScript("#search-result").hide();
    aurousScript("#search-results-count").hide();
}

function buildSearchResult(id, albumart, duration, album, title, artist, link) {
    var html = "<tr data-id=\"{0}\" data-value=\"{1}\" data-album-art=\"{9}\" data-song-name=\"{3}\" data-artist-name=\"{4}\"><td class=\"result-control\"> <button class=\"btn btn-transparent control-show\"><a href=\"#\"><i class=\"material-icons\" id=\"control-show-{10}\">add</i></a></button> <a href=\"#\"> <button class=\"btn btn-transparent\"><a href=\"#\"><i id=\"row-icon-{2}\" class=\"material-icons\">play_arrow<\/i><\/a></button><button class=\"btn btn-transparent control-show\"><a href=\"#\" data-jq-dropdown=\"#dropdown\"><i class=\"material-icons\">more_horiz</i></a></button><\/td> <td>{5}<\/td> <td>{6}<\/td> <td>{7}<\/td> <td>{8}<\/td> <\/tr>".format(id, link, id,title, artist, title, artist, album, duration, albumart, id);
    return html;
}

function handleException(message) {
    aurousScript("#loading").hide();
    aurousScript("#search-result").hide();
    aurousScript("#search-results-count").hide();
    aurousScript("#alertError").html('No result found for <strong><span id="searchQuery">' +message+ '</span></strong>. Please check your spelling or try fewer keywords.');
    aurousScript("#alertError").show();
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function lookupRemote(i, obj) {
    if (obj === null) {
        handleException('Error encountered');
        return false;
    }
    var artist = obj.artist;
    var title = obj.title;
    artist =  utils.replaceAll(decodeURIComponent(artist), "+", " ");
    title = utils.replaceAll(decodeURIComponent(title), "+", " ");
    obj.artist = artist;
    obj.title = title;
    var apiUrl = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=4cb074e4b8ec4ee9ad3eb37d6f7eb240&artist=" + artist + "&track=" + title + "&format=json";
    var defaultReturnValue = null;
    var returnValue = defaultReturnValue;
    $.getJSON(apiUrl, function(data) {
        if (data != null) {
            returnValue = data;
        }

        appendResults(i, obj, returnValue);
    });
}

function bindData(i, title, artist ,albumArt, url) {
    aurousScript( "#row-icon-" + i ).on( "click", function() {
        if(window.previousSearchResult !== undefined) {
            window.previousSearchResult.removeClass( "result-now-playing" );
            aurousScript( "#row-icon-" + window.previousSearchId).html("play_arrow");
        }
        var parent = aurousScript( this ).closest('tr');
        parent.addClass( "result-now-playing" );
        var id = parent.attr('data-id');
        aurousScript( "#row-icon-" + id).html("pause");
        var url = parent.attr('data-value');
        aurousScript.player.changeMedia(title, artist, albumArt,  url);
        aurousScript( "#playerPause" ).show();
        aurousScript( "#playerPlay").hide();
        window.previousSearchResult = parent;
        window.previousSearchId = id;

    });
}

function bindDownload(i, title, artist, url) {
    aurousScript( "#control-show-" + i ).on( "click", function() {
        console.log(i);
        downloader.downloadSong(title, artist, url);
    });
}

function appendResults(i, obj, data) {

    if (data.track !== undefined) {
        var duration = obj.duration;
        var album = "Unknown";
        var albumArt = "assets/img/noalbumart.png";
        if (data.track !== undefined) {
            duration = millisToMinutesAndSeconds(data.track.duration);
        }
        if (data.track.album !== undefined) {
            album = data.track.album.title;
        }
        if (data.track.album !== undefined) {
            albumArt = data.track.album.image[3]["#text"];
        }
        if (!albumArt.length) {
            albumArt = "assets/img/noalbumart.png";
        }
        var result = buildSearchResult(i, albumArt, duration, album, obj.title, obj.artist, obj.link);
        aurousScript('#searchResultsTable tbody').append(result);
        bindData(i, obj.title, obj.artist, albumArt, obj.link);
        bindDownload(i, obj.title, obj.artist, obj.link);
    } else {
        var resultUnknown = buildSearchResult(i, "assets/img/noalbumart.png", obj.duration, obj.album, obj.title, obj.artist, obj.link);
        aurousScript('#searchResultsTable tbody').append(resultUnknown);
        bindData(i, obj.title, obj.artist, "assets/img/noalbumart.png", obj.link);
        bindDownload(i, obj.title, obj.artist, obj.link);
    }

}
function searchCallback(message) {
    var decoded = atob(message);
    var jsonData = JSON.parse(decoded);
    if (jsonData.results.length == 0) {
        handleException(jsonData.phrase);
        return false;
    }
    var totalResults = "{0} results from the Aurous Network".format(jsonData.results.length);
    aurousScript('#searchResultsTable tbody').html("");
    aurousScript("#search-results-count").text(totalResults);
    for (var i = 0; i < jsonData.results.length; i++) {
        var obj = jsonData.results[i];

        lookupRemote(i, obj)
    }

    aurousScript("#loading").hide();
    aurousScript("#search-result").show();
    aurousScript("#search-results-count").show();
    window.activeViewPort = "search";

}