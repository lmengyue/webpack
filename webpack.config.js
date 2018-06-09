const path = require('path');
const webpack = require('webpack');
const uglifyPlugin = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require("extract-text-webpack-plugin");
const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");
const copyWebpackPlugin= require("copy-webpack-plugin");

var website={
	publicPath: 'http://localhost:8088/'
}
module.exports={
	entry:{
		entry: './src/entry.js'
	},
	output:{
		path: path.resolve(__dirname,'dist'),
		filename: '[name].js',
		publicPath: website.publicPath
	},
	module:{
		rules: [
            {
              test: /\.css$/,
              use: extractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader","postcss-loader"]
              })
            },{
               test:/\.(png|jpg|gif)/ ,
               use:[{
                   loader:'url-loader',
                   options:{
                       limit:1000,
                       outputPath: 'images/'
                   }
               }]
            },{
			    test: /\.(htm|html)$/i,
			     use:[ 'html-withimg-loader'] 
			},{
	            test: /\.less$/,
	            use: extractTextPlugin.extract({
	                use: [{
	                    loader: "css-loader"
	                }, {
	                    loader: "less-loader"
	                }],
	                fallback: "style-loader"
	            })
	 		},{
			    test:/\.(jsx|js)$/,  //jsx是react渲染
			    use:{
			        loader:'babel-loader'
			    },
			    exclude:/node_modules/     //过滤掉包管理器文件
			}
          ]
	},
	plugins:[
		new uglifyPlugin(),
		new htmlPlugin({
			minify: {
				removeAttributeQuotes: true
			},
			hash:true,
			template:'./src/index.html'
		}),
		new extractTextPlugin("css/style.css"),
		new PurifyCSSPlugin({
       		 paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new copyWebpackPlugin([{
	        from:__dirname+'/src/public',
	        to:'./public'
	    }])
	],
	mode:'development',
	devServer:{
		contentBase:path.resolve(__dirname,'dist'),
		host:'localhost',
		compress:true,
		port:8088
	}
}
