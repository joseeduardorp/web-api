const http = require('node:http');

const HeroFactory = require('./factories/heroFactory');
const heroService = HeroFactory.generateInstance();
const Hero = require('./entities/hero');

const PORT = 3000;
const DEFAULT_HEADER = {
	'Content-Type': 'application/json',
};

const routes = {
	'/heroes:get': async (request, response) => {
		const { id } = request.queryString;
		const heroes = await heroService.find(id);

		response.write(JSON.stringify({ result: heroes }));

		return response.end();
	},
	'/heroes:post': async (request, response) => {
		try {
			// async iterator
			for await (const data of request) {
				// await Promise.reject('/heroes:post');

				const item = JSON.parse(data);
				const hero = new Hero(item);
				const { valid, error } = hero.isValid();

				if (!valid) {
					response.writeHead(400, DEFAULT_HEADER);
					response.write(JSON.stringify({ error: error.join(',') }));

					return response.end();
				}

				const id = await heroService.create(hero);

				response.writeHead(201, DEFAULT_HEADER);
				response.write(
					JSON.stringify({ success: 'User created with success!', id })
				);

				// esse return só é usado pois recebemos um body por requisição
				// se fosse um arquivo, que é enviado sob demanda
				// receberiamos mais de um body em um único evento
				// então seria necessário remover o return
				return response.end();
			}
		} catch (error) {
			return handleError(response)(error);
		}
	},
	default: (request, response) => {
		response.write('Opa!');
		response.end();
	},
};

const handleError = (response) => {
	return (error) => {
		console.error('Houve um erro interno', error);
		response.writeHead(500, DEFAULT_HEADER);
		response.write(JSON.stringify({ error: 'Internal server error!' }));
		response.end();
	};
};

const handler = (request, response) => {
	const { url, method } = request;
	const [first, route, id] = url.split('/');

	request.queryString = { id: isNaN(id) ? id : Number(id) };

	const key = `/${route}:${method.toLowerCase()}`;

	// response.writeHead(200, DEFAULT_HEADER);
	response.setHeader('Content-Type', 'application/json');
	response.statusCode = 200;

	const chosen = routes[key] || routes.default;

	return chosen(request, response).catch(handleError(response));
};

http.createServer(handler).listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
