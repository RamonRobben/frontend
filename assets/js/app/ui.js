$(document).ready(function () {

    $.ajaxSetup({ cache: true });
    alertify.success("Connected to the Aurous Network");

    if (settings.getInvertedNav()) {
        $('#titlebar').addClass("left");
    }

    /* Disable drag and drop */
    $('a').on('dragstart', function (event) {
        event.preventDefault();
    });
    $('#minimize-app').on('click', function (event) {
        minimize();
        event.preventDefault();
    });
    $('#maximize-app').on('click', function (event) {
        maximize();
        event.preventDefault();
    });
    $('#close-app').on('click', function (event) {
        close();
        event.preventDefault();
    });

    $('#close-app').on('click', function (event) {
        close();
        event.preventDefault();
    });
    $("#search-form").submit(function (event) {
        var query = $('#searchbar').val();
        search(query);
        event.preventDefault();
    });
    $('#btn-search').on('click', function (event) {
        var query = $('#searchbar').val();
        search(query);
        event.preventDefault();
    });


    /* Sortable Table */

    /*$('#topSongsTable').DataTable({
     paging: false,
     searching: false
     });*/


    $('#collectionResult').DataTable({
        paging: false,
        "oLanguage": {
            "asStripeClasses": [''],
            scrollY:        200,
            "deferRender": true,
            scroller:       true,
            "sSearch": "Filter: ",
            "sEmptyTable": "Your collection is empty. Click <a onclick=\"settings.openSettingsMenu();\" href=\"javascript:void(0);\">here</a> to configure your settings."
        },
        "columns": [
            {"width": "50px"},
            null,
            null,
            null,
            {"width": "25px"}
        ]
    });
    $('#albumTable').DataTable({
        paging: false,
        "oLanguage": {
            "asStripeClasses": [''],
            scrollY:        200,
            "deferRender": true,
            scroller:       true,
            "sSearch": "Filter: ",
            "sEmptyTable": "Your collection is empty. Click <a onclick=\"settings.openSettingsMenu();\" href=\"javascript:void(0);\">here</a> to configure your settings."
        },
        "columns": [
            {"width": "50px"},
            null,
            null,
            null,
            {"width": "25px"}
        ]
    });
    $('#artistTable').DataTable({
        paging: false,
        "oLanguage": {
            "asStripeClasses": [''],
            scrollY:        200,
            "deferRender": true,
            scroller:       true,
            "sSearch": "Filter: ",
            "sEmptyTable": "Your collection is empty. Click <a onclick=\"settings.openSettingsMenu();\" href=\"javascript:void(0);\">here</a> to configure your settings."
        },
        "columns": [
            {"width": "50px"},
            null,
            null,
            null,
            {"width": "25px"}
        ]
    });
    $('#playlistResult').DataTable({
        paging: false,
        "oLanguage": {
            "asStripeClasses": [''],
            scrollY:        200,
            "deferRender": true,
            scroller:       true,
            "sSearch": "Filter: ",
            "sEmptyTable": "This playlist is empty, try adding some songs from your collection or search results"
        },
        "columns": [
            {"width": "50px"},
            null,
            null,
            null,
            {"width": "25px"}
        ]
    });
    $('.dataTables_filter input').addClass('form-control');



    /* Artifically repeat rows in search result */

    /* var rowSearch = $('#search-result-not-playing');
     var rowCollection = $('#collection-result-not-playing');
     var rowTop = $('#top-result-not-playing');

     for (var i = 0; i < 25; i++) {
     $('#search-result tbody').append(rowSearch.clone());
     }

     for (var i = 0; i < 25; i++) {
     $('#collection-result tbody').append(rowCollection.clone());
     }

     for (var i = 0; i < 10; i++) {
     $('#top-result tbody').append(rowTop.clone());
     }*/

    /* Slider */

    $('#song-volume-slider').slider({
        formatter: function (value) {
            return value;
        }
    });

    $('#song-progress-slider').slider({
        formatter: function (value) {
            return value;
        },
        slide: function (event, ui) { // CHANGED HERE
            var seekto = aurousScript.player.getDuration() * (ui.value / 100);
            // check console to see if this is getting called.
            aurousScript.player.setTime(seekto);
        }
    });

    /* Set and update viewport/sidebar height for scrolling */

    function SetHeight() {
        var windowHeight = $(window).height();
        var playerHeight = $('#player').height() + 101;

        $(".viewport").height(windowHeight - 120); // .navbar height + .viewport padBottom + .viewport padTop
        $('.nav-sidebar').css('height', '100%').css('height', '-=' + playerHeight + 'px');
    }

    $(document).ready(SetHeight);
    $(window).resize(SetHeight);

    /* Test switching page */
    var $switchPageSpeed = 100;

    $('#nav-discover').click(function (event) {
        $('#collection').fadeOut($switchPageSpeed);
        $('#playlist').fadeOut($switchPageSpeed);
        $('#nav-collection').removeClass('active');
        $('.playlist-study a').removeClass('active');
        $(this).addClass('active');
        $('#discover').fadeIn($switchPageSpeed);
        event.preventDefault();
    });

    $('#nav-collection').click(function (event) {

        if ($( "#collectionNavArtists" ).hasClass( "active" )) {
            window.activeViewPort = "artist";
        } else if ($( "#collectionNavAlbums" ).hasClass( "active" )) {
            window.activeViewPort = "album";
        } else {
            window.activeViewPort = "collection";
        }

        $('#discover').fadeOut($switchPageSpeed);
        $('#playlist').fadeOut($switchPageSpeed);
        $('#nav-discover').removeClass('active');
        $('.playlist-study a').removeClass('active');
        $(this).addClass('active');
        $('#collection').fadeIn($switchPageSpeed);

        event.preventDefault();
    });

    $('.playlist-study').click(function (event) {
        $('#discover').fadeOut($switchPageSpeed);
        $('#collection').fadeOut($switchPageSpeed);
        $('#nav-discover').removeClass('active');
        $('#nav-collection').removeClass('active');
        $(this).find('a').addClass('active');
        $('#playlist').fadeIn($switchPageSpeed);

        event.preventDefault();
    });

	/* Collection nav switch page */

	$('#collectionNavArtists').click(function (event) {
        if (typeof sortArtistDb == 'function') {
            if (songCollection.needsUpdate || songCollection.artistNeedsUpdate) {
                songCollection.artistNeedsUpdate = false;
                sortArtistDb();
            }

        }
        window.activeViewPort = "artist";
		$('#collectionSongs').fadeOut($switchPageSpeed);
		$('#collectionAlbums').fadeOut($switchPageSpeed);
		$('#collectionNavSongs').removeClass('active');
		$('#collectionNavAlbums').removeClass('active');
		$(this).addClass('active');
		$('#collectionArtists').fadeIn($switchPageSpeed);
		event.preventDefault();
	});

	$('#collectionNavAlbums').click(function (event) {
        if (typeof sortAlbumDb == 'function') {
            if (songCollection.needsUpdate || songCollection.albumNeedsUpdate) {
                songCollection.albumNeedsUpdate = false;
               sortAlbumDb();
            }
        }
        window.activeViewPort = "album";
		$('#collectionSongs').fadeOut($switchPageSpeed);
		console.log("#collectionSongs faded out");
		$('#collectionArtists').fadeOut($switchPageSpeed);
		$('#collectionNavSongs').removeClass('active');
		$('#collectionNavArtists').removeClass('active');
		$(this).addClass('active');
		$('#collectionAlbums').fadeIn($switchPageSpeed);
		event.preventDefault();
	});

	$('#collectionNavSongs').click(function (event) {
        window.activeViewPort = "collection";
		$('#collectionAlbums').fadeOut($switchPageSpeed);
		$('#collectionArtists').fadeOut($switchPageSpeed);
		$('#collectionNavAlbums').removeClass('active');
		$('#collectionNavArtists').removeClass('active');
		$(this).addClass('active');
		$('#collectionSongs').fadeIn($switchPageSpeed);
		event.preventDefault();
	});

    /* Add class to viewport if page is active */
    if ($('#nav-discover').hasClass('active')) {
        $('.viewport').addClass('discover');
        $('.viewport').removeClass('collection');
        window.activeViewPort = "discover";
    }

    aurousScript("#searchResultsTable").on('dblclick', 'tr', function (e) {
        e.preventDefault();
        if (window.previousSearchResult !== undefined) {
            aurousScript(window.previousSearchResult).removeClass("result-now-playing");
            aurousScript("#row-icon-" + window.previousSearchId).html("play_arrow");
        }
        var id = aurousScript(this).attr('data-id');
        var albumArt = aurousScript(this).attr('data-album-art');
        aurousScript("#row-icon-" + id).html("pause");
        aurousScript(this).addClass("result-now-playing");
        var url = aurousScript(this).attr('data-value');
        var artist = aurousScript(this).attr('data-artist-name');
        var song = aurousScript(this).attr('data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousSearchResult = aurousScript(this);
        window.previousSearchId = id;
    });

    aurousScript("#collectionResult").on('dblclick', 'tr', function (e) {
        if (aurousScript(this).attr("data-role") == "header") {
            return false;
        }
        e.preventDefault();
        if (window.previousCollectionRow !== undefined) {
            window.previousCollectionRow.removeClass("result-now-playing");
            aurousScript("#collection-row-icon-" + window.previousCollectId).html("play_arrow");
        }
        var id = aurousScript(this).attr('collection-data-id');
        window.currentCollectionId = id;
        var albumArt = aurousScript(this).attr('collection-data-album-art');
        aurousScript("#collection-row-icon-" + id).html("pause");
        aurousScript(this).addClass("result-now-playing");
        var url = aurousScript(this).attr('collection-data-value');
        var artist = aurousScript(this).attr('collection-data-artist-name');
        var song = aurousScript(this).attr('collection-data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousCollectionRow = aurousScript(this);
        window.previousCollectId = id;
    });
    aurousScript("#artistTable").on('dblclick', 'tr', function (e) {
        if (aurousScript(this).attr("data-role") == "header") {
            return false;
        }
        e.preventDefault();
        if (window.previousCollectionRow !== undefined) {
            window.previousCollectionRow.removeClass("result-now-playing");
            aurousScript("#artist-row-icon-" + window.previousCollectId).html("play_arrow");
        }
        var id = aurousScript(this).attr('artistTable-data-id');
        window.currentCollectionId = id;
        var albumArt = aurousScript(this).attr('artist-data-album-art');
        aurousScript("#artist-row-icon-" + id).html("pause");
        aurousScript(this).addClass("result-now-playing");
        var url = aurousScript(this).attr('artist-data-value');
        var artist = aurousScript(this).attr('artist-data-artist-name');
        var song = aurousScript(this).attr('artist-data-song-name');
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousCollectionRow = aurousScript(this);
        window.previousCollectId = id;
    });
    aurousScript("#topSongsTable").on('dblclick', 'tr', function (e) {
        e.preventDefault();
        if (window.previousDiscovery !== undefined) {
            aurousScript(window.previousDiscovery).removeClass("result-now-playing");
            aurousScript("#discover-row-icon-" + window.previousDiscoveyId).html("play_arrow");
        }
        var id = aurousScript(this).attr('data-id');
        var url = aurousScript(this).attr('data-value');
        var artist = aurousScript(this).attr('data-artist-name');
        var song = aurousScript(this).attr('data-song-name');
        var albumArt = aurousScript(this).attr('data-album-art');

        aurousScript("#discover-row-icon-" + id).html("pause");
        aurousScript(this).addClass("result-now-playing");
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousDiscovery = aurousScript(this);
        window.previousDiscoveyId = id;
    });
    aurousScript("#playlistResult").on('dblclick', 'tr', function (e) {
        e.preventDefault();
        if (window.previousPlaylist !== undefined) {
            window.previousPlaylist.removeClass("result-now-playing");
            aurousScript("#playlist-row-icon-" + window.previousPlaylistId).html("play_arrow");
        }
        var id = aurousScript(this).attr('playlist-data-id');
        var url = aurousScript(this).attr('playlist-data-value');
        var artist = aurousScript(this).attr('playlist-data-artist-name');
        var song = aurousScript(this).attr('playlist-data-song-name');
        var albumArt = aurousScript(this).attr('playlist-data-album-art');

        aurousScript("#playlist-row-icon-" + id).html("pause");
        aurousScript(this).addClass("result-now-playing");
        aurousScript.player.changeMedia(song, artist, albumArt, url);
        aurousScript("#playerPause").show();
        aurousScript("#playerPlay").hide();
        window.previousPlaylist = aurousScript(this);
        window.previousPlaylistId = id;
    });

    for (var i = 0; i < 6; i++) {
        aurousScript("#discover-row-icon-" + i).on("click", function () {
            if (window.previousDiscovery !== undefined) {
                aurousScript(window.previousDiscovery).removeClass("result-now-playing");
                aurousScript("#discover-row-icon-" + window.previousDiscoveyId).html("play_arrow");
            }

            var parent = aurousScript(this).closest('tr');
            var id = parent.attr('data-id');
            var url = parent.attr('data-value');
            var artist = parent.attr('data-artist-name');
            var song = parent.attr('data-song-name');
            var albumArt = parent.attr('data-album-art');
            parent.addClass("result-now-playing");

            aurousScript("#discover-row-icon-" + id).html("pause");
            aurousScript.player.changeMedia(song, artist, albumArt, url);
            aurousScript("#playerPause").show();
            aurousScript("#playerPlay").hide();
            window.previousDiscovery = parent;
            window.previousDiscoveyId = id;

        });
    }

    /* Dropdown slide effect */
    var $dropdownSpeed = 150;
    var $dropdownMove = 5;

    $('.dropdown').on('show.bs.dropdown', function (e) {
        var $dropdown = $(this).find('.dropdown-menu');
        var orig_margin_top = parseInt($dropdown.css('margin-top'));
        $dropdown.css({
            'margin-top': (orig_margin_top + $dropdownMove) + 'px',
            opacity: 0
        }).animate({'margin-top': orig_margin_top + 'px', opacity: 1}, $dropdownSpeed, function () {
            $(this).css({'margin-top': ''});
        });
    });

    $('.dropdown').on('hide.bs.dropdown', function (e) {
        var $dropdown = $(this).find('.dropdown-menu');
        var orig_margin_top = parseInt($dropdown.css('margin-top'));
        $dropdown.css({
            'margin-top': orig_margin_top + 'px',
            opacity: 1,
            display: 'block'
        }).animate({'margin-top': (orig_margin_top + $dropdownMove) + 'px', opacity: 0}, $dropdownSpeed, function () {
            $(this).css({'margin-top': '', display: ''});
        });
    });

	/* Right-click dropdown */
	(function ($, window) {

		$.fn.contextMenu = function (settings) {

			return this.each(function () {

				// Open context menu
				$(this).on("contextmenu", function (e) {
					// return native menu if pressing control
					if (e.ctrlKey) return;

					//open menu
					var $menu = $(settings.menuSelector)
					.data("invokedOn", $(e.target))
					.show()
					.css({
						position: "absolute",
						left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
						top: getMenuPosition(e.clientY, 'height', 'scrollTop')
					})
					.off('click')
					.on('click', 'a', function (e) {
						$menu.hide();

						var $invokedOn = $menu.data("invokedOn");
						var $selectedMenu = $(e.target);

						settings.menuSelected.call(this, $invokedOn, $selectedMenu);
					});

					return false;
				});

				//make sure menu closes on any click
				$(document).click(function () {
					$(settings.menuSelector).hide();
				});
			});

			function getMenuPosition(mouse, direction, scrollDir) {
				var win = $(window)[direction](),
					scroll = $(window)[scrollDir](),
					menu = $(settings.menuSelector)[direction](),
					position = mouse + scroll;

				// opening menu would pass the side of the page
				if (mouse + menu > win && menu < mouse)
					position -= menu;

				return position;
			}

		};
	})(jQuery, window);

	$("#collectionResult td").contextMenu({
		menuSelector: "#collectionResultMenu",
		menuSelected: function (invokedOn, selectedMenu) {
			var msg = "You selected the menu item '" + selectedMenu.text() +
				"' on the value '" + invokedOn.text() + "'";
			console.log(msg);
		}
	});

    //open the lateral panel
    $('.toggle-panel a').on('click', function (event) {
        var href = $(this).attr('href');
        event.preventDefault();
        $(href).addClass('is-visible');
    });
    //clode the lateral panel
    $('.cd-panel').on('click', function (event) {
        if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close i')) {
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
        }
    });


	/* Show controls while hovering table row */

	var $resultControl = ".control-show";

	$("tbody tr").hover(function () {
		$(this).find($resultControl).css({
			"opacity": 1
		});
	}, function () {
		$(this).find($resultControl).css({
			"opacity": 0
		});
	});

    $('.selectSearchEngine').selectpicker();

    mediaScanner.init();
    $('#nav-discover').click();
    if (typeof loadSettings == 'function') {
        settings.bind();
        playlist.bind();
        loadAllPlaylist();
    }

    versionChecker.checkForUpdate();

});
