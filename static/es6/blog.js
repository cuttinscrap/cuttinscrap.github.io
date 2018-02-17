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

