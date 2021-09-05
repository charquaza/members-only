var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        first_name: { type: String, maxLength: 100, required },
        last_name: { type: String, maxLength: 100, required },
        username: { type: String, maxLength: 100, required },
        password: { type: String, required },
        is_member: { type: Boolean, required }
    }
);

UserSchema.virtual('url')
    .get(function () {
        return '/' + this._id;
    });

module.exports = mongoose.model('User', UserSchema);