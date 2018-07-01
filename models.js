'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const blogSchema = mongoose.Schema({

	title: {type: String, required: true},	
	content: {type: String, required: true},
	author: {firstName: String, lastName: String},

	created: {type: Date, default: Date.now}
});

blogSchema.virtual('authorName').get(function(){
	return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogSchema.methods.serialize = function() {
	return {
		title: this.title,
		author: this.authorName,
		content: this.content,
		id: this._id,
		created: this.created
	};
};

const BlogPost = mongoose.model('Blogpost',blogSchema)

module.exports = {BlogPost};