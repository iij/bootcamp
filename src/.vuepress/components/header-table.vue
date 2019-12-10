<template>
  <table>
    <tr>
      <td>このハンズオンでやること</td><td>{{$page.frontmatter.description}}</td>
    </tr>
    <tr>
      <td>想定時間</td><td>{{$page.frontmatter.time}}</td>
    </tr>
    <tr>
      <td>前提知識・用語</td><td>{{$page.frontmatter.prior_knowledge}}</td>
    </tr>
  </table>
</template>

<script>
module.exports = {

}
</script>
