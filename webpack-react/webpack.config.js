module.exports = {
		entry: "./js/main.js",
		output: {
				path: __dirname,
				filename: "bundle.js"
		},
		module: {
			loaders : [
			{
				test: /\.css$/,
				loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
			}, {
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}]
		}
};