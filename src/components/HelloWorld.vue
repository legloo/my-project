<template>
  <Row style="background:#eee;padding:20px">
    <i-col span="24">
      <Card style="width:320px;background:#fff" v-for="item in routes" :key="item.value">
        <div style="text-align:center;" @click="routePush(item)">
          <h3>{{item.name}}</h3>
        </div>
      </Card>
    </i-col>
  </Row>
</template>

<script>
export default {
  name: "helloworld",
  data() {
    return {
      routes: []
    };
  },
  methods: {
    routePush(item) {
      if (!item.path) return;
      this.$router.push(item.path);
    }
  },
  created() {
    this.routes = this.$router.options.routes
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h3 {
  :hover {
    cursor: default;
  }
}
</style>
