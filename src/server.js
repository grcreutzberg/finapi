const express = require('express');
const { v4: uuidv4 } = require('uuid');

const HOST = process.env.HOST || 'http://localhost'
const PORT = process.env.PORT || 8000
const LOGMSG = '[Hello there!]:'

const app = express();
app.use(express.json());

const customers = [];

app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    const custumerAlreadyExists = customers.find(custumer => custumer.cpf === cpf);

    if (custumerAlreadyExists) {
        return response.status(400).json({
            error: 'Customer already exists'
        });
    }

    const id = uuidv4();
    customers.push({ 
        id, 
        cpf, 
        name,
        statement: [] 
    });
    return response.status(201).send({ id });
});

app.listen(PORT, () => {
    console.log(`${LOGMSG} Server is running at ${HOST}:${PORT}`)
});