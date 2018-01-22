(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
document.addEventListener("DOMContentLoaded", function () {
    blog = new Blog()
    blog.promo(blog.next_url, '#next')
    blog.promo(blog.prev_url, '#prev')
})

function Blog() {
    this.url = window.location.pathname
    this.root = this.url.substr(1, this.url.substr(1).search('/'))
    this.n = parseInt(this.url.slice(this.url.substr(1).search('/') + 2, this.url.lastIndexOf('/')))

    if (isNaN(this.n)) {
        console.log('nan')
        this.n = document.querySelector(`meta[name='${this.root}:n']`).getAttribute('content')
        console.log(`index_n: ${this.n}`)
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
               <h1>${title}</h1>
               <p>
               <a href="${url}">Read More <i class = "fa fa-long-arrow-right" aria-hidden='true'></i></a>
               </p>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJjOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vc3RhdGljL2VzNi9mYWtlXzE5YWRmODcwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgYmxvZyA9IG5ldyBCbG9nKClcclxuICAgIGJsb2cucHJvbW8oYmxvZy5uZXh0X3VybCwgJyNuZXh0JylcclxuICAgIGJsb2cucHJvbW8oYmxvZy5wcmV2X3VybCwgJyNwcmV2JylcclxufSlcclxuXHJcbmZ1bmN0aW9uIEJsb2coKSB7XHJcbiAgICB0aGlzLnVybCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxyXG4gICAgdGhpcy5yb290ID0gdGhpcy51cmwuc3Vic3RyKDEsIHRoaXMudXJsLnN1YnN0cigxKS5zZWFyY2goJy8nKSlcclxuICAgIHRoaXMubiA9IHBhcnNlSW50KHRoaXMudXJsLnNsaWNlKHRoaXMudXJsLnN1YnN0cigxKS5zZWFyY2goJy8nKSArIDIsIHRoaXMudXJsLmxhc3RJbmRleE9mKCcvJykpKVxyXG5cclxuICAgIGlmIChpc05hTih0aGlzLm4pKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25hbicpXHJcbiAgICAgICAgdGhpcy5uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgbWV0YVtuYW1lPScke3RoaXMucm9vdH06biddYCkuZ2V0QXR0cmlidXRlKCdjb250ZW50JylcclxuICAgICAgICBjb25zb2xlLmxvZyhgaW5kZXhfbjogJHt0aGlzLm59YClcclxuICAgICAgICB0aGlzLm5leHRfdXJsID0gYC8ke3RoaXMucm9vdH0vMS9gXHJcbiAgICAgICAgdGhpcy5wcmV2X3VybCA9IGAvJHt0aGlzLnJvb3R9LyR7dGhpcy5uIC0gMX0vYFxyXG4gICAgfSBlbHNlIGlmICh0aGlzLm4gPT09IDEpIHtcclxuICAgICAgICB0aGlzLm5leHRfdXJsID0gYC8ke3RoaXMucm9vdH0vJHt0aGlzLm4gKyAxfS9gXHJcbiAgICAgICAgdGhpcy5wcmV2X3VybCA9IGAvJHt0aGlzLnJvb3R9L2BcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5uZXh0X3VybCA9IGAvJHt0aGlzLnJvb3R9LyR7dGhpcy5uICsgMX0vYFxyXG4gICAgICAgIHRoaXMucHJldl91cmwgPSBgLyR7dGhpcy5yb290fS8ke3RoaXMubiAtIDF9L2BcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnByb21vID0gZnVuY3Rpb24odXJsLCBkaXYpIHtcclxuICAgICAgICBmZXRjaCh1cmwpXHJcbiAgICAgICAgICAgIC50aGVuKChyZXNwKSA9PiByZXNwLnRleHQoKSlcclxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoKS5kb2N1bWVudEVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBkYXRhXHJcbiAgICAgICAgICAgICAgICB0aXRsZSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwibWV0YVtwcm9wZXJ0eT0nb2c6dGl0bGUnXVwiKS5nZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIpXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwibWV0YVtwcm9wZXJ0eT0nb2c6ZGVzY3JpcHRpb24nXVwiKS5nZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIpXHJcbiAgICAgICAgICAgICAgICBuZXh0X3Bvc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGRpdilcclxuICAgICAgICAgICAgICAgIG5leHRfcG9zdC5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgICAgIDxoMT4ke3RpdGxlfTwvaDE+XHJcbiAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICA8YSBocmVmPVwiJHt1cmx9XCI+UmVhZCBNb3JlIDxpIGNsYXNzID0gXCJmYSBmYS1sb25nLWFycm93LXJpZ2h0XCIgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48L2E+XHJcbiAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgPHA+XHJcbiAgICAgICAgICAgICAgICR7ZGVzY3JpcHRpb259IFxyXG4gICAgICAgICAgICAgICA8YSBocmVmPVwiJHt1cmx9L1wiPlJlYWQgTW9yZSA8aSBjbGFzcyA9IFwiZmEgZmEtbG9uZy1hcnJvdy1yaWdodFwiIGFyaWEtaGlkZGVuPSd0cnVlJz48L2k+PC9hPlxyXG4gICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgICAgIGBcclxuICAgICAgICAgICAgICAgIG5leHRfcG9zdC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJylcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG4iXX0=
