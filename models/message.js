var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        title: { type: String, maxLength: 100, required: true },
        timestamp: { type: Date, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    }
);

MessageSchema.virtual('url')
    .get(function () {
        return '/message/' + this._id;
    });

module.exports = mongoose.model('Message', MessageSchema);