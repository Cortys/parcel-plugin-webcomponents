"use strict";

const path = require("path");
const fs = require("fs-extra");
const replace = require("replace-in-file");

module.exports = bundler => {
	bundler.on("bundled", bundle => {
		fs.copySync(
			path.dirname(require.resolve("@webcomponents/webcomponentsjs")),
			path.join(path.dirname(bundle.name), "webcomponentsjs"),
			{
				dereference: true,
				filter: file => file.match(/(webcomponentsjs(\/bundles)?|\.js\.map|\.js)$/) !== null
			}
		);

		replace.sync({
			files: bundle.name,
			from: /<script/,
			to: `<script src="${path.join(bundler.options.publicURL, "webcomponentsjs/webcomponents-loader.js")}"></script><script`
		});
	});
};
