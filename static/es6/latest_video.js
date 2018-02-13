document.addEventListener("DOMContentLoaded", function () {
    window.Video = Video
    video = new Video()
    video.embed()
})

function Video(){
    this.div = document.getElementById('youtube_video')
    this.title_div = document.getElementById('youtube_title')
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
    }

    // this.link = this.data.items[0].link;
    // this.id = this.link.substr(link.indexOf("=") + 1);
    // this.embed = function(){
    //     // this.div.setAttribute('src', src = this.src)
    // }
}