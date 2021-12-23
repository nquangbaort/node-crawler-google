const {stringify} = require('csv-stringify');
let request = require('request');
const cheerio = require("cheerio");
request = request.defaults({jar: true});
const fs = require('fs');
let ip = []
let userGents = []
let proxys = []
fs.readFile('./user-agents/ip.txt', {encoding:'utf8', flag:'r'}, function(err, data) {
    if(err) throw err
    proxys = data.split(/\r\n/)
});
// fs.readFile('./user-agents/user_agents.txt', {encoding:'utf8', flag:'r'}, function(err, data) {
//     if(err) throw err
//     userGents = data.split(/\r\n/)
// });

let columns = {
    title: 'title',
    link: 'link'
};
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports.index = async (req, res, next) => {
    const query = req.query
    if(query.q) {
        let data = []
        let nameFileCSV = `data_search-${query.q}-${Math.floor(Math.random()*999999)}.csv`
        for(let i = 1; i <= 1000 ; i+=10){
             const options = {
                url: 'www.google.com',
                // headers: {
                //     'User-Agent': userGents[Math.floor(Math.random()*userGents.length)]
                // },
                proxy: proxys[Math.floor(Math.random()*proxys.length)]
            };
            request(options, function () {
                request(encodeURI(`https://www.google.com/search?q=${query.q}&start=${i}`), function (error, response, body) {
                    if(error) throw error;
                    var $ = cheerio.load(body);
                    console.log(body)
                    $('h3').each((index , elem) => {
                        const title = $(elem).text();
                        const link = $(elem).parent().attr('href');
                        data.push({ title, link }); 
                        console.log(data)
                        stringify(data, { header: true, columns: columns }, (err, output) => {
                            if (err) throw err;
                            fs.writeFile(nameFileCSV, output, (err) => {
                                if (err) throw err;
                                console.log(`${nameFileCSV} saved`);
                            });
                        });
                    })
                });
            });
           await sleep(1000);
        }
    }
    
    res.render('search', { title: 'Custom search api google' });
}