/**
 * Created by Andrew on 5/29/2015.
 */

activePlugins.goodbyeWorld = {
    name: "",
    version: 0,
    desc: "",
    author: "",
    twitter: "",
    source: "",
    status: false,
    
    alert: function() {
      alert('Go fuck yourself');
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
    drawImage: function () {
        aurousScript( "body" ).append( '<div id="gohan"></div><img src="http://31.media.tumblr.com/6b73e46adae2723711ef3b1a5f697107/tumblr_mf63ipNqkV1r72ht7o1_r14_500.gif" alt="Smiley face" ></div>' );
    }
};