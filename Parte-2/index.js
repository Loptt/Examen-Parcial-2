let express = require( 'express' );
let bodyParser = require( 'body-parser' );
let mongoose = require( 'mongoose' );
let jsonParser = bodyParser.json();
let { DATABASE_URL, PORT } = require( './config' );

let {BookmarkController} = require('./model');
let app = express();

let server;

app.put('/api/bookmarks/:id', jsonParser, (req, res) => {
	if (req.body.id == undefined) {
		res.statusMessage = "ID no proporcionado en el cuerpo";
		return res.status(406).send();
	}

	if (req.body.id !== req.params.id) {
		res.statusMessage = "ID de parametro y cuerpo no coinciden";
		return res.status(409).send();
	}

	let id = req.params.id;

	let titulo, desc, url;

	titulo = req.body.titulo;
	desc = req.body.descripcion;
	url = req.body.url;

	if (titulo == undefined && desc == undefined && url == undefined) {
		res.statusMessage = "No hay parametros a actualizar";
		return res.status(406).send();
	}

	let nuevoBookmark = {};

	if (titulo != undefined) {
		nuevoBookmark.titulo = titulo;
	}

	if (desc != undefined) {
		nuevoBookmark.descripcion = desc;
	}

	if (url != undefined) {
		nuevoBookmark.url = url;
	}

	BookmarkController.update(id, nuevoBookmark)
		.then(nb => {
			if (nb == null) {
				res.statusMessage = "Bookmark no encontrado";
				return res.status(404).send();
			}
			// Por alguna razón, mongoose nos está regresando el bookmark anterior,
			// antes de que se actualice, por lo tanto, para regresar el bookmark
			// actualizado vamos a obtenerlo fresco de la BD
			console.log(nb);

			BookmarkController.getById(id)
				.then(b => {
					console.log(b)
					return res.status(202).json(b);
				})
				.catch(error => {
					console.log(error);
					res.statusMessage = "Error con la BD";
					return res.status(500).send();
				});
		})
		.catch(error => {
			console.log(error);
			res.statusMessage = "Error con la BD";
			return res.status(500).send();
		});

});

function runServer( port, databaseUrl ){
	return new Promise( (resolve, reject ) => {
		mongoose.connect( databaseUrl, response => {
			if ( response ){
				return reject( response );
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then( () => {
			return new Promise( (resolve, reject) => {
				console.log( 'Closing the server' );
				server.close( err => {
					if ( err ){
						return reject( err );
					}
					else{
						resolve();
					}
				});
			});
		});
}
runServer( PORT, DATABASE_URL );

module.exports = { 
    app, 
    runServer, 
    closeServer 
}