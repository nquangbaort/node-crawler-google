const {stringify} = require('csv-stringify');
const fs = require('fs')
var path = require('path');
require('dotenv').config();
let columns = {
    title: 'title',
    link: 'link'
};
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const GG_API = require('google-search-results-nodejs');
const SEARCH_API = new GG_API.GoogleSearch(process.env.API_KEY);


module.exports.search =  (req , res , next) => {
    let contentFie = []
    let q = req.query.q
    if(!q) return res.render('search', { title: 'Custom search api google'});
    let nameFileCSV = `data_search-${q}-${Math.floor(Math.random()*999999)}.csv`
    const callback = async function(data) {
        const content = await data['organic_results']
        for(let j = 0; j < content.length; j++) {
            let title = content[j].title
            let link = content[j].link
            contentFie.push({ title, link });
            stringify(contentFie, { header: true, columns: columns }, (err, output) => {
                if (err) throw err;
                fs.writeFile(path.resolve()+'/public/csv/' + nameFileCSV, output, (err) => {
                    if (err) throw err;
                });
            });
        }
    };
    for(let i = 0; i < 200 ; i+=10){
        const params = {
            engine: "google",
            q: q,
            num : 100,
            start : 0,
            location_requested: "Japan",
            location_used:"Japan",
            google_domain:"google.co.jp",
            hl:"ja",
            gl:"jp",
            device:"desktop"
        };
        SEARCH_API.json(params, async (data) => {
           await callback(data)
        })
    }
    res.render('search', { title: 'Custom search api google' , q: q, file : process.env.BASE_URL_CSV+nameFileCSV});
}