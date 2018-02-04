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
