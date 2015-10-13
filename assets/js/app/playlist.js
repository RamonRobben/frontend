/**
 * Created by Andrew on 9/12/2015.
 */
var playlist = {

    scanPaths: '',
    scanningActive: false,
    scanFilters: '',
    size: 0,
    activePlaylistName: '',
    activePlaylistID: -1,
    activeTr: null,
    bind: function() {
        $('#dropdown').on('show', function(event, dropdownData) {
            playlist.activeTr = $(dropdownData.trigger).closest("tr");
        }).on('hide', function(event, dropdownData) {
            playlist.activeTr = null;
        });
        $('#createPlaylistButton').click(function(e) {
            var idClicked = e.target.id;
            playlist.createPlaylist();
        });
        $('#deletPlaylistButton').click(function(e) {
            if (typeof deletePlaylist == 'function') {
                var $switchPageSpeed = 100;
                var index = playlist.activePlaylistID;
                deletePlaylist(index);

                $('#playlist-' + index).remove();
                $('#playlistAddTo-' + index).remove();
                window.activeViewPort = "collection";
                $('#discover').fadeOut($switchPageSpeed);
                $('#playlist').fadeOut($switchPageSpeed);
                $('#nav-discover').removeClass('active');
                $('.playlist-study a').removeClass('active');
                $(this).addClass('active');
                $('#collection').fadeIn($switchPageSpeed);

            }
        });
        $('#addToCollection').click(function(e) {
            var url = $(playlist.activeTr).data("value");
            var songName = $(playlist.activeTr).data("songName");
            var artistName = $(playlist.activeTr).data("artistName");
            downloader.downloadSong(songName, artistName, url);
        });
        $('#renamePlaylistButton').click(function(e) {
            var id = playlist.activePlaylistID;
            var playListName = $('#inputRenamePlaylist').val();
                if (typeof renamePlaylist == 'function') {
                    renamePlaylist(playListName, id);
                    playListName.activePlaylistName = playListName;
                    $('#activePlaylistTitle').text(playListName);
                    $('#inputRenamePlaylist').val(playListName);
                    $('.modalPlaylistName').text(playListName);
                    $( "#playlist-" + id ).find( "span" ).text(playListName);
                }
        });

    },
    formatPlaylistTime: function(a, c, e) {
        d = 60;
        s = [" seconds", " mins", " hrs"];
        return (t = [a, (0 | a / d) * d, (0 | a / d / d) * d * d].map(function(a, b, f) {
            p = (a - (0 | f[b + 1])) / Math.pow(d, b);
            return e && 1 > b ? "" : c && !p ? "" : p + s[b] + ". "
        }).reverse().join(""))

    },
    populatePlaylist: function(data) {
        var decoded = atob(data);
        var jsonData = JSON.parse(decoded);
        var playlistSize = jsonData.results.length;
        var totalTime = playlist.formatPlaylistTime(jsonData.totalTime);
        $('#playlistInfo').text(playlistSize + " songs in playlist, " + totalTime);
        for (var k = 0; k < 4; k++) {
            aurousScript("#playlistCover" + k).attr("src", "assets/img/noalbumart.png");
        }

        var t = $('#playlistResult').DataTable();
        t.clear().draw();
        for (var i = 0; i < jsonData.results.length; i++) {
            var obj = jsonData.results[i];
            var songId = obj.id;
            var title = obj.title;
            var artist = obj.artist;
            var album = obj.album;
            var albumArt = obj.albumArt;
            var rawDuration = obj.duration;
            var duration = aurousScript.player.toTime(rawDuration);
            var link = obj.link;
            artist = utils.replaceAll(decodeURIComponent(artist), "+", " ");
            title = utils.replaceAll(decodeURIComponent(title), "+", " ");
            album = utils.replaceAll(decodeURIComponent(album), "+", " ");
            link = utils.decodeHtml(link);
            playlist.appendPlaylistRow(songId, albumArt, duration, album, title, artist, link);

            if (i < 4) {
                aurousScript("#playlistCover" + i).attr("src", albumArt);
            }


        }
    },
    appendPlaylistRow: function(songId, albumArt, duration, album, title, artist, link) {
        link = utils.decodeHtml(link);
        var id = songId;
        var t = $('#playlistResult').DataTable();

        t.row.add([
            '<button class="btn btn-transparent control-show"><a href="#"><i class="material-icons">add</i></a></button> <button class="btn btn-transparent"><a href=\"#\"><i id=\"playlist-row-icon-{0}\" class=\"material-icons\">play_arrow<\/i><\/a></button>'.format(id),
            title,
            artist,
            album,
            duration
        ]).index();

        t.row(id - 1).draw();

        aurousScript("#playlist-row-icon-" + id).closest('td').addClass("result-control");
        var parent = aurousScript("#playlist-row-icon-" + id).closest('tr');
        parent.attr('playlist-data-id', id);
        parent.attr('playlist-data-value', link);
        parent.attr('playlist-data-album-art', albumArt);
        parent.attr('playlist-data-song-name', title);
        parent.attr('playlist-data-artist-name', artist);
        playlist.bindRow(id, title, artist, albumArt, link);
    },
    bindRow: function(id, title, artist, albumArt, link) {

        aurousScript("#playlist-row-icon-" + id).on("click", function() {
            if (window.previousPlaylist !== undefined) {
                window.previousPlaylist.removeClass("result-now-playing");
                aurousScript("#playlist-row-icon-" + window.previousPlaylistId).html("play_arrow");
            }
            var parent = aurousScript(this).closest('tr');
            parent.addClass("result-now-playing");
            var id = parent.attr('playlist-data-id');
            window.currentPlaylistId = id;
            aurousScript("#playlist-row-icon-" + id).html("pause");

            var url = parent.attr('playlist-data-value');
            aurousScript.player.changeMedia(title, artist, albumArt, url);
            aurousScript("#playerPause").show();
            aurousScript("#playerPlay").hide();
            window.previousPlaylist = parent;
            window.previousPlaylistId = id;

        });
    },
    createPlaylist: function() {
        var playListName = $('#inputAddPlaylist').val();
        if (!utils.isEmpty(playListName)) {
            if (typeof createLocalPlaylist == 'function') {
                createLocalPlaylist(playListName);
                var index = playlist.size + 1;
                var html = '<li id="playlist-{1}" class="playlist-study"><a href="#"><i class="material-icons">play_arrow</i><span>{0}</span></a></li>'.format(playListName, index);
                $('#playlistContainer').append(html);
                var item = '<li><a id="playlistAddTo-{1}" href="#">{0}</a></li>'.format(playListName, index);
                $("#appendPlaylist").after(item);
                playlist.bindPlaylist(playListName, index);

            }
        }
    },
    bindPlaylist: function(name, index) {


        $("#playlistAddTo-" + index).click(function(event) {
            var songId = playlist.activeTr.attr("collection-data-id");
            if (typeof addSongToPlaylist == 'function') {

                if (window.activeViewPort == "search") {
                    var url = playlist.activeTr.data("value");
                    var artist = playlist.activeTr.data("artist-name");
                    var songName = playlist.activeTr.data("song-name");
                    downloader.downloadToPlaylist(songName, artist, url,index);
                } else if (window.activeViewPort == "artist") {
                    songId = playlist.activeTr.attr("artist-data-id");
                    addSongToPlaylist(songId, index);
                } else if (window.activeViewPort == "album") {
                    songId = playlist.activeTr.attr("album-data-id");
                    addSongToPlaylist(songId, index);
                } else {
                    addSongToPlaylist(songId, index);
                }
            }
        });

        $('#playlist-' + index).click(function(event) {
            var $switchPageSpeed = 100;
            $('#discover').fadeOut($switchPageSpeed);
            $('#collection').fadeOut($switchPageSpeed);
            $('#nav-discover').removeClass('active');
            $('#nav-collection').removeClass('active');
            $(this).find('a').addClass('active');
            $('#playlist').fadeIn($switchPageSpeed);
            $('#activePlaylistTitle').text(name);
            $("#playlist-" + index).find("i").text("pause");
            $("#playlist-" + playlist.activePlaylistID).find("i").text("play_arrow");
            playlist.activePlaylistName = name;
            playlist.activePlaylistID = index;

            $('#inputRenamePlaylist').val(name);

            $('.modalPlaylistName').text(name);

            if (typeof loadSongsInPlaylist == 'function') {
                loadSongsInPlaylist(index);
            }
            window.activeViewPort = "playlist";
            event.preventDefault();
        });
    },
    loadLocalPlaylist: function(data) {
        $('#playlistContainer').html(' <li class="nav-title"><div class="pull-right"><a href="#"><i class="material-icons">chevron_right</i></a></div>PLAYLIST</li>');
        var decoded = atob(data);
        var jsonData = JSON.parse(decoded);
        for (var i = 0; i < jsonData.results.length; i++) {

            var obj = jsonData.results[i];
            var name = obj.name;
            var id = obj.id;
            playlist.size = id;
            name = utils.replaceAll(decodeURIComponent(name), "+", " ");
            var html = '<li id="playlist-{1}" class="playlist-study"><a href="#"><i class="material-icons">play_arrow</i><span>{0}</span></a></li>'.format(name, id);
            $('#playlistContainer').append(html);
            var item = '<li><a id="playlistAddTo-{1}" href="#">{0}</a></li>'.format(name, id);
            $("#appendPlaylist").after(item);
            playlist.bindPlaylist(name, id);
        }
    },
    addToPlaylist: function() {


    },
    completeScanning: function() {
        mediaScanner.scanningActive = false;
        alertify.success("Media Scanned from Disk");
    }
};