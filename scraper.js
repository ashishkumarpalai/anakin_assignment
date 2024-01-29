// // const axios = require('axios');
// // const cheerio = require('cheerio');
// // const fs = require('fs');
// // const zlib = require('zlib');

// // class AmazonINLaptopScraper {
// //     constructor() {
// //         this.baseURL = 'https://www.amazon.in';
// //         this.headers = {
// //             'User-Agent': 'Your User Agent String',
// //             'Accept-Language': 'en-US,en;q=0.9',
// //             // Add any other necessary headers
// //         };
// //         this.delay = 1000; // 1 second delay between requests to avoid rate limiting
// //     }

// //     async fetchHTML(url) {
// //         try {
// //             await this.sleep(this.delay); // Introduce delay between requests
// //             const response = await axios.get(url, { headers: this.headers });
// //             return response.data;
// //         } catch (error) {
// //             if (error.response && error.response.status === 404) {
// //                 console.error('404 Not Found:', url);
// //             } else {
// //                 console.error('Error fetching HTML:', error.message);
// //             }
// //             throw error;
// //         }
// //     }

// //     async sleep(ms) {
// //         return new Promise(resolve => setTimeout(resolve, ms));
// //     }

// //     scrapeProduct(html) {
// //         const $ = cheerio.load(html);
// //         // Example: Extracting product name
// //         const productName = $('#productTitle').text().trim();
// //         return { productName };
// //     }

// //     scrapePage(html) {
// //         const $ = cheerio.load(html);
// //         const products = [];

// //         // Example: Extracting all product links on the page
// //         $('a[data-asin]').each((index, element) => {
// //             const productLink = $(element).attr('href');
// //             products.push(productLink);
// //         });

// //         return products;
// //     }

// //     async scrapeLocation(pincode) {
// //         const url = `${this.baseURL}/search/?location=${pincode}&category=laptops`;
// //         const html = await this.fetchHTML(url);

// //         const productLinks = this.scrapePage(html);

// //         const productDetails = [];
// //         for (const link of productLinks) {
// //             const productHTML = await this.fetchHTML(this.baseURL + link);
// //             const productInfo = this.scrapeProduct(productHTML);
// //             productDetails.push(productInfo);
// //         }

// //         return productDetails;
// //     }

// //     extractData(htmlContent) {
// //         const $ = cheerio.load(htmlContent);

// //         // Example: Extracting additional data from the product page
// //         const productDetails = {
// //             skuId: $('#sku-id-element').text().trim(),
// //             productTitle: $('title').text().trim(),
// //             description: $('#product-description-element').text().trim(),
// //             category: $('#category-element').text().trim(),
// //             subcategories: $('#subcategory-element').text().trim(),
// //             mrp: $('#mrp-element').text().trim(),
// //             sellingPrice: $('#selling-price-element').text().trim(),
// //             discount: $('#discount-element').text().trim(),
// //             weight: $('#weight-element').text().trim(),
// //             brandName: $('#brand-element').text().trim(),
// //             imageUrl: $('#image-element').attr('src'),
// //             specifications: this.extractSpecifications($),
// //         };

// //         return productDetails;
// //     }

// //     extractSpecifications($) {
// //         // Example: Extracting laptop specifications
// //         const specifications = [];

// //         $('.specifications-element').each((index, element) => {
// //             const spec = $(element).text().trim();
// //             specifications.push(spec);
// //         });

// //         return specifications;
// //     }

// //     saveDataToGzippedNdjson(data, filePath) {
// //         const fileStream = fs.createWriteStream(filePath);
// //         const gzipStream = zlib.createGzip();

// //         gzipStream.pipe(fileStream);

// //         data.forEach((item) => {
// //             gzipStream.write(JSON.stringify(item) + '\n');
// //         });

// //         gzipStream.end();
// //     }

// //     async runScraper() {
// //         try {
// //             const data = await this.scrapeLocation('Bangalore');
// //             this.saveDataToGzippedNdjson(data, 'scraped_data.ndjson.gz');
// //             console.log('Scraping completed successfully!');
// //         } catch (error) {
// //             console.error('Error during scraping:', error.message);
// //         }
// //     }
// // }

// // // Instantiate the scraper and run it
// // const scraper = new AmazonINLaptopScraper();
// // scraper.runScraper();








// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');

// const app = express();
// const port = 3000;

// app.use(express.static('public'));

// app.get('/scrape', async (req, res) => {
//     try {
//         const pincode = req.query.pincode || '560001';
//         const data = await scrapeLocation(pincode);
//         res.json(data);
//     } catch (error) {
//         console.error('Error during scraping:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// async function scrapeLocation(pincode) {
//     const url = `https://www.amazon.in/search/?location=${pincode}&category=laptops`;
//     const html = await fetchHTML(url);

//     const productLinks = scrapePage(html);

//     const productDetails = [];
//     for (const link of productLinks) {
//         const productHTML = await fetchHTML(link);
//         const productInfo = scrapeProduct(productHTML);
//         productDetails.push(productInfo);
//     }

