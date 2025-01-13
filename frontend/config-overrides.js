const webpack = require('webpack');

module.exports = function override(config, env) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        path: require.resolve("path-browserify"),
        fs: false,
        net: false,
        http: require.resolve("stream-http"),
        stream: require.resolve("stream-browserify"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        util: require.resolve("util/"),
        crypto: require.resolve("crypto-browserify"),
        buffer: require.resolve("buffer/"),
        zlib: require.resolve("browserify-zlib"),
        assert: require.resolve("assert/"),
    };

    

    return config;
};