module.exports = {
    entry: [
        "./scripts/load.js",
        "./scripts/main.js"
    ],
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /.js$/, exclude: /node_modules/, loader: 'babel?presets[]=es2015' }
        ]
    }
};