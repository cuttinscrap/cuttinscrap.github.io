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

},{"instafeed":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwZXJzb25hbFxcY3V0dGluc2NyYXAuZ2l0aHViLmlvXFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJDOi9wZXJzb25hbC9jdXR0aW5zY3JhcC5naXRodWIuaW8vbm9kZV9tb2R1bGVzL2luc3RhZmVlZC9saWIvaW5zdGFmZWVkLmpzIiwiQzovcGVyc29uYWwvY3V0dGluc2NyYXAuZ2l0aHViLmlvL3N0YXRpYy9lczYvZmFrZV84NjdkYTJhZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbkNvcHlyaWdodCAyMDE3IGJsYWNrQ0lDQURBXG5cbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcblxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuXG5Vbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG5kaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG5XSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbmxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuKi9cblxuOyhmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGZ1bmN0aW9uIEluc3RhZmVlZChvcHRpb25zKSB7XG4gICAgICAgIHRoaXMudXVpZCA9IFwiaW5zdGFmZWVkXCIuY29uY2F0KHV1aWR2NCgpLnJlcGxhY2UoLy0vZywgXCJcIikpO1xuICAgICAgICBpZighb3B0aW9ucykgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBNaXNzaW5nIG9wdGlvbnMuXCIpO1xuICAgICAgICB0aGlzLnVybCA9IFwiaHR0cHM6Ly9hcGkuaW5zdGFncmFtLmNvbS92MS9cIjtcblxuICAgICAgICBzd2l0Y2gob3B0aW9ucy5nZXQpIHtcbiAgICAgICAgICAgIGNhc2UgXCJ0YWdcIjpcbiAgICAgICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy50YWdOYW1lICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IE1pc3Npbmcgb3IgaW52YWxpZCBvcHRpb24gXFxcInRhZ05hbWVcXFwiLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVybCA9IHRoaXMudXJsLmNvbmNhdChcInRhZ3MvXCIsIGVuY29kZVVSSUNvbXBvbmVudChvcHRpb25zLnRhZ05hbWUpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBcImxvY2F0aW9uXCI6XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMubG9jYXRpb25JZCAhPT0gXCJzdHJpbmdcIiB8fCAhL15cXGQrJC8udGVzdChvcHRpb25zLmxvY2F0aW9uSWQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IE1pc3Npbmcgb3IgaW52YWxpZCBvcHRpb24gXFxcImxvY2F0aW9uSWRcXFwiLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVybCA9IHRoaXMudXJsLmNvbmNhdChcImxvY2F0aW9ucy9cIiwgb3B0aW9ucy5sb2NhdGlvbklkKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5nZXQgIT09IFwidW5kZWZpbmVkXCIgJiYgb3B0aW9ucy5nZXQgIT09IFwidXNlclwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJnZXRcXFwiLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVybCA9IHRoaXMudXJsLmNvbmNhdChcInVzZXJzL1wiKTtcblxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLnVzZXJJZCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVybCA9IHRoaXMudXJsLmNvbmNhdChcInNlbGZcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMudXNlcklkICE9PSBcInN0cmluZ1wiIHx8ICEvXlxcZCskLy50ZXN0KG9wdGlvbnMudXNlcklkKSkgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwidXNlcklkXFxcIi5cIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXJsID0gdGhpcy51cmwuY29uY2F0KG9wdGlvbnMudXNlcklkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5hY2Nlc3NUb2tlbiAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBNaXNzaW5nIG9yIGludmFsaWQgb3B0aW9uIFxcXCJhY2Nlc3NUb2tlblxcXCIuXCIpO1xuICAgICAgICB0aGlzLnVybCA9IHRoaXMudXJsLmNvbmNhdChcIi9tZWRpYS9yZWNlbnQ/YWNjZXNzX3Rva2VuPVwiLCBlbmNvZGVVUklDb21wb25lbnQob3B0aW9ucy5hY2Nlc3NUb2tlbiksIFwiJmNhbGxiYWNrPVwiLCB0aGlzLnV1aWQsIFwiLnBhcnNlXCIpO1xuICAgICAgICB0aGlzLm5leHRVcmwgPSBcIlwiO1xuXG4gICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmxpbWl0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5saW1pdCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwibGltaXRcXFwiLlwiKTtcbiAgICAgICAgICAgIGlmKG9wdGlvbnMubGltaXQpIHRoaXMudXJsID0gdGhpcy51cmwuY29uY2F0KFwiJmNvdW50PVwiLCBvcHRpb25zLmxpbWl0LnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuc29ydCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5zb3J0ID0gXCJub25lXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZighL14oPzpub25lfCg/Om1vc3R8bGVhc3QpLSg/OnJlY2VudHxsaWtlZHxjb21tZW50ZWQpfHJhbmRvbSkkLy50ZXN0KG9wdGlvbnMuc29ydCkpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcInNvcnRcXFwiLlwiKTtcbiAgICAgICAgICAgIHRoaXMuc29ydCA9IG9wdGlvbnMuc29ydDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmltYWdlVGVtcGxhdGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VUZW1wbGF0ZSA9IFwiPGltZyBzcmM9XFxcInt7aW1hZ2V9fVxcXCIgd2lkdGg9XFxcInt7d2lkdGh9fVxcXCIgaGVpZ2h0PVxcXCJ7e2hlaWdodH19XFxcIj5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmltYWdlVGVtcGxhdGUgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcImltYWdlVGVtcGxhdGVcXFwiLlwiKTtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VUZW1wbGF0ZSA9IG9wdGlvbnMuaW1hZ2VUZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLnZpZGVvVGVtcGxhdGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMudmlkZW9UZW1wbGF0ZSA9IFwiPGltZyBzcmM9XFxcInt7cHJldmlld0ltYWdlfX1cXFwiIHdpZHRoPVxcXCJ7e3ByZXZpZXdXaWR0aH19XFxcIiBoZWlnaHQ9XFxcInt7cHJldmlld0hlaWdodH19XFxcIj5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLnZpZGVvVGVtcGxhdGUgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcInZpZGVvVGVtcGxhdGVcXFwiLlwiKTtcbiAgICAgICAgICAgIHRoaXMudmlkZW9UZW1wbGF0ZSA9IG9wdGlvbnMudmlkZW9UZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmNhcm91c2VsRnJhbWVUZW1wbGF0ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbEZyYW1lVGVtcGxhdGUgPSBcIjxpbWcgc3JjPVxcXCJ7e3ByZXZpZXdJbWFnZX19XFxcIiB3aWR0aD1cXFwie3twcmV2aWV3V2lkdGh9fVxcXCIgaGVpZ2h0PVxcXCJ7e3ByZXZpZXdIZWlnaHR9fVxcXCI+XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5jYXJvdXNlbEZyYW1lVGVtcGxhdGUgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcImNhcm91c2VsRnJhbWVUZW1wbGF0ZVxcXCIuXCIpO1xuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbEZyYW1lVGVtcGxhdGUgPSBvcHRpb25zLmNhcm91c2VsRnJhbWVUZW1wbGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmNhcm91c2VsSW1hZ2VUZW1wbGF0ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5jYXJvdXNlbEltYWdlVGVtcGxhdGUgPSBcIlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMuY2Fyb3VzZWxJbWFnZVRlbXBsYXRlICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJjYXJvdXNlbEltYWdlVGVtcGxhdGVcXFwiLlwiKTtcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWxJbWFnZVRlbXBsYXRlID0gb3B0aW9ucy5jYXJvdXNlbEltYWdlVGVtcGxhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5jYXJvdXNlbFZpZGVvVGVtcGxhdGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2Fyb3VzZWxWaWRlb1RlbXBsYXRlID0gXCJcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmNhcm91c2VsVmlkZW9UZW1wbGF0ZSAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkT3B0aW9uc0Vycm9yOiBJbnZhbGlkIG9wdGlvbiBcXFwiY2Fyb3VzZWxWaWRlb1RlbXBsYXRlXFxcIi5cIik7XG4gICAgICAgICAgICB0aGlzLmNhcm91c2VsVmlkZW9UZW1wbGF0ZSA9IG9wdGlvbnMuY2Fyb3VzZWxWaWRlb1RlbXBsYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoKG9wdGlvbnMuaW1hZ2VSZXNvbHV0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIFwibG93LXJlc29sdXRpb25cIjpcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlUmVzb2x1dGlvbiA9IFwibG93X3Jlc29sdXRpb25cIjtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBcInN0YW5kYXJkLXJlc29sdXRpb25cIjpcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlUmVzb2x1dGlvbiA9IFwic3RhbmRhcmRfcmVzb2x1dGlvblwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmltYWdlUmVzb2x1dGlvbiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmltYWdlUmVzb2x1dGlvbiA9IFwidGh1bWJuYWlsXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKG9wdGlvbnMuZ2V0ICE9PSBcInRodW1ibmFpbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcImltYWdlUmVzb2x1dGlvblxcXCIuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaChvcHRpb25zLnZpZGVvUmVzb2x1dGlvbikge1xuICAgICAgICAgICAgY2FzZSBcImxvdy1iYW5kd2lkdGhcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnZpZGVvUmVzb2x1dGlvbiA9IFwibG93X2JhbmR3aWR0aFwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFwibG93LXJlc29sdXRpb25cIjpcbiAgICAgICAgICAgICAgICB0aGlzLnZpZGVvUmVzb2x1dGlvbiA9IFwibG93X3Jlc29sdXRpb25cIjtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy52aWRlb1Jlc29sdXRpb24gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52aWRlb1Jlc29sdXRpb24gPSBcInN0YW5kYXJkX3Jlc29sdXRpb25cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYob3B0aW9ucy5nZXQgIT09IFwic3RhbmRhcmQtcmVzb2x1dGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcInZpZGVvUmVzb2x1dGlvblxcXCIuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLnJlbGF0aXZlU2NoZW1lID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGF0aXZlU2NoZW1lID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5yZWxhdGl2ZVNjaGVtZSAhPT0gXCJib29sZWFuXCIpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZE9wdGlvbnNFcnJvcjogSW52YWxpZCBvcHRpb24gXFxcInJlbGF0aXZlU2NoZW1lXFxcIi5cIik7XG4gICAgICAgICAgICB0aGlzLnJlbGF0aXZlU2NoZW1lID0gb3B0aW9ucy5yZWxhdGl2ZVNjaGVtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLnRhcmdldCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSBcImluc3RhZmVlZFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYodHlwZW9mIG9wdGlvbnMudGFyZ2V0ICE9PSBcInN0cmluZ1wiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJ0YXJnZXRcXFwiLlwiKTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gb3B0aW9ucy50YXJnZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5tb2NrID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLm1vY2sgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLm1vY2sgIT09IFwiYm9vbGVhblwiKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRPcHRpb25zRXJyb3I6IEludmFsaWQgb3B0aW9uIFxcXCJtb2NrXFxcIi5cIik7XG4gICAgICAgICAgICB0aGlzLm1vY2sgPSBvcHRpb25zLm1vY2s7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpbHRlciA9IHR5cGVvZiBvcHRpb25zLmZpbHRlciA9PT0gXCJmdW5jdGlvblwiID8gb3B0aW9ucy5maWx0ZXIgOiBudWxsO1xuICAgICAgICB0aGlzLm9uQmVmb3JlID0gdHlwZW9mIG9wdGlvbnMub25CZWZvcmUgPT09IFwiZnVuY3Rpb25cIiA/IG9wdGlvbnMub25CZWZvcmUgOiBudWxsO1xuICAgICAgICB0aGlzLm9uQWZ0ZXIgPSB0eXBlb2Ygb3B0aW9ucy5vbkFmdGVyID09PSBcImZ1bmN0aW9uXCIgPyBvcHRpb25zLm9uQWZ0ZXIgOiBudWxsO1xuICAgICAgICB0aGlzLm9uU3VjY2VzcyA9IHR5cGVvZiBvcHRpb25zLm9uU3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiID8gb3B0aW9ucy5vblN1Y2Nlc3MgOiBudWxsO1xuICAgICAgICB0aGlzLm9uRXJyb3IgPSB0eXBlb2Ygb3B0aW9ucy5vbkVycm9yID09PSBcImZ1bmN0aW9uXCIgPyBvcHRpb25zLm9uRXJyb3IgOiBudWxsO1xuICAgIH1cblxuICAgIEluc3RhZmVlZC5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24obmV4dFVybCkge1xuICAgICAgICBpZih0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiIHx8ICF3aW5kb3cpIHRocm93IG5ldyBFcnJvcihcIkluc3RhZmVlZFJ1bkVycm9yOiBObyB3aW5kb3cgb2JqZWN0IGF2YWlsYWJsZS5cIik7XG4gICAgICAgIHdpbmRvd1t0aGlzLnV1aWRdID0ge307XG4gICAgICAgIHdpbmRvd1t0aGlzLnV1aWRdLnBhcnNlID0gcGFyc2UuYmluZCh0aGlzKTtcbiAgICAgICAgaWYodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiIHx8ICFkb2N1bWVudCkgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFmZWVkUnVuRXJyb3I6IE5vIGRvY3VtZW50IG9iamVjdCBhdmFpbGFibGUuXCIpO1xuICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgc2NyaXB0LmlkID0gdGhpcy51dWlkO1xuICAgICAgICBzY3JpcHQuc3JjID0gbmV4dFVybCB8fCB0aGlzLnVybDtcblxuICAgICAgICBzY3JpcHQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnV1aWQpKTtcbiAgICAgICAgICAgIHRoaXMub25FcnJvcihcIkluc3RhZmVlZENvbm5lY3Rpb25FcnJvcjogQ29ubmVjdGlvbiB0byBJbnN0YWdyYW0gZmFpbGVkLlwiKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9O1xuXG4gICAgSW5zdGFmZWVkLnByb3RvdHlwZS5oYXNOZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5leHRVcmwubGVuZ3RoID4gMDtcbiAgICB9O1xuXG4gICAgSW5zdGFmZWVkLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMuaGFzTmV4dCgpKSB7XG4gICAgICAgICAgICB0aGlzLnJ1bih0aGlzLm5leHRVcmwpO1xuICAgICAgICAgICAgdGhpcy5uZXh0VXJsID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiB1dWlkdjQoKSB7XG4gICAgICAgIHJldHVybiBcInh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eFwiLnJlcGxhY2UoL3gvZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiAxNiB8IDApLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgfSkucmVwbGFjZShcInlcIiwgKChNYXRoLnJhbmRvbSgpICogMTYgfCAwKSAmIDB4MyB8IDB4OCkudG9TdHJpbmcoMTYpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZShyZXNwb25zZSkge1xuICAgICAgICBkb2N1bWVudC5oZWFkLnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudXVpZCkpO1xuICAgICAgICBkZWxldGUgd2luZG93W3RoaXMudXVpZF07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmKCFyZXNwb25zZSB8fCAhcmVzcG9uc2UubWV0YSB8fCB0eXBlb2YgcmVzcG9uc2UubWV0YS5jb2RlICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLm1ldGEuY29kZSAhPT0gMjAwKSB0aHJvdyBuZXcgRXJyb3IodHlwZW9mIHJlc3BvbnNlLm1ldGEuZXJyb3JfdHlwZSA9PT0gXCJzdHJpbmdcIiAmJiB0eXBlb2YgcmVzcG9uc2UubWV0YS5lcnJvcl9tZXNzYWdlID09PSBcInN0cmluZ1wiID8gXCJJbnN0YWZlZWRJbnN0YWdyYW1BUElFcnJvcjogXFxcIlwiLmNvbmNhdChyZXNwb25zZS5tZXRhLmVycm9yX3R5cGUsIFwiOiBcIiwgcmVzcG9uc2UubWV0YS5lcnJvcl9tZXNzYWdlLCBcIlxcXCIuXCIpIDogXCJJbnN0YWZlZWRDb25uZWN0aW9uRXJyb3I6IENvbm5lY3Rpb24gdG8gSW5zdGFncmFtIGZhaWxlZC5cIik7XG5cbiAgICAgICAgICAgIGlmKCF0aGlzLm1vY2spIHtcbiAgICAgICAgICAgICAgICBpZighcmVzcG9uc2UuZGF0YSkgdGhyb3cgbmV3IEVycm9yKCk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLnNvcnQgPT09IFwicmFuZG9tXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gcmVzcG9uc2UuZGF0YS5sZW5ndGggLSAxOyBpOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmRvbVZhbHVlID0gcmVzcG9uc2UuZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGFbaV0gPSByZXNwb25zZS5kYXRhW3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGFbcmFuZG9tSW5kZXhdID0gcmFuZG9tVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYodGhpcy5zb3J0ICE9PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc29ydEFycmF5ID0gdGhpcy5zb3J0LnNwbGl0KFwiLVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldmVyc2UgPSBzb3J0QXJyYXlbMF0gPT09IFwibGVhc3RcIjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5O1xuXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaChzb3J0QXJyYXlbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyZWNlbnRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IFwiY3JlYXRlZF90aW1lXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJsaWtlZFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gXCJsaWtlcy5jb3VudFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY29tbWVudGVkXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBcImNvbW1lbnRzLmNvdW50XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlQSA9IGdldE9iamVjdFByb3BlcnR5KGEsIHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZUIgPSBnZXRPYmplY3RQcm9wZXJ0eShiLCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZUEgPT09IG51bGwgfHwgdmFsdWVCID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZUEgPCB2YWx1ZUIgXiByZXZlcnNlID8gMSA6IC0xO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLmZpbHRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0YSwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuZmlsdGVyKGRhdGEpKSBkZWxldGUgcmVzcG9uc2UuZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLmZvckVhY2goZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgZGF0YS5pZCAhPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgZGF0YS50eXBlICE9PSBcInN0cmluZ1wiIHx8ICFkYXRhLnVzZXIgfHwgdHlwZW9mIGRhdGEudXNlci5pZCAhPT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgZGF0YS51c2VyLnVzZXJuYW1lICE9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBkYXRhLnVzZXIuZnVsbF9uYW1lICE9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBkYXRhLnVzZXIucHJvZmlsZV9waWN0dXJlICE9PSBcInN0cmluZ1wiIHx8ICFkYXRhLmltYWdlcyB8fCB0eXBlb2YgZGF0YS5maWx0ZXIgIT09IFwic3RyaW5nXCIgfHwgIWRhdGEubGlrZXMgfHwgdHlwZW9mIGRhdGEubGlrZXMuY291bnQgIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGRhdGEudXNlcl9oYXNfbGlrZWQgIT09IFwiYm9vbGVhblwiIHx8ICFkYXRhLmNvbW1lbnRzIHx8IHR5cGVvZiBkYXRhLmNvbW1lbnRzLmNvdW50ICE9PSBcIm51bWJlclwiIHx8ICFkYXRhLnRhZ3MgfHwgdHlwZW9mIGRhdGEuY3JlYXRlZF90aW1lICE9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBkYXRhLmxpbmsgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcigpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZVZhbHVlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBkYXRhLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZGF0YS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiBkYXRhLnVzZXIuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogZGF0YS51c2VyLnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbE5hbWU6IGRhdGEudXNlci5mdWxsX25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlUGljdHVyZTogZGF0YS51c2VyLnByb2ZpbGVfcGljdHVyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogZGF0YS5maWx0ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaWtlczogZGF0YS5saWtlcy5jb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJIYXNMaWtlZDogZGF0YS51c2VyX2hhc19saWtlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudHM6IGRhdGEuY29tbWVudHMuY291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdzOiBKU09OLnN0cmluZ2lmeShkYXRhLnRhZ3MpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlZFRpbWU6IGRhdGEuY3JlYXRlZF90aW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluazogZGF0YS5saW5rLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWw6IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmNhcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhLmNhcHRpb24udGV4dCAhPT0gXCJzdHJpbmdcIikgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5jYXB0aW9uID0gZGF0YS5jYXB0aW9uLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5jYXB0aW9uID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEubG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhLmxvY2F0aW9uLm5hbWUgIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGRhdGEubG9jYXRpb24ubGF0aXR1ZGUgIT09IFwibnVtYmVyXCIgfHwgdHlwZW9mIGRhdGEubG9jYXRpb24ubG9uZ2l0dWRlICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLmxvY2F0aW9uID0gZGF0YS5sb2NhdGlvbi5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMubGF0aXR1ZGUgPSBkYXRhLmxvY2F0aW9uLmxhdGl0dWRlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5sb25naXR1ZGUgPSBkYXRhLmxvY2F0aW9uLmxvbmdpdHVkZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMubG9jYXRpb24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMubGF0aXR1ZGUgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMubG9uZ2l0dWRlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmV2aWV3SW1hZ2UgPSBkYXRhLmltYWdlc1t0aGlzLmltYWdlUmVzb2x1dGlvbl07XG4gICAgICAgICAgICAgICAgICAgIGlmKCFwcmV2aWV3SW1hZ2UgfHwgdHlwZW9mIHByZXZpZXdJbWFnZS51cmwgIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHByZXZpZXdJbWFnZS53aWR0aCAhPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgcHJldmlld0ltYWdlLmhlaWdodCAhPT0gXCJudW1iZXJcIikgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMucmVsYXRpdmVTY2hlbWUpIHByZXZpZXdJbWFnZS51cmwgPSBwcmV2aWV3SW1hZ2UudXJsLnJlcGxhY2UoL15odHRwcz86LywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXdJbWFnZS5vcmllbnRhdGlvbiA9IHByZXZpZXdJbWFnZS53aWR0aCA9PT0gcHJldmlld0ltYWdlLmhlaWdodCA/IFwic3F1YXJlXCIgOiAocHJldmlld0ltYWdlLndpZHRoID4gcHJldmlld0ltYWdlLmhlaWdodCA/IFwibGFuZHNjYXBlXCIgOiBcInBvcnRyYWl0XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEudHlwZSA9PT0gXCJpbWFnZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5pbWFnZSA9IHByZXZpZXdJbWFnZS51cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy53aWR0aCA9IHByZXZpZXdJbWFnZS53aWR0aC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMuaGVpZ2h0ID0gcHJldmlld0ltYWdlLmhlaWdodC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMub3JpZW50YXRpb24gPSBwcmV2aWV3SW1hZ2Uub3JpZW50YXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighZGF0YS51c2Vyc19pbl9waG90bykgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy51c2Vyc0luUGhvdG8gPSBKU09OLnN0cmluZ2lmeShkYXRhLnVzZXJzX2luX3Bob3RvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdi5pbm5lckhUTUwgPSBkaXYuaW5uZXJIVE1MLmNvbmNhdChwYXJzZVRlbXBsYXRlKHRoaXMuaW1hZ2VUZW1wbGF0ZSwgdGVtcGxhdGVWYWx1ZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLnByZXZpZXdJbWFnZSA9IHByZXZpZXdJbWFnZS51cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5wcmV2aWV3V2lkdGggPSBwcmV2aWV3SW1hZ2Uud2lkdGgudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLnByZXZpZXdIZWlnaHQgPSBwcmV2aWV3SW1hZ2UuaGVpZ2h0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5wcmV2aWV3T3JpZW50YXRpb24gPSBwcmV2aWV3SW1hZ2Uub3JpZW50YXRpb247XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEudHlwZSA9PT0gXCJ2aWRlb1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWRhdGEudmlkZW9zKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmlkZW8gPSBkYXRhLnZpZGVvc1t0aGlzLnZpZGVvUmVzb2x1dGlvbl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXZpZGVvIHx8IHR5cGVvZiB2aWRlby51cmwgIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHZpZGVvLndpZHRoICE9PSBcIm51bWJlclwiIHx8IHR5cGVvZiB2aWRlby5oZWlnaHQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLnZpZGVvID0gdGhpcy5yZWxhdGl2ZVNjaGVtZSA/IHZpZGVvLnVybC5yZXBsYWNlKC9eaHR0cHM/Oi8sIFwiXCIpIDogdmlkZW8udXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLndpZHRoID0gdmlkZW8ud2lkdGgudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5oZWlnaHQgPSB2aWRlby5oZWlnaHQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5vcmllbnRhdGlvbiA9IHZpZGVvLndpZHRoID09PSB2aWRlby5oZWlnaHQgPyBcInNxdWFyZVwiIDogKHZpZGVvLndpZHRoID4gdmlkZW8uaGVpZ2h0ID8gXCJsYW5kc2NhcGVcIiA6IFwicG9ydHJhaXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IGRpdi5pbm5lckhUTUwuY29uY2F0KHBhcnNlVGVtcGxhdGUodGhpcy52aWRlb1RlbXBsYXRlLCB0ZW1wbGF0ZVZhbHVlcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGRhdGEudHlwZSA9PT0gXCJjYXJvdXNlbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWRhdGEuY2Fyb3VzZWxfbWVkaWEpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVmFsdWVzLm1lZGlhID0gXCJcIjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY2Fyb3VzZWxfbWVkaWEuZm9yRWFjaChmdW5jdGlvbihjYXJvdXNlbE1lZGlhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBjYXJvdXNlbE1lZGlhLnR5cGUgIT09IFwic3RyaW5nXCIpIHRocm93IG5ldyBFcnJvcigpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogY2Fyb3VzZWxNZWRpYS50eXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoKGNhcm91c2VsTWVkaWEudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImltYWdlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWNhcm91c2VsTWVkaWEuaW1hZ2VzKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBjYXJvdXNlbE1lZGlhLmltYWdlc1t0aGlzLmltYWdlUmVzb2x1dGlvbl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWltYWdlIHx8IHR5cGVvZiBpbWFnZS51cmwgIT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGltYWdlLndpZHRoICE9PSBcIm51bWJlclwiIHx8IHR5cGVvZiBpbWFnZS5oZWlnaHQgIT09IFwibnVtYmVyXCIpIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMuaW1hZ2UgPSB0aGlzLnJlbGF0aXZlU2NoZW1lID8gaW1hZ2UudXJsLnJlcGxhY2UoL15odHRwcz86LywgXCJcIikgOiBpbWFnZS51cmw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcy53aWR0aCA9IGltYWdlLndpZHRoLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcy5oZWlnaHQgPSBpbWFnZS5oZWlnaHQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzLm9yaWVudGF0aW9uID0gaW1hZ2Uud2lkdGggPT09IGltYWdlLmhlaWdodCA/IFwic3F1YXJlXCIgOiAoaW1hZ2Uud2lkdGggPiBpbWFnZS5oZWlnaHQgPyBcImxhbmRzY2FwZVwiIDogXCJwb3J0cmFpdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighY2Fyb3VzZWxNZWRpYS51c2Vyc19pbl9waG90bykgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcy51c2Vyc0luUGhvdG8gPSBKU09OLnN0cmluZ2lmeShjYXJvdXNlbE1lZGlhLnVzZXJzX2luX3Bob3RvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVZhbHVlcy5tZWRpYSA9IHRlbXBsYXRlVmFsdWVzLm1lZGlhLmNvbmNhdChwYXJzZVRlbXBsYXRlKHRoaXMuY2Fyb3VzZWxJbWFnZVRlbXBsYXRlLCB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ2aWRlb1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFjYXJvdXNlbE1lZGlhLnZpZGVvcykgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZpZGVvID0gY2Fyb3VzZWxNZWRpYS52aWRlb3NbdGhpcy52aWRlb1Jlc29sdXRpb25dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF2aWRlbyB8fCB0eXBlb2YgdmlkZW8udXJsICE9PSBcInN0cmluZ1wiIHx8IHR5cGVvZiB2aWRlby53aWR0aCAhPT0gXCJudW1iZXJcIiB8fCB0eXBlb2YgdmlkZW8uaGVpZ2h0ICE9PSBcIm51bWJlclwiKSB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZUNhcm91c2VsTWVkaWFsVmFsdWVzLnZpZGVvID0gdGhpcy5yZWxhdGl2ZVNjaGVtZSA/IHZpZGVvLnVybC5yZXBsYWNlKC9eaHR0cHM/Oi8sIFwiXCIpIDogdmlkZW8udXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMud2lkdGggPSB2aWRlby53aWR0aC50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlQ2Fyb3VzZWxNZWRpYWxWYWx1ZXMuaGVpZ2h0ID0gdmlkZW8uaGVpZ2h0LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcy5vcmllbnRhdGlvbiA9IHZpZGVvLndpZHRoID09PSB2aWRlby5oZWlnaHQgPyBcInNxdWFyZVwiIDogKHZpZGVvLndpZHRoID4gdmlkZW8uaGVpZ2h0ID8gXCJsYW5kc2NhcGVcIiA6IFwicG9ydHJhaXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVWYWx1ZXMubWVkaWEgPSB0ZW1wbGF0ZVZhbHVlcy5tZWRpYS5jb25jYXQocGFyc2VUZW1wbGF0ZSh0aGlzLmNhcm91c2VsVmlkZW9UZW1wbGF0ZSwgdGVtcGxhdGVDYXJvdXNlbE1lZGlhbFZhbHVlcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gZGl2LmlubmVySFRNTC5jb25jYXQocGFyc2VUZW1wbGF0ZSh0aGlzLmNhcm91c2VsRnJhbWVUZW1wbGF0ZSwgdGVtcGxhdGVWYWx1ZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5vbkJlZm9yZSkgdGhpcy5vbkJlZm9yZSgpO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXQpO1xuICAgICAgICAgICAgICAgIGlmKCF0YXJnZXRFbGVtZW50KSB0aHJvdyBuZXcgRXJyb3IoXCJJbnN0YWZlZWRQYXJzZUVycm9yOiBObyB0YXJnZXQgZWxlbWVudCBmb3VuZC5cIik7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gZGl2LmNoaWxkTm9kZXMubGVuZ3RoOyBpOyBpLS0pIHRhcmdldEVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2LmNoaWxkTm9kZXNbMF0pO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMub25BZnRlcikgdGhpcy5vbkFmdGVyKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHJlc3BvbnNlLnBhZ2luYXRpb24gJiYgdHlwZW9mIHJlc3BvbnNlLnBhZ2luYXRpb24ubmV4dF91cmwgPT09IFwic3RyaW5nXCIpIHRoaXMubmV4dFVybCA9IHJlc3BvbnNlLnBhZ2luYXRpb24ubmV4dF91cmw7XG4gICAgICAgICAgICBpZih0aGlzLm9uU3VjY2VzcykgdGhpcy5vblN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGlmKHRoaXMub25FcnJvcikgdGhpcy5vbkVycm9yKGUubWVzc2FnZS5sZW5ndGggPyBlLm1lc3NhZ2UgOiBcIkluc3RhZmVlZFBhcnNlRXJyb3I6IEludmFsaWQgcmVzcG9uc2UgZnJvbSBJbnN0YWdyYW0uXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0T2JqZWN0UHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgICAgICB2YXIgcGllY2VzID0gcHJvcGVydHkucmVwbGFjZSgvXFxbKFxcdyspXFxdL2csIFwiLiQxXCIpLnNwbGl0KFwiLlwiKTtcblxuICAgICAgICB3aGlsZShwaWVjZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgcGllY2UgPSBwaWVjZXMuc2hpZnQoKTtcbiAgICAgICAgICAgIGlmKG9iamVjdCA9PSBudWxsIHx8ICEocGllY2UgaW4gb2JqZWN0KSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBvYmplY3QgPSBvYmplY3RbcGllY2VdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVRlbXBsYXRlKHRlbXBsYXRlLCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSAvKD86XFx7ezJ9KShcXHcrKD86XFwuXFx3K3xcXFtcXHcrXFxdKSopKD86XFx9ezJ9KS87XG5cbiAgICAgICAgd2hpbGUocGF0dGVybi50ZXN0KHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgdmFyIGtleSA9IHRlbXBsYXRlLm1hdGNoKHBhdHRlcm4pWzFdO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gZ2V0T2JqZWN0UHJvcGVydHkodmFsdWVzLCBrZXkpO1xuICAgICAgICAgICAgaWYodmFsdWUgPT09IG51bGwpIHZhbHVlID0gXCJcIjtcblxuICAgICAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKHBhdHRlcm4sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH1cblxuICAgIChmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gICAgICAgIGlmKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gXCJvYmplY3RcIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgICAgICBkZWZpbmUoZmFjdG9yeSk7XG4gICAgICAgIH0gZWxzZSBpZih0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJvb3QuSW5zdGFmZWVkID0gZmFjdG9yeSgpO1xuICAgICAgICB9XG4gICAgfSkodGhpcywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBJbnN0YWZlZWQ7XG4gICAgfSk7XG59LmNhbGwodGhpcykpO1xuIiwidmFyIEluc3RhZmVlZCA9IHJlcXVpcmUoJ2luc3RhZmVlZCcpXHJcbmNvbnN0IHRlbXBsYXRlID0gYFxyXG4gICAgPGRpdiBjbGFzcz0nY2FyZCc+IFxyXG4gICAgICAgIDxoMT5JbnN0YWZlZWQ8L2gxPlxyXG4gICAgICAgIDxhIGNsYXNzPSdpbnN0YWdyYW0nIGhyZWY9J3t7bGlua319Jz48aW1nIHNyYz0ne3tpbWFnZX19JyB3aWR0aD0ne3t3aWR0aH19JyBoZWlnaHQ9J3t7aGVpZ2h0fX0nPjwvYT5cclxuICAgIDwvZGl2PlxyXG4gICAgYFxyXG52YXIgZmVlZCA9IG5ldyBJbnN0YWZlZWQoe1xyXG4gICAgdGVtcGxhdGU6ICd7eyBsaW5rIH19JyxcclxuICAgIGdldDogJ3VzZXInLFxyXG4gICAgYWNjZXNzVG9rZW46IFwiNjc2MjQ4NjEzNi4xN2JhYmM4LmNhYzVlNWQ1M2M0NzRkOTQ4MjExMDgyNzU0NzY4YTNlXCIsXHJcbiAgICBsaW1pdDogNCxcclxufSk7XHJcblxyXG5mZWVkLnJ1bigpXHJcbiJdfQ==
