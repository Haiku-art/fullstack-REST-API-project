var mongoose = require("mongoose"); // otetaan mongoose käyttöön

const CoffeeshopSchema = new mongoose.Schema({ //määritellään skeema

        name : String, //samat key & value parit löytyvät MongoDB:stä
        description : String,
        price : Number,
        type : String
});

module.exports=mongoose.model('Coffeeshop', CoffeeshopSchema, 'menuData'); // palauttaa skeemamallin, jotta se voidaan ottaa käyttöön muualla ohjelmassa.