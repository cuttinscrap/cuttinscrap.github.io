(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
document.addEventListener("DOMContentLoaded", function () {
    window.Video = Video
    video = new Video()
    video.embed()
})

function Video(){
    this.div = document.getElementById('youtube_video')
    this.title_div = document.getElementById('youtube_title')
    this.channelID = "UCg7ZCfygUJMoMC6AcfIaH1A";
    this.url = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3D' + this.channelID 
    this.embed = function(){
        fetch(this.url)
            .then(r => r.json())
            .then(data => this.data = data)
            .catch(e => console.log('unable to get latest video'))
            .then(link => this.link = this.data.items[0].link)
            .then(title => this.title = this.data.items[0].title)
            .then(date => this.date = this.data.items[0].pubDate)
            .then(image => this.image = this.data.items[0].thumbnail)
            .then(desc => this.desc = this.data.items[0].desc)
            
            .then(id => this.id = this.link.substr(this.link.indexOf("=") + 1))
            .then(src => this.src = "https://youtube.com/embed/" + this.id + "?controls=0&showinfo=0&rel=0")
            .then(embed => this.div.setAttribute('src', src = this.src))
            .then(title => this.title_div.innerHTML = `<a href='${this.link}'>${this.title}</a>`)
    }

    // this.link = this.data.items[0].link;
    // this.id = this.link.substr(link.indexOf("=") + 1);
    // this.embed = function(){
    //     // this.div.setAttribute('src', src = this.src)
    // }
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vc3RhdGljL2VzNi9mYWtlXzNjYzRkMGE3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgd2luZG93LlZpZGVvID0gVmlkZW9cclxuICAgIHZpZGVvID0gbmV3IFZpZGVvKClcclxuICAgIHZpZGVvLmVtYmVkKClcclxufSlcclxuXHJcbmZ1bmN0aW9uIFZpZGVvKCl7XHJcbiAgICB0aGlzLmRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd5b3V0dWJlX3ZpZGVvJylcclxuICAgIHRoaXMudGl0bGVfZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3lvdXR1YmVfdGl0bGUnKVxyXG4gICAgdGhpcy5jaGFubmVsSUQgPSBcIlVDZzdaQ2Z5Z1VKTW9NQzZBY2ZJYUgxQVwiO1xyXG4gICAgdGhpcy51cmwgPSAnaHR0cHM6Ly9hcGkucnNzMmpzb24uY29tL3YxL2FwaS5qc29uP3Jzc191cmw9aHR0cHMlM0ElMkYlMkZ3d3cueW91dHViZS5jb20lMkZmZWVkcyUyRnZpZGVvcy54bWwlM0ZjaGFubmVsX2lkJTNEJyArIHRoaXMuY2hhbm5lbElEIFxyXG4gICAgdGhpcy5lbWJlZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZmV0Y2godGhpcy51cmwpXHJcbiAgICAgICAgICAgIC50aGVuKHIgPT4gci5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4gdGhpcy5kYXRhID0gZGF0YSlcclxuICAgICAgICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5sb2coJ3VuYWJsZSB0byBnZXQgbGF0ZXN0IHZpZGVvJykpXHJcbiAgICAgICAgICAgIC50aGVuKGxpbmsgPT4gdGhpcy5saW5rID0gdGhpcy5kYXRhLml0ZW1zWzBdLmxpbmspXHJcbiAgICAgICAgICAgIC50aGVuKHRpdGxlID0+IHRoaXMudGl0bGUgPSB0aGlzLmRhdGEuaXRlbXNbMF0udGl0bGUpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGUgPT4gdGhpcy5kYXRlID0gdGhpcy5kYXRhLml0ZW1zWzBdLnB1YkRhdGUpXHJcbiAgICAgICAgICAgIC50aGVuKGltYWdlID0+IHRoaXMuaW1hZ2UgPSB0aGlzLmRhdGEuaXRlbXNbMF0udGh1bWJuYWlsKVxyXG4gICAgICAgICAgICAudGhlbihkZXNjID0+IHRoaXMuZGVzYyA9IHRoaXMuZGF0YS5pdGVtc1swXS5kZXNjKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLnRoZW4oaWQgPT4gdGhpcy5pZCA9IHRoaXMubGluay5zdWJzdHIodGhpcy5saW5rLmluZGV4T2YoXCI9XCIpICsgMSkpXHJcbiAgICAgICAgICAgIC50aGVuKHNyYyA9PiB0aGlzLnNyYyA9IFwiaHR0cHM6Ly95b3V0dWJlLmNvbS9lbWJlZC9cIiArIHRoaXMuaWQgKyBcIj9jb250cm9scz0wJnNob3dpbmZvPTAmcmVsPTBcIilcclxuICAgICAgICAgICAgLnRoZW4oZW1iZWQgPT4gdGhpcy5kaXYuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMgPSB0aGlzLnNyYykpXHJcbiAgICAgICAgICAgIC50aGVuKHRpdGxlID0+IHRoaXMudGl0bGVfZGl2LmlubmVySFRNTCA9IGA8YSBocmVmPScke3RoaXMubGlua30nPiR7dGhpcy50aXRsZX08L2E+YClcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzLmxpbmsgPSB0aGlzLmRhdGEuaXRlbXNbMF0ubGluaztcclxuICAgIC8vIHRoaXMuaWQgPSB0aGlzLmxpbmsuc3Vic3RyKGxpbmsuaW5kZXhPZihcIj1cIikgKyAxKTtcclxuICAgIC8vIHRoaXMuZW1iZWQgPSBmdW5jdGlvbigpe1xyXG4gICAgLy8gICAgIC8vIHRoaXMuZGl2LnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjID0gdGhpcy5zcmMpXHJcbiAgICAvLyB9XHJcbn0iXX0=
