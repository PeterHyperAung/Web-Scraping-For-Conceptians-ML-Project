const puppeteer = require("puppeteer");
const fs = require("fs");

(async function () {
  try {
    const obj = {};
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto("https://bold.org/blog/college/");
    obj.title = await page.evaluate(() => document.title);

    //   const posts = await page.$$eval("[href]", (el) => {
    //     console.log("HELLO", el);
    //     return el.innerText;
    // return {
    //   title: el.lastChild.children[1].innerText,
    //   description: el.lastChild.children[2].innerText,
    //   date: el.lastChild.firstChild.firstChild.firstChild.innerText,
    //   imageLink: el.firstChild.style.backgroundImage.slice(5, -2),
    // };
    //   });

    obj.posts = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          ".PostsGrid-module--container--5ac84 a[href^='/blog']"
        ),
        (el) => {
          //   const imageLink = await document.querySelector(
          //     `a[href="${el.href}"] div.PostsGrid-module--image--28378`
          //   ).styles;
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
