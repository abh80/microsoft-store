"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requester = require("./requester");
const config = require("./config");
const cheerio = require("cheerio");
/// <reference types="node" />
class MsStore {
    constructor() {
        this.version = require("./package.json").version;
    }
    async search(query, platform, limit) {
        const html = await requester.get(config.searchurl + encodeURIComponent(query) + `&devicetype=${platform}`);
        return new Promise((resolve, reject) => {
            if (!query)
                reject("No search query was provided");
            if (!platform)
                reject("No platform was provided");
            if (platform !== "xbox" && platform !== "pc")
                reject("Invalid platform");
            const $ = cheerio.load(html);
            let base = [];
            $("h3").each(function (i, elem) {
                base[i] = { name: $(this).text(), withGamepass: false, url: null };
            });
            // checking if the game is available with gamepass
            $("div.c-channel-placement-price div span span span.x-screen-reader").each(function (i, elem) {
                base[i].withGamepass = true;
            });
            // adding price
            $("div.c-channel-placement-price div span span[itemprop=price]").each(function (i, elem) {
                let price = null;
                if ($(this).attr("content") === 'aria-hidden="false"')
                    price = "Not available";
                else if ($(this).attr("content") === "Included")
                    price = "Included with Game Pass";
                else
                    price = $(this).attr("content");
                base[i].price = price;
            });
            // href for getting individual product details later
            $("#productPlacementList div div.c-group.f-wrap-items.context-list-page div a").each(function (i, elem) {
                base[i].url = "https://www.microsoft.com" + $(this).attr("href");
            });
            if (limit && limit <= 0)
                reject("Limit should be greater than zero (0)");
            if (limit && isNaN(limit))
                reject("Limits can be blank but not something other than digit");
            if (limit)
                return resolve(base.splice(0, limit));
            resolve(base);
        });
    }
    async get(url, system_requirements) {
        const html = await requester.get(url);
        return new Promise((resolve, reject) => {
            if (!url)
                reject("No url was provided");
            const $ = cheerio.load(html);
            // the object which will be output
            let out = {
                name: $("h1").first().text(),
                img: $("#dynamicImage_image_picture img").attr("src"),
                publisher: $("#publisher div span").text(),
                rating: $("#maturityRatings div a").text(),
                rating_description: $("#maturityRatings div a").attr("aria-label"),
                category: $("#category div a").text(),
                bg: $("#dynamicImage_backgroundImage_picture img").attr("src"),
                price: $("#ProductPrice_productPrice_PriceContainer span.price-disclaimer span").text(),
            };
            if (!out.bg) {
                //checking if the bg is a video
                // so this condition is true now we will load a static image of the video
                out.bg = $("#trailer div div").attr("data-player-data");
                out.bg = "https:" + JSON.parse(out.bg).metadata.posterframeUrl;
            }
            if (system_requirements) {
                //some simple brain things
                out.system_requirements = { minimum: [], recommended: [] };
                $("#system-requirements div div div table tbody tr th").each(function (i, elem) {
                    if (!out.system_requirements.minimum
                        .map((x) => x.type)
                        .includes($(this).text())) {
                        out.system_requirements.minimum[i] = { type: $(this).text() };
                    }
                    else {
                        out.system_requirements.recommended[i - out.system_requirements.minimum.length] = {
                            type: $(this).text(),
                        };
                    }
                });
                $("#system-requirements div div div table tbody tr td").each(function (i, elem) {
                    if (i < out.system_requirements.minimum.length) {
                        out.system_requirements.minimum[i].value = $(this).text();
                    }
                    else {
                        out.system_requirements.recommended[i - out.system_requirements.minimum.length].value = $(this).text();
                    }
                });
                resolve(out);
            }
        });
    }
}
exports.default = MsStore;
//# sourceMappingURL=msStore.js.map