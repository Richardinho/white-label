module.exports = {
		entry: "./js/main.js",
		output: {
				path: __dirname,
				filename: "bundle.js"
		},
		module: {
			loaders : [
			{
				test: /\.css$/,  //  I believe this is the file type that the loader will be applied to.
				//  example of query parameters passed to loaders
				loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
			}, {
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}, {
        test: /\.scss$/,
        loaders: ["style", "css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]", "sass"]
      }]
		}
};