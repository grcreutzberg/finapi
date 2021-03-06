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
    const { cpf } = request.headers;

    const custumer = customers.find(custumer => custumer.cpf === cpf);

    if (!custumer) {
        return response.status(404).json({
            error: 'Customer not found'
        });
    }
    request.custumer = custumer;
    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === 'credit') {
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        }
    }, 0);

    return balance;
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

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { custumer } = request;
    return response.status(200).send(custumer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
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

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
    const { custumer } = request;
    const { amount } = request.body;

    const balance = getBalance(custumer.statement);

    if (balance < amount) {
        return response.status(400).json({
            error: 'Insufficient funds!'
        });
    }

    const operation = {
        description: 'Withdraw',
        amount,
        createdAt: new Date(),
        type: 'debit'
    }

    custumer.statement.push(operation);

    return response.status(201).send();
});

app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
    const { custumer } = request;
    const { date } = request.query;

    const dateFormat = new Date(date + ' 00:00');
    
    const statement = custumer.statement.filter((statement) => statement.createdAt === new Date(dateFormat).toDateString());

    return response.status(200).send(statement);
});

app.put("/account", verifyIfExistsAccountCPF, (request, response) => {
    const { custumer } = request;
    const { name } = request.body;

    custumer.name = name;

    return response.status(201).send();
});

app.get("/account", verifyIfExistsAccountCPF, (request, response) => {
    const { custumer } = request;

    return response.status(200).send(custumer);
});

app.delete("/account", verifyIfExistsAccountCPF, (request, response) => {
    const { custumer } = request;

    customers.splice(custumer, 1);

    return response.status(200).json(customers);
});

app.get("/balance", verifyIfExistsAccountCPF, (request, response) => {
    const { custumer } = request;

    const balance = getBalance(custumer.statement);

    return response.status(200).json(balance);
});

app.listen(PORT, () => {
    console.log(`${LOGMSG} Server is running at ${HOST}:${PORT}`)
});