var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
	{
		firstname: {type: String, required: true},
		lastname: {type: String, required: true},
		username: {type: String, required: true},
		password: { type: String, required: true },
		isMember: {type: Boolean, required: true}
	}
)

module.exports = mongoose.model('User', UserSchema);