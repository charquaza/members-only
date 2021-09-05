var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        title: { type: String, maxLength: 100, required },
        timestamp: { type: Date, required },
        body: { type: String, required },
        author: { type: Schema.Types.ObjectId, ref: 'User', required }
    }
);

MessageSchema.virtual('url')
    .get(function () {
        return '/' + this._id;
    });

module.exports = mongoose.model('Message', MessageSchema);