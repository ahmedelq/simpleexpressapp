const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', 
        {'Tokens' : morgan.token('body',  (req, res) =>  JSON.stringify(req.body) )}));


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



app.get('/api/persons/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = data.find(p => p.id === id);
    if(person)
        res.json(person);
    else
        res.status(404).json({'error': 'person not found'})
});

app.post('/api/persons', (req, res) => {
    const newID = Math.floor(Math.random() * (1295) + 42);
    const newPerson = {
        'id': newID,
        'name': req.body.name,
        'number':  req.body.number
    }
    if(! ('name' in req.body && 'number' in req.body) )
        res.status(415).json({'error': 'either the name or the number is not set'});
    else if (data.find(person => person.name === req.body.name ))
        res.status(409).json({'error': 'the name already exists'});
    else {
        data.push(newPerson);
        res.json(newPerson);
    }

});
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const newPersons = data.filter(person => person.id != id);
    if(newPersons.length == data.length)
        res.status(404).end()
    else { data.length = 0;
    newPersons.forEach(person => data.push(person));
    res.status(204).end();
}
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

app.listen(1337, (req, res)=> {
    console.log('Server running!');
});