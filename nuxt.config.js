let baseUrl = 'http://api.your.colibri.tj/api/'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head

  ssr: false,

  head: {
    title: "Админ панель Your",
    htmlAttrs: {
      lang: "ru",
    },

    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/css/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/axios.js'},
    {src: '~/plugins/vuelidate.js'}
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxt/postcss8", "@nuxtjs/google-fonts"],

  googleFonts: {
    families: {
      Manrope: [200, 300, 400, 500, 600, 700, 800],
    },
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    ["vue2-editor/nuxt"]
  ],
 axios: {
  baseURL: `${baseUrl}`,
 },
auth: {
  axios: {
    // credentials: true,
    baseUrl: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  },

    watchLoggedIn: true,
    resetOnError: true,
    strategies: {
      local: {
        url: baseUrl,
        token: {
          property: "data.token",
          maxAge: false,
          global: true,
        },
        user: {
          property: "data",
          autoFetch: true
        },
        endpoints: {
          login: {
            url: `${baseUrl}auth/login`,
          },
          logout: {
            url: `${baseUrl}auth/logout`,
          },
          user: {
            url: `${baseUrl}profile`,
          },
        },
        autoFetchUser: true
      },
    },
    redirect: {
      login: "/login",
      logout: "/login",
      callback: '/login',
      home: "/",
    },
  },
  router: {
    middleware: ["auth"],
  },



  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    extend(config, { isDev, isClient }) {
      const svgRule = config.module.rules.find((rule) => rule.test.test('.svg'))

      svgRule.exclude = /(sprite)\\.svg$/

      config.module.rules.push({
        test: /(sprite)\\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          symbolId: 'icon-[name]',
        },
      })
    },
  },
};
