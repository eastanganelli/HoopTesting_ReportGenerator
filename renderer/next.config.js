/** @type {import('next').NextConfig} */
module.exports = {
  output: 'renderer',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  },
}
