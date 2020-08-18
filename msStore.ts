import * as requester from "./requester";
import * as config from "./config";
const cheerio = require("cheerio");
interface searchReturn {
  name: string;
  withGamepass: boolean;
  url: string;
  price?: string;
}
interface getReturn {
  name: string;
  img: string;
  publisher: string;
  rating: string;
  rating_description: string;
  price: string;
  system_requirements?: {
    minimum: any[];
    recommended: any[];
  };
}
/// <reference types="node" />
export default class MsStore {
  version: string;
  constructor() {
    this.version = require("./package.json").version;
  }
  async search(
    query: string,
    platform: config.platform,
    limit?: number
  ): Promise<searchReturn[]> {
    const html = await requester.get(
      config.searchurl + encodeURIComponent(query) + `&devicetype=${platform}`
    );
    return new Promise((resolve, reject) => {
      if (!query) reject("No search query was provided");
      if (!platform) reject("No platform was provided");
      if (platform !== "xbox" && platform !== "pc") reject("Invalid platform");
      const $ = cheerio.load(html);
      let base: config.searchObj[] = [];
      $("h3").each(function (i, elem) {
        base[i] = { name: $(this).text(), withGamepass: false, url: null };
      });
      // checking if the game is available with gamepass
      $(
        "div.c-channel-placement-price div span span span.x-screen-reader"
      ).each(function (i, elem) {
        base[i].withGamepass = true;
      });
      // adding price
      $("div.c-channel-placement-price div span span[itemprop=price]").each(
        function (i, elem) {
          let price = null;
          if ($(this).attr("content") === 'aria-hidden="false"')
            price = "Not available";
          else if ($(this).attr("content") === "Included")
            price = "Included with Game Pass";
          else price = $(this).attr("content");
          base[i].price = price;
        }
      );
      // href for getting individual product details later
      $(
        "#productPlacementList div div.c-group.f-wrap-items.context-list-page div a"
      ).each(function (i, elem) {
        base[i].url = "https://www.microsoft.com" + $(this).attr("href");
      });
      if (limit && limit <= 0) reject("Limit should be greater than zero (0)");
      if (limit && isNaN(limit))
        reject("Limits can be blank but not something other than digit");
      if (limit) return resolve(base.splice(0, limit));
      resolve(base);
    });
  }
  async get(url: string, system_requirements?: boolean): Promise<getReturn> {
    const html = await requester.get(url);
    return new Promise((resolve, reject) => {
      if (!url) reject("No url was provided");
      const $ = cheerio.load(html);
      // the object which will be output
      const out: getReturn = {
        name: $("h1").first().text(),
        img: $("#dynamicImage_image_picture img").attr("src"),
        publisher: $("#publisher div span").text(),
        rating: $("#maturityRatings div a").text(),
        rating_description: $("#maturityRatings div a").attr("aria-label"),
        price: $(
          "#ProductPrice_productPrice_PriceContainer span.price-disclaimer span"
        ).text(),
      };
      if (system_requirements) {
        //some simple brain things
        out.system_requirements = { minimum: [], recommended: [] };
        $("#system-requirements div div div table tbody tr th").each(function (
          i,
          elem
        ) {
          if (i <= 8) {
            out.system_requirements.minimum[i] = { type: $(this).text() };
          } else {
            out.system_requirements.recommended[i - 9] = {
              type: $(this).text(),
            };
          }
        });
        $("#system-requirements div div div table tbody tr td").each(function (
          i,
          elem
        ) {
          if (i <= 8) {
            out.system_requirements.minimum[i].value = $(this).text();
          } else {
            out.system_requirements.recommended[i - 9].value = $(this).text();
          }
        });
        resolve(out);
      }
    });
  }
}
