module.exports = {
  title: 'IIJ Bootcamp',
  description: 'IIJ で実施している主に新人向けのハンズオン資料集です。',
  themeConfig: {
    sidebar: 'auto',
    lastUpdated: 'Last Updated',
    repo: 'iij/bootcamp',
    docsDir: 'src',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub'
  },
  markdown: {
    extendMarkdown: md => {
      md.set({
        linkify: true
      })
    }
  },
  base: '/bootcamp/',
  dest: 'docs',
  plugins: ['@vuepress/register-components']
}