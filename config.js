'use strict';

//	Allows us to easily configure values for the Mongo database URL 
//	and the port the application will run on.
exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://localhost/blog-app';

exports.PORT = process.env.PORT || 8080;