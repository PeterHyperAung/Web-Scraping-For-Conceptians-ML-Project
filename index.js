const puppeteer = require("puppeteer");
const fs = require("fs");

(async function () {
  try {
    const obj = {};
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto("https://bold.org/blog/college/");
    obj.title = await page.evaluate(() => document.title);

    obj.posts = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          ".PostsGrid-module--container--5ac84 a[href^='/blog']"
        ),
        (el) => {
          const [date, duration, title, description] = el.innerText.split("\n");
          return {
            title,
            description,
            duration,
            date,
          };
        }
      )
    );

    fs.writeFileSync("college-blog-post.json", JSON.stringify(obj));

    await browser.close();
    console.log("Succeed");
  } catch (err) {
    console.log(err);
  }
})();
