const express = require("express");

const app = express();

app.use(express.json());

//localhost:3333/
// app.get("/"),(request,response)=>{
//     return('')
// }
                    //ROTAS
//get - busca informações dentro do serv
app.get("/courses", (request,response) =>{
    const query = request.query;
    console.log(query);
    return response.json(["Curso 1,Curso 2,Curso 3"]);
});
//POST - inserir informações no serv
app.post("/courses",(request,response)=>{
    const body = request.body;
    console.log(body);
    return response.json(["Curso 1","Curso 2","Curso 3","Curso 4"]);
});
//put - altera informações no serv
app.put("/courses/:id",(request,response)=>{
    const params =request.params;
    console.log(params);
    return response.json(["Curso 6","Curso 2","Curso 3","Curso 4"]);
});
//patch- altera informações especificas
app.patch("/courses/:id",(request,response)=>{
    return response.json(["Curso 6","Curso 7","Curso 3","Curso 4"]);
});
//delete - deleta informações
app.delete("/courses/:id",(request,response)=>{
    return response.json(["Curso 6","Curso 2","Curso 4"]);
});
// aonde passa a porta que vai ser inicializada - localhost:3333
app.listen(3333);

                //TIPOS DE PARAMETROS
//Route Params => Identificar um recurso - editar / deleta / buscar
//Query Params => Paginação/ Filtro de busca
//Body Params => os objetos insersão/alteração (JSON)