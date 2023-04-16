import { readFile, writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";
import getUrls from "get-urls";
import groupBy from "just-group-by";
import { default as scrapbox, type Page } from "./scrapbox/index.js";
import { progress } from "./utils.js";

const extractUrls = (
  texts: Array<{
    articleUrl: string;
    text: string;
  }>
) => {
  const urls = texts.flatMap(({ articleUrl, text }) => {
    const extractedUrls = new Set(
      text.split("]").flatMap((t) => {
        return Array.from(
          getUrls(t, {
            stripWWW: false,
            removeTrailingSlash: false,
            removeSingleSlash: false,
            sortQueryParameters: false,
          })
        );
      })
    );

    const convolutes = Array.from(extractedUrls).map((url) => {
      if (url.endsWith("]")) url = url.slice(0, -1);

      return {
        articleUrl,
        url,
      };
    });

    return convolutes;
  });

  const groupByUrl = groupBy(urls, ({ url }) => url);

  return groupByUrl;
};

const isAliveUrl = async (url: string) => {
  try {
    const METHOD_NOT_ALLOWED = 405;

    let response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "PostmanRuntime/7.28.4",
        "accept-language": "ja",
      },
    });
    if (response.status === METHOD_NOT_ALLOWED) {
      response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "PostmanRuntime/7.28.4",
          "accept-language": "ja",
        },
      });
    }

    return response.ok;
  } catch (error) {
    if (error instanceof Error) {
      // @ts-expect-error
      if (error.cause?.code === "UND_ERR_CONNECT_TIMEOUT") {
        return false;
      }
    }
    console.error(error);
    return false;
  }
};

const main = async () => {
  console.log("Start Scrapbox URL Living Checker !");

  try {
    // const { pages } = await scrapbox.getPages();
    // console.log("\nFetched Scrapbox Pages");

    // const pageTitles = pages.map(({ title }) => title).slice(35, 39);
    // const pageTitles = pages.map(({ title }) => title);
    const pageTitles = [
      "BLTouchの導入方法",
      "Fusion_360でSVGを出力する",
      "イベントの開き方",
    ];

    console.log("\nStart Fetch Scrapbox Articles");

    const responses: Page[] = [];
    const l = pageTitles.length;
    for (let i = 0; i < l; i++) {
      const title = pageTitles[i];
      progress(l, i + 1, title);
      responses.push(await scrapbox.getPage(encodeURIComponent(title)));
      await sleep(1000);
    }

    const textIncludeUrls = responses.flatMap((response) => {
      return response.lines
        .map(({ text }) => {
          return {
            articleUrl: scrapbox.buildPageURL(response.title),
            text,
          };
        })
        .filter(({ text }) => text.includes("https"));
    });

    const urls = extractUrls(textIncludeUrls);
    console.log(urls);

    // await writeFile("urls", JSON.stringify(urls, null, 2));

    // const urls = JSON.parse(await readFile("urls", "utf8"));

    console.log("\nStart Check Living URLs");

    const deadUrls: ReturnType<typeof extractUrls> = {};
    const keys = Object.keys(urls);
    const ll = keys.length;
    for (let i = 0; i < ll; i++) {
      const url = keys[i];
      progress(ll, i + 1, url);
      const isAlive = await isAliveUrl(url);
      if (!isAlive) {
        deadUrls[url] = urls[url];
      }
      await sleep(1000);
    }

    console.log("\nResult");

    const result = JSON.stringify(deadUrls, null, 2);
    console.log(result);
    // await writeFile("log", result);
  } catch (error) {
    console.error(error);
  }
};

main();
