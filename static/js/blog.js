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
    } else {
        this.root = root
    }

    if (isNaN(this.n)) {
        try {
            this.n = document.querySelector(`meta[name='${this.root}:n']`).getAttribute('content')
           this.next_url = `/${this.root}/1/`
            this.prev_url = `/${this.root}/${this.n - 1}/`           
        } catch (TypeError) {
            this.n = 1
            this.next_url = `/${this.root}/`
            this.prev_url = `/${this.root}/1/`
              }

    } else if (this.n === 1) {
        this.next_url = `/${this.root}/${this.n + 1}/`
        this.prev_url = `/${this.root}/1/`
    } else {
        this.next_url = `/${this.root}/${this.n + 1}/`
        this.prev_url = `/${this.root}/${this.n - 1}/`
    }

    this.promo = function(url, div, em='') {
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
               <p><em>${em}</em></p>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vc3RhdGljL2VzNi9mYWtlX2FiYTEzYjI5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gYmxvZyA9IG5ldyBCbG9nKClcclxuICAgIC8vIGJsb2cucHJvbW8oYmxvZy5uZXh0X3VybCwgJyNuZXh0JylcclxuICAgIC8vIGJsb2cucHJvbW8oYmxvZy5wcmV2X3VybCwgJyNwcmV2JylcclxuICAgIHdpbmRvdy5CbG9nID0gQmxvZ1xyXG59KVxyXG5cclxuZnVuY3Rpb24gQmxvZyhyb290PWZhbHNlKSB7XHJcbiAgICB0aGlzLnVybCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxyXG4gICAgaWYgKCFyb290KXtcclxuICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLnVybC5zdWJzdHIoMSwgdGhpcy51cmwuc3Vic3RyKDEpLnNlYXJjaCgnLycpKVxyXG4gICAgICAgIHRoaXMubiA9IHBhcnNlSW50KHRoaXMudXJsLnNsaWNlKHRoaXMudXJsLnN1YnN0cigxKS5zZWFyY2goJy8nKSArIDIsIHRoaXMudXJsLmxhc3RJbmRleE9mKCcvJykpKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJvb3QgPSByb290XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzTmFOKHRoaXMubikpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLm4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBtZXRhW25hbWU9JyR7dGhpcy5yb290fTpuJ11gKS5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnKVxyXG4gICAgICAgICAgIHRoaXMubmV4dF91cmwgPSBgLyR7dGhpcy5yb290fS8xL2BcclxuICAgICAgICAgICAgdGhpcy5wcmV2X3VybCA9IGAvJHt0aGlzLnJvb3R9LyR7dGhpcy5uIC0gMX0vYCAgICAgICAgICAgXHJcbiAgICAgICAgfSBjYXRjaCAoVHlwZUVycm9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMubiA9IDFcclxuICAgICAgICAgICAgdGhpcy5uZXh0X3VybCA9IGAvJHt0aGlzLnJvb3R9L2BcclxuICAgICAgICAgICAgdGhpcy5wcmV2X3VybCA9IGAvJHt0aGlzLnJvb3R9LzEvYFxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMubiA9PT0gMSkge1xyXG4gICAgICAgIHRoaXMubmV4dF91cmwgPSBgLyR7dGhpcy5yb290fS8ke3RoaXMubiArIDF9L2BcclxuICAgICAgICB0aGlzLnByZXZfdXJsID0gYC8ke3RoaXMucm9vdH0vMS9gXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubmV4dF91cmwgPSBgLyR7dGhpcy5yb290fS8ke3RoaXMubiArIDF9L2BcclxuICAgICAgICB0aGlzLnByZXZfdXJsID0gYC8ke3RoaXMucm9vdH0vJHt0aGlzLm4gLSAxfS9gXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wcm9tbyA9IGZ1bmN0aW9uKHVybCwgZGl2LCBlbT0nJykge1xyXG4gICAgICAgIGZldGNoKHVybClcclxuICAgICAgICAgICAgLnRoZW4oKHJlc3ApID0+IHJlc3AudGV4dCgpKVxyXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCgpLmRvY3VtZW50RWxlbWVudFxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IGRhdGFcclxuICAgICAgICAgICAgICAgIHRpdGxlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW3Byb3BlcnR5PSdvZzp0aXRsZSddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW3Byb3BlcnR5PSdvZzpkZXNjcmlwdGlvbiddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcclxuICAgICAgICAgICAgICAgIG5leHRfcG9zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZGl2KVxyXG4gICAgICAgICAgICAgICAgbmV4dF9wb3N0LmlubmVySFRNTCA9IGBcclxuICAgICAgICAgICAgICAgPGgxPjxhIGhyZWY9XCIke3VybH1cIj4ke3RpdGxlfTwvYT48L2gxPlxyXG4gICAgICAgICAgICAgICA8cD48ZW0+JHtlbX08L2VtPjwvcD5cclxuICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICR7ZGVzY3JpcHRpb259IFxyXG4gICAgICAgICAgICAgICA8YSBocmVmPVwiJHt1cmx9L1wiPlJlYWQgTW9yZSA8aSBjbGFzcyA9IFwiZmEgZmEtbG9uZy1hcnJvdy1yaWdodFwiIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PC9hPlxyXG4gICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgIG5leHRfcG9zdC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuIl19
