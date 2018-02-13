var Instafeed = require('instafeed')
const template = `
    <div class='card'> 
        <h1>Instafeed</h1>
        <a class='instagram' href='{{link}}'><img src='{{image}}' width='{{width}}' height='{{height}}'></a>
    </div>
    `
var feed = new Instafeed({
    template: '{{ link }}',
    get: 'user',
    accessToken: "6762486136.17babc8.cac5e5d53c474d948211082754768a3e",
    limit: 4,
});

feed.run()
