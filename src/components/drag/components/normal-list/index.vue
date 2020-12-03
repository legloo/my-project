<template>
  <div class="normal-list">
    <div
      class="list-item"
      v-for="(item, index) in list"
      :key="'normal-list' + index"
    >
      <p>{{ item.name }}</p>
      <p>{{ item.time }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datasource: {
      required: false,
    },
  },
  data() {
    return {
      list: [
        {
          name: "123",
          time: "2020年12月03日14:34:40",
        },
         {
          name: "456",
          time: "2020年12月03日19:07:25",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.normal-list {
  display: flex;
  flex-direction: column;
  .list-item {
    display: flex;
    justify-content: space-between;
  }
}
</style>