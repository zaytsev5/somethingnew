const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();


  

// EJS
app.get('/',(req, res) => res.render('show'));
app.get('/booking-ticket',(req, res) => res.render('booking'));

app.get('/me/stream',async(req,res) =>{
	let videoOb = await fetch('https://localhost')
})

app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
