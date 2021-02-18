import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default {
    mode: "production",
    optimization: {
        concatenateModules: true,
        sideEffects: true,
        minimize: true,
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        }
    },
    performance: {
        hints: 'warning',
        maxEntrypointSize: 250000
    },
    plugins: [
        new BundleAnalyzerPlugin()
    ]
}