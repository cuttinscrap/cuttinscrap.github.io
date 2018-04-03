(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
document.addEventListener("DOMContentLoaded", function () {
    ham = document.getElementById('ham')
    x = document.getElementById('x')
    nav = document.querySelector('nav')
    logo = document.getElementById('logo')
    logoHeight = logo.clientHeight
    // document.getElementById('logo-wrapper').style.height = `${logoHeight}px`

    ham.onclick = navOn
    x.onclick = navOn

    // window.addEventListener('scroll', debounce(onScroll, 50))

    function navOn(event) {
        nav.classList.toggle('on')
        nav.classList.toggle('off')
    }

    function onScroll(){
       if (window,pageYOffset > logoHeight){
           console.log(logoHeight)
           logo.classList.add('fixed')
       }
       else {
           logo.classList.remove('fixed')
       }
    }

    //as taken from  underscore
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };


})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vc3RhdGljL2VzNi9mYWtlX2NhZWExOTE4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBoYW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGFtJylcclxuICAgIHggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneCcpXHJcbiAgICBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCduYXYnKVxyXG4gICAgbG9nbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dvJylcclxuICAgIGxvZ29IZWlnaHQgPSBsb2dvLmNsaWVudEhlaWdodFxyXG4gICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ28td3JhcHBlcicpLnN0eWxlLmhlaWdodCA9IGAke2xvZ29IZWlnaHR9cHhgXHJcblxyXG4gICAgaGFtLm9uY2xpY2sgPSBuYXZPblxyXG4gICAgeC5vbmNsaWNrID0gbmF2T25cclxuXHJcbiAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZGVib3VuY2Uob25TY3JvbGwsIDUwKSlcclxuXHJcbiAgICBmdW5jdGlvbiBuYXZPbihldmVudCkge1xyXG4gICAgICAgIG5hdi5jbGFzc0xpc3QudG9nZ2xlKCdvbicpXHJcbiAgICAgICAgbmF2LmNsYXNzTGlzdC50b2dnbGUoJ29mZicpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25TY3JvbGwoKXtcclxuICAgICAgIGlmICh3aW5kb3cscGFnZVlPZmZzZXQgPiBsb2dvSGVpZ2h0KXtcclxuICAgICAgICAgICBjb25zb2xlLmxvZyhsb2dvSGVpZ2h0KVxyXG4gICAgICAgICAgIGxvZ28uY2xhc3NMaXN0LmFkZCgnZml4ZWQnKVxyXG4gICAgICAgfVxyXG4gICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgbG9nby5jbGFzc0xpc3QucmVtb3ZlKCdmaXhlZCcpXHJcbiAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9hcyB0YWtlbiBmcm9tICB1bmRlcnNjb3JlXHJcbiAgICBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcclxuICAgICAgICB2YXIgdGltZW91dDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcclxuICAgICAgICAgICAgaWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG5cclxufSlcclxuIl19
