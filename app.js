const express = require("express");
const app = express();
const Joi = require('joi')

app.use(express.json());

const users = [
    {id: 1, name: "Christian"},
    {id: 2, name: "Uriel"},
    {id: 3, name: "Morpheus"}
];

app.get('/api/users', (req, res) => {
    res.send(users)
});

app.get('/api/users/:id', (req, res) => {
    const user = userExists(req.params.id)
    !user ? 
        res.status(404).send("The user has been not found")
        : res.send(user)  
});

app.post('/api/users/', (req, res) => {
    const {error, value} = validate_user(req.body.name);
    if (!error){
        const user = {
            id: users.length + 1,
            name: value,
        };
        users.push(user);
        res.send(user);
    } else {
        const message = error.details[0].message
        res.status(400).send(message)
    }
});

app.put('/api/users/:id', (req, res) => {
    const user = userExists(req.params.id)
    if (!user){
        res.status(404).send("The user has been not found")
        return
    }
    const {error, value} = validate_user(req.body.name);
    if (error){
        const message = error.details[0].message
        res.status(400).send(message)
        return;
    }
    user.name = value.name;
    res.send(user)
});

app.delete('/api/users/:id', (req, res) => {
    const user = userExists(req.params.id)
    if (!user){
        res.status(404).send("The user has been not found")
        return
    }
    const index = users.indexOf(user);
    users.splice(index, 1);
    res.send(users);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening at port: ${port}.`);
})

function userExists(id){
    return users.find(user => user.id === parseInt(id))
}

function validate_user(name){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    })
    return schema.validate({ name: name });
}