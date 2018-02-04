(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
Copyright 2017 blackCICADA

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

;(function() {
    "use strict";

    function Instafeed(options) {
        this.uuid = "instafeed".concat(uuidv4().replace(/-/g, ""));
        if(!options) throw new Error("InstafeedOptionsError: Missing options.");
        this.url = "https://api.instagram.com/v1/";

        switch(options.get) {
            case "tag":
                if(typeof options.tagName !== "string") throw new Error("InstafeedOptionsError: Missing or invalid option \"tagName\".");
                this.url = this.url.concat("tags/", encodeURIComponent(options.tagName));
                break;

            case "location":
                if(typeof options.locationId !== "string" || !/^\d+$/.test(options.locationId)) throw new Error("InstafeedOptionsError: Missing or invalid option \"locationId\".");
                this.url = this.url.concat("locations/", options.locationId);
                break;

            default:
                if(typeof options.get !== "undefined" && options.get !== "user") throw new Error("InstafeedOptionsError: Invalid option \"get\".");
                this.url = this.url.concat("users/");

                if(typeof options.userId === "undefined") {
                    this.url = this.url.concat("self");
                } else {
                    if(typeof options.userId !== "string" || !/^\d+$/.test(options.userId)) throw new Error("InstafeedOptionsError: Invalid option \"userId\".");
                    this.url = this.url.concat(options.userId);
                }
        }

        if(typeof options.accessToken !== "string") throw new Error("InstafeedOptionsError: Missing or invalid option \"accessToken\".");
        this.url = this.url.concat("/media/recent?access_token=", encodeURIComponent(options.accessToken), "&callback=", this.uuid, ".parse");
        this.nextUrl = "";

        if(typeof options.limit !== "undefined") {
            if(typeof options.limit !== "number") throw new Error("InstafeedOptionsError: Invalid option \"limit\".");
            if(options.limit) this.url = this.url.concat("&count=", options.limit.toString());
        }

        if(typeof options.sort === "undefined") {
            this.sort = "none";
        } else {
            if(!/^(?:none|(?:most|least)-(?:recent|liked|commented)|random)$/.test(options.sort)) throw new Error("InstafeedOptionsError: Invalid option \"sort\".");
            this.sort = options.sort;
        }

        if(typeof options.imageTemplate === "undefined") {
            this.imageTemplate = "<img src=\"{{image}}\" width=\"{{width}}\" height=\"{{height}}\">";
        } else {
            if(typeof options.imageTemplate !== "string") throw new Error("InstafeedOptionsError: Invalid option \"imageTemplate\".");
            this.imageTemplate = options.imageTemplate;
        }

        if(typeof options.videoTemplate === "undefined") {
            this.videoTemplate = "<img src=\"{{previewImage}}\" width=\"{{previewWidth}}\" height=\"{{previewHeight}}\">";
        } else {
            if(typeof options.videoTemplate !== "string") throw new Error("InstafeedOptionsError: Invalid option \"videoTemplate\".");
            this.videoTemplate = options.videoTemplate;
        }

        if(typeof options.carouselFrameTemplate === "undefined") {
            this.carouselFrameTemplate = "<img src=\"{{previewImage}}\" width=\"{{previewWidth}}\" height=\"{{previewHeight}}\">";
        } else {
            if(typeof options.carouselFrameTemplate !== "string") throw new Error("InstafeedOptionsError: Invalid option \"carouselFrameTemplate\".");
            this.carouselFrameTemplate = options.carouselFrameTemplate;
        }

        if(typeof options.carouselImageTemplate === "undefined") {
            this.carouselImageTemplate = "";
        } else {
            if(typeof options.carouselImageTemplate !== "string") throw new Error("InstafeedOptionsError: Invalid option \"carouselImageTemplate\".");
            this.carouselImageTemplate = options.carouselImageTemplate;
        }

        if(typeof options.carouselVideoTemplate === "undefined") {
            this.carouselVideoTemplate = "";
        } else {
            if(typeof options.carouselVideoTemplate !== "string") throw new Error("InstafeedOptionsError: Invalid option \"carouselVideoTemplate\".");
            this.carouselVideoTemplate = options.carouselVideoTemplate;
        }

        switch(options.imageResolution) {
            case "low-resolution":
                this.imageResolution = "low_resolution";
                break;

            case "standard-resolution":
                this.imageResolution = "standard_resolution";
                break;

            default:
                if(typeof options.imageResolution === "undefined") {
                    this.imageResolution = "thumbnail";
                } else if(options.get !== "thumbnail") {
                    throw new Error("InstafeedOptionsError: Invalid option \"imageResolution\".");
                }
        }

        switch(options.videoResolution) {
            case "low-bandwidth":
                this.videoResolution = "low_bandwidth";
                break;

            case "low-resolution":
                this.videoResolution = "low_resolution";
                break;

            default:
                if(typeof options.videoResolution === "undefined") {
                    this.videoResolution = "standard_resolution";
                } else if(options.get !== "standard-resolution") {
                    throw new Error("InstafeedOptionsError: Invalid option \"videoResolution\".");
                }
        }

        if(typeof options.relativeScheme === "undefined") {
            this.relativeScheme = false;
        } else {
            if(typeof options.relativeScheme !== "boolean") throw new Error("InstafeedOptionsError: Invalid option \"relativeScheme\".");
            this.relativeScheme = options.relativeScheme;
        }

        if(typeof options.target === "undefined") {
            this.target = "instafeed";
        } else {
            if(typeof options.target !== "string") throw new Error("InstafeedOptionsError: Invalid option \"target\".");
            this.target = options.target;
        }

        if(typeof options.mock === "undefined") {
            this.mock = false;
        } else {
            if(typeof options.mock !== "boolean") throw new Error("InstafeedOptionsError: Invalid option \"mock\".");
            this.mock = options.mock;
        }

        this.filter = typeof options.filter === "function" ? options.filter : null;
        this.onBefore = typeof options.onBefore === "function" ? options.onBefore : null;
        this.onAfter = typeof options.onAfter === "function" ? options.onAfter : null;
        this.onSuccess = typeof options.onSuccess === "function" ? options.onSuccess : null;
        this.onError = typeof options.onError === "function" ? options.onError : null;
    }

    Instafeed.prototype.run = function(nextUrl) {
        if(typeof window === "undefined" || !window) throw new Error("InstafeedRunError: No window object available.");
        window[this.uuid] = {};
        window[this.uuid].parse = parse.bind(this);
        if(typeof document === "undefined" || !document) throw new Error("InstafeedRunError: No document object available.");
        var script = document.createElement("script");
        script.id = this.uuid;
        script.src = nextUrl || this.url;

        script.onerror = function() {
            document.head.removeChild(document.getElementById(this.uuid));
            this.onError("InstafeedConnectionError: Connection to Instagram failed.");
        }.bind(this);

        document.head.appendChild(script);
    };

    Instafeed.prototype.hasNext = function() {
        return this.nextUrl.length > 0;
    };

    Instafeed.prototype.next = function() {
        if(this.hasNext()) {
            this.run(this.nextUrl);
            this.nextUrl = "";
        }
    };

    function uuidv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/x/g, function() {
            return (Math.random() * 16 | 0).toString(16);
        }).replace("y", ((Math.random() * 16 | 0) & 0x3 | 0x8).toString(16));
    }

    function parse(response) {
        document.head.removeChild(document.getElementById(this.uuid));
        delete window[this.uuid];

        try {
            if(!response || !response.meta || typeof response.meta.code !== "number") throw new Error();
            if(response.meta.code !== 200) throw new Error(typeof response.meta.error_type === "string" && typeof response.meta.error_message === "string" ? "InstafeedInstagramAPIError: \"".concat(response.meta.error_type, ": ", response.meta.error_message, "\".") : "InstafeedConnectionError: Connection to Instagram failed.");

            if(!this.mock) {
                if(!response.data) throw new Error();

                if(this.sort === "random") {
                    for(var i = response.data.length - 1; i; i--) {
                        var randomIndex = Math.floor(Math.random() * (i + 1));
                        var randomValue = response.data[i];
                        response.data[i] = response.data[randomIndex];
                        response.data[randomIndex] = randomValue;
                    }
                } else if(this.sort !== "none") {
                    var sortArray = this.sort.split("-");
                    var reverse = sortArray[0] === "least";
                    var property;

                    switch(sortArray[1]) {
                        case "recent":
                            property = "created_time";
                            break;

                        case "liked":
                            property = "likes.count";
                            break;

                        case "commented":
                            property = "comments.count";
                            break;
                    }

                    response.data.sort(function(a, b) {
                        var valueA = getObjectProperty(a, property);
                        var valueB = getObjectProperty(b, property);
                        if(valueA === null || valueB === null) throw new Error();
                        return valueA < valueB ^ reverse ? 1 : -1;
                    });
                }

                if(this.filter) {
                    response.data.forEach(function(data, i) {
                        if(!this.filter(data)) delete response.data[i];
                    }, this);
                }

                var div = document.createElement("div");

                response.data.forEach(function(data) {
                    if(typeof data.id !== "string" || typeof data.type !== "string" || !data.user || typeof data.user.id !== "string" || typeof data.user.username !== "string" || typeof data.user.full_name !== "string" || typeof data.user.profile_picture !== "string" || !data.images || typeof data.filter !== "string" || !data.likes || typeof data.likes.count !== "number" || typeof data.user_has_liked !== "boolean" || !data.comments || typeof data.comments.count !== "number" || !data.tags || typeof data.created_time !== "string" || typeof data.link !== "string") throw new Error();

                    var templateValues = {
                        id: data.id,
                        type: data.type,
                        userId: data.user.id,
                        username: data.user.username,
                        fullName: data.user.full_name,
                        profilePicture: data.user.profile_picture,
                        filter: data.filter,
                        likes: data.likes.count,
                        userHasLiked: data.user_has_liked ? "true" : "false",
                        comments: data.comments.count,
                        tags: JSON.stringify(data.tags),
                        createdTime: data.created_time,
                        link: data.link,
                        model: data
                    };

                    if(data.caption) {
                        if(typeof data.caption.text !== "string") throw new Error();
                        templateValues.caption = data.caption.text;
                    } else {
                        templateValues.caption = "";
                    }

                    if(data.location) {
                        if(typeof data.location.name !== "string" || typeof data.location.latitude !== "number" || typeof data.location.longitude !== "number") throw new Error();
                        templateValues.location = data.location.name;
                        templateValues.latitude = data.location.latitude.toString();
                        templateValues.longitude = data.location.longitude.toString();
                    } else {
                        templateValues.location = "";
                        templateValues.latitude = "";
                        templateValues.longitude = "";
                    }

                    var previewImage = data.images[this.imageResolution];
                    if(!previewImage || typeof previewImage.url !== "string" || typeof previewImage.width !== "number" || typeof previewImage.height !== "number") throw new Error();
                    if(this.relativeScheme) previewImage.url = previewImage.url.replace(/^https?:/, "");
                    previewImage.orientation = previewImage.width === previewImage.height ? "square" : (previewImage.width > previewImage.height ? "landscape" : "portrait");

                    if(data.type === "image") {
                        templateValues.image = previewImage.url;
                        templateValues.width = previewImage.width.toString();
                        templateValues.height = previewImage.height.toString();
                        templateValues.orientation = previewImage.orientation;
                        if(!data.users_in_photo) throw new Error();
                        templateValues.usersInPhoto = JSON.stringify(data.users_in_photo);
                        div.innerHTML = div.innerHTML.concat(parseTemplate(this.imageTemplate, templateValues));
                    } else {
                        templateValues.previewImage = previewImage.url;
                        templateValues.previewWidth = previewImage.width.toString();
                        templateValues.previewHeight = previewImage.height.toString();
                        templateValues.previewOrientation = previewImage.orientation;

                        if(data.type === "video") {
                            if(!data.videos) throw new Error();
                            var video = data.videos[this.videoResolution];
                            if(!video || typeof video.url !== "string" || typeof video.width !== "number" || typeof video.height !== "number") throw new Error();
                            templateValues.video = this.relativeScheme ? video.url.replace(/^https?:/, "") : video.url;
                            templateValues.width = video.width.toString();
                            templateValues.height = video.height.toString();
                            templateValues.orientation = video.width === video.height ? "square" : (video.width > video.height ? "landscape" : "portrait");
                            div.innerHTML = div.innerHTML.concat(parseTemplate(this.videoTemplate, templateValues));
                        } else if(data.type === "carousel") {
                            if(!data.carousel_media) throw new Error();
                            templateValues.media = "";

                            data.carousel_media.forEach(function(carouselMedia) {
                                if(typeof carouselMedia.type !== "string") throw new Error();

                                var templateCarouselMedialValues = {
                                    type: carouselMedia.type
                                };

                                switch(carouselMedia.type) {
                                    case "image":
                                        if(!carouselMedia.images) throw new Error();
                                        var image = carouselMedia.images[this.imageResolution];
                                        if(!image || typeof image.url !== "string" || typeof image.width !== "number" || typeof image.height !== "number") throw new Error();
                                        templateCarouselMedialValues.image = this.relativeScheme ? image.url.replace(/^https?:/, "") : image.url;
                                        templateCarouselMedialValues.width = image.width.toString();
                                        templateCarouselMedialValues.height = image.height.toString();
                                        templateCarouselMedialValues.orientation = image.width === image.height ? "square" : (image.width > image.height ? "landscape" : "portrait");
                                        if(!carouselMedia.users_in_photo) throw new Error();
                                        templateCarouselMedialValues.usersInPhoto = JSON.stringify(carouselMedia.users_in_photo);
                                        templateValues.media = templateValues.media.concat(parseTemplate(this.carouselImageTemplate, templateCarouselMedialValues));
                                        break;

                                    case "video":
                                        if(!carouselMedia.videos) throw new Error();
                                        var video = carouselMedia.videos[this.videoResolution];
                                        if(!video || typeof video.url !== "string" || typeof video.width !== "number" || typeof video.height !== "number") throw new Error();
                                        templateCarouselMedialValues.video = this.relativeScheme ? video.url.replace(/^https?:/, "") : video.url;
                                        templateCarouselMedialValues.width = video.width.toString();
                                        templateCarouselMedialValues.height = video.height.toString();
                                        templateCarouselMedialValues.orientation = video.width === video.height ? "square" : (video.width > video.height ? "landscape" : "portrait");
                                        templateValues.media = templateValues.media.concat(parseTemplate(this.carouselVideoTemplate, templateCarouselMedialValues));
                                        break;
                                }
                            }, this);

                            div.innerHTML = div.innerHTML.concat(parseTemplate(this.carouselFrameTemplate, templateValues));
                        }
                    }
                }, this);

                if(this.onBefore) this.onBefore();
                var targetElement = document.getElementById(this.target);
                if(!targetElement) throw new Error("InstafeedParseError: No target element found.");
                for(var i = div.childNodes.length; i; i--) targetElement.appendChild(div.childNodes[0]);
                if(this.onAfter) this.onAfter();
            }

            if(response.pagination && typeof response.pagination.next_url === "string") this.nextUrl = response.pagination.next_url;
            if(this.onSuccess) this.onSuccess(response);
        } catch(e) {
            if(this.onError) this.onError(e.message.length ? e.message : "InstafeedParseError: Invalid response from Instagram.");
        }
    }

    function getObjectProperty(object, property) {
        var pieces = property.replace(/\[(\w+)\]/g, ".$1").split(".");

        while(pieces.length) {
            var piece = pieces.shift();
            if(object == null || !(piece in object)) return null;
            object = object[piece];
        }

        return object;
    }

    function parseTemplate(template, values) {
        var pattern = /(?:\{{2})(\w+(?:\.\w+|\[\w+\])*)(?:\}{2})/;

        while(pattern.test(template)) {
            var key = template.match(pattern)[1];
            var value = getObjectProperty(values, key);
            if(value === null) value = "";

            template = template.replace(pattern, function() {
                return value;
            });
        }

        return template;
    }

    (function(root, factory) {
        if(typeof define === "function" && typeof define.amd === "object" && define.amd) {
            define(factory);
        } else if(typeof module === "object" && module.exports) {
            module.exports = factory();
        } else {
            root.Instafeed = factory();
        }
    })(this, function() {
        return Instafeed;
    });
}.call(this));

},{}],2:[function(require,module,exports){
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

console.log(template)
},{"instafeed":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJjOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vbm9kZV9tb2R1bGVzL2luc3RhZmVlZC9saWIvaW5zdGFmZWVkLmpzIiwiYzovcGVyc29uYWwvY3V0dGluc2NyYXAuZ2l0aHViLmlvL3N0YXRpYy9lczYvZmFrZV8xOTQwNmM2LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG5Db3B5cmlnaHQgMjAxNyBibGFja0NJQ0FEQVxuXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xueW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5cbjsoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBmdW5jdGlvbiBJbnN0YWZlZWQob3B0aW9ucykge1xuICAgICAgICB0aGlzLnV1aWQgPSBcImluc3RhZmVlZFwiLmNvbmNhdCh1dWlkdjQoKS5yZXBsYWNlKC8tL2csIFwiXCIpKTtcbiAgICAgICAgaWYoIW9wdGlvbnMpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogTWlzc2luZyBvcHRpb25zLlwiKTtcbiAgICAgICAgdGhpcy51cmwgPSBcImh0dHBzOi8vYXBpLmluc3RhZ3JhbS5jb20vdjEvXCI7XG5cbiAgICAgICAgc3dpdGNoKG9wdGlvbnMuZ2V0KSB7XG4gICAgICAgICAgICBjYXNlIFwidGFnXCI6XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMudGFnTmFtZSAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBNaXNzaW5nIG9yIGludmFsaWQgb3B0aW9uIFxcXCJ0YWdOYW1lXFxcIi5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy51cmwgPSB0aGlzLnVybC5jb25jYXQoXCJ0YWdzL1wiLCBlbmNvZGVVUklDb21wb25lbnQob3B0aW9ucy50YWdOYW1lKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgXCJsb2NhdGlvblwiOlxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmxvY2F0aW9uSWQgIT09IFwic3RyaW5nXCIgfHwgIS9eXFxkKyQvLnRlc3Qob3B0aW9ucy5sb2NhdGlvbklkKSkgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBNaXNzaW5nIG9yIGludmFsaWQgb3B0aW9uIFxcXCJsb2NhdGlvbklkXFxcIi5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy51cmwgPSB0aGlzLnVybC5jb25jYXQoXCJsb2NhdGlvbnMvXCIsIG9wdGlvbnMubG9jYXRpb25JZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuZ2V0ICE9PSBcInVuZGVmaW5lZFwiICYmIG9wdGlvbnMuZ2V0ICE9PSBcInVzZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwiZ2V0XFxcIi5cIik7XG4gICAgICAgICAgICAgICAgdGhpcy51cmwgPSB0aGlzLnVybC5jb25jYXQoXCJ1c2Vycy9cIik7XG5cbiAgICAgICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy51c2VySWQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cmwgPSB0aGlzLnVybC5jb25jYXQoXCJzZWxmXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLnVzZXJJZCAhPT0gXCJzdHJpbmdcIiB8fCAhL15cXGQrJC8udGVzdChvcHRpb25zLnVzZXJJZCkpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcInVzZXJJZFxcXCIuXCIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVybCA9IHRoaXMudXJsLmNvbmNhdChvcHRpb25zLnVzZXJJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuYWNjZXNzVG9rZW4gIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogTWlzc2luZyBvciBpbnZhbGlkIG9wdGlvbiBcXFwiYWNjZXNzVG9rZW5cXFwiLlwiKTtcbiAgICAgICAgdGhpcy51cmwgPSB0aGlzLnVybC5jb25jYXQoXCIvbWVkaWEvcmVjZW50P2FjY2Vzc190b2tlbj1cIiwgZW5jb2RlVVJJQ29tcG9uZW50KG9wdGlvbnMuYWNjZXNzVG9rZW4pLCBcIiZjYWxsYmFjaz1cIiwgdGhpcy51dWlkLCBcIi5wYXJzZVwiKTtcbiAgICAgICAgdGhpcy5uZXh0VXJsID0gXCJcIjtcblxuICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5saW1pdCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMubGltaXQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcImxpbWl0XFxcIi5cIik7XG4gICAgICAgICAgICBpZihvcHRpb25zLmxpbWl0KSB0aGlzLnVybCA9IHRoaXMudXJsLmNvbmNhdChcIiZjb3VudD1cIiwgb3B0aW9ucy5saW1pdC50b1N0cmluZygpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLnNvcnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc29ydCA9IFwibm9uZVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoIS9eKD86bm9uZXwoPzptb3N0fGxlYXN0KS0oPzpyZWNlbnR8bGlrZWR8Y29tbWVudGVkKXxyYW5kb20pJC8udGVzdChvcHRpb25zLnNvcnQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJzb3J0XFxcIi5cIik7XG4gICAgICAgICAgICB0aGlzLnNvcnQgPSBvcHRpb25zLnNvcnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5pbWFnZVRlbXBsYXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlVGVtcGxhdGUgPSBcIjxpbWcgc3JjPVxcXCJ7e2ltYWdlfX1cXFwiIHdpZHRoPVxcXCJ7e3dpZHRofX1cXFwiIGhlaWdodD1cXFwie3toZWlnaHR9fVxcXCI+XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5pbWFnZVRlbXBsYXRlICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJpbWFnZVRlbXBsYXRlXFxcIi5cIik7XG4gICAgICAgICAgICB0aGlzLmltYWdlVGVtcGxhdGUgPSBvcHRpb25zLmltYWdlVGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy52aWRlb1RlbXBsYXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnZpZGVvVGVtcGxhdGUgPSBcIjxpbWcgc3JjPVxcXCJ7e3ByZXZpZXdJbWFnZX19XFxcIiB3aWR0aD1cXFwie3twcmV2aWV3V2lkdGh9fVxcXCIgaGVpZ2h0PVxcXCJ7e3ByZXZpZXdIZWlnaHR9fVxcXCI+XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy52aWRlb1RlbXBsYXRlICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJ2aWRlb1RlbXBsYXRlXFxcIi5cIik7XG4gICAgICAgICAgICB0aGlzLnZpZGVvVGVtcGxhdGUgPSBvcHRpb25zLnZpZGVvVGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5jYXJvdXNlbEZyYW1lVGVtcGxhdGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWxGcmFtZVRlbXBsYXRlID0gXCI8aW1nIHNyYz1cXFwie3twcmV2aWV3SW1hZ2V9fVxcXCIgd2lkdGg9XFxcInt7cHJldmlld1dpZHRofX1cXFwiIGhlaWdodD1cXFwie3twcmV2aWV3SGVpZ2h0fX1cXFwiPlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuY2Fyb3VzZWxGcmFtZVRlbXBsYXRlICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJjYXJvdXNlbEZyYW1lVGVtcGxhdGVcXFwiLlwiKTtcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWxGcmFtZVRlbXBsYXRlID0gb3B0aW9ucy5jYXJvdXNlbEZyYW1lVGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5jYXJvdXNlbEltYWdlVGVtcGxhdGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWxJbWFnZVRlbXBsYXRlID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmNhcm91c2VsSW1hZ2VUZW1wbGF0ZSAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwiY2Fyb3VzZWxJbWFnZVRlbXBsYXRlXFxcIi5cIik7XG4gICAgICAgICAgICB0aGlzLmNhcm91c2VsSW1hZ2VUZW1wbGF0ZSA9IG9wdGlvbnMuY2Fyb3VzZWxJbWFnZVRlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuY2Fyb3VzZWxWaWRlb1RlbXBsYXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmNhcm91c2VsVmlkZW9UZW1wbGF0ZSA9IFwiXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5jYXJvdXNlbFZpZGVvVGVtcGxhdGUgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcImNhcm91c2VsVmlkZW9UZW1wbGF0ZVxcXCIuXCIpO1xuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbFZpZGVvVGVtcGxhdGUgPSBvcHRpb25zLmNhcm91c2VsVmlkZW9UZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaChvcHRpb25zLmltYWdlUmVzb2x1dGlvbikge1xuICAgICAgICAgICAgY2FzZSBcImxvdy1yZXNvbHV0aW9uXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZVJlc29sdXRpb24gPSBcImxvd19yZXNvbHV0aW9uXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgXCJzdGFuZGFyZC1yZXNvbHV0aW9uXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZVJlc29sdXRpb24gPSBcInN0YW5kYXJkX3Jlc29sdXRpb25cIjtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5pbWFnZVJlc29sdXRpb24gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZVJlc29sdXRpb24gPSBcInRodW1ibmFpbFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihvcHRpb25zLmdldCAhPT0gXCJ0aHVtYm5haWxcIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJpbWFnZVJlc29sdXRpb25cXFwiLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2gob3B0aW9ucy52aWRlb1Jlc29sdXRpb24pIHtcbiAgICAgICAgICAgIGNhc2UgXCJsb3ctYmFuZHdpZHRoXCI6XG4gICAgICAgICAgICAgICAgdGhpcy52aWRlb1Jlc29sdXRpb24gPSBcImxvd19iYW5kd2lkdGhcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBcImxvdy1yZXNvbHV0aW9uXCI6XG4gICAgICAgICAgICAgICAgdGhpcy52aWRlb1Jlc29sdXRpb24gPSBcImxvd19yZXNvbHV0aW9uXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMudmlkZW9SZXNvbHV0aW9uID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlkZW9SZXNvbHV0aW9uID0gXCJzdGFuZGFyZF9yZXNvbHV0aW9uXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKG9wdGlvbnMuZ2V0ICE9PSBcInN0YW5kYXJkLXJlc29sdXRpb25cIikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJ2aWRlb1Jlc29sdXRpb25cXFwiLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5yZWxhdGl2ZVNjaGVtZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5yZWxhdGl2ZVNjaGVtZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMucmVsYXRpdmVTY2hlbWUgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJyZWxhdGl2ZVNjaGVtZVxcXCIuXCIpO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGl2ZVNjaGVtZSA9IG9wdGlvbnMucmVsYXRpdmVTY2hlbWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy50YXJnZXQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gXCJpbnN0YWZlZWRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLnRhcmdldCAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwidGFyZ2V0XFxcIi5cIik7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IG9wdGlvbnMudGFyZ2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMubW9jayA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5tb2NrID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5tb2NrICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwibW9ja1xcXCIuXCIpO1xuICAgICAgICAgICAgdGhpcy5tb2NrID0gb3B0aW9ucy5tb2NrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maWx0ZXIgPSB0eXBlb2Ygb3B0aW9ucy5maWx0ZXIgPT09IFwiZnVuY3Rpb25cIiA/IG9wdGlvbnMuZmlsdGVyIDogbnVsbDtcbiAgICAgICAgdGhpcy5vbkJlZm9yZSA9IHR5cGVvZiBvcHRpb25zLm9uQmVmb3JlID09PSBcImZ1bmN0aW9uXCIgPyBvcHRpb25zLm9uQmVmb3JlIDogbnVsbDtcbiAgICAgICAgdGhpcy5vbkFmdGVyID0gdHlwZW9mIG9wdGlvbnMub25BZnRlciA9PT0gXCJmdW5jdGlvblwiID8gb3B0aW9ucy5vbkFmdGVyIDogbnVsbDtcbiAgICAgICAgdGhpcy5vblN1Y2Nlc3MgPSB0eXBlb2Ygb3B0aW9ucy5vblN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIiA/IG9wdGlvbnMub25TdWNjZXNzIDogbnVsbDtcbiAgICAgICAgdGhpcy5vbkVycm9yID0gdHlwZW9mIG9wdGlvbnMub25FcnJvciA9PT0gXCJmdW5jdGlvblwiID8gb3B0aW9ucy5vbkVycm9yIDogbnVsbDtcbiAgICB9XG5cbiAgICBJbnN0YWZlZWQucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uKG5leHRVcmwpIHtcbiAgICAgICAgaWYodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhd2luZG93KSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRSdW5FcnJvcjogTm8gd2luZG93IG9iamVjdCBhdmFpbGFibGUuXCIpO1xuICAgICAgICB3aW5kb3dbdGhpcy51dWlkXSA9IHt9O1xuICAgICAgICB3aW5kb3dbdGhpcy51dWlkXS5wYXJzZSA9IHBhcnNlLmJpbmQodGhpcyk7XG4gICAgICAgIGlmKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhZG9jdW1lbnQpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZFJ1bkVycm9yOiBObyBkb2N1bWVudCBvYmplY3QgYXZhaWxhYmxlLlwiKTtcbiAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgIHNjcmlwdC5pZCA9IHRoaXMudXVpZDtcbiAgICAgICAgc2NyaXB0LnNyYyA9IG5leHRVcmwgfHwgdGhpcy51cmw7XG5cbiAgICAgICAgc2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy51dWlkKSk7XG4gICAgICAgICAgICB0aGlzLm9uRXJyb3IoXCJJbnN0YWZlZWRDb25uZWN0aW9uRXJyb3I6IENvbm5lY3Rpb24gdG8gSW5zdGFncmFtIGZhaWxlZC5cIik7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgfTtcblxuICAgIEluc3RhZmVlZC5wcm90b3R5cGUuaGFzTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZXh0VXJsLmxlbmd0aCA+IDA7XG4gICAgfTtcblxuICAgIEluc3RhZmVlZC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLmhhc05leHQoKSkge1xuICAgICAgICAgICAgdGhpcy5ydW4odGhpcy5uZXh0VXJsKTtcbiAgICAgICAgICAgIHRoaXMubmV4dFVybCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdXVpZHY0KCkge1xuICAgICAgICByZXR1cm4gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKC94L2csIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIChNYXRoLnJhbmRvbSgpICogMTYgfCAwKS50b1N0cmluZygxNik7XG4gICAgICAgIH0pLnJlcGxhY2UoXCJ5XCIsICgoTWF0aC5yYW5kb20oKSAqIDE2IHwgMCkgJiAweDMgfCAweDgpLnRvU3RyaW5nKDE2KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2UocmVzcG9uc2UpIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnV1aWQpKTtcbiAgICAgICAgZGVsZXRlIHdpbmRvd1t0aGlzLnV1aWRdO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZighcmVzcG9uc2UgfHwgIXJlc3BvbnNlLm1ldGEgfHwgdHlwZW9mIHJlc3BvbnNlLm1ldGEuY29kZSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICBpZihyZXNwb25zZS5tZXRhLmNvZGUgIT09IDIwMCkgdGhyb3cgbmV3IEVycm9yKHR5cGVvZiByZXNwb25zZS5tZXRhLmVycm9yX3R5cGUgPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHJlc3BvbnNlLm1ldGEuZXJyb3JfbWVzc2FnZSA9PT0gXCJzdHJpbmdcIiA/IFwiSW5zdGFmZWVkSW5zdGFncmFtQVBJRXJyb3I6IFxcXCJcIi5jb25jYXQocmVzcG9uc2UubWV0YS5lcnJvcl90eXBlLCBcIjogXCIsIHJlc3BvbnNlLm1ldGEuZXJyb3JfbWVzc2FnZSwgXCJcXFwiLlwiKSA6IFwiSW5zdGFmZWVkQ29ubmVjdGlvbkVycm9yOiBDb25uZWN0aW9uIHRvIEluc3RhZ3JhbSBmYWlsZWQuXCIpO1xuXG4gICAgICAgICAgICBpZighdGhpcy5tb2NrKSB7XG4gICAgICAgICAgICAgICAgaWYoIXJlc3BvbnNlLmRhdGEpIHRocm93IG5ldyBFcnJvcigpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5zb3J0ID09PSBcInJhbmRvbVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IHJlc3BvbnNlLmRhdGEubGVuZ3RoIC0gMTsgaTsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYW5kb21WYWx1ZSA9IHJlc3BvbnNlLmRhdGFbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhW2ldID0gcmVzcG9uc2UuZGF0YVtyYW5kb21JbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhW3JhbmRvbUluZGV4XSA9IHJhbmRvbVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHRoaXMuc29ydCAhPT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNvcnRBcnJheSA9IHRoaXMuc29ydC5zcGxpdChcIi1cIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXZlcnNlID0gc29ydEFycmF5WzBdID09PSBcImxlYXN0XCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eTtcblxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2goc29ydEFycmF5WzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicmVjZW50XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBcImNyZWF0ZWRfdGltZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibGlrZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IFwibGlrZXMuY291bnRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImNvbW1lbnRlZFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gXCJjb21tZW50cy5jb3VudFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZUEgPSBnZXRPYmplY3RQcm9wZXJ0eShhLCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVCID0gZ2V0T2JqZWN0UHJvcGVydHkoYiwgcHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodmFsdWVBID09PSBudWxsIHx8IHZhbHVlQiA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVBIDwgdmFsdWVCIF4gcmV2ZXJzZSA/IDEgOiAtMTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5maWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF0aGlzLmZpbHRlcihkYXRhKSkgZGVsZXRlIHJlc3BvbnNlLmRhdGFbaV07XG4gICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGRhdGEuaWQgIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGRhdGEudHlwZSAhPT0gXCJzdHJpbmdcIiB8fCAhZGF0YS51c2VyIHx8IHR5cGVvZiBkYXRhLnVzZXIuaWQgIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGRhdGEudXNlci51c2VybmFtZSAhPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgZGF0YS51c2VyLmZ1bGxfbmFtZSAhPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgZGF0YS51c2VyLnByb2ZpbGVfcGljdHVyZSAhPT0gXCJzdHJpbmdcIiB8fCAhZGF0YS5pbWFnZXMgfHwgdHlwZW9mIGRhdGEuZmlsdGVyICE9PSBcInN0cmluZ1wiIHx8ICFkYXRhLmxpa2VzIHx8IHR5cGVvZiBkYXRhLmxpa2VzLmNvdW50ICE9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBkYXRhLnVzZXJfaGFzX2xpa2VkICE9PSBcImJvb2xlYW5cIiB8fCAhZGF0YS5jb21tZW50cyB8fCB0eXBlb2YgZGF0YS5jb21tZW50cy5jb3VudCAhPT0gXCJudW1iZXJcIiB8fCAhZGF0YS50YWdzIHx8IHR5cGVvZiBkYXRhLmNyZWF0ZWRfdGltZSAhPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgZGF0YS5saW5rICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVWYWx1ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogZGF0YS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGRhdGEudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZDogZGF0YS51c2VyLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IGRhdGEudXNlci51c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxOYW1lOiBkYXRhLnVzZXIuZnVsbF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZVBpY3R1cmU6IGRhdGEudXNlci5wcm9maWxlX3BpY3R1cmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IGRhdGEuZmlsdGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGlrZXM6IGRhdGEubGlrZXMuY291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySGFzTGlrZWQ6IGRhdGEudXNlcl9oYXNfbGlrZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnRzOiBkYXRhLmNvbW1lbnRzLmNvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnczogSlNPTi5zdHJpbmdpZnkoZGF0YS50YWdzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRUaW1lOiBkYXRhLmNyZWF0ZWRfdGltZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbms6IGRhdGEubGluayxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiBkYXRhXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5jYXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgZGF0YS5jYXB0aW9uLnRleHQgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMuY2FwdGlvbiA9IGRhdGEuY2FwdGlvbi50ZXh0O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMuY2FwdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgZGF0YS5sb2NhdGlvbi5uYW1lICE9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBkYXRhLmxvY2F0aW9uLmxhdGl0dWRlICE9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBkYXRhLmxvY2F0aW9uLmxvbmdpdHVkZSAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5sb2NhdGlvbiA9IGRhdGEubG9jYXRpb24ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLmxhdGl0dWRlID0gZGF0YS5sb2NhdGlvbi5sYXRpdHVkZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMubG9uZ2l0dWRlID0gZGF0YS5sb2NhdGlvbi5sb25naXR1ZGUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLmxvY2F0aW9uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLmxhdGl0dWRlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLmxvbmdpdHVkZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJldmlld0ltYWdlID0gZGF0YS5pbWFnZXNbdGhpcy5pbWFnZVJlc29sdXRpb25dO1xuICAgICAgICAgICAgICAgICAgICBpZighcHJldmlld0ltYWdlIHx8IHR5cGVvZiBwcmV2aWV3SW1hZ2UudXJsICE9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBwcmV2aWV3SW1hZ2Uud2lkdGggIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHByZXZpZXdJbWFnZS5oZWlnaHQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnJlbGF0aXZlU2NoZW1lKSBwcmV2aWV3SW1hZ2UudXJsID0gcHJldmlld0ltYWdlLnVybC5yZXBsYWNlKC9eaHR0cHM/Oi8sIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBwcmV2aWV3SW1hZ2Uub3JpZW50YXRpb24gPSBwcmV2aWV3SW1hZ2Uud2lkdGggPT09IHByZXZpZXdJbWFnZS5oZWlnaHQgPyBcInNxdWFyZVwiIDogKHByZXZpZXdJbWFnZS53aWR0aCA+IHByZXZpZXdJbWFnZS5oZWlnaHQgPyBcImxhbmRzY2FwZVwiIDogXCJwb3J0cmFpdFwiKTtcblxuICAgICAgICAgICAgICAgICAgICBpZihkYXRhLnR5cGUgPT09IFwiaW1hZ2VcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMuaW1hZ2UgPSBwcmV2aWV3SW1hZ2UudXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMud2lkdGggPSBwcmV2aWV3SW1hZ2Uud2lkdGgudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLmhlaWdodCA9IHByZXZpZXdJbWFnZS5oZWlnaHQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLm9yaWVudGF0aW9uID0gcHJldmlld0ltYWdlLm9yaWVudGF0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWRhdGEudXNlcnNfaW5fcGhvdG8pIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMudXNlcnNJblBob3RvID0gSlNPTi5zdHJpbmdpZnkoZGF0YS51c2Vyc19pbl9waG90byk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gZGl2LmlubmVySFRNTC5jb25jYXQocGFyc2VUZW1wbGF0ZSh0aGlzLmltYWdlVGVtcGxhdGUsIHRlbXBsYXRlVmFsdWVzKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5wcmV2aWV3SW1hZ2UgPSBwcmV2aWV3SW1hZ2UudXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMucHJldmlld1dpZHRoID0gcHJldmlld0ltYWdlLndpZHRoLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5wcmV2aWV3SGVpZ2h0ID0gcHJldmlld0ltYWdlLmhlaWdodC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMucHJldmlld09yaWVudGF0aW9uID0gcHJldmlld0ltYWdlLm9yaWVudGF0aW9uO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLnR5cGUgPT09IFwidmlkZW9cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFkYXRhLnZpZGVvcykgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZpZGVvID0gZGF0YS52aWRlb3NbdGhpcy52aWRlb1Jlc29sdXRpb25dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF2aWRlbyB8fCB0eXBlb2YgdmlkZW8udXJsICE9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiB2aWRlby53aWR0aCAhPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgdmlkZW8uaGVpZ2h0ICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy52aWRlbyA9IHRoaXMucmVsYXRpdmVTY2hlbWUgPyB2aWRlby51cmwucmVwbGFjZSgvXmh0dHBzPzovLCBcIlwiKSA6IHZpZGVvLnVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy53aWR0aCA9IHZpZGVvLndpZHRoLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMuaGVpZ2h0ID0gdmlkZW8uaGVpZ2h0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMub3JpZW50YXRpb24gPSB2aWRlby53aWR0aCA9PT0gdmlkZW8uaGVpZ2h0ID8gXCJzcXVhcmVcIiA6ICh2aWRlby53aWR0aCA+IHZpZGVvLmhlaWdodCA/IFwibGFuZHNjYXBlXCIgOiBcInBvcnRyYWl0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBkaXYuaW5uZXJIVE1MLmNvbmNhdChwYXJzZVRlbXBsYXRlKHRoaXMudmlkZW9UZW1wbGF0ZSwgdGVtcGxhdGVWYWx1ZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihkYXRhLnR5cGUgPT09IFwiY2Fyb3VzZWxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFkYXRhLmNhcm91c2VsX21lZGlhKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5tZWRpYSA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNhcm91c2VsX21lZGlhLmZvckVhY2goZnVuY3Rpb24oY2Fyb3VzZWxNZWRpYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgY2Fyb3VzZWxNZWRpYS50eXBlICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGNhcm91c2VsTWVkaWEudHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaChjYXJvdXNlbE1lZGlhLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbWFnZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFjYXJvdXNlbE1lZGlhLmltYWdlcykgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0gY2Fyb3VzZWxNZWRpYS5pbWFnZXNbdGhpcy5pbWFnZVJlc29sdXRpb25dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFpbWFnZSB8fCB0eXBlb2YgaW1hZ2UudXJsICE9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBpbWFnZS53aWR0aCAhPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgaW1hZ2UuaGVpZ2h0ICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzLmltYWdlID0gdGhpcy5yZWxhdGl2ZVNjaGVtZSA/IGltYWdlLnVybC5yZXBsYWNlKC9eaHR0cHM/Oi8sIFwiXCIpIDogaW1hZ2UudXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMud2lkdGggPSBpbWFnZS53aWR0aC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMuaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcy5vcmllbnRhdGlvbiA9IGltYWdlLndpZHRoID09PSBpbWFnZS5oZWlnaHQgPyBcInNxdWFyZVwiIDogKGltYWdlLndpZHRoID4gaW1hZ2UuaGVpZ2h0ID8gXCJsYW5kc2NhcGVcIiA6IFwicG9ydHJhaXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWNhcm91c2VsTWVkaWEudXNlcnNfaW5fcGhvdG8pIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMudXNlcnNJblBob3RvID0gSlNPTi5zdHJpbmdpZnkoY2Fyb3VzZWxNZWRpYS51c2Vyc19pbl9waG90byk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMubWVkaWEgPSB0ZW1wbGF0ZVZhbHVlcy5tZWRpYS5jb25jYXQocGFyc2VUZW1wbGF0ZSh0aGlzLmNhcm91c2VsSW1hZ2VUZW1wbGF0ZSwgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidmlkZW9cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighY2Fyb3VzZWxNZWRpYS52aWRlb3MpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2aWRlbyA9IGNhcm91c2VsTWVkaWEudmlkZW9zW3RoaXMudmlkZW9SZXNvbHV0aW9uXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighdmlkZW8gfHwgdHlwZW9mIHZpZGVvLnVybCAhPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdmlkZW8ud2lkdGggIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHZpZGVvLmhlaWdodCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcy52aWRlbyA9IHRoaXMucmVsYXRpdmVTY2hlbWUgPyB2aWRlby51cmwucmVwbGFjZSgvXmh0dHBzPzovLCBcIlwiKSA6IHZpZGVvLnVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzLndpZHRoID0gdmlkZW8ud2lkdGgudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzLmhlaWdodCA9IHZpZGVvLmhlaWdodC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMub3JpZW50YXRpb24gPSB2aWRlby53aWR0aCA9PT0gdmlkZW8uaGVpZ2h0ID8gXCJzcXVhcmVcIiA6ICh2aWRlby53aWR0aCA+IHZpZGVvLmhlaWdodCA/IFwibGFuZHNjYXBlXCIgOiBcInBvcnRyYWl0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLm1lZGlhID0gdGVtcGxhdGVWYWx1ZXMubWVkaWEuY29uY2F0KHBhcnNlVGVtcGxhdGUodGhpcy5jYXJvdXNlbFZpZGVvVGVtcGxhdGUsIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGRpdi5pbm5lckhUTUwuY29uY2F0KHBhcnNlVGVtcGxhdGUodGhpcy5jYXJvdXNlbEZyYW1lVGVtcGxhdGUsIHRlbXBsYXRlVmFsdWVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMub25CZWZvcmUpIHRoaXMub25CZWZvcmUoKTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBpZighdGFyZ2V0RWxlbWVudCkgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkUGFyc2VFcnJvcjogTm8gdGFyZ2V0IGVsZW1lbnQgZm91bmQuXCIpO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IGRpdi5jaGlsZE5vZGVzLmxlbmd0aDsgaTsgaS0tKSB0YXJnZXRFbGVtZW50LmFwcGVuZENoaWxkKGRpdi5jaGlsZE5vZGVzWzBdKTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uQWZ0ZXIpIHRoaXMub25BZnRlcigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihyZXNwb25zZS5wYWdpbmF0aW9uICYmIHR5cGVvZiByZXNwb25zZS5wYWdpbmF0aW9uLm5leHRfdXJsID09PSBcInN0cmluZ1wiKSB0aGlzLm5leHRVcmwgPSByZXNwb25zZS5wYWdpbmF0aW9uLm5leHRfdXJsO1xuICAgICAgICAgICAgaWYodGhpcy5vblN1Y2Nlc3MpIHRoaXMub25TdWNjZXNzKHJlc3BvbnNlKTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBpZih0aGlzLm9uRXJyb3IpIHRoaXMub25FcnJvcihlLm1lc3NhZ2UubGVuZ3RoID8gZS5tZXNzYWdlIDogXCJJbnN0YWZlZWRQYXJzZUVycm9yOiBJbnZhbGlkIHJlc3BvbnNlIGZyb20gSW5zdGFncmFtLlwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE9iamVjdFByb3BlcnR5KG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICAgICAgdmFyIHBpZWNlcyA9IHByb3BlcnR5LnJlcGxhY2UoL1xcWyhcXHcrKVxcXS9nLCBcIi4kMVwiKS5zcGxpdChcIi5cIik7XG5cbiAgICAgICAgd2hpbGUocGllY2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIHBpZWNlID0gcGllY2VzLnNoaWZ0KCk7XG4gICAgICAgICAgICBpZihvYmplY3QgPT0gbnVsbCB8fCAhKHBpZWNlIGluIG9iamVjdCkpIHJldHVybiBudWxsO1xuICAgICAgICAgICAgb2JqZWN0ID0gb2JqZWN0W3BpZWNlXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgdmFsdWVzKSB7XG4gICAgICAgIHZhciBwYXR0ZXJuID0gLyg/Olxce3syfSkoXFx3Kyg/OlxcLlxcdyt8XFxbXFx3K1xcXSkqKSg/OlxcfXsyfSkvO1xuXG4gICAgICAgIHdoaWxlKHBhdHRlcm4udGVzdCh0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSB0ZW1wbGF0ZS5tYXRjaChwYXR0ZXJuKVsxXTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGdldE9iamVjdFByb3BlcnR5KHZhbHVlcywga2V5KTtcbiAgICAgICAgICAgIGlmKHZhbHVlID09PSBudWxsKSB2YWx1ZSA9IFwiXCI7XG5cbiAgICAgICAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZShwYXR0ZXJuLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAoZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICAgICAgICBpZih0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09IFwib2JqZWN0XCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAgICAgZGVmaW5lKGZhY3RvcnkpO1xuICAgICAgICB9IGVsc2UgaWYodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByb290Lkluc3RhZmVlZCA9IGZhY3RvcnkoKTtcbiAgICAgICAgfVxuICAgIH0pKHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gSW5zdGFmZWVkO1xuICAgIH0pO1xufS5jYWxsKHRoaXMpKTtcbiIsInZhciBJbnN0YWZlZWQgPSByZXF1aXJlKCdpbnN0YWZlZWQnKVxyXG5jb25zdCB0ZW1wbGF0ZSA9IGBcclxuICAgIDxkaXYgY2xhc3M9J2NhcmQnPiBcclxuICAgICAgICA8aDE+SW5zdGFmZWVkPC9oMT5cclxuICAgICAgICA8YSBjbGFzcz0naW5zdGFncmFtJyBocmVmPSd7e2xpbmt9fSc+PGltZyBzcmM9J3t7aW1hZ2V9fScgd2lkdGg9J3t7d2lkdGh9fScgaGVpZ2h0PSd7e2hlaWdodH19Jz48L2E+XHJcbiAgICA8L2Rpdj5cclxuICAgIGBcclxudmFyIGZlZWQgPSBuZXcgSW5zdGFmZWVkKHtcclxuICAgIHRlbXBsYXRlOiAne3sgbGluayB9fScsXHJcbiAgICBnZXQ6ICd1c2VyJyxcclxuICAgIGFjY2Vzc1Rva2VuOiBcIjY3NjI0ODYxMzYuMTdiYWJjOC5jYWM1ZTVkNTNjNDc0ZDk0ODIxMTA4Mjc1NDc2OGEzZVwiLFxyXG4gICAgbGltaXQ6IDQsXHJcbn0pO1xyXG5cclxuZmVlZC5ydW4oKVxyXG5cclxuY29uc29sZS5sb2codGVtcGxhdGUpIl19
