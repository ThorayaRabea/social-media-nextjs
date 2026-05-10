/** @type {import('next').NextConfig} */
const nextConfig = {
  //https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/1775944498260-5eb6ce6e-a8ca-4855-b7a0-814bfea3a27e-route.webp
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "linked-posts.routemisr.com",
        pathname: "/account123/**",
      },
      {
        protocol: "https",
        hostname: "pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev",
        pathname: "/linked-posts/**",
      },
      {
        protocol: "https",
        hostname: "pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev",
        pathname: "/linkedPosts/**",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/linked-posts/**",
      },
    ],
  },

  reactStrictMode: false,
};

module.exports = nextConfig;
