/**
 * Created by Andrew on 9/17/2015.
 */
var settings = {

    pathSelector: $("#scanPathSelector"),
    currentPath: '',
    hasVKAuth: false,
    previousSelectEngine: '',
    selectedSearchEngine: '',
    bind: function() {
        settings.pathSelector.on('change', function() {
            settings.currentPath = this.value;
        });
        $('#removeFolder').click(function() {
            settings.removeScanPath();
        });
        $('#saveSettings').click(function() {
            settings.save();
            loadSettings();
        });
        $('#vkAuthButton').click(function(e) {
          settings.handleVKAuth();
            e.preventDefault();
        });
        $('#selectAvatar').click(function(e) {
                if (typeof selectProfilePicture == 'function') {
                    selectProfilePicture();
                }
            e.preventDefault();
        });
        $(".selectSearchEngine").on('focus', function() {
            // Store the current value on focus and on change
            previousSelectEngine = this.value;
        }).change(function() {
            if (this.value === "VK" && !settings.hasVKAuth) {
                $(".selectSearchEngine").val(settings.previousSelectEngine).change();
                alertify.error("You cannot use VK until you authorize your account.");
                return false;
            }
            settings.previousSelectEngine = this.value;
        });

        $('#invertNav').click(function() {
            settings.setInvertedNav(!$('#invertNav').hasClass("btn-success"));
        });

        loadSettings();
        checkAuths();
        return true;

    },
    load: function(data) {
        var decoded = atob(data);
        var jsonData = JSON.parse(decoded);
        settings.setDisplayName(jsonData.displayName);
        settings.setAvatar(jsonData.avatarPath);
        settings.setScanPaths(jsonData.scanPaths);
        settings.setRestrictions(jsonData.scanRestrictions);
        settings.setExcludes(jsonData.scanExcludes);
        settings.setInvertedNav(jsonData.invertedNav);
        return true;

    },
    handleVKAuth: function () {
        var status =  $('#vkAuthButton').html();
        if (status === "Deauthorize") {
            if (typeof deleteVK == 'function') {
                deleteVK();
            }
        } else {
            if (typeof authVK == 'function') {
                authVK();
            }
        }
    },
    setAuthButtons: function(status) {
        if (status == true) {
            $('#vkAuthButton').removeClass("btn-success");
            $('#vkAuthButton').addClass("btn-danger");
            $('#vkAuthButton').html("Deauthorize");
            settings.hasVKAuth = true;
        } else {
            $('#vkAuthButton').addClass("btn-success");
            $('#vkAuthButton').removeClass("btn-danger");
            $('#vkAuthButton').html("Authorize");
            settings.hasVKAuth = false;
        }

    },
    save: function() {
        var scanExcludes = settings.getExcludes();
        var scanRestrictions = settings.getRestrictions();
        var scanPaths = settings.getAllScanPaths();
        var searchEngine = settings.getDefaultSearchEngine();
        var displayName = settings.getUsername();
        var avatarPath = settings.getAvatar();
        var invertedNav = settings.getInvertedNav();
        saveSettings(scanExcludes, scanRestrictions, scanPaths, searchEngine, displayName, avatarPath, invertedNav);
        alertify.success("Settings Saved.");

    },

    getAllScanPaths: function() {
        var paths = '';
        $("#scanPathSelector option").each(function()
        {
            if (paths.length > 0) {
                paths += ",";
            }
            var path = $(this).text();
            paths += path;

        });
       return paths;

    },
    getExcludes: function() {
      return $("#inputFileTypeExclude").val();
    },
    getRestrictions: function() {
        return $("#inputFileTypeRestrict").val();
    },
    getUsername: function() {
           return $("#inputDisplayName").val();
    },
    getAvatar: function() {
        return $('#settingsAvatar').attr('src');
    },

    getDefaultSearchEngine: function() {
            return $(".selectSearchEngine").val();
    },
    getInvertedNav: function() {
            return $('#invertNav').hasClass("btn-success");
    },
    setDefaultSearchEngine: function(engine) {

       // $(".selectSearchEngine").val(engine);
    },
    setAvatar: function(path) {
        $('#settingsAvatar').attr('src', path);
        $('#sideBarAvatar').attr('src', path);

    },
    setDisplayName: function(displayName) {
        $('#inputDisplayName').val(displayName);
        $('.nav-username').html(displayName);
    },
    setInvertedNav: function(inversion) {
        if (inversion) {
            $('#invertNav').removeClass("btn-danger").addClass("btn-success");
            $('#invertNav').html("Enabled");

            $('#titlebar').addClass("left");
        }
        else {
            $('#invertNav').removeClass("btn-success").addClass("btn-danger");
            $('#invertNav').html("Disabled");

            $('#titlebar').removeClass("left");
        }
    },
    setRestrictions: function(restrictions) {
       if (restrictions.length > 0) {
          var results = restrictions.toString().replace(",", ";");
           $("#inputFileTypeRestrict").val(results);
       } else {
           $("#inputFileTypeRestrict").val("");
       }
    },
    setExcludes: function(excludes) {
        if (excludes.length > 0) {
            var results = excludes.toString().replace(",", ";");
            $("#inputFileTypeRestrict").val(results);
        } else {
            $("#inputFileTypeRestrict").val("");
        }
    },
    setScanPaths: function(paths) {
         settings.pathSelector.empty();
         $.each(paths, function(index, item) {
         settings.pathSelector.append(new Option(item, item));
         });
    },
    addScanPath: function(path) {
        settings.pathSelector.append(new Option(path, path));
        songCollection.needsUpdate = true;
        songCollection.albumNeedsUpdate = true;
        songCollection.artistNeedsUpdate = true;

    },
    removeScanPath: function() {

        $('#scanPathSelector option').each(function() {
            if ( $(this).val() == settings.currentPath ) {
                console.log(settings.currentPath);
                $(this).remove();
            }
        });

    },
    openSettingsMenu: function() {
        jQuery('#modalSettings').modal('show').on('hide.bs.modal', function(e) {

        });
    }

};
