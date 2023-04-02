/** @type {import('next').NextConfig} */
const fs = require("fs")

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
        config.resolve.fallback = {
            fs: false
        }
    }

    return config
  }
}

module.exports = nextConfig
