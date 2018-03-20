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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vc3RhdGljL2VzNi9mYWtlXzU5N2JmZTQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBibG9nID0gbmV3IEJsb2coKVxyXG4gICAgLy8gYmxvZy5wcm9tbyhibG9nLm5leHRfdXJsLCAnI25leHQnKVxyXG4gICAgLy8gYmxvZy5wcm9tbyhibG9nLnByZXZfdXJsLCAnI3ByZXYnKVxyXG4gICAgd2luZG93LkJsb2cgPSBCbG9nXHJcbn0pXHJcblxyXG5mdW5jdGlvbiBCbG9nKHJvb3Q9ZmFsc2UpIHtcclxuICAgIHRoaXMudXJsID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lXHJcbiAgICBpZiAoIXJvb3Qpe1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHRoaXMudXJsLnN1YnN0cigxLCB0aGlzLnVybC5zdWJzdHIoMSkuc2VhcmNoKCcvJykpXHJcbiAgICAgICAgdGhpcy5uID0gcGFyc2VJbnQodGhpcy51cmwuc2xpY2UodGhpcy51cmwuc3Vic3RyKDEpLnNlYXJjaCgnLycpICsgMiwgdGhpcy51cmwubGFzdEluZGV4T2YoJy8nKSkpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHJvb3RcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNOYU4odGhpcy5uKSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYG1ldGFbbmFtZT0nJHt0aGlzLnJvb3R9Om4nXWApLmdldEF0dHJpYnV0ZSgnY29udGVudCcpXHJcbiAgICAgICAgICAgdGhpcy5uZXh0X3VybCA9IGAvJHt0aGlzLnJvb3R9LzEvYFxyXG4gICAgICAgICAgICB0aGlzLnByZXZfdXJsID0gYC8ke3RoaXMucm9vdH0vJHt0aGlzLm4gLSAxfS9gICAgICAgICAgICBcclxuICAgICAgICB9IGNhdGNoIChUeXBlRXJyb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5uID0gMVxyXG4gICAgICAgICAgICB0aGlzLm5leHRfdXJsID0gYC8ke3RoaXMucm9vdH0vYFxyXG4gICAgICAgICAgICB0aGlzLnByZXZfdXJsID0gYC8ke3RoaXMucm9vdH0vMS9gXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgIH0gZWxzZSBpZiAodGhpcy5uID09PSAxKSB7XHJcbiAgICAgICAgdGhpcy5uZXh0X3VybCA9IGAvJHt0aGlzLnJvb3R9LyR7dGhpcy5uICsgMX0vYFxyXG4gICAgICAgIHRoaXMucHJldl91cmwgPSBgLyR7dGhpcy5yb290fS8xL2BcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5uZXh0X3VybCA9IGAvJHt0aGlzLnJvb3R9LyR7dGhpcy5uICsgMX0vYFxyXG4gICAgICAgIHRoaXMucHJldl91cmwgPSBgLyR7dGhpcy5yb290fS8ke3RoaXMubiAtIDF9L2BcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnByb21vID0gZnVuY3Rpb24odXJsLCBkaXYsIGVtPScnKSB7XHJcbiAgICAgICAgZmV0Y2godXJsKVxyXG4gICAgICAgICAgICAudGhlbigocmVzcCkgPT4gcmVzcC50ZXh0KCkpXHJcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KCkuZG9jdW1lbnRFbGVtZW50XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gZGF0YVxyXG4gICAgICAgICAgICAgICAgdGl0bGUgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIm1ldGFbcHJvcGVydHk9J29nOnRpdGxlJ11cIikuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKVxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihcIm1ldGFbcHJvcGVydHk9J29nOmRlc2NyaXB0aW9uJ11cIikuZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKVxyXG4gICAgICAgICAgICAgICAgbmV4dF9wb3N0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihkaXYpXHJcbiAgICAgICAgICAgICAgICBuZXh0X3Bvc3QuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgICAgICA8aDE+PGEgaHJlZj1cIiR7dXJsfVwiPiR7dGl0bGV9PC9hPjwvaDE+XHJcbiAgICAgICAgICAgICAgIDxwPjxlbT4ke2VtfTwvZW0+PC9wPlxyXG4gICAgICAgICAgICAgICA8cD5cclxuICAgICAgICAgICAgICAgJHtkZXNjcmlwdGlvbn0gXHJcbiAgICAgICAgICAgICAgIDxhIGhyZWY9XCIke3VybH0vXCI+UmVhZCBNb3JlIDxpIGNsYXNzID0gXCJmYSBmYS1sb25nLWFycm93LXJpZ2h0XCIgYXJpYS1oaWRkZW49J3RydWUnPjwvaT48L2E+XHJcbiAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgYFxyXG4gICAgICAgICAgICAgICAgbmV4dF9wb3N0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=
