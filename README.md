# Oslosykkel

Oslosykkel is a hobby project that uses data from the bikesharing schemes in Oslo, Bergen and Trondheim to show both the location of stations as well as the availability of bikes and locks at each station. The project uses Vue, Node and Leaflet.js as its main frameworks and libraries.

## Run the project
The code can be run in developer mode by first starting and express server using `node server.js` to start the express server that is proxying the data provided by the bike sharing schemes. Then run `npm run serve` in order to start the Vue app in dev mode. When running in this mode the Vue dev tools will be available and all unknown requests will be proxied to `localhost:5000`, i.e. the Express server.

If you wish to run the project in production mode, you must first compile the Vue project with `npm run build` and then start the Express server. The server will then serve the static files provided by Vue as well as proxy the API's.

In order to retrieve the data from the Oslo bysykkel API you need to get a key from [Oslo Bysykkel](https://oslobysykkel.no/apne-data), while the API's for Bergen and Trondheim onl require that you provide a client name. For simplicity, these two are read from enviroment variables, see [`example.env`](example.env)