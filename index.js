const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify=require("slugify");
const replaceTemplace = require("./modules/replaceTemplace");
/////////////////////////////////////////////////
//File
// const txt = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(txt);

// const out = `This is what we know about the avocado : +${txt} \n created on ${Date.now()} `;
// fs.writeFileSync("./txt/output.txt", out);
// console.log("finsh");

// fs.readFile("./txt/start.txt", 'utf-8' , (erro, data1) => {
//     console.log('1',erro);
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8' , (erro, data2) => {
//        console.log('2');
//     });
//     fs.readFile("./txt/append.txt", 'utf-8' , (erro, data3) => {
//         console.log('3');
//     });
//     console.log('4');
// });

// console.log('5');
//
//////////////////////////////////////////////////////////
/**
 * đọc html ở trong file và trả về cho client 
 * **/

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
/**
 * đọc file ngay lần đầu tiên để tránh việc mỗi lần gọi api sẽ phải đọc lại file 
 * **/
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataOject = JSON.parse(data);
const slugs=dataOject.map(el => slugify(el.productName,{lower:true}) );

/**
 * tạo ra 1 server mới để có thể lắng nghe các sự kiện và trả về api 
 * **/
const server = http.createServer((req, res) => {
  /**
   *  lấy truy vấn và tên đường dẫn hiện tại  
   * **/
  
  const { query, pathname } = url.parse(req.url, true);
  // overview page
  if (pathname === "/overview" || pathname === "/") {
    /**
     * trước tiên phải xét contenttype cho trang trả về nó như định dạng cho trang 
     * **/
    res.writeHead(200, { Contentype: "text/html" });
    const cardsHTML = dataOject
      .map((el) => replaceTemplace(tempCard, el))
      .join("");
    output = tempOverview.replace(/{%PRODUCT_CARDS\%}/g, cardsHTML);
    res.end(output);
  } else if (pathname === "/api") {
    // trả lại cho 1 json với status là 200
    res.writeHead(200, { Contentype: "application/json" });
    res.end(data);
    // product page
  } else if (pathname === "/product") {
    res.writeHead(200, { Contentype: "text/html" });
    const product = dataOject[query.id];
    const output = replaceTemplace(tempProduct, product);
    res.end(output);

    // NOT FOUND
  } else {
    res.writeHead(404);
    res.end("Page not found");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