//     return productDetails;
// }

// async function fetchHTML(url) {
//     try {
//         const response = await axios.get(url);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// }

// function scrapePage(html) {
//     const $ = cheerio.load(html);
//     const products = [];

//     $('a[data-asin]').each((index, element) => {
//         const productLink = $(element).attr('href');
//         products.push('https://www.amazon.in' + productLink);
//     });

//     return products;
// }

// function scrapeProduct(html) {
//     const $ = cheerio.load(html);
//     const productName = $('#productTitle').text().trim();
//     return { productName };
// }

// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });






















const puppeteer = require("puppeteer");
const fs = require("fs");
const zlib = require("zlib");
const ndjson = require("ndjson");

// Define a class for Amazon India Scraper
class AmazonINScraper {
  constructor() {
    this.results = []; // Array to store scraped data
    this.browser = null; // Puppeteer browser instance
  }

  // Initialize the Puppeteer browser
  async initialize() {
    try {
      this.browser = await puppeteer.launch();
    } catch (error) {
      console.error("Error during initialization:", error);
      throw error;
    }
  }

  // Scrape Amazon India for laptops based on pincode
  async scrapeAmazon(pincode) {
    const page = await this.browser.newPage(); // Create a new page in the browser
    console.log(pincode);

    try {
      // Navigate to the Amazon India laptops page with the specified pincode
      await page.goto(`https://www.amazon.in/s?k=laptops&pincode=${pincode}`);
      // Extract laptop data from the page using JavaScript in the browser context
      const laptops = await page.evaluate(() => {
        const data = [];
        const laptopElements = document.querySelectorAll(".s-result-item");

        laptopElements.forEach((laptopElement) => {
          try {
            // Extract various data points for each laptop
            const sku = laptopElement.dataset.asin || "";
            const productNameElement = laptopElement.querySelector("h2 span");
            const productName = productNameElement
              ? productNameElement.innerText
              : "";

            // Extract other properties in a similar manner
            const productTitleElement = laptopElement.querySelector("h2 span");
            const productTitle = productTitleElement
              ? productTitleElement.innerText
              : "";

            const descriptionElement =
              laptopElement.querySelector(".a-size-base");
            const description = descriptionElement
              ? descriptionElement.innerText
              : "";

            const categoryElement =
              laptopElement.querySelector(".a-link-normal");
            const category = categoryElement ? categoryElement.innerText : "";

            const mrpElement = laptopElement.querySelector(
              ".a-text-price .a-offscreen"
            );
            const mrp = mrpElement ? mrpElement.innerText : "";

            const sellingPriceElement = laptopElement.querySelector(
              ".a-price .a-offscreen"
            );
            const sellingPrice = sellingPriceElement
              ? sellingPriceElement.innerText
              : "";

            const discountElement = laptopElement.querySelector(".a-offscreen");
            const discount = discountElement ? discountElement.innerText : "";

            const weightElement =
              laptopElement.querySelector(".a-text-bold span");
            const weight = weightElement ? weightElement.innerText : "";

            const brandNameElement =
              laptopElement.querySelector(".a-text-bold");
            const brandName = brandNameElement
              ? brandNameElement.innerText
              : "";

            const imageUrlElement = laptopElement.querySelector(".s-image");
            const imageUrl = imageUrlElement
              ? imageUrlElement.getAttribute("src")
              : "";

            const laptopSpecificationElement =
              laptopElement.querySelector(".a-unordered-list");
            const laptopSpecification = laptopSpecificationElement
              ? laptopSpecificationElement.innerText
              : "";

            // Construct an object with extracted data
            const laptopData = {
              SKU: sku,
              productName: productName,
              productTitle: productTitle,
              description: description,
              category: category,
              mrp: mrp,
              sellingPrice: sellingPrice,
              discount: discount,
              weight: weight,
              brandName: brandName,
              imageUrl: imageUrl,
              laptopSpecification: laptopSpecification,
              // Add other properties here
            };

            // Add the laptop data object to the array
            data.push(laptopData);
          } catch (ex) {
            console.error("Error during laptop data extraction:", ex);
          }
        });

        return data;
      });

      this.results = this.results.concat(laptops);
    } catch (error) {
      console.error("Error during scraping:", error);
    } finally {
      await page.close();
    }
  }
  // Close the Puppeteer browsers
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
  // Save scraped results to a compressed NDJSON file
  saveResults() {
    const filename = "scraped_data.ndjson.gz";
    const fileStream = fs.createWriteStream(filename);
    const gzip = zlib.createGzip();
    const ndjsonStream = ndjson.stringify();

    ndjsonStream.pipe(gzip).pipe(fileStream);

    this.results.forEach((data) => {
      ndjsonStream.write(data);
    });

    ndjsonStream.end();

    console.log(`Scraped data saved to ${filename}`);
  }
}
// Export the AmazonINScraper class for external use
module.exports = AmazonINScraper;