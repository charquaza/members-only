var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        first_name: { type: String, maxLength: 100, required: true },
        last_name: { type: String, maxLength: 100, required: true },
        username: { type: String, maxLength: 100, required: true },
        password: { type: String, required: true },
        is_member: { type: Boolean, default: false },
        is_admin: { type: Boolean, default: false }
    }
);

UserSchema.virtual('url')
    .get(function () {
        return '/' + this._id;
    });

module.exports = mongoose.model('User', UserSchema);