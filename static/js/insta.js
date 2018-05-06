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
    // template: template,
    get: 'user',
    accessToken: "6762486136.17babc8.cac5e5d53c474d948211082754768a3e",
    limit: 10,
});

feed.run()

},{"instafeed":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJjOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vbm9kZV9tb2R1bGVzL2luc3RhZmVlZC9saWIvaW5zdGFmZWVkLmpzIiwiYzovcGVyc29uYWwvY3V0dGluc2NyYXAuZ2l0aHViLmlvL3N0YXRpYy9lczYvZmFrZV9kNTk3N2QwYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuQ29weXJpZ2h0IDIwMTcgYmxhY2tDSUNBREFcblxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuXG4gICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuXG47KGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgZnVuY3Rpb24gSW5zdGFmZWVkKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy51dWlkID0gXCJpbnN0YWZlZWRcIi5jb25jYXQodXVpZHY0KCkucmVwbGFjZSgvLS9nLCBcIlwiKSk7XG4gICAgICAgIGlmKCFvcHRpb25zKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IE1pc3Npbmcgb3B0aW9ucy5cIik7XG4gICAgICAgIHRoaXMudXJsID0gXCJodHRwczovL2FwaS5pbnN0YWdyYW0uY29tL3YxL1wiO1xuXG4gICAgICAgIHN3aXRjaChvcHRpb25zLmdldCkge1xuICAgICAgICAgICAgY2FzZSBcInRhZ1wiOlxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLnRhZ05hbWUgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogTWlzc2luZyBvciBpbnZhbGlkIG9wdGlvbiBcXFwidGFnTmFtZVxcXCIuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMudXJsID0gdGhpcy51cmwuY29uY2F0KFwidGFncy9cIiwgZW5jb2RlVVJJQ29tcG9uZW50KG9wdGlvbnMudGFnTmFtZSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFwibG9jYXRpb25cIjpcbiAgICAgICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5sb2NhdGlvbklkICE9PSBcInN0cmluZ1wiIHx8ICEvXlxcZCskLy50ZXN0KG9wdGlvbnMubG9jYXRpb25JZCkpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogTWlzc2luZyBvciBpbnZhbGlkIG9wdGlvbiBcXFwibG9jYXRpb25JZFxcXCIuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMudXJsID0gdGhpcy51cmwuY29uY2F0KFwibG9jYXRpb25zL1wiLCBvcHRpb25zLmxvY2F0aW9uSWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmdldCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvcHRpb25zLmdldCAhPT0gXCJ1c2VyXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcImdldFxcXCIuXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMudXJsID0gdGhpcy51cmwuY29uY2F0KFwidXNlcnMvXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMudXNlcklkID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXJsID0gdGhpcy51cmwuY29uY2F0KFwic2VsZlwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy51c2VySWQgIT09IFwic3RyaW5nXCIgfHwgIS9eXFxkKyQvLnRlc3Qob3B0aW9ucy51c2VySWQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJ1c2VySWRcXFwiLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cmwgPSB0aGlzLnVybC5jb25jYXQob3B0aW9ucy51c2VySWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmFjY2Vzc1Rva2VuICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IE1pc3Npbmcgb3IgaW52YWxpZCBvcHRpb24gXFxcImFjY2Vzc1Rva2VuXFxcIi5cIik7XG4gICAgICAgIHRoaXMudXJsID0gdGhpcy51cmwuY29uY2F0KFwiL21lZGlhL3JlY2VudD9hY2Nlc3NfdG9rZW49XCIsIGVuY29kZVVSSUNvbXBvbmVudChvcHRpb25zLmFjY2Vzc1Rva2VuKSwgXCImY2FsbGJhY2s9XCIsIHRoaXMudXVpZCwgXCIucGFyc2VcIik7XG4gICAgICAgIHRoaXMubmV4dFVybCA9IFwiXCI7XG5cbiAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMubGltaXQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmxpbWl0ICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJsaW1pdFxcXCIuXCIpO1xuICAgICAgICAgICAgaWYob3B0aW9ucy5saW1pdCkgdGhpcy51cmwgPSB0aGlzLnVybC5jb25jYXQoXCImY291bnQ9XCIsIG9wdGlvbnMubGltaXQudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5zb3J0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnNvcnQgPSBcIm5vbmVcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKCEvXig/Om5vbmV8KD86bW9zdHxsZWFzdCktKD86cmVjZW50fGxpa2VkfGNvbW1lbnRlZCl8cmFuZG9tKSQvLnRlc3Qob3B0aW9ucy5zb3J0KSkgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwic29ydFxcXCIuXCIpO1xuICAgICAgICAgICAgdGhpcy5zb3J0ID0gb3B0aW9ucy5zb3J0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuaW1hZ2VUZW1wbGF0ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5pbWFnZVRlbXBsYXRlID0gXCI8aW1nIHNyYz1cXFwie3tpbWFnZX19XFxcIiB3aWR0aD1cXFwie3t3aWR0aH19XFxcIiBoZWlnaHQ9XFxcInt7aGVpZ2h0fX1cXFwiPlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuaW1hZ2VUZW1wbGF0ZSAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwiaW1hZ2VUZW1wbGF0ZVxcXCIuXCIpO1xuICAgICAgICAgICAgdGhpcy5pbWFnZVRlbXBsYXRlID0gb3B0aW9ucy5pbWFnZVRlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMudmlkZW9UZW1wbGF0ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy52aWRlb1RlbXBsYXRlID0gXCI8aW1nIHNyYz1cXFwie3twcmV2aWV3SW1hZ2V9fVxcXCIgd2lkdGg9XFxcInt7cHJldmlld1dpZHRofX1cXFwiIGhlaWdodD1cXFwie3twcmV2aWV3SGVpZ2h0fX1cXFwiPlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMudmlkZW9UZW1wbGF0ZSAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwidmlkZW9UZW1wbGF0ZVxcXCIuXCIpO1xuICAgICAgICAgICAgdGhpcy52aWRlb1RlbXBsYXRlID0gb3B0aW9ucy52aWRlb1RlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuY2Fyb3VzZWxGcmFtZVRlbXBsYXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmNhcm91c2VsRnJhbWVUZW1wbGF0ZSA9IFwiPGltZyBzcmM9XFxcInt7cHJldmlld0ltYWdlfX1cXFwiIHdpZHRoPVxcXCJ7e3ByZXZpZXdXaWR0aH19XFxcIiBoZWlnaHQ9XFxcInt7cHJldmlld0hlaWdodH19XFxcIj5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmNhcm91c2VsRnJhbWVUZW1wbGF0ZSAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwiY2Fyb3VzZWxGcmFtZVRlbXBsYXRlXFxcIi5cIik7XG4gICAgICAgICAgICB0aGlzLmNhcm91c2VsRnJhbWVUZW1wbGF0ZSA9IG9wdGlvbnMuY2Fyb3VzZWxGcmFtZVRlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuY2Fyb3VzZWxJbWFnZVRlbXBsYXRlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLmNhcm91c2VsSW1hZ2VUZW1wbGF0ZSA9IFwiXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5jYXJvdXNlbEltYWdlVGVtcGxhdGUgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcImNhcm91c2VsSW1hZ2VUZW1wbGF0ZVxcXCIuXCIpO1xuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbEltYWdlVGVtcGxhdGUgPSBvcHRpb25zLmNhcm91c2VsSW1hZ2VUZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmNhcm91c2VsVmlkZW9UZW1wbGF0ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbFZpZGVvVGVtcGxhdGUgPSBcIlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuY2Fyb3VzZWxWaWRlb1RlbXBsYXRlICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJjYXJvdXNlbFZpZGVvVGVtcGxhdGVcXFwiLlwiKTtcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWxWaWRlb1RlbXBsYXRlID0gb3B0aW9ucy5jYXJvdXNlbFZpZGVvVGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2gob3B0aW9ucy5pbWFnZVJlc29sdXRpb24pIHtcbiAgICAgICAgICAgIGNhc2UgXCJsb3ctcmVzb2x1dGlvblwiOlxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VSZXNvbHV0aW9uID0gXCJsb3dfcmVzb2x1dGlvblwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFwic3RhbmRhcmQtcmVzb2x1dGlvblwiOlxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VSZXNvbHV0aW9uID0gXCJzdGFuZGFyZF9yZXNvbHV0aW9uXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuaW1hZ2VSZXNvbHV0aW9uID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VSZXNvbHV0aW9uID0gXCJ0aHVtYm5haWxcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYob3B0aW9ucy5nZXQgIT09IFwidGh1bWJuYWlsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwiaW1hZ2VSZXNvbHV0aW9uXFxcIi5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoKG9wdGlvbnMudmlkZW9SZXNvbHV0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIFwibG93LWJhbmR3aWR0aFwiOlxuICAgICAgICAgICAgICAgIHRoaXMudmlkZW9SZXNvbHV0aW9uID0gXCJsb3dfYmFuZHdpZHRoXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgXCJsb3ctcmVzb2x1dGlvblwiOlxuICAgICAgICAgICAgICAgIHRoaXMudmlkZW9SZXNvbHV0aW9uID0gXCJsb3dfcmVzb2x1dGlvblwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLnZpZGVvUmVzb2x1dGlvbiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZGVvUmVzb2x1dGlvbiA9IFwic3RhbmRhcmRfcmVzb2x1dGlvblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihvcHRpb25zLmdldCAhPT0gXCJzdGFuZGFyZC1yZXNvbHV0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwidmlkZW9SZXNvbHV0aW9uXFxcIi5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMucmVsYXRpdmVTY2hlbWUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpdmVTY2hlbWUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLnJlbGF0aXZlU2NoZW1lICE9PSBcImJvb2xlYW5cIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwicmVsYXRpdmVTY2hlbWVcXFwiLlwiKTtcbiAgICAgICAgICAgIHRoaXMucmVsYXRpdmVTY2hlbWUgPSBvcHRpb25zLnJlbGF0aXZlU2NoZW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMudGFyZ2V0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IFwiaW5zdGFmZWVkXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy50YXJnZXQgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcInRhcmdldFxcXCIuXCIpO1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSBvcHRpb25zLnRhcmdldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLm1vY2sgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMubW9jayA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMubW9jayAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcIm1vY2tcXFwiLlwiKTtcbiAgICAgICAgICAgIHRoaXMubW9jayA9IG9wdGlvbnMubW9jaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlsdGVyID0gdHlwZW9mIG9wdGlvbnMuZmlsdGVyID09PSBcImZ1bmN0aW9uXCIgPyBvcHRpb25zLmZpbHRlciA6IG51bGw7XG4gICAgICAgIHRoaXMub25CZWZvcmUgPSB0eXBlb2Ygb3B0aW9ucy5vbkJlZm9yZSA9PT0gXCJmdW5jdGlvblwiID8gb3B0aW9ucy5vbkJlZm9yZSA6IG51bGw7XG4gICAgICAgIHRoaXMub25BZnRlciA9IHR5cGVvZiBvcHRpb25zLm9uQWZ0ZXIgPT09IFwiZnVuY3Rpb25cIiA/IG9wdGlvbnMub25BZnRlciA6IG51bGw7XG4gICAgICAgIHRoaXMub25TdWNjZXNzID0gdHlwZW9mIG9wdGlvbnMub25TdWNjZXNzID09PSBcImZ1bmN0aW9uXCIgPyBvcHRpb25zLm9uU3VjY2VzcyA6IG51bGw7XG4gICAgICAgIHRoaXMub25FcnJvciA9IHR5cGVvZiBvcHRpb25zLm9uRXJyb3IgPT09IFwiZnVuY3Rpb25cIiA/IG9wdGlvbnMub25FcnJvciA6IG51bGw7XG4gICAgfVxuXG4gICAgSW5zdGFmZWVkLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbihuZXh0VXJsKSB7XG4gICAgICAgIGlmKHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgfHwgIXdpbmRvdykgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkUnVuRXJyb3I6IE5vIHdpbmRvdyBvYmplY3QgYXZhaWxhYmxlLlwiKTtcbiAgICAgICAgd2luZG93W3RoaXMudXVpZF0gPSB7fTtcbiAgICAgICAgd2luZG93W3RoaXMudXVpZF0ucGFyc2UgPSBwYXJzZS5iaW5kKHRoaXMpO1xuICAgICAgICBpZih0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIgfHwgIWRvY3VtZW50KSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRSdW5FcnJvcjogTm8gZG9jdW1lbnQgb2JqZWN0IGF2YWlsYWJsZS5cIik7XG4gICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICBzY3JpcHQuaWQgPSB0aGlzLnV1aWQ7XG4gICAgICAgIHNjcmlwdC5zcmMgPSBuZXh0VXJsIHx8IHRoaXMudXJsO1xuXG4gICAgICAgIHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudXVpZCkpO1xuICAgICAgICAgICAgdGhpcy5vbkVycm9yKFwiSW5zdGFmZWVkQ29ubmVjdGlvbkVycm9yOiBDb25uZWN0aW9uIHRvIEluc3RhZ3JhbSBmYWlsZWQuXCIpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgIH07XG5cbiAgICBJbnN0YWZlZWQucHJvdG90eXBlLmhhc05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dFVybC5sZW5ndGggPiAwO1xuICAgIH07XG5cbiAgICBJbnN0YWZlZWQucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYodGhpcy5oYXNOZXh0KCkpIHtcbiAgICAgICAgICAgIHRoaXMucnVuKHRoaXMubmV4dFVybCk7XG4gICAgICAgICAgICB0aGlzLm5leHRVcmwgPSBcIlwiO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHV1aWR2NCgpIHtcbiAgICAgICAgcmV0dXJuIFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSgveC9nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAoTWF0aC5yYW5kb20oKSAqIDE2IHwgMCkudG9TdHJpbmcoMTYpO1xuICAgICAgICB9KS5yZXBsYWNlKFwieVwiLCAoKE1hdGgucmFuZG9tKCkgKiAxNiB8IDApICYgMHgzIHwgMHg4KS50b1N0cmluZygxNikpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlKHJlc3BvbnNlKSB7XG4gICAgICAgIGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy51dWlkKSk7XG4gICAgICAgIGRlbGV0ZSB3aW5kb3dbdGhpcy51dWlkXTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYoIXJlc3BvbnNlIHx8ICFyZXNwb25zZS5tZXRhIHx8IHR5cGVvZiByZXNwb25zZS5tZXRhLmNvZGUgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgaWYocmVzcG9uc2UubWV0YS5jb2RlICE9PSAyMDApIHRocm93IG5ldyBFcnJvcih0eXBlb2YgcmVzcG9uc2UubWV0YS5lcnJvcl90eXBlID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiByZXNwb25zZS5tZXRhLmVycm9yX21lc3NhZ2UgPT09IFwic3RyaW5nXCIgPyBcIkluc3RhZmVlZEluc3RhZ3JhbUFQSUVycm9yOiBcXFwiXCIuY29uY2F0KHJlc3BvbnNlLm1ldGEuZXJyb3JfdHlwZSwgXCI6IFwiLCByZXNwb25zZS5tZXRhLmVycm9yX21lc3NhZ2UsIFwiXFxcIi5cIikgOiBcIkluc3RhZmVlZENvbm5lY3Rpb25FcnJvcjogQ29ubmVjdGlvbiB0byBJbnN0YWdyYW0gZmFpbGVkLlwiKTtcblxuICAgICAgICAgICAgaWYoIXRoaXMubW9jaykge1xuICAgICAgICAgICAgICAgIGlmKCFyZXNwb25zZS5kYXRhKSB0aHJvdyBuZXcgRXJyb3IoKTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc29ydCA9PT0gXCJyYW5kb21cIikge1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSByZXNwb25zZS5kYXRhLmxlbmd0aCAtIDE7IGk7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmFuZG9tVmFsdWUgPSByZXNwb25zZS5kYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YVtpXSA9IHJlc3BvbnNlLmRhdGFbcmFuZG9tSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YVtyYW5kb21JbmRleF0gPSByYW5kb21WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZih0aGlzLnNvcnQgIT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3J0QXJyYXkgPSB0aGlzLnNvcnQuc3BsaXQoXCItXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmV2ZXJzZSA9IHNvcnRBcnJheVswXSA9PT0gXCJsZWFzdFwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHk7XG5cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoKHNvcnRBcnJheVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJlY2VudFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gXCJjcmVhdGVkX3RpbWVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxpa2VkXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBcImxpa2VzLmNvdW50XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjb21tZW50ZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IFwiY29tbWVudHMuY291bnRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVBID0gZ2V0T2JqZWN0UHJvcGVydHkoYSwgcHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlQiA9IGdldE9iamVjdFByb3BlcnR5KGIsIHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlQSA9PT0gbnVsbCB8fCB2YWx1ZUIgPT09IG51bGwpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlQSA8IHZhbHVlQiBeIHJldmVyc2UgPyAxIDogLTE7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5maWx0ZXIoZGF0YSkpIGRlbGV0ZSByZXNwb25zZS5kYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhLmlkICE9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBkYXRhLnR5cGUgIT09IFwic3RyaW5nXCIgfHwgIWRhdGEudXNlciB8fCB0eXBlb2YgZGF0YS51c2VyLmlkICE9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBkYXRhLnVzZXIudXNlcm5hbWUgIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGRhdGEudXNlci5mdWxsX25hbWUgIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGRhdGEudXNlci5wcm9maWxlX3BpY3R1cmUgIT09IFwic3RyaW5nXCIgfHwgIWRhdGEuaW1hZ2VzIHx8IHR5cGVvZiBkYXRhLmZpbHRlciAhPT0gXCJzdHJpbmdcIiB8fCAhZGF0YS5saWtlcyB8fCB0eXBlb2YgZGF0YS5saWtlcy5jb3VudCAhPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgZGF0YS51c2VyX2hhc19saWtlZCAhPT0gXCJib29sZWFuXCIgfHwgIWRhdGEuY29tbWVudHMgfHwgdHlwZW9mIGRhdGEuY29tbWVudHMuY291bnQgIT09IFwibnVtYmVyXCIgfHwgIWRhdGEudGFncyB8fCB0eXBlb2YgZGF0YS5jcmVhdGVkX3RpbWUgIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGRhdGEubGluayAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlVmFsdWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGRhdGEuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBkYXRhLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IGRhdGEudXNlci5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBkYXRhLnVzZXIudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdWxsTmFtZTogZGF0YS51c2VyLmZ1bGxfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGVQaWN0dXJlOiBkYXRhLnVzZXIucHJvZmlsZV9waWN0dXJlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiBkYXRhLmZpbHRlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpa2VzOiBkYXRhLmxpa2VzLmNvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlckhhc0xpa2VkOiBkYXRhLnVzZXJfaGFzX2xpa2VkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50czogZGF0YS5jb21tZW50cy5jb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ3M6IEpTT04uc3RyaW5naWZ5KGRhdGEudGFncyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVkVGltZTogZGF0YS5jcmVhdGVkX3RpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rOiBkYXRhLmxpbmssXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDogZGF0YVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuY2FwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGRhdGEuY2FwdGlvbi50ZXh0ICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLmNhcHRpb24gPSBkYXRhLmNhcHRpb24udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLmNhcHRpb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5sb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGRhdGEubG9jYXRpb24ubmFtZSAhPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgZGF0YS5sb2NhdGlvbi5sYXRpdHVkZSAhPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgZGF0YS5sb2NhdGlvbi5sb25naXR1ZGUgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMubG9jYXRpb24gPSBkYXRhLmxvY2F0aW9uLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5sYXRpdHVkZSA9IGRhdGEubG9jYXRpb24ubGF0aXR1ZGUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLmxvbmdpdHVkZSA9IGRhdGEubG9jYXRpb24ubG9uZ2l0dWRlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5sb2NhdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5sYXRpdHVkZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5sb25naXR1ZGUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpZXdJbWFnZSA9IGRhdGEuaW1hZ2VzW3RoaXMuaW1hZ2VSZXNvbHV0aW9uXTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIXByZXZpZXdJbWFnZSB8fCB0eXBlb2YgcHJldmlld0ltYWdlLnVybCAhPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgcHJldmlld0ltYWdlLndpZHRoICE9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBwcmV2aWV3SW1hZ2UuaGVpZ2h0ICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5yZWxhdGl2ZVNjaGVtZSkgcHJldmlld0ltYWdlLnVybCA9IHByZXZpZXdJbWFnZS51cmwucmVwbGFjZSgvXmh0dHBzPzovLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlld0ltYWdlLm9yaWVudGF0aW9uID0gcHJldmlld0ltYWdlLndpZHRoID09PSBwcmV2aWV3SW1hZ2UuaGVpZ2h0ID8gXCJzcXVhcmVcIiA6IChwcmV2aWV3SW1hZ2Uud2lkdGggPiBwcmV2aWV3SW1hZ2UuaGVpZ2h0ID8gXCJsYW5kc2NhcGVcIiA6IFwicG9ydHJhaXRcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS50eXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLmltYWdlID0gcHJldmlld0ltYWdlLnVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLndpZHRoID0gcHJldmlld0ltYWdlLndpZHRoLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5oZWlnaHQgPSBwcmV2aWV3SW1hZ2UuaGVpZ2h0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5vcmllbnRhdGlvbiA9IHByZXZpZXdJbWFnZS5vcmllbnRhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFkYXRhLnVzZXJzX2luX3Bob3RvKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLnVzZXJzSW5QaG90byA9IEpTT04uc3RyaW5naWZ5KGRhdGEudXNlcnNfaW5fcGhvdG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGRpdi5pbm5lckhUTUwuY29uY2F0KHBhcnNlVGVtcGxhdGUodGhpcy5pbWFnZVRlbXBsYXRlLCB0ZW1wbGF0ZVZhbHVlcykpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMucHJldmlld0ltYWdlID0gcHJldmlld0ltYWdlLnVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLnByZXZpZXdXaWR0aCA9IHByZXZpZXdJbWFnZS53aWR0aC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMucHJldmlld0hlaWdodCA9IHByZXZpZXdJbWFnZS5oZWlnaHQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLnByZXZpZXdPcmllbnRhdGlvbiA9IHByZXZpZXdJbWFnZS5vcmllbnRhdGlvbjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS50eXBlID09PSBcInZpZGVvXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighZGF0YS52aWRlb3MpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2aWRlbyA9IGRhdGEudmlkZW9zW3RoaXMudmlkZW9SZXNvbHV0aW9uXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighdmlkZW8gfHwgdHlwZW9mIHZpZGVvLnVybCAhPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdmlkZW8ud2lkdGggIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIHZpZGVvLmhlaWdodCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMudmlkZW8gPSB0aGlzLnJlbGF0aXZlU2NoZW1lID8gdmlkZW8udXJsLnJlcGxhY2UoL15odHRwcz86LywgXCJcIikgOiB2aWRlby51cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMud2lkdGggPSB2aWRlby53aWR0aC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLmhlaWdodCA9IHZpZGVvLmhlaWdodC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLm9yaWVudGF0aW9uID0gdmlkZW8ud2lkdGggPT09IHZpZGVvLmhlaWdodCA/IFwic3F1YXJlXCIgOiAodmlkZW8ud2lkdGggPiB2aWRlby5oZWlnaHQgPyBcImxhbmRzY2FwZVwiIDogXCJwb3J0cmFpdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gZGl2LmlubmVySFRNTC5jb25jYXQocGFyc2VUZW1wbGF0ZSh0aGlzLnZpZGVvVGVtcGxhdGUsIHRlbXBsYXRlVmFsdWVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoZGF0YS50eXBlID09PSBcImNhcm91c2VsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighZGF0YS5jYXJvdXNlbF9tZWRpYSkgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMubWVkaWEgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jYXJvdXNlbF9tZWRpYS5mb3JFYWNoKGZ1bmN0aW9uKGNhcm91c2VsTWVkaWEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGNhcm91c2VsTWVkaWEudHlwZSAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBjYXJvdXNlbE1lZGlhLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2goY2Fyb3VzZWxNZWRpYS50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW1hZ2VcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighY2Fyb3VzZWxNZWRpYS5pbWFnZXMpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IGNhcm91c2VsTWVkaWEuaW1hZ2VzW3RoaXMuaW1hZ2VSZXNvbHV0aW9uXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighaW1hZ2UgfHwgdHlwZW9mIGltYWdlLnVybCAhPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaW1hZ2Uud2lkdGggIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGltYWdlLmhlaWdodCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcy5pbWFnZSA9IHRoaXMucmVsYXRpdmVTY2hlbWUgPyBpbWFnZS51cmwucmVwbGFjZSgvXmh0dHBzPzovLCBcIlwiKSA6IGltYWdlLnVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzLndpZHRoID0gaW1hZ2Uud2lkdGgudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzLmhlaWdodCA9IGltYWdlLmhlaWdodC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMub3JpZW50YXRpb24gPSBpbWFnZS53aWR0aCA9PT0gaW1hZ2UuaGVpZ2h0ID8gXCJzcXVhcmVcIiA6IChpbWFnZS53aWR0aCA+IGltYWdlLmhlaWdodCA/IFwibGFuZHNjYXBlXCIgOiBcInBvcnRyYWl0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFjYXJvdXNlbE1lZGlhLnVzZXJzX2luX3Bob3RvKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzLnVzZXJzSW5QaG90byA9IEpTT04uc3RyaW5naWZ5KGNhcm91c2VsTWVkaWEudXNlcnNfaW5fcGhvdG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLm1lZGlhID0gdGVtcGxhdGVWYWx1ZXMubWVkaWEuY29uY2F0KHBhcnNlVGVtcGxhdGUodGhpcy5jYXJvdXNlbEltYWdlVGVtcGxhdGUsIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInZpZGVvXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWNhcm91c2VsTWVkaWEudmlkZW9zKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmlkZW8gPSBjYXJvdXNlbE1lZGlhLnZpZGVvc1t0aGlzLnZpZGVvUmVzb2x1dGlvbl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXZpZGVvIHx8IHR5cGVvZiB2aWRlby51cmwgIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHZpZGVvLndpZHRoICE9PSBcIm51bWJlclwiIHx8IHR5cGVvZiB2aWRlby5oZWlnaHQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMudmlkZW8gPSB0aGlzLnJlbGF0aXZlU2NoZW1lID8gdmlkZW8udXJsLnJlcGxhY2UoL15odHRwcz86LywgXCJcIikgOiB2aWRlby51cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcy53aWR0aCA9IHZpZGVvLndpZHRoLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcy5oZWlnaHQgPSB2aWRlby5oZWlnaHQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzLm9yaWVudGF0aW9uID0gdmlkZW8ud2lkdGggPT09IHZpZGVvLmhlaWdodCA/IFwic3F1YXJlXCIgOiAodmlkZW8ud2lkdGggPiB2aWRlby5oZWlnaHQgPyBcImxhbmRzY2FwZVwiIDogXCJwb3J0cmFpdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5tZWRpYSA9IHRlbXBsYXRlVmFsdWVzLm1lZGlhLmNvbmNhdChwYXJzZVRlbXBsYXRlKHRoaXMuY2Fyb3VzZWxWaWRlb1RlbXBsYXRlLCB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBkaXYuaW5uZXJIVE1MLmNvbmNhdChwYXJzZVRlbXBsYXRlKHRoaXMuY2Fyb3VzZWxGcmFtZVRlbXBsYXRlLCB0ZW1wbGF0ZVZhbHVlcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLm9uQmVmb3JlKSB0aGlzLm9uQmVmb3JlKCk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgaWYoIXRhcmdldEVsZW1lbnQpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZFBhcnNlRXJyb3I6IE5vIHRhcmdldCBlbGVtZW50IGZvdW5kLlwiKTtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSBkaXYuY2hpbGROb2Rlcy5sZW5ndGg7IGk7IGktLSkgdGFyZ2V0RWxlbWVudC5hcHBlbmRDaGlsZChkaXYuY2hpbGROb2Rlc1swXSk7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkFmdGVyKSB0aGlzLm9uQWZ0ZXIoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYocmVzcG9uc2UucGFnaW5hdGlvbiAmJiB0eXBlb2YgcmVzcG9uc2UucGFnaW5hdGlvbi5uZXh0X3VybCA9PT0gXCJzdHJpbmdcIikgdGhpcy5uZXh0VXJsID0gcmVzcG9uc2UucGFnaW5hdGlvbi5uZXh0X3VybDtcbiAgICAgICAgICAgIGlmKHRoaXMub25TdWNjZXNzKSB0aGlzLm9uU3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgaWYodGhpcy5vbkVycm9yKSB0aGlzLm9uRXJyb3IoZS5tZXNzYWdlLmxlbmd0aCA/IGUubWVzc2FnZSA6IFwiSW5zdGFmZWVkUGFyc2VFcnJvcjogSW52YWxpZCByZXNwb25zZSBmcm9tIEluc3RhZ3JhbS5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRPYmplY3RQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgICAgIHZhciBwaWVjZXMgPSBwcm9wZXJ0eS5yZXBsYWNlKC9cXFsoXFx3KylcXF0vZywgXCIuJDFcIikuc3BsaXQoXCIuXCIpO1xuXG4gICAgICAgIHdoaWxlKHBpZWNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBwaWVjZSA9IHBpZWNlcy5zaGlmdCgpO1xuICAgICAgICAgICAgaWYob2JqZWN0ID09IG51bGwgfHwgIShwaWVjZSBpbiBvYmplY3QpKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIG9iamVjdCA9IG9iamVjdFtwaWVjZV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlVGVtcGxhdGUodGVtcGxhdGUsIHZhbHVlcykge1xuICAgICAgICB2YXIgcGF0dGVybiA9IC8oPzpcXHt7Mn0pKFxcdysoPzpcXC5cXHcrfFxcW1xcdytcXF0pKikoPzpcXH17Mn0pLztcblxuICAgICAgICB3aGlsZShwYXR0ZXJuLnRlc3QodGVtcGxhdGUpKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gdGVtcGxhdGUubWF0Y2gocGF0dGVybilbMV07XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBnZXRPYmplY3RQcm9wZXJ0eSh2YWx1ZXMsIGtleSk7XG4gICAgICAgICAgICBpZih2YWx1ZSA9PT0gbnVsbCkgdmFsdWUgPSBcIlwiO1xuXG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UocGF0dGVybiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfVxuXG4gICAgKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAgICAgaWYodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSBcIm9iamVjdFwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgICAgIGRlZmluZShmYWN0b3J5KTtcbiAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm9vdC5JbnN0YWZlZWQgPSBmYWN0b3J5KCk7XG4gICAgICAgIH1cbiAgICB9KSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEluc3RhZmVlZDtcbiAgICB9KTtcbn0uY2FsbCh0aGlzKSk7XG4iLCJ2YXIgSW5zdGFmZWVkID0gcmVxdWlyZSgnaW5zdGFmZWVkJylcclxuY29uc3QgdGVtcGxhdGUgPSBgXHJcbiAgICA8ZGl2IGNsYXNzPSdjYXJkJz4gXHJcbiAgICAgICAgPGgxPkluc3RhZmVlZDwvaDE+XHJcbiAgICAgICAgPGEgY2xhc3M9J2luc3RhZ3JhbScgaHJlZj0ne3tsaW5rfX0nPjxpbWcgc3JjPSd7e2ltYWdlfX0nIHdpZHRoPSd7e3dpZHRofX0nIGhlaWdodD0ne3toZWlnaHR9fSc+PC9hPlxyXG4gICAgPC9kaXY+XHJcbiAgICBgXHJcbnZhciBmZWVkID0gbmV3IEluc3RhZmVlZCh7XHJcbiAgICB0ZW1wbGF0ZTogJ3t7IGxpbmsgfX0nLFxyXG4gICAgLy8gdGVtcGxhdGU6IHRlbXBsYXRlLFxyXG4gICAgZ2V0OiAndXNlcicsXHJcbiAgICBhY2Nlc3NUb2tlbjogXCI2NzYyNDg2MTM2LjE3YmFiYzguY2FjNWU1ZDUzYzQ3NGQ5NDgyMTEwODI3NTQ3NjhhM2VcIixcclxuICAgIGxpbWl0OiAxMCxcclxufSk7XHJcblxyXG5mZWVkLnJ1bigpXHJcbiJdfQ==
