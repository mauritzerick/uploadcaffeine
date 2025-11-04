/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Prevent markdown from node_modules breaking webpack (libsql packages ship README.md)
    config.module.rules.push({ test: /\.md$/, use: 'ignore-loader' })
    
    // Exclude libsql from client-side bundling
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        '@libsql/client': 'commonjs @libsql/client',
        '@prisma/adapter-libsql': 'commonjs @prisma/adapter-libsql',
      })
    }
    
    return config
  },
}

module.exports = nextConfig
