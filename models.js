'use strict';

const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({

	title: {type: String, required: true},	
	content: {type: String, required: true},
	author: {firstName: String, lastName: String},

	created: {type: Date, default: Date.now}
});

const BlogPost = mongoose.model('Blogpost',blogSchema)

module.exports = {BlogPost};