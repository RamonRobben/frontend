/**
 * Created by Andrew on 9/12/2015.
 */
var songCollection = {


    songData: '',
    needsUpdate: true,
    artistNeedsUpdate: true,
    albumNeedsUpdate: true,
    scanFilters: '',
    cache: null,
    loadAllSongs: function () {
        var cachedData = songCollection.songData;
        if (mediaScanner.scanningActive) {
            alertify.error("Unable to load collection while media scan active");
            alertify.success("Loaded cached db");
            return false;
        } else {
            if (utils.isEmpty(cachedData) || songCollection.needsUpdate) {
                loadSongs();
                alertify.success("Loaded fresh db");
                return true;
            } else {
                alertify.success("Loaded cached db");
                return true;
            }


        }
    },
    populateArtist: function(data) {
        $('#artistSortList').html("");
        var decoded = atob(data);
        var jsonData = JSON.parse(decoded);
        for (var i = 0; i < jsonData.results.length; i++) {
            var obj = jsonData.results[i];
            var objectArtist = obj.artist;
            var totalSongs = obj.total;
            objectArtist =  utils.replaceAll(decodeURIComponent(objectArtist), "+", " ");
            artistInfo.fetchArtistArt(objectArtist, totalSongs);
        }

    },
    populateAlbums: function(data) {
        $('#albumSortList').html("");
        var decoded = atob(data);
        var jsonData = JSON.parse(decoded);
        for (var i = 0; i < jsonData.results.length; i++) {
            var obj = jsonData.results[i];
            var objectAlbum = obj.album;
            var objectArtist = obj.artist;
            var totalSongs = obj.total;
            objectAlbum =  utils.replaceAll(decodeURIComponent(objectAlbum), "+", " ");
            objectArtist =  utils.replaceAll(decodeURIComponent(objectArtist), "+", " ");
            albumInfo.fetchAlbumArt(objectArtist, objectAlbum, totalSongs);
        }

    },
    sortByArtist: function (artist) {
        if (songCollection.cache != null) {
            var t = $('#artistTable').DataTable();
            t.clear().draw();
            var data = songCollection.cache;
            for (var i = 0; i < data.results.length; i++) {
                var obj = data.results[i];
                var objectArtist = obj.artist;
                objectArtist =  utils.replaceAll(decodeURIComponent(objectArtist), "+", " ");
                if (objectArtist === artist) {
                    var songId = obj.id;
                    var title = obj.title;
                    var album = obj.album;
                    var albumArt = obj.albumArt;
                    var rawDuration = obj.duration;
                    var duration = aurousScript.player.toTime(rawDuration);
                    var link = obj.link;
                    artist = utils.replaceAll(decodeURIComponent(artist), "+", " ");
                    title = utils.replaceAll(decodeURIComponent(title), "+", " ");
                    album = utils.replaceAll(decodeURIComponent(album), "+", " ");
                    link = utils.decodeHtml(link);
                    songCollection.appendSortedArtistRow(songId, albumArt, duration, album, title, objectArtist, link);
                    // aurousScript('#collectionResult tbody').append(row);
                   songCollection.bindSortedArtistRow(songId, title, objectArtist, albumArt, link);
                    aurousScript('#currentSortedArtist').html(objectArtist);
                }

            }
        }
    },
    sortByAlbum: function (album) {
        if (songCollection.cache != null) {
            var t = $('#albumTable').DataTable();
            t.clear().draw();
            var data = songCollection.cache;
            for (var i = 0; i < data.results.length; i++) {
                var obj = data.results[i];
                var objectAlbum = obj.album;
                objectAlbum =  utils.replaceAll(decodeURIComponent(objectAlbum), "+", " ");
                if (objectAlbum === album) {

                    var songId = obj.id;
                    var title = obj.title;
                    var albumArt = obj.albumArt;
                    var rawDuration = obj.duration;
                    var duration = aurousScript.player.toTime(rawDuration);
                    var link = obj.link;
                    var artist = obj.artist;
                    artist = utils.replaceAll(decodeURIComponent(artist), "+", " ");
                    title = utils.replaceAll(decodeURIComponent(title), "+", " ");
                    link = utils.decodeHtml(link);
                    songCollection.appendSortedAlbum(songId, albumArt, duration, objectAlbum, title, artist, link);
                    // aurousScript('#collectionResult tbody').append(row);
                    songCollection.bindSortedAlbumRow(songId, title, artist, albumArt, link);
                    aurousScript('#currentSortedAlbum').html(objectAlbum);
                }

            }
        }
    },
    appendSortedArtistRow: function (id, albumart, duration, album, title, artist, link) {
        var t = $('#artistTable').DataTable();

        t.row.add([
            '<button class="btn btn-transparent control-show"><a href="#"><i class="material-icons">add</i></a></button> <button class="btn btn-transparent"><a href=\"#\"><i id=\"artist-row-icon-{0}\" class=\"material-icons\">play_arrow<\/i><\/a></button>'.format(id),
            title,
            artist,
            album,
            duration
        ]).index();

        t.row(id - 1).draw();

        aurousScript("#artist-row-icon-" + id).closest('td').addClass("result-control");
        var parent = aurousScript("#artist-row-icon-" + id).closest('tr');
        parent.attr('artist-data-id', id);
        parent.attr('artist-data-value', link);
        parent.attr('artist-data-album-art', albumart);
        parent.attr('artist-data-song-name', title);
        parent.attr('artist-data-artist-name', artist);
    },
    appendSortedAlbum: function (id, albumart, duration, album, title, artist, link) {
        var t = $('#albumTable').DataTable();

        t.row.add([
            '<button class="btn btn-transparent control-show"><a href="#"><i class="material-icons">add</i></a></button> <button class="btn btn-transparent"><a href=\"#\"><i id=\"album-row-icon-{0}\" class=\"material-icons\">play_arrow<\/i><\/a></button><button class="btn btn-transparent control-show"><a href="#" data-jq-dropdown="#dropdown"><i class="material-icons">more_horiz</i></a></button>'.format(id),
            title,
            artist,
            album,
            duration
        ]).index();

        t.row(id - 1).draw();

        aurousScript("#album-row-icon-" + id).closest('td').addClass("result-control");
        var parent = aurousScript("#album-row-icon-" + id).closest('tr');
        parent.attr('album-data-id', id);
        parent.attr('album-data-value', link);
        parent.attr('album-data-album-art', albumart);
        parent.attr('album-data-song-name', title);
        parent.attr('album-data-artist-name', artist);
    },
    appendSortedArtistRow: function (id, albumart, duration, album, title, artist, link) {
        var t = $('#artistTable').DataTable();

        t.row.add([
            '<button class="btn btn-transparent control-show"><a href="#"><i class="material-icons">add</i></a></button> <button class="btn btn-transparent"><a href=\"#\"><i id=\"artist-row-icon-{0}\" class=\"material-icons\">play_arrow<\/i><\/a></button><button class="btn btn-transparent control-show"><a href="#" data-jq-dropdown="#dropdown"><i class="material-icons">more_horiz</i></a></button>'.format(id),
            title,
            artist,
            album,
            duration
        ]).index();

        t.row(id - 1).draw();

        aurousScript("#artist-row-icon-" + id).closest('td').addClass("result-control");
        var parent = aurousScript("#artist-row-icon-" + id).closest('tr');
        parent.attr('artist-data-id', id);
        parent.attr('artist-data-value', link);
        parent.attr('artist-data-album-art', albumart);
        parent.attr('artist-data-song-name', title);
        parent.attr('artist-data-artist-name', artist);
    },
    bindSortedArtistRow:  function (i, title, artist, albumArt, url) {
        aurousScript("#artist-row-icon-" + i).on("click", function () {
            if (window.previousCollectionRow !== undefined) {
                window.previousCollectionRow.removeClass("result-now-playing");
                aurousScript("#artist-row-icon-" + window.previousCollectId).html("play_arrow");
            }
            var parent = aurousScript(this).closest('tr');
            parent.addClass("result-now-playing");
            var id = parent.attr('artist-data-id');
            window.currentCollectionId = id;
            aurousScript("#artist-row-icon-" + id).html("pause");

            var url = parent.attr('artist-data-value');
            aurousScript.player.changeMedia(title, artist, albumArt, url);
            aurousScript("#playerPause").show();
            aurousScript("#playerPlay").hide();
            window.previousCollectionRow = parent;
            window.previousCollectId = id;

        });
    },
    bindSortedAlbumRow:  function (i, title, artist, albumArt, url) {
        aurousScript("#album-row-icon-" + i).on("click", function () {
            if (window.previousCollectionRow !== undefined) {
                window.previousCollectionRow.removeClass("result-now-playing");
                aurousScript("#album-row-icon-" + window.previousCollectId).html("play_arrow");
            }
            var parent = aurousScript(this).closest('tr');
            parent.addClass("result-now-playing");
            var id = parent.attr('album-data-id');
            window.currentCollectionId = id;
            aurousScript("#album-row-icon-" + id).html("pause");

            var url = parent.attr('album-data-value');
            aurousScript.player.changeMedia(title, artist, albumArt, url);
            aurousScript("#playerPause").show();
            aurousScript("#playerPlay").hide();
            window.previousCollectionRow = parent;
            window.previousCollectId = id;

        });
    },
    bindCollectionRow: function (i, title, artist, albumArt, url) {
        aurousScript("#collection-row-icon-" + i).on("click", function () {
            if (window.previousCollectionRow !== undefined) {
                window.previousCollectionRow.removeClass("result-now-playing");
                aurousScript("#collection-row-icon-" + window.previousCollectId).html("play_arrow");
            }
            var parent = aurousScript(this).closest('tr');
            parent.addClass("result-now-playing");
            var id = parent.attr('collection-data-id');
            window.currentCollectionId = id;
            aurousScript("#collection-row-icon-" + id).html("pause");

            var url = parent.attr('collection-data-value');
            aurousScript.player.changeMedia(title, artist, albumArt, url);
            aurousScript("#playerPause").show();
            aurousScript("#playerPlay").hide();
            window.previousCollectionRow = parent;
            window.previousCollectId = id;

        });
    },
    appendLocalCollection: function (data) {
        songCollection.cache = data;
        var t = $('#collectionResult').DataTable();
        t.clear().draw();
        for (var i = 0; i < data.results.length; i++) {
            var obj = data.results[i];
            var songId = obj.id;
            var title = obj.title;
            var artist = obj.artist;
            var album = obj.album;
            var albumArt = obj.albumArt;
            var rawDuration = obj.duration;
            var duration = aurousScript.player.toTime(rawDuration);
            var link = obj.link;
            artist =  utils.replaceAll(decodeURIComponent(artist), "+", " ");
            title = utils.replaceAll(decodeURIComponent(title), "+", " ");
            album = utils.replaceAll(decodeURIComponent(album), "+", " ");
            link = utils.decodeHtml(link);
            songCollection.appendCollectionRow( songId, albumArt, duration, album, title, artist, link);
        }

    },
    removeCollectionRow: function (id) {
        var t = $('#collectionResult').DataTable();
        var target = $('#collection-row-icon-'+id).closest('tr');
        t.row(target).remove()
            .draw();
        console.log(id);
    },
    appendDynamicRow: function (id, albumart, rawDuration, album, title, artist, link) {
        link = utils.decodeHtml(link);
        var duration = aurousScript.player.toTime(rawDuration);
        var t = $('#collectionResult').DataTable();

        t.row.add([
            '<button class="btn btn-transparent control-show"><a href="#"><i class="material-icons">add</i></a></button> <button class="btn btn-transparent"><a href=\"#\"><i id=\"collection-row-icon-{0}\" class=\"material-icons\">play_arrow<\/i><\/a></button><button class="btn btn-transparent control-show"><a href="#" data-jq-dropdown="#dropdown"><i class="material-icons">more_horiz</i></a></button>'.format(id),
            title,
            artist,
            album,
            duration
        ]).index();

        t.row(id - 1).draw();

        aurousScript("#collection-row-icon-" + id).closest('td').addClass("result-control");
        var parent = aurousScript("#collection-row-icon-" + id).closest('tr');
        parent.attr('collection-data-id', id);
        parent.attr('collection-data-value', link);
        parent.attr('collection-data-album-art', albumart);
        parent.attr('collection-data-song-name', title);
        parent.attr('collection-data-artist-name', artist);
        songCollection.bindCollectionRow(id, title, artist, albumart, link);
        return true;
    },
    appendCollectionRow: function (id, albumart, duration, album, title, artist, link) {
        link = utils.decodeHtml(link);
        var t = $('#collectionResult').DataTable();

        t.row.add([
            '<button class="btn btn-transparent control-show"><a href="#"><i class="material-icons">add</i></a></button> <button class="btn btn-transparent"><a href=\"#\"><i id=\"collection-row-icon-{0}\" class=\"material-icons\">play_arrow<\/i><\/a></button><button class="btn btn-transparent control-show"><a href="#" data-jq-dropdown="#dropdown"><i class="material-icons">more_horiz</i></a></button>'.format(id),
            title,
            artist,
            album,
            duration
        ]).index();

        t.row(id - 1).draw();

        aurousScript("#collection-row-icon-" + id).closest('td').addClass("result-control");
        var parent = aurousScript("#collection-row-icon-" + id).closest('tr');
        parent.attr('collection-data-id', id);
        parent.attr('collection-data-value', link);
        parent.attr('collection-data-album-art', albumart);
        parent.attr('collection-data-song-name', title);
        parent.attr('collection-data-artist-name', artist);
        songCollection.bindCollectionRow(id, title, artist, albumart, link);
        return true;
    },

    collectionCallback: function (data) {
        var decoded = atob(data);
        var jsonData = JSON.parse(decoded);
        var cachedData = songCollection.songData;
        if (utils.isEmpty(cachedData) || songCollection.needsUpdate) {
            songCollection.needsUpdate = false;
            songCollection.songData = jsonData;
            songCollection.appendLocalCollection(jsonData);
        } else {
            songCollection.appendLocalCollection(cachedData);
        }
    },
    completeScanning: function () {
        mediaScanner.scanningActive = false;
        alertify.success("Media Scanned from Disk");
    }
};