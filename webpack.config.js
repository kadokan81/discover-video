const path = require('path');

module.exports = {
	//...
	resolve: {
		alias: {
			'magic-sdk': path.resolve(
				__dirname,
				'node_modules/magic-sdk/dist/cjs/index.js'
			),
		},
	},
};
