(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
document.addEventListener("DOMContentLoaded", function () {
    window.Video = Video
    video = new Video()
    video.embed()
})

function Video(){
    this.div = document.getElementById('youtube_video')
    this.channelID = "UCg7ZCfygUJMoMC6AcfIaH1A";
    this.url = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3D' + this.channelID 
    this.embed = function(){
        fetch(this.url)
            .then(r => r.json())
            .then(data => this.data = data)
            .catch(e => console.log('unable to get latest video'))
            .then(link => this.link = this.data.items[0].link)
            .then(id => this.id = this.link.substr(this.link.indexOf("=") + 1))
            .then(src => this.src = "https://youtube.com/embed/" + this.id + "?controls=0&showinfo=0&rel=0")
            .then(embed => this.div.setAttribute('src', src = this.src))
            .then(function() {return this.data})

    }

    // this.link = this.data.items[0].link;
    // this.id = this.link.substr(link.indexOf("=") + 1);
    // this.embed = function(){
    //     // this.div.setAttribute('src', src = this.src)
    // }
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vc3RhdGljL2VzNi9mYWtlXzUyMGVmNzUzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB3aW5kb3cuVmlkZW8gPSBWaWRlb1xyXG4gICAgdmlkZW8gPSBuZXcgVmlkZW8oKVxyXG4gICAgdmlkZW8uZW1iZWQoKVxyXG59KVxyXG5cclxuZnVuY3Rpb24gVmlkZW8oKXtcclxuICAgIHRoaXMuZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3lvdXR1YmVfdmlkZW8nKVxyXG4gICAgdGhpcy5jaGFubmVsSUQgPSBcIlVDZzdaQ2Z5Z1VKTW9NQzZBY2ZJYUgxQVwiO1xyXG4gICAgdGhpcy51cmwgPSAnaHR0cHM6Ly9hcGkucnNzMmpzb24uY29tL3YxL2FwaS5qc29uP3Jzc191cmw9aHR0cHMlM0ElMkYlMkZ3d3cueW91dHViZS5jb20lMkZmZWVkcyUyRnZpZGVvcy54bWwlM0ZjaGFubmVsX2lkJTNEJyArIHRoaXMuY2hhbm5lbElEIFxyXG4gICAgdGhpcy5lbWJlZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZmV0Y2godGhpcy51cmwpXHJcbiAgICAgICAgICAgIC50aGVuKHIgPT4gci5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4gdGhpcy5kYXRhID0gZGF0YSlcclxuICAgICAgICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5sb2coJ3VuYWJsZSB0byBnZXQgbGF0ZXN0IHZpZGVvJykpXHJcbiAgICAgICAgICAgIC50aGVuKGxpbmsgPT4gdGhpcy5saW5rID0gdGhpcy5kYXRhLml0ZW1zWzBdLmxpbmspXHJcbiAgICAgICAgICAgIC50aGVuKGlkID0+IHRoaXMuaWQgPSB0aGlzLmxpbmsuc3Vic3RyKHRoaXMubGluay5pbmRleE9mKFwiPVwiKSArIDEpKVxyXG4gICAgICAgICAgICAudGhlbihzcmMgPT4gdGhpcy5zcmMgPSBcImh0dHBzOi8veW91dHViZS5jb20vZW1iZWQvXCIgKyB0aGlzLmlkICsgXCI/Y29udHJvbHM9MCZzaG93aW5mbz0wJnJlbD0wXCIpXHJcbiAgICAgICAgICAgIC50aGVuKGVtYmVkID0+IHRoaXMuZGl2LnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjID0gdGhpcy5zcmMpKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtyZXR1cm4gdGhpcy5kYXRhfSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGhpcy5saW5rID0gdGhpcy5kYXRhLml0ZW1zWzBdLmxpbms7XHJcbiAgICAvLyB0aGlzLmlkID0gdGhpcy5saW5rLnN1YnN0cihsaW5rLmluZGV4T2YoXCI9XCIpICsgMSk7XHJcbiAgICAvLyB0aGlzLmVtYmVkID0gZnVuY3Rpb24oKXtcclxuICAgIC8vICAgICAvLyB0aGlzLmRpdi5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYyA9IHRoaXMuc3JjKVxyXG4gICAgLy8gfVxyXG59Il19
