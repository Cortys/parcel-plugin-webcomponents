"use strict";

const path = require("path");
const fs = require("fs-extra");
const replace = require("replace-in-file");

module.exports = bundler => {
	function fixBundle(bundle) {
		const { name, childBundles } = bundle;

		// Multiple entrypoints:
		if(name == null) {
			for(const childBundle of childBundles)
				fixBundle(childBundle);

			return;
		}

		replace.sync({
			files: name,
			from: /(?<!<!--webcomponents-->[^]*)<script/,
			to: `<!--webcomponents--><script src="${path.posix.join(bundler.options.publicURL, "webcomponentsjs/webcomponents-loader.js")}"></script><script`
		});
	}

	bundler.on("bundled", bundle => {
		fs.copySync(
			path.dirname(require.resolve("@webcomponents/webcomponentsjs")),
			path.join(bundler.options.outDir, "webcomponentsjs"),
			{
				dereference: true,
				filter: file => file.match(/(webcomponentsjs(\/bundles)?|\.js\.map|\.js)$/) !== null
			}
		);

		fixBundle(bundle);
	});
};
