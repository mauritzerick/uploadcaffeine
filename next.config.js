/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Ignore markdown files (fixes @prisma/adapter-libsql README.md import errors)
    config.module.rules.push({
      test: /\.md$/,
      use: 'ignore-loader',
    })

    // Ignore TypeScript definition files from libsql packages
    config.module.rules.push({
      test: /\.d\.ts$/,
      use: 'ignore-loader',
    })

    // Exclude libsql packages from being processed by webpack (server-side only)
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
