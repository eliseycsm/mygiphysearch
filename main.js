// app takes in search keyword and returns search query from mygiphy

const URL = 'https://api.giphy.com/v1/gifs/search'

const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default


//CONST
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || ''
const API_KEY = process.env.API_KEY || ""  

//set up express instance
const app = express() 

//configure hbs
app.engine('hbs', handlebars({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
//mount static files from dir
app.use(express.static(__dirname)) 

if(API_KEY) {  //if no apiKey return error
    //start express and server
    app.listen(PORT, () => {
        console.info(`Application started on port ${PORT} at ${new Date()}.`)
        console.info(`with key ${API_KEY}`)
})
} else {
    console.error('API_KEY is not set')
}


//set up root
app.get(["/", "/index.html"], (req, resp) => {  
    resp.status(200)
    resp.type('text/html')
    resp.render("index")
})


const imagesRetrieved = (dataArr) => {
    return dataArr.data.map(d => {
        return { title: (d.title || 'no title available'), url: d.images.fixed_height.url }
        }
    )}

    
app.get('/search', 
    async (req, resp) => { 
        const search = req.query['search-term']
        //console.info('search-term: ', search)

        const fullURL = withQuery(URL, {
            q: search,
            api_key: API_KEY,
            limit: 10
        })
        
        const result = await fetch(fullURL) 
        const p = await result.json()
        const imageList = imagesRetrieved(p)
        resp.status(200)
        resp.type('text/html')
        resp.render("result", {
            searchTerm: search,
            img: imageList,
            hasContent: !! (imageList.length > 0) 
        })
        
})





