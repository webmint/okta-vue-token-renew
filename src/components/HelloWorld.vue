<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <input type="text">
    <div>AT exp: {{ new Date(okta.accessToken.expiresAt * 1000) }}</div>
    <div>ID exp: {{ new Date(okta.idToken.expiresAt * 1000) }}</div>
    <button value="XXXXXX" @click="test">test</button>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  computed: {
    okta() {
      return JSON.parse(localStorage['okta-token-storage']);
    },
  },
  mounted() {
  },
  methods: {
    test() {
      this.$auth.tokenManager.renew('accessToken');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
