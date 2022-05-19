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

    const custumerAlreadyExists = customers.some(custumer => custumer.cpf === cpf);

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

app.get("/statement/:cpf", (request, response) => {
    const { cpf } = request.params;

    const custumer = customers.find(custumer => custumer.cpf === cpf);

    if (!custumer) {
        return response.status(400).json({
            error: 'Customer does not exists'
        });
    }

    return response.status(200).send(custumer.statement);
});

app.listen(PORT, () => {
    console.log(`${LOGMSG} Server is running at ${HOST}:${PORT}`)
});