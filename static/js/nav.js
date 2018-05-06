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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJjOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vc3RhdGljL2VzNi9mYWtlX2FhMDhmN2IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIGhhbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoYW0nKVxyXG4gICAgeCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd4JylcclxuICAgIG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ25hdicpXHJcbiAgICBsb2dvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ28nKVxyXG4gICAgbG9nb0hlaWdodCA9IGxvZ28uY2xpZW50SGVpZ2h0XHJcbiAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9nby13cmFwcGVyJykuc3R5bGUuaGVpZ2h0ID0gYCR7bG9nb0hlaWdodH1weGBcclxuXHJcbiAgICBoYW0ub25jbGljayA9IG5hdk9uXHJcbiAgICB4Lm9uY2xpY2sgPSBuYXZPblxyXG5cclxuICAgIC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBkZWJvdW5jZShvblNjcm9sbCwgNTApKVxyXG5cclxuICAgIGZ1bmN0aW9uIG5hdk9uKGV2ZW50KSB7XHJcbiAgICAgICAgbmF2LmNsYXNzTGlzdC50b2dnbGUoJ29uJylcclxuICAgICAgICBuYXYuY2xhc3NMaXN0LnRvZ2dsZSgnb2ZmJylcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvblNjcm9sbCgpe1xyXG4gICAgICAgaWYgKHdpbmRvdyxwYWdlWU9mZnNldCA+IGxvZ29IZWlnaHQpe1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKGxvZ29IZWlnaHQpXHJcbiAgICAgICAgICAgbG9nby5jbGFzc0xpc3QuYWRkKCdmaXhlZCcpXHJcbiAgICAgICB9XHJcbiAgICAgICBlbHNlIHtcclxuICAgICAgICAgICBsb2dvLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpeGVkJylcclxuICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL2FzIHRha2VuIGZyb20gIHVuZGVyc2NvcmVcclxuICAgIGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xyXG4gICAgICAgIHZhciB0aW1lb3V0O1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xyXG4gICAgICAgICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuXHJcblxyXG59KVxyXG4iXX0=
