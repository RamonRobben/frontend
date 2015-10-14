/**
 * Created by Andrew on 9/13/2015.
 */

String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};
var utils = {
    isEmpty: function (str) {
        return (!str || 0 === str.length);
    },
    escapeRegExp: function (string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    },
    decodeHtml: function (str) {
        var decoded = $('<div/>').html(str).text();
        return decoded;
    },
    scaleSize: function(maxW, maxH, currW, currH) {
        var ratio = currH / currW;

        if(currW >= maxW && ratio <= 1){
            currW = maxW;
            currH = currW * ratio;
        } else if(currH >= maxH){
            currH = maxH;
            currW = currH / ratio;
        }
        return [currW, currH];
    },
    getImageMetaData: function(url) {
        $("<img/>").attr("src", url).load(function(){
            var dimension = new Array();
                if (this.width !== undefined) {
                    dimension['width'] = this.width;
                    dimension['height'] = this.height;
                    return dimension;
                } else {
                    dimension['width'] = 139;
                    dimension['height'] = 139;
                    return dimension;
                }

        });
    },
    replaceAll: function(string, find, replace) {
        return string.replace(new RegExp(utils.escapeRegExp(find), 'g'), replace);
    }
};