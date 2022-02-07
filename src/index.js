//requisitos
//regras de negocio
const express = require("express");
const {v4: uuidv4} = require("uuid"); //8.3k (gzipped: 3.5k)

const app = express();

app.use(express.json());

const constumers = [];

//middlerware
function verifyIfExistsAccountCPF(request,response,next){
    const {cpf} = request.params;

    const customer = constumers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({error: "Customer not found"});
    }

    request.customer = customer;

    return next();
}

function getBalance(statment){
   const balance = statment.reduce((acc , operation) => {
        if(operation.type === 'credit'){
            return acc + operation.amount;
        } else{
            return acc - operation.amount;
        }
    }, 0); //transforma os valores em um valor somente - SOMA
    return balance;
}

app.post('/account',(request, response) => {
    const {cpf,name} = request.body; //solicitar o usuario

    const customeAlreadyExists = constumers.some(
        (customer) =>customer.cpf === cpf
    );
     if (customeAlreadyExists){
         return response.status(400).json({error: 'customer already exist!'});
     }
    
    constumers.push({
        cpf,
        name,
        id:uuidv4(),
        statment:[],
    });//inserir dados dentro do array
    return response.status(201).send(); //201 dado criado
});

//app.use(verifyIfExistsAccountCPF);

app.get("/statement",verifyIfExistsAccountCPF,(request, response) => {
    const {customer} = request;

    return response.json(customer.statment);
});

app.post("/deposit",verifyIfExistsAccountCPF,(request, response)=>{
    const {description,amount} = request.body;

    const {customer} = request;

    const statmentOperation = {
        description,
        amount,
        created_at: new Date(),
        type:"credit",
    }

    customer.statement.push(statmentOperation);

    return response.status(201).send();
});

app.post("/withdraw",verifyIfExistsAccountCPF,(request, response)=>{
    const { amount } = request.body; //quantia que vai recebr o saque
    const {customer} =request; //do quanto ele tem em conta

    const balance = getBalance(customer.statement);

    if(balance < amount){
        return response.status(400).json({error:"insuficient funds!"})
    }

    const statmentOperation = {
        amount,
        created_at: new Date(),
        type:"debit",
    };

    customer.statement.push(statmentOperation);  

    return response.status(201).send();

});

app.get("/statement/date",verifyIfExistsAccountCPF,(request, response) => {
    const {customer} = request;
    const {date} =request.query;

    const dateFormat = new Date(date + " 00:00");
    
    //10/10/2021
    const statment = customer.statment.filter((statment)=> statment.created_at.toDateString()=== new Date(dateFormat).toDateString());

    return response.json(customer);
});


//mudar os nomes
app.put("/account",verifyIfExistsAccountCPF,(request, response)=>{
    const {name} = request.body;
    const {customer} = request;

    customer.name = name;

    return response.status(201).send();
});

//mudar as info
app.get("/account",verifyIfExistsAccountCPF,(request, response)=>{
    const {customer}=request;
    return response.json(customer);
});

app.delete("/account",verifyIfExistsAccountCPF,(request, response)=>{
    const {customer} = request;

    //slice
    customers.splice(customer, 1);

    return response.status(200).json(customers);
});

app.get("/balance",verifyIfExistsAccountCPF,(request, response)=>{
    const{customer} = request;

    const balance = getBalance(customer.statement);

    return response.json(balance);

})

app.listen(3333);


 