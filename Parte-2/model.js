let mongoose = require( 'mongoose' );
let uuid = require( 'uuid' );

mongoose.Promise = global.Promise;

let bookmarkCollection = mongoose.Schema({
    // Guardamos el id como tipo string ya que así esta guardado en los ejemplos 
    // proporcionados y facilita las queries a la DB por medio del ID.
    // Este ID va a coexistir con el _id que genera mongo ya que ese es para uso
    // interno de mongo y este es para nuestro uso particular
    id: String,
    titulo: String,
    descripcion: String,
    url: String,
});

let Bookmark = mongoose.model('bookmarks', bookmarkCollection);

let BookmarkController = {
    getById: function(id) {
        return Bookmark.findOne({id: id})
            .then(b => {
                return b;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    update: function(id, nuevo) {
        return Bookmark.findOneAndUpdate({id: id}, nuevo)
            .then(ub => {
                return ub;
            })
            .catch(error => {
                throw Error(error);
            });
    }
}

module.exports = {
    BookmarkController
};