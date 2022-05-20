const express = require('express');
const { v4: uuidv4 } = require('uuid');

const HOST = process.env.HOST || 'http://localhost'
const PORT = process.env.PORT || 8000
const LOGMSG = '[Hello there!]:'

const app = express();
app.use(express.json());

const customers = [];

//Middleware
function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.params;

    const custumer = customers.find(custumer => custumer.cpf === cpf);

    if (!custumer) {
        return response.status(404).json({
            error: 'Customer not found'
        });
    }
    request.custumer = custumer;
    return next();
}

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

app.get("/statement/:cpf", verifyIfExistsAccountCPF, (request, response) => {
    const { custumer } = request;
    return response.status(200).send(custumer.statement);
});

app.post("/deposit/:cpf", verifyIfExistsAccountCPF, (request, response) => {
    const { custumer } = request;
    const { description, amount } = request.body;

    const operation = {
        description,
        amount,
        createdAt: new Date(),
        type: 'credit'
    }

    custumer.statement.push(operation);

    return response.status(201).send();
});

app.listen(PORT, () => {
    console.log(`${LOGMSG} Server is running at ${HOST}:${PORT}`)
});