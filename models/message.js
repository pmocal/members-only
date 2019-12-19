var mongoose = require(mongoose);
var Schema = mongoose.Schema;

var MessageSchema = new Schema(
	{
		title: {type: String, required: true},
		timestamp: {type: Date, required: true},
		text: {type: String},
		user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
	}
)

MessageSchema
.virtual('url')
.get(function(){
	return '/league/messages/' + this._id;
});

module.exports = mongoose.model('Message', MessageSchema);