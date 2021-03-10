const puppeteer = require('puppeteer');
const urls = ['https://www.mediamarkt.be/fr/'];
const { StaticPool } = require("node-worker-threads-pool");


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/crawling2', {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;
db.on('connecting', () => console.error('connection connecting ...'))
db.on('open', () => console.log('connected successfully ~'))
db.on('error', (e) => console.error('connection error:', e))


const ProductModel = require('./models/product.js');



const getCategories = async(page, url)=> {

    await page.goto(url);
    const categories = await page.evaluate( () => {
        const selector = 'li.site-navigation2__item.site-navigation2__item--primary-toggle > div > ul > li > a';
        return Array.from( document.querySelectorAll(`${selector}`), category => { return { title: category.textContent.trim(), href: category.href } } );
    })    

    return categories;
}

const getSubCategories = async(page, category) => {

    await page.goto(category.href);
    const subcategories =  await page.evaluate( () => {
        const selector = '#filters > form > fieldset > div > ul > li > a';
        return Array.from( document.querySelectorAll(`${selector}`), subcategory => { return { title: subcategory.textContent.trim(), href: subcategory.href } } );
    })    

    return subcategories;
}

const getProducts = async(page, subcategory, numberOfPages) => {

    var products = [];

    for(let i=0; i< numberOfPages; i++){

        await page.goto(`${subcategory.href}?page=${i+1}`);
        const prods =  await page.evaluate( () => {
            const selectorDetails = '#category > ul.products-list > li > script';
            const selectorImage = '#category > ul.products-list > li > div > aside.product-photo > figure > a > img';
            const Details = Array.from( document.querySelectorAll(`${selectorDetails}`), item => JSON.parse( item.text.split(/[=;]/)[1].trim() ))
            const Image = Array.from( document.querySelectorAll(`${selectorImage}`), item => item.src );
            const result = Details.map( (item, index) => { return { ...item, img: Image[index] } });
            console.log(result);
            return result;
        })
        products.push.apply(products, prods);
    }   
    return products;
}


const handleResults =  async () => {
    let startTime = Date.now();
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    var result = [];
    for await (let url of urls){
        var categories = await getCategories(page, url);
        
        var nunberOfCatgories = 1; 
        for(let i=0; i <  nunberOfCatgories; i++){
            let numberOfPages = 1;
            var subcategories = await getSubCategories(page, categories[i]);
            for(let j=0; j < numberOfPages; j++){
                const products = await getProducts(page, subcategories[j], numberOfPages);
                products.forEach( item => {
                    const product = new ProductModel(item);
                    console.log(item);
                    product.save( (err) => {
                        if(err) hadnelError(err);
                    })
                })
                subcategories[j] = { ...subcategories[j] , products };
            }
            
        }
        result.push(...categories);
    }
    console.log('Hi');
    console.log(result)
}
handleResults();





