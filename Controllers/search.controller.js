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
const SERP_API = require('google-search-results-nodejs');
const SEARCH_API = new SERP_API.GoogleSearch(process.env.API_KEY);
let dataContent = []
module.exports.search = (req , res , next) => {
    let contentFie = []
    let q = req.query.q
    let nameFileCSV = `data_search-${q}-${Math.floor(Math.random()*999999)}.csv`
    let dataSearch = []
    for(let i = 1; i <= 100 ; i+=10){
        const params = {
            engine: "google",
            q: q,
            num : 100,
            start : i
        };
        SEARCH_API.json(params,  (data) => {
            dataSearch = data['organic_results']
            dataContent.push(data['organic_results'])
            for(let i = 0; i< dataSearch.length; i++){
                let title = dataSearch[i].title
                let link = dataSearch[i].link
                contentFie.push({ title, link });
            }
            stringify(contentFie, { header: true, columns: columns }, (err, output) => {
                if (err) throw err;
                fs.writeFile(path.resolve()+'/public/csv/'+nameFileCSV, output, (err) => {
                    if (err) throw err;
                });
            });
        });
    }
    res.render('search', { title: 'Custom search api google' , dataSearch : dataSearch , file : process.env.BASE_URL_CSV+nameFileCSV});
}