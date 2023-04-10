import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

// GET => Buscar um recurso do back-end
// POST => Criar um recurso no back-end
// PUT => Atualizar um recurso no back-end
// PATCH => Atualizar uma informação específica de um recurso no back-end
// DELETE => Atualizar um recurso no back-end

// GET /users => Buscando um usuário do back-end
// POST /users => Criar um usuário no back-end

// Stateful (Estado ) / Stateless

// Cabeçalhos (Requisição / Resposta) => Metadados

// HTTP Status Code

// Query Parameters: URL Stateful => Filtros, paginação, não obrigatórios
// Ex.: http://localhost:3333/users?userId=1&name=Diego

// Route Parameters: Identificação de recurso =>
// Ex.: GET http://localhost:3333/users/1
// Ex.: DELETE http://localhost:3333/users/1

// Request Body: Envio de informações de um formulário (HTTPS)
// Ex.: POST http://localhost:3333/users

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);
