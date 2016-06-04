const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
	entry: {
		src: path.join(__dirname, 'src')
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.ProvidePlugin({ 
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery'
    	}),
    	new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				warnings:false
			}
		}),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
	],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /\.scss$/,
				loader: "style!css!sass"
			},
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
		]
	}
};

	/*,
    	new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				warnings:false
			}
		}),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
		new CompressionPlugin({
      		asset: "[path].gz[query]",
      		algorithm: "gzip",
      		test: /\.js$|\.css$|\.html$/,
      		threshold: 10240,
      		minRatio: 0.8
    	})*/