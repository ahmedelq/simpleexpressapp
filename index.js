require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('build'));


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', 
        {'Tokens' : morgan.token('body',  (req, res) =>  JSON.stringify(req.body) )}));

const errorHandler = (err, req, res, nxt) => {
    console.log(`GOT Error: ${err.message}`);
    if (err.message === 'CastError')
        return res.status(400).json({error : 'Invalid id'});
    
    next(err);
}
app.use(errorHandler);

const data =  [
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]



app.get('/api/persons/', (req, res, nxt) => {
    Person.find({})
    .then(persons => 
        res.json(persons))
    .catch(err => nxt(err));
});

app.get('/api/persons/:id', (req, res, nxt) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
       if(person)
        return  res.json(person);
        res.status(404).end();
    }).catch(err => nxt(err));      
});

app.post('/api/persons', (req, res, nxt) => {
    const newPerson = {
        'name': req.body.name,
        'number':  req.body.number
    }

    if(! ('name' in req.body && 'number' in req.body) )
        res.status(415).json({'error': 'either the name or the number is not set'});

    Person.find({"name": req.body.name})
        .then(person =>  {
            if (person.length !=0)
                return res.json({'error': 'the person already exists'});

            new Person(newPerson).save()
            .then(ret => res.json(newPerson))
            .catch(err => nxt(err));

        });

});

app.delete('/api/persons/:id', (req, res, nxt) => {
    const id = req.params.id;
    Person.findByIdAndRemove(id).then(out => {
        res.status(204).end();
    }).catch(err => nxt(err) );
});

app.put('/api/persons/:id', (req, res, nxt) => {
    const id = req.params.id;
    const newPerson = {"number": 123}
    Person
        .findByIdAndUpdate(id, newPerson, {new: true})
        .then(person => {res.json(person)})
        .catch(err => nxt(err));
});

app.get('/info/', (req, res) => {
    res.setHeader('Content-Type','text/html')
    res.write(`Phonebook has info for ${data.length} people`);
    res.write(`<br> ${new Date()}`);
    res.end();
    
});


const defaultResp = (req, res, next) => {
    res.status(404).json({'error': 'not found'});
}
app.use(defaultResp);

const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
    console.log(`Server running @ ${process.env.PORT}`);
});