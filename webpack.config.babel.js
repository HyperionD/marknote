import config from "./config.js";

export default {
    devtool: "source-map",
    entry: config.entry,
    output: {
        filename: config.dist_js_filename,
        path: config.dist_dir
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                        {
                            loader: 'file-loader',
                            options: {
                                emitFile: false,
                                name: '[name].[ext]',
                                outputPath: 'static/'
                            }
                        }
                ]
            }
        ]
    },
};
