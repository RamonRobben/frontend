/**
 * Created by Andrew on 8/19/2015.
 */

aurousScript(function() {
    aurousScript.player = document.getElementById("audioPlayer");
    aurousScript.player.source = document.getElementById("playersource");
    aurousScript.player.averageAudio = 0;
    aurousScript.player.shuffle = false;
    aurousScript.player.repeat = false;

    aurousScript("#playerPlay").click(function() {
        aurousScript.player.alterPlayback();
        event.preventDefault();
    });
    aurousScript("#playerPause").click(function() {
        aurousScript.player.alterPlayback();
        event.preventDefault();
    });
    aurousScript("#playerSkipNext").click(function() {
        aurousScript.player.playNext();
        event.preventDefault();
    });
    aurousScript("#playerSkipPrevious").click(function() {
        aurousScript.player.playPrevious();
        event.preventDefault();
    });
    aurousScript.player.getCurrentTime = function() {
        return aurousScript.player.currentTime;
    };
    aurousScript.player.playNext = function() {
        var activeViewport = window.activeViewPort;
        switch (activeViewport) {
            case "search":
                aurousScript.player.playNextSearchResult();
                break;
            case "collection":
                aurousScript.player.playNextCollection();
                break;
            case "artist":
                aurousScript.player.playNextArtist();
                break;
            case "album":
                aurousScript.player.playNextAlbum();
                break;
            case "playlist":
                aurousScript.player.playNextPlaylist();
                break;
            default:
                text = "Looking forward to the Weekend";
        }
    };
    aurousScript.player.playPrevious = function() {
        var activeViewport = window.activeViewPort;
        switch (activeViewport) {
            case "search":
                aurousScript.player.playLastSearchResult();
                break;
            case "collection":
                aurousScript.player.playLastCollection();
                break;
            case "artist":
                aurousScript.player.playLastArtist();
                break;
            case "album":
                aurousScript.player.playLastAlbum();
                break;
            case "playlist":
                aurousScript.player.playLastPlaylist();
                break;
            default:
                text = "Looking forward to the Weekend";
        }
    };
    aurousScript.player.getDuration = function() {
        return aurousScript.player.duration;
    };
    aurousScript('#song-volume-slider').slider().bind({
        change: function() {
            aurousScript.player.setVolume(aurousScript('#song-volume-slider').slider('getValue') / 100);
        }
    });
    aurousScript('#song-progress-slider').on('slideStop', function(ev) {
        var seekto = aurousScript.player.getDuration() * (aurousScript('#song-progress-slider').slider('getValue') / 100);
        aurousScript.player.setTime(seekto);
    });
    aurousScript.player.getPlaybackPercentage = function() {
        return aurousScript.player.duration;
    };
    aurousScript.player.onloadeddata = function() {};
    aurousScript.player.onreadystatechange = function() {};
    aurousScript.player.addEventListener("suspend", function() {});
    aurousScript.player.addEventListener("abort", function() {});
    aurousScript.player.addEventListener("onreadystatechange", function() {});
    aurousScript.player.addEventListener('error', function(e) {
        var noSourcesLoaded = (this.networkState === HTMLMediaElement.NETWORK_NO_SOURCE);
        if (noSourcesLoaded) alertify.error("Error starting playback. ");
    }, true);
    aurousScript.player.addEventListener("stalled", function() {});
    aurousScript.player.addEventListener("timeupdate", function() {
        var currentTime = aurousScript.player.getCurrentTime();
        var currentDuration = aurousScript.player.getDuration();
        var percentage = 100 * currentTime / currentDuration; //in %
        aurousScript("#song-current-time").html(aurousScript.player.toTime(currentTime));
        aurousScript("#song-total-time").html(aurousScript.player.toTime(currentDuration));
        aurousScript('#song-progress-slider').slider('setValue', percentage);
    });

    aurousScript.player.toTime = function(seconds) {
        var duration = moment.duration(seconds, "seconds");
        var time = "";
        var hours = duration.hours();
        if (hours > 0) {
            time = hours + ":";
        }
        var formattedSeconds = duration.seconds() < 10 ? "0" + duration.seconds() : duration.seconds();
        time = time + duration.minutes() + ":" + formattedSeconds;
        return time;
    };
    aurousScript.player.addEventListener("ended", function() {
        aurousScript.player.playNext();
    });
    aurousScript.player.playNextCollection = function() {
        var nextRow = $(window.previousCollectionRow).closest('tr').next('tr');
        window.previousCollectionRow.removeClass("result-now-playing");
        aurousScript("#collection-row-icon-" + window.previousCollectId).html("play_arrow");
        var parent = nextRow.closest('tr');
        var id = parent.attr('collection-data-id');
        window.currentCollectionId = id;
        var albumArt = nextRow.attr('collection-data-album-art');
        aurousScript("#collection-row-icon-" + id).html("pause");
        nextRow.addClass("result-now-playing");
        var url = parent.attr('collection-data-value');
        var artist = parent.attr('collection-data-artist-name');
        var song = parent.attr('collection-data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousCollectionRow = aurousScript(nextRow);
        window.previousCollectId = id;
    };
    aurousScript.player.playNextAlbum = function() {

        var nextRow = $(window.previousCollectionRow).closest('tr').next('tr');
        window.previousCollectionRow.removeClass("result-now-playing");
        aurousScript("#album-row-icon-" + window.previousCollectId).html("play_arrow");
        var parent = nextRow.closest('tr');
        var id = parent.attr('album-data-id');
        window.currentCollectionId = id;
        var albumArt = nextRow.attr('album-data-album-art');
        aurousScript("#album-row-icon-" + id).html("pause");
        nextRow.addClass("result-now-playing");
        var url = parent.attr('album-data-value');
        var artist = parent.attr('album-data-artist-name');
        var song = parent.attr('album-data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousCollectionRow = aurousScript(nextRow);
        window.previousCollectId = id;
    };
    aurousScript.player.playNextPlaylist = function() {
        if (window.previousPlaylist !== undefined) {
            window.previousPlaylist.removeClass("result-now-playing");
            aurousScript("#playlist-row-icon-" + window.previousPlaylistId).html("play_arrow");
        }
        var nextRow = $(window.previousPlaylist).closest('tr').next('tr');
        window.previousPlaylist.removeClass("result-now-playing");
        aurousScript("#playlist-row-icon-" + window.previousPlaylistId).html("play_arrow");
        var parent = nextRow.closest('tr');
        var id = parent.attr('playlist-data-id');
        window.currentCollectionId = id;
        var albumArt = nextRow.attr('playlist-data-album-art');
        aurousScript("#playlist-row-icon-" + id).html("pause");
        nextRow.addClass("result-now-playing");
        var url = parent.attr('playlist-data-value');
        var artist = parent.attr('playlist-data-artist-name');
        var song = parent.attr('playlist-data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousPlaylist = aurousScript(nextRow);
        window.previousPlaylistId = id;
    };
    aurousScript.player.playNextArtist = function() {

        var nextRow = $(window.previousCollectionRow).closest('tr').next('tr');
        window.previousCollectionRow.removeClass("result-now-playing");
        aurousScript("#artist-row-icon-" + window.previousCollectId).html("play_arrow");
        var parent = nextRow.closest('tr');
        var id = parent.attr('artist-data-id');
        window.currentCollectionId = id;
        var albumArt = nextRow.attr('artist-data-album-art');
        aurousScript("#artist-row-icon-" + id).html("pause");
        nextRow.addClass("result-now-playing");
        var url = parent.attr('artist-data-value');
        var artist = parent.attr('artist-data-artist-name');
        var song = parent.attr('artist-data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousCollectionRow = aurousScript(nextRow);
        window.previousCollectId = id;
    };
    aurousScript.player.playNextSearchResult = function() {
        var nextRow = $(window.previousSearchResult).closest('tr').next('tr');
        window.previousSearchResult.removeClass("result-now-playing");
        aurousScript("#row-icon-" + window.previousSearchId).html("play_arrow");
        var parent = nextRow.closest('tr');
        var id = parent.attr('data-id');
        var albumArt = nextRow.attr('data-album-art');
        aurousScript("#row-icon-" + id).html("pause");
        nextRow.addClass("result-now-playing");
        var url = parent.attr('data-value');
        var artist = parent.attr('data-artist-name');
        var song = parent.attr('data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousSearchResult = aurousScript(nextRow);
        window.previousSearchId = id;
    };
    aurousScript.player.playLastSearchResult = function() {
        var nextRow = $(window.previousSearchResult).closest('tr').prev('tr');
        window.previousSearchResult.removeClass("result-now-playing");
        aurousScript("#row-icon-" + window.previousSearchId).html("play_arrow");
        var parent = nextRow.closest('tr');
        var id = parent.attr('data-id');
        window.currentCollectionId = id;
        var albumArt = nextRow.attr('data-album-art');
        aurousScript("#row-icon-" + id).html("pause");
        nextRow.addClass("result-now-playing");
        var url = parent.attr('data-value');
        var artist = parent.attr('data-artist-name');
        var song = parent.attr('data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousSearchResult = aurousScript(nextRow);
        window.previousSearchId = id;
    };
    aurousScript.player.playLastArtist = function() {

        var lastRow = $(window.previousCollectionRow).closest('tr').prev('tr');
        window.previousCollectionRow.removeClass("result-now-playing");
        aurousScript("#artist-row-icon-" + window.previousCollectId).html("play_arrow");
        var parent = lastRow.closest('tr');
        var id = parent.attr('artist-data-id');
        var albumArt = lastRow.attr('artist-data-album-art');
        aurousScript("#artist-row-icon-" + id).html("pause");
        lastRow.addClass("result-now-playing");
        var url = parent.attr('artist-data-value');
        var artist = parent.attr('artist-data-artist-name');
        var song = parent.attr('artist-data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousCollectionRow = aurousScript(lastRow);
        window.previousCollectId = id;
    };
    aurousScript.player.playLastAlbum = function() {

        var lastRow = $(window.previousCollectionRow).closest('tr').prev('tr');
        window.previousCollectionRow.removeClass("result-now-playing");
        aurousScript("#album-row-icon-" + window.previousCollectId).html("play_arrow");
        var parent = lastRow.closest('tr');
        var id = parent.attr('album-data-id');
        var albumArt = lastRow.attr('album-data-album-art');
        aurousScript("#album-row-icon-" + id).html("pause");
        lastRow.addClass("result-now-playing");
        var url = parent.attr('album-data-value');
        var artist = parent.attr('album-data-artist-name');
        var song = parent.attr('album-data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousCollectionRow = aurousScript(lastRow);
        window.previousCollectId = id;
    };
    aurousScript.player.playLastPlaylist = function() {
        if (window.previousPlaylist !== undefined) {
            window.previousPlaylist.removeClass("result-now-playing");
            aurousScript("#playlist-row-icon-" + window.previousPlaylistId).html("play_arrow");
        }
        var lastRow = $(window.previousPlaylist).closest('tr').prev('tr');
        window.previousPlaylist.removeClass("result-now-playing");
        aurousScript("#playlist-row-icon-" + window.previousPlaylistId).html("play_arrow");
        var parent = lastRow.closest('tr');
        var id = parent.attr('playlist-data-id');
        var albumArt = lastRow.attr('playlist-data-album-art');
        aurousScript("#playlist-row-icon-" + id).html("pause");
        lastRow.addClass("result-now-playing");
        var url = parent.attr('playlist-data-value');
        var artist = parent.attr('playlist-data-artist-name');
        var song = parent.attr('playlist-data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousPlaylist = aurousScript(lastRow);
        window.previousPlaylistId = id;
    };
    aurousScript.player.playLastCollection = function() {
        var lastRow = $(window.previousCollectionRow).closest('tr').prev('tr');
        window.previousCollectionRow.removeClass("result-now-playing");
        aurousScript("#collection-row-icon-" + window.previousCollectId).html("play_arrow");
        var parent = lastRow.closest('tr');
        var id = parent.attr('collection-data-id');
        var albumArt = lastRow.attr('collection-data-album-art');
        aurousScript("#collection-row-icon-" + id).html("pause");
        lastRow.addClass("result-now-playing");
        var url = parent.attr('collection-data-value');
        var artist = parent.attr('collection-data-artist-name');
        var song = parent.attr('collection-data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousCollectionRow = aurousScript(lastRow);
        window.previousCollectId = id;
    };
    aurousScript.player.getVolume = function() {
        return aurousScript.player.volume;
    };
    aurousScript.player.setVolume = function(vol) {
        aurousScript.player.volume = vol;
    };
    aurousScript.player.toggleAutoPlay = function() {
        player.autoplay == false ? true : false;
    };
    aurousScript.player.setTime = function(time) {
        aurousScript.player.currentTime = time;
    };
    aurousScript.player.alterPlayback = function() {
        if (aurousScript.player.paused == true) {
            aurousScript.player.play();
            aurousScript("#playerPause").show();
            aurousScript("#playerPlay").hide();

        } else {
            aurousScript.player.pause();
            aurousScript("#playerPause").hide();
            aurousScript("#playerPlay").show();
        }
    };
    aurousScript.player.reloadMedia = function() {
        aurousScript.player.load();
    };
    aurousScript.player.changeMedia = function(title, artist, albumArt, url) {
        aurousScript.player.pause();
        aurousScript.player.currentTime = 0;
        aurousScript.player.source.src = url;
        aurousScript.player.load();
        aurousScript.player.play();
        aurousScript("#currentAlbumArt").attr("src", albumArt);
        aurousScript("#currentTitle").html(title);
        aurousScript("#currentArtist").html(artist);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        if (window.activeViewPort == "collection" || window.activeViewPort == "artist" || window.activeViewPort == "album") {
            if (albumArt == "assets/img/noalbumart.png") {
                albumInfo.fetchTrackArt( window.currentCollectionId, title, artist);
            }
        } else if (window.activeViewPort == "playlist") {
            if (albumArt == "assets/img/noalbumart.png") {
                albumInfo.fetchTrackArt( window.currentPlaylistId, title, artist);
            }
        }

    };
    aurousScript.player.getPlayerData = function() {
        return aurousScript.player.averageAudio;
    };
    aurousScript.player.getAverageVolume = function(array) {
        var values = 0;
        var average;
        var length = array.length;
        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }
        average = values / length;
        return average;
    };
    aurousScript.player.context = new webkitAudioContext();
     aurousScript.player.analyser = aurousScript.player.context.createAnalyser();
     aurousScript.player.contextSource = aurousScript.player.context.createMediaElementSource(aurousScript.player);
     aurousScript.player.contextSource.connect(aurousScript.player.analyser);
     aurousScript.player.analyser.connect(aurousScript.player.context.destination);
     aurousScript.player.frequencyData = new Uint8Array(aurousScript.player.analyser.frequencyBinCount);
     aurousScript.player.renderFrame = function() {
     requestAnimationFrame(aurousScript.player.renderFrame);
     // update data in frequencyData
     aurousScript.player.analyser.getByteFrequencyData(aurousScript.player.frequencyData);
     aurousScript.player.averageAudio = aurousScript.player.getAverageVolume(aurousScript.player.frequencyData);


     };
     aurousScript.player.getFrequencyData = function() {
     return aurousScript.player.frequencyData;
     };

     aurousScript.player.renderFrame();

    //bind it to the global scope
    window.player = aurousScript.player;

});