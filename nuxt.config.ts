// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxthub/core',
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: { 
    apiKey: process.env.GODADDY_KEY,
    apiSecret: process.env.GODADDY_SECRET,
    stripeSecret: process.env.STRIPE_SECRET,
    public: {
      BASE_URL: process.env.NUXT_BASE_URL,
      discordClient: process.env.DISCORD_CLIENT, 
      discordSecret: process.env.DISCORD_SECRET,
      apiUrl: process.env.NUXT_GODADDY_URL,
    },
  },

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    }
  },

  compatibilityDate: '2024-09-19',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'iconify'
  },

  llms: {
    domain: 'https://docs-template.nuxt.dev/',
    title: 'Nuxt Docs Template',
    description: 'A template for building documentation with Nuxt UI and Nuxt Content.',
    full: {
      title: 'Nuxt Docs Template - Full Documentation',
      description: 'This is the full documentation for the Nuxt Docs Template.'
    },
    sections: [
      {
        title: 'Getting Started',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' }
        ]
      },
      {
        title: 'Essentials',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/essentials%' }
        ]
      }
    ]
  },

  ui: {
    icons: [
      'mdi',
      'heroicons',
      'simple-icons',
      'ph',
      'material-symbols'
    ]
  },

  app: {
    head: {
      script: [
        { src: 'https://www.marcoguglie.it/Codepen/AnimatedHeaderBg/demo-1/js/EasePack.min.js' },
        { src: 'https://www.marcoguglie.it/Codepen/AnimatedHeaderBg/demo-1/js/rAF.js' },
        { src: 'https://www.marcoguglie.it/Codepen/AnimatedHeaderBg/demo-1/js/TweenLite.min.js' },
      ],
    },
  },

  pinia: {
    autoImports: ['defineStore'], // optional
  },
})