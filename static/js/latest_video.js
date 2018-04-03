(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
document.addEventListener("DOMContentLoaded", function () {
    window.Video = Video
    video = new Video()
    video.embed()
})

function Video(){
    this.div = document.getElementById('youtube_video')
    this.title_div = document.getElementById('youtube_title')
    this.desc_div = document.getElementById('desc')
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
            // .then(des => this.desc_div.innerHTML = `${this.desc}`)
    }

    // this.link = this.data.items[0].link;
    // this.id = this.link.substr(link.indexOf("=") + 1);
    // this.embed = function(){
    //     // this.div.setAttribute('src', src = this.src)
    // }
} 
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vc3RhdGljL2VzNi9mYWtlXzEwY2U2ZjdiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIHdpbmRvdy5WaWRlbyA9IFZpZGVvXHJcbiAgICB2aWRlbyA9IG5ldyBWaWRlbygpXHJcbiAgICB2aWRlby5lbWJlZCgpXHJcbn0pXHJcblxyXG5mdW5jdGlvbiBWaWRlbygpe1xyXG4gICAgdGhpcy5kaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneW91dHViZV92aWRlbycpXHJcbiAgICB0aGlzLnRpdGxlX2RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd5b3V0dWJlX3RpdGxlJylcclxuICAgIHRoaXMuZGVzY19kaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzYycpXHJcbiAgICB0aGlzLmNoYW5uZWxJRCA9IFwiVUNnN1pDZnlnVUpNb01DNkFjZklhSDFBXCI7XHJcbiAgICB0aGlzLnVybCA9ICdodHRwczovL2FwaS5yc3MyanNvbi5jb20vdjEvYXBpLmpzb24/cnNzX3VybD1odHRwcyUzQSUyRiUyRnd3dy55b3V0dWJlLmNvbSUyRmZlZWRzJTJGdmlkZW9zLnhtbCUzRmNoYW5uZWxfaWQlM0QnICsgdGhpcy5jaGFubmVsSUQgXHJcbiAgICB0aGlzLmVtYmVkID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBmZXRjaCh0aGlzLnVybClcclxuICAgICAgICAgICAgLnRoZW4ociA9PiByLmpzb24oKSlcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB0aGlzLmRhdGEgPSBkYXRhKVxyXG4gICAgICAgICAgICAuY2F0Y2goZSA9PiBjb25zb2xlLmxvZygndW5hYmxlIHRvIGdldCBsYXRlc3QgdmlkZW8nKSlcclxuICAgICAgICAgICAgLnRoZW4obGluayA9PiB0aGlzLmxpbmsgPSB0aGlzLmRhdGEuaXRlbXNbMF0ubGluaylcclxuICAgICAgICAgICAgLnRoZW4odGl0bGUgPT4gdGhpcy50aXRsZSA9IHRoaXMuZGF0YS5pdGVtc1swXS50aXRsZSlcclxuICAgICAgICAgICAgLnRoZW4oZGF0ZSA9PiB0aGlzLmRhdGUgPSB0aGlzLmRhdGEuaXRlbXNbMF0ucHViRGF0ZSlcclxuICAgICAgICAgICAgLnRoZW4oaW1hZ2UgPT4gdGhpcy5pbWFnZSA9IHRoaXMuZGF0YS5pdGVtc1swXS50aHVtYm5haWwpXHJcbiAgICAgICAgICAgIC50aGVuKGRlc2MgPT4gdGhpcy5kZXNjID0gdGhpcy5kYXRhLml0ZW1zWzBdLmRlc2MpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAudGhlbihpZCA9PiB0aGlzLmlkID0gdGhpcy5saW5rLnN1YnN0cih0aGlzLmxpbmsuaW5kZXhPZihcIj1cIikgKyAxKSlcclxuICAgICAgICAgICAgLnRoZW4oc3JjID0+IHRoaXMuc3JjID0gXCJodHRwczovL3lvdXR1YmUuY29tL2VtYmVkL1wiICsgdGhpcy5pZCArIFwiP2NvbnRyb2xzPTAmc2hvd2luZm89MCZyZWw9MFwiKVxyXG4gICAgICAgICAgICAudGhlbihlbWJlZCA9PiB0aGlzLmRpdi5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYyA9IHRoaXMuc3JjKSlcclxuICAgICAgICAgICAgLnRoZW4odGl0bGUgPT4gdGhpcy50aXRsZV9kaXYuaW5uZXJIVE1MID0gYDxhIGhyZWY9JyR7dGhpcy5saW5rfSc+JHt0aGlzLnRpdGxlfTwvYT5gKVxyXG4gICAgICAgICAgICAvLyAudGhlbihkZXMgPT4gdGhpcy5kZXNjX2Rpdi5pbm5lckhUTUwgPSBgJHt0aGlzLmRlc2N9YClcclxuICAgIH1cclxuXHJcbiAgICAvLyB0aGlzLmxpbmsgPSB0aGlzLmRhdGEuaXRlbXNbMF0ubGluaztcclxuICAgIC8vIHRoaXMuaWQgPSB0aGlzLmxpbmsuc3Vic3RyKGxpbmsuaW5kZXhPZihcIj1cIikgKyAxKTtcclxuICAgIC8vIHRoaXMuZW1iZWQgPSBmdW5jdGlvbigpe1xyXG4gICAgLy8gICAgIC8vIHRoaXMuZGl2LnNldEF0dHJpYnV0ZSgnc3JjJywgc3JjID0gdGhpcy5zcmMpXHJcbiAgICAvLyB9XHJcbn0gIl19
