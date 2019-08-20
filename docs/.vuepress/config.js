module.exports = {
  title: 'IIJ Bootcamp',
  description: 'IIJ で実施している主に新人向けのハンズオン資料集です。',
  themeConfig: {
    sidebar: 'auto',
    lastUpdated: 'Last Updated',
    repo: 'iij/bootcamp',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub'
  },
  plugins: ['@vuepress/register-components']
}
