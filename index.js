
var express = require("express");
var app = express();
var mongoose = require("mongoose"); // otetaan mongoose käyttöön
var bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

require("dotenv").config(); //otetaan .env käyttöön salasanoja ja käyttäjätunnuksia varten

app.set('view engine', 'ejs'); // ejs-sivupohjien käyttöönotto
app.use(bodyParser.urlencoded({ extended: true }));

const Coffeeshop = require("./modules/model"); //Skeema on määritelty kansioon /modules, se haetaan käyttöön tällä rivillä. 

var user = process.env.DB_USER //käyttäjätunnutkset yms. tallennettuna .env -tiedostossa
var password = process.env.DB_PASS
const uri = process.env.DB_URI
//const uri = "mongodb+srv://" + user + ":" + password + "@cluster0.1z6n89r.mongodb.net/coffeeshopData?retryWrites=true&w=majority";

//Yhteydenotto MongoDB -tietokantaan mongoosen välityksellä.
async function connect() {
    try {
      const client = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB!');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
  
connect();
  
//index.ejs -etusivu
app.get('/', (req, res) => {
    res.render('index');
});

//palauttaa kaikki tietokannassa olevat dokumentit json -muodossa
app.get('/getall', async (req, res) => { 
    try {
      const items = await Coffeeshop.find({});
      res.status(200).json(items);
    } catch (error) {
      console.log(error);
    }
  }); 

  //palauttaa kaikki tietokannassa olevat dokumentit, mutta items.ejs -pohjaan muotoiltuina
  app.get('/getall/menu', async (req, res) => { 
    try {
      const items = await Coffeeshop.find({});
      res.render('items', { items });
    } catch (error) {
      console.log(error);
    }
  });
  
//palauttaa datan id:n mukaan
app.get('/items/:id', async (req, res) => { 
    var itemId = req.params.id;

    try {
        const kahvi = await Coffeeshop.findById(itemId);
        res.status(200).json(kahvi);
    } catch (error) {
        console.log(error);
    }
});
 
//POST lisää tietokantaa uuden olion, testattu Postmanilla
app.post('/addnew', async (req, res) => {
    const { name, description, price, type } = req.body;
  
        const newCoffeeshop = new Coffeeshop({
        name,
        description,
        price,
        type
        });
  
    try {
      await newCoffeeshop.save();
      res.status(201).json({ message: 'New object created!' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  //PUT pyyntö muokkaa dokumenttia annetun id:n perusteella, testattu Postmanilla
  app.put("/edit/:id", async function (req, res) {

    //const name = req.body.name;
    const price = req.body.price
    const id = req.params.id;
  
    try {
      const updatedCoffeeshopItem = await Coffeeshop.findByIdAndUpdate(id, { price: price }, { new: true }); //findByIdAndUpdate on Mongoosen tarjoama valmisfunktio
      res.json({ message: 'Object updated!', updatedCoffeeshop: updatedCoffeeshopItem });
        }catch (err) {res.status(400).json({ error: err.message });
    }
  });

  //DELETE poistaa dokumentin annetun id:n perusteella
  app.delete('/delete/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const deletedObject = await Coffeeshop.findByIdAndRemove(id); //findByIdAndRemove on mongoosen valmisfunktio. 
      if (!deletedObject) {
        return res.status(404).send('Object not found');
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).send(err);
    }
  });
  


/* app.listen(3000, () => {
    console.log('Server listening on port 3000');
}); */
app.listen(port, function() {
  console.log(`Server running on http://localhost:${port}`);
});