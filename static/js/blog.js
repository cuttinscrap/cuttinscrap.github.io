(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
document.addEventListener("DOMContentLoaded", function () {
    // blog = new Blog()
    // blog.promo(blog.next_url, '#next')
    // blog.promo(blog.prev_url, '#prev')
    window.Blog = Blog
})

function Blog(root=false) {
    this.url = window.location.pathname
    if (!root){
        this.root = this.url.substr(1, this.url.substr(1).search('/'))
        this.n = parseInt(this.url.slice(this.url.substr(1).search('/') + 2, this.url.lastIndexOf('/')))
    }

    if (isNaN(this.n)) {
        try {
            this.n = document.querySelector(`meta[name='${this.root}:n']`).getAttribute('content')
            
        } catch (TypeError) {
            this.n = 1
        }
        this.next_url = `/${this.root}/1/`
        this.prev_url = `/${this.root}/${this.n - 1}/`
    } else if (this.n === 1) {
        this.next_url = `/${this.root}/${this.n + 1}/`
        this.prev_url = `/${this.root}/`
    } else {
        this.next_url = `/${this.root}/${this.n + 1}/`
        this.prev_url = `/${this.root}/${this.n - 1}/`
    }

    this.promo = function(url, div) {
        fetch(url)
            .then((resp) => resp.text())
            .then((data) => {
                var container = document.implementation.createHTMLDocument().documentElement
                container.innerHTML = data
                title = container.querySelector("meta[property='og:title']").getAttribute("content")
                description = container.querySelector("meta[property='og:description']").getAttribute("content")
                next_post = document.querySelector(div)
                next_post.innerHTML = `
               <h1><a href="${url}">${title}</a></h1>
               <p></p>
               <p>
               ${description} 
               <a href="${url}/">Read More <i class = "fa fa-long-arrow-right" aria-hidden='true'></i></a>
               </p>
               `
                next_post.classList.remove('hide')
            })
    }
}


},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJjOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vc3RhdGljL2VzNi9mYWtlXzZkYTM2YTMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gYmxvZyA9IG5ldyBCbG9nKClcclxuICAgIC8vIGJsb2cucHJvbW8oYmxvZy5uZXh0X3VybCwgJyNuZXh0JylcclxuICAgIC8vIGJsb2cucHJvbW8oYmxvZy5wcmV2X3VybCwgJyNwcmV2JylcclxuICAgIHdpbmRvdy5CbG9nID0gQmxvZ1xyXG59KVxyXG5cclxuZnVuY3Rpb24gQmxvZyhyb290PWZhbHNlKSB7XHJcbiAgICB0aGlzLnVybCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxyXG4gICAgaWYgKCFyb290KXtcclxuICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLnVybC5zdWJzdHIoMSwgdGhpcy51cmwuc3Vic3RyKDEpLnNlYXJjaCgnLycpKVxyXG4gICAgICAgIHRoaXMubiA9IHBhcnNlSW50KHRoaXMudXJsLnNsaWNlKHRoaXMudXJsLnN1YnN0cigxKS5zZWFyY2goJy8nKSArIDIsIHRoaXMudXJsLmxhc3RJbmRleE9mKCcvJykpKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc05hTih0aGlzLm4pKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgbWV0YVtuYW1lPScke3RoaXMucm9vdH06biddYCkuZ2V0QXR0cmlidXRlKCdjb250ZW50JylcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSBjYXRjaCAoVHlwZUVycm9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMubiA9IDFcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uZXh0X3VybCA9IGAvJHt0aGlzLnJvb3R9LzEvYFxyXG4gICAgICAgIHRoaXMucHJldl91cmwgPSBgLyR7dGhpcy5yb290fS8ke3RoaXMubiAtIDF9L2BcclxuICAgIH0gZWxzZSBpZiAodGhpcy5uID09PSAxKSB7XHJcbiAgICAgICAgdGhpcy5uZXh0X3VybCA9IGAvJHt0aGlzLnJvb3R9LyR7dGhpcy5uICsgMX0vYFxyXG4gICAgICAgIHRoaXMucHJldl91cmwgPSBgLyR7dGhpcy5yb290fS9gXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubmV4dF91cmwgPSBgLyR7dGhpcy5yb290fS8ke3RoaXMubiArIDF9L2BcclxuICAgICAgICB0aGlzLnByZXZfdXJsID0gYC8ke3RoaXMucm9vdH0vJHt0aGlzLm4gLSAxfS9gXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wcm9tbyA9IGZ1bmN0aW9uKHVybCwgZGl2KSB7XHJcbiAgICAgICAgZmV0Y2godXJsKVxyXG4gICAgICAgICAgICAudGhlbigocmVzcCkgPT4gcmVzcC50ZXh0KCkpXHJcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCkuZG9jdW1lbnRFbGVtZW50XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gZGF0YVxyXG4gICAgICAgICAgICAgICAgdGl0bGUgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIm1ldGFbcHJvcGVydHk9J29nOnRpdGxlJ11cIikuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKVxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIm1ldGFbcHJvcGVydHk9J29nOmRlc2NyaXB0aW9uJ11cIikuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKVxyXG4gICAgICAgICAgICAgICAgbmV4dF9wb3N0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihkaXYpXHJcbiAgICAgICAgICAgICAgICBuZXh0X3Bvc3QuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgICAgICA8aDE+PGEgaHJlZj1cIiR7dXJsfVwiPiR7dGl0bGV9PC9hPjwvaDE+XHJcbiAgICAgICAgICAgICAgIDxwPjwvcD5cclxuICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICR7ZGVzY3JpcHRpb259IFxyXG4gICAgICAgICAgICAgICA8YSBocmVmPVwiJHt1cmx9L1wiPlJlYWQgTW9yZSA8aSBjbGFzcyA9IFwiZmEgZmEtbG9uZy1hcnJvdy1yaWdodFwiIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PC9hPlxyXG4gICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgIG5leHRfcG9zdC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuIl19
