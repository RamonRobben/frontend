/**
 * Created by Andrew on 5/29/2015.
 */
activePlugins.helloWorld = {
    name: "",
    version: 0,
    desc: "",
    author: "",
    twitter: "",
    source: "",
    status: false,
    init: function(pluginName, pluginVersion, pluginDesc, pluginAuthor, pluginTwitter, pluginSource, loadStatus) {
        this.name = pluginName;
        this.version = pluginVersion;
        this.desc = pluginDesc;
        this.author = pluginAuthor;
        this.twitter = pluginTwitter;
        this.source = pluginSource;
        this.status = loadStatus;
        this.listSystemPlugins();
    },
    getName: function() {
        return this.name;
    },
    getVersion: function() {
        return this.version;
    },
    getDescription: function() {
        return this.desc;
    },
    getAuthor: function() {
        return this.author;
    },
    getTwitter: function() {
        return this.twitter;
    },
    getSource: function() {
        return this.source;
    },
    getStatus: function() {
        return this.status;
    },
    listSystemPlugins: function() {
       aurousScript( "#sidebar" ).append('<li><a href="#"><i class="fa fa-user"></i>Custom Option</a></li>');
        for(var i = 0; i < AUROUS_PLUGINS.length; i++) {
            document.write("<br>");
            for(var j = 0; j < AUROUS_PLUGINS[i].length; j++) {

                document.write(AUROUS_PLUGINS[i][j] + ",");

            }
        }
    }
};