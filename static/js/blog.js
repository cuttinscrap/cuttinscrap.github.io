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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vc3RhdGljL2VzNi9mYWtlXzUxNjBlMTQyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGJsb2cgPSBuZXcgQmxvZygpXHJcbiAgICAvLyBibG9nLnByb21vKGJsb2cubmV4dF91cmwsICcjbmV4dCcpXHJcbiAgICAvLyBibG9nLnByb21vKGJsb2cucHJldl91cmwsICcjcHJldicpXHJcbiAgICB3aW5kb3cuQmxvZyA9IEJsb2dcclxufSlcclxuXHJcbmZ1bmN0aW9uIEJsb2cocm9vdD1mYWxzZSkge1xyXG4gICAgdGhpcy51cmwgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcclxuICAgIGlmICghcm9vdCl7XHJcbiAgICAgICAgdGhpcy5yb290ID0gdGhpcy51cmwuc3Vic3RyKDEsIHRoaXMudXJsLnN1YnN0cigxKS5zZWFyY2goJy8nKSlcclxuICAgICAgICB0aGlzLm4gPSBwYXJzZUludCh0aGlzLnVybC5zbGljZSh0aGlzLnVybC5zdWJzdHIoMSkuc2VhcmNoKCcvJykgKyAyLCB0aGlzLnVybC5sYXN0SW5kZXhPZignLycpKSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNOYU4odGhpcy5uKSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYG1ldGFbbmFtZT0nJHt0aGlzLnJvb3R9Om4nXWApLmdldEF0dHJpYnV0ZSgnY29udGVudCcpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH0gY2F0Y2ggKFR5cGVFcnJvcikge1xyXG4gICAgICAgICAgICB0aGlzLm4gPSAxXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubmV4dF91cmwgPSBgLyR7dGhpcy5yb290fS8xL2BcclxuICAgICAgICB0aGlzLnByZXZfdXJsID0gYC8ke3RoaXMucm9vdH0vJHt0aGlzLm4gLSAxfS9gXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMubiA9PT0gMSkge1xyXG4gICAgICAgIHRoaXMubmV4dF91cmwgPSBgLyR7dGhpcy5yb290fS8ke3RoaXMubiArIDF9L2BcclxuICAgICAgICB0aGlzLnByZXZfdXJsID0gYC8ke3RoaXMucm9vdH0vYFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm5leHRfdXJsID0gYC8ke3RoaXMucm9vdH0vJHt0aGlzLm4gKyAxfS9gXHJcbiAgICAgICAgdGhpcy5wcmV2X3VybCA9IGAvJHt0aGlzLnJvb3R9LyR7dGhpcy5uIC0gMX0vYFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHJvbW8gPSBmdW5jdGlvbih1cmwsIGRpdikge1xyXG4gICAgICAgIGZldGNoKHVybClcclxuICAgICAgICAgICAgLnRoZW4oKHJlc3ApID0+IHJlc3AudGV4dCgpKVxyXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCgpLmRvY3VtZW50RWxlbWVudFxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IGRhdGFcclxuICAgICAgICAgICAgICAgIHRpdGxlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW3Byb3BlcnR5PSdvZzp0aXRsZSddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW3Byb3BlcnR5PSdvZzpkZXNjcmlwdGlvbiddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcclxuICAgICAgICAgICAgICAgIG5leHRfcG9zdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZGl2KVxyXG4gICAgICAgICAgICAgICAgbmV4dF9wb3N0LmlubmVySFRNTCA9IGBcclxuICAgICAgICAgICAgICAgPGgxPjxhIGhyZWY9XCIke3VybH1cIj4ke3RpdGxlfTwvYT48L2gxPlxyXG4gICAgICAgICAgICAgICA8cD48L3A+XHJcbiAgICAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAke2Rlc2NyaXB0aW9ufSBcclxuICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7dXJsfS9cIj5SZWFkIE1vcmUgPGkgY2xhc3MgPSBcImZhIGZhLWxvbmctYXJyb3ctcmlnaHRcIiBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9pPjwvYT5cclxuICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICBgXHJcbiAgICAgICAgICAgICAgICBuZXh0X3Bvc3QuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==
