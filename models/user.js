var mongoose = require(mongoose);
var Schema = mongoose.Schema;

var UserSchema = new Schema(
	{
		firstname: {type: String, required: true},
		lastname: {type: String, required: true},
		username: {type: String, required: true},
		isMember: {type: Boolean, required: true}
	}
)

UserSchema
.virtual('url')
.get(function(){
	return '/league/users/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);