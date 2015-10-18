/**
 * Created by Andrew on 9/12/2015.
 */
var mediaScanner = {

    scanPaths: '',
    scanningActive: false,
    scanFilters: '',

    init: function() {
        if (mediaScanner.scanningActive) {
            return false;
        }
        mediaScanner.scanningActive = true;
        alertify.success("Scanning media from your disk, please wait");
        if (typeof scanMedia == 'function') {
            scanMedia();
        }
        return true;
    },
    showSize: function(size) {
        alertify.success(size);
    },
    scannerErrorCallback: function () {
        mediaScanner.scanningActive = false;
        songCollection.needsUpdate = false;
        alertify.error("Unable to scan due to lack of paths. Please check your settings.");
    },
    completeScanning: function() {
        mediaScanner.scanningActive = false;
        songCollection.needsUpdate = true;
        alertify.success("Scanning media complete.");
        songCollection.loadAllSongs();
    }
};