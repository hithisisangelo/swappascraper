const axios = require('axios');
const pupeteer = require('puppeteer');
const cheerio = require ('cheerio');

const webHook = '';

async function getUrl(){

    let url = 'https://swappa.com/laptops/buy/macbook-pro-2019-16';
    const urlData = await axios.get(url);

    //console.log(urlData);
    const $ = cheerio.load(urlData.data);

    let foundMatched = '';
   
    let count = $('#section_main > div > div.col-xs-12.col-sm-8.col-md-9 > div > div').length;

    console.log(count);
 
    let priceToScrapeFor = 1950;

    for(let i = 1; i < count; i++){

        let price = $(`#listing_previews > div:nth-child(${i}) > a > div > div.col-xs-12.col-sm-12.col-md-7.col-lg-8 > div > div > div.hidden-xs.hidden-sm.col-md-2.text-right > div`).text().replace('$','');
        let hrefUrl = $(`#listing_previews > div:nth-child(${i}) > a`).attr('href');
        let description = $(`#listing_previews > div:nth-child(${i}) > a > div > div.col-xs-12.col-sm-12.col-md-7.col-lg-8 > div > div > div.col-xs-12.col-md-10 > div.headline.hidden-xs.text-nowrap`).text().trim();
        
        if(price < priceToScrapeFor){
            console.log(i);
            //foundMatched += (`${price} url is https://swappa.com/${hrefUrl} ${description} \n`);
            console.log(`${price} url is https://swappa.com/${hrefUrl} ${description} \n`);
            
            await postWebhook("We found it!",price,`https://swappa.com/${hrefUrl}`,description);
        }

    }
 
    //console.log(price);
}

async function postWebhook(message,price,url,itemTitle){

    const myEmbeds = {
        
        author : {
            name : "Jello"
        },
        title: "Swappa Price Scraper",
        fields: [

        {

            "name" : "Title",
            "value" : itemTitle

        },
            
        {
            "name" : "Price",
            "value" : price
        },

        {
            "name" : "URL",
            "value" : url
        }

    ]}

    const params = {
        username : "Amzn Scrapa",
        avatar_url: "https://i1.wp.com/www.thenerddaily.com/wp-content/uploads/2020/05/Itaewon-Class-K-Drama-Series.jpg?fit=1000%2C742&ssl=1",
        content : `${itemTitle} is back in stock for price of ${price} go cop!`,
        embeds: [myEmbeds]
    }

    const headers = {
        'Content-Type' : 'Application/Json'
    };


    axios.post(webHook,params,headers);

}

getUrl();