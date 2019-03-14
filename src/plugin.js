"use strict";

const path = require("path");
const fs = require("fs-extra");
const replace = require("replace-in-file");

module.exports = bundler => {
	function fixBundle(bundle) {
		const { name, type, childBundles } = bundle;

		if(type === "html")
			replace.sync({
				files: name,
				from: /(?<!<!--webcomponents-->[^]*)<script/,
				to: `<!--webcomponents--><script src="${path.posix.join(bundler.options.publicURL, "webcomponentsjs/webcomponents-loader.js")}"></script><script`
			});

		for(const childBundle of childBundles)
			fixBundle(childBundle);
	}

	bundler.on("bundled", bundle => {
		fs.copySync(
			path.dirname(require.resolve("@webcomponents/webcomponentsjs")),
			path.join(bundler.options.outDir, "webcomponentsjs"),
			{
				dereference: true,
				filter: file => file.match(/(webcomponentsjs([/\\]bundles)?|\.js\.map|\.js)$/) !== null
			}
		);

		fixBundle(bundle);
	});
};
