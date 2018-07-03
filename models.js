'use strict';

//const uuid = require('uuid');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// function StorageException(message) {
//    this.message = message;
//    this.name = "StorageException";
// }

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

const BlogPost = mongoose.model('BlogPost',blogSchema,"blogPosts");

module.exports = {BlogPost};