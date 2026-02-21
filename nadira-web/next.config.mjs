/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // pg работает только в Node.js окружении, не в Edge Runtime
    serverComponentsExternalPackages: ['pg'],

    // Увеличиваем лимит тела запроса до 110MB для загрузки видео
    serverActions: {
      bodySizeLimit: '110mb',
    },
  },
};

export default nextConfig;
