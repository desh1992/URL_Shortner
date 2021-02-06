const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

app.set('view engine', 'ejs')
// tell app to use url parameters
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
	const shortUrls = await ShortUrl.find()
	console.log("🚀 ~ file: server.js ~ line 17 ~ app.get ~ shortUrls", shortUrls)
	res.render('index', { shortUrls: shortUrls })

})

app.post('/shortUrls', async (req, res) => {
	await ShortUrl.create({ full: req.body.fullUrl })
	res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
	const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
	if (shortUrl == null) return res.sendStatus(404)

	shortUrl.clicks++
	shortUrl.save(

		res.redirect(shortUrl.full)
	)
})

app.listen(process.env.PORT || 5000);