// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Sisyphus',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/android-chrome-512x512.png',

  // Set the production url of your site here
  url: 'https://sisyphus.jamesthebard.net',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'JamesTheBard', // Usually your GitHub org/user name.
  projectName: 'sisyphus-docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      navbar: {
        title: 'Sisyphus',
        logo: {
          alt: 'Sisyphus Encoding Server',
          src: 'img/red-circle.png',
        },
        items: [
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Installation',
          // },
          {
            href: '/category/installation',
            label: 'Installation',
            position: 'left',
          },
          {
            href: '/category/operations',
            label: 'Operations',
            position: 'left',
          },
          {
            href: '/category/modules',
            label: 'Modules',
            position: 'left',
          },
          {
            href: 'https://github.com/JamesTheBard',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Sisyphus Repositories',
            items: [
              {
                label: 'Client',
                href: 'https://github.com/JamesTheBard/sisyphus-client',
              },
              {
                label: 'Server',
                href: 'https://github.com/JamesTheBard/sisyphus-server',
              },
              {
                label: 'Frontend',
                href: 'https://github.com/JamesTheBard/sisyphus-frontend',
              },
              {
                label: 'Handbrake',
                href: 'https://github.com/JamesTheBard/sisyphus-handbrake',
              },
              {
                label: 'Ffmpeg',
                href: 'https://github.com/JamesTheBard/sisyphus-ffmpeg',
              },
              {
                label: 'Matroska',
                href: 'https://github.com/JamesTheBard/sisyphus-matroska',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Mastodon',
                href: 'https://social.linux.pizza/@jamesthebard'
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/JamesTheBard',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                href: 'https://blog.jamesthebard.net',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/JamesTheBard',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} JamesTheBard. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: [
          'powershell',
          'json',
          'shell-session',
          'toml'
        ]
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      }
    }),
};

module.exports = config;
