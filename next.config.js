/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGO_URL:
      'mongodb+srv://desaianiruddh:anii123@cluster0.b8zam.mongodb.net/pizzaDeliery?retryWrites=true&w=majority',
    ADMIN_USERNAME: 'admin',
    ADMIN_PASSWORD: '1234321',
    TOKEN: '!0:#QEF7i3x7d;Gs`h$f',
    BASE_URL: 'https://pizza-delivery-app-with-next-js.vercel.app',
  },
};

module.exports = nextConfig;
