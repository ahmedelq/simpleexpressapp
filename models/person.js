const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
mongoose.set('useFindAndModify', false);

const DB_URL = process.env.MONGO_DB;

mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(res => {
        console.log('Connection to MongoDB has been established');
    })
    .catch(err => {
        console.log('An error occured while connecting to MongoDB', err.message);
    });

const personSchema = mongoose.Schema({
    name: String,
    number: String
});

//TODO: Why transform?
personSchema.set('toJSON', {
    "transform": (doc, obj) => {
        obj.id = obj._id.toString();
        delete obj.__v;
        delete obj._id;
    }
});
const Person = mongoose.model('Person', personSchema);
// if (process.argv.length == 5) {
//     const person = new Person(
//         {name: process.argv[3],
//          number:  process.argv[4]});
    
// person.save().then(res => {
//     console.log(`added ${person.name} number ${person.number} to phonebook`);
//     mongoose.connection.close();
// }).catch(res => console.log('Failed to add the name to the phonebook')); 

// }

// if(process.argv.length == 3) {
//     Person.find({}).then(res => {
//         res.forEach(person => console.log(person));
//          mongoose.connection.close();});
// }

module.exports = Person;