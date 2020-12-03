<template>
  <div class="normal-text">
    <p :style="getStyle">{{ content }}</p>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      required: false,
    },
    fontSize: {
      required: false,
      default: 14,
    },
    // datasource,
  },
  data() {
    return {};
  },
  computed: {
    getStyle() {
      return {
        fontSize: `${this.fontSize}px`,
      };
    },
  },
};
</script>

<style scoped>
p {
  word-break: break-all;
}
</style>