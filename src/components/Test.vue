<template>
  <div id="test">
    <span>
      <h1>Hello Component</h1><slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  created() {
    // console.log('Created!')
  }
}
</script>