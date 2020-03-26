<template>
  <div>
    <countTo :startVal="startVal" :endVal="endVal" :duration="60000"></countTo>
  </div>
</template>
<script>
import countTo from "vue-count-diy";
export default {
  components: { countTo },
  data() {
    return {
      startVal: 0,
      endVal: 1231231313
    };
  },
  computed: {
  },
  mounted() {
  },
  created() {
  }
};
</script>

<style lang="scss" scoped>
</style>
