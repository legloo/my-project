<template>
  <div class="main">
    <TreeRight :list="list" :showfields="showFields" />
  </div>
</template>

<script>
import TreeRight from "vue-tree-right";
export default {
  components: {
    TreeRight,
  },
  data() {
    return {
      list: [
        {
          id: "z21",
          name: "leglo22",
          age: "18",
          gender: "男",
          work: "web",
          children: [
            {
              name: "leglo1",
              age: "18",
              gender: "男",
              work: "web",
              id: "z1-1",
              children: [
                {
                  name: "leglo1-1",
                  age: "18",
                  gender: "男",
                  work: "web",
                  id: "z1-1-1",
                  children: [
                    {
                      name: "leglo1-1-1",
                      age: "18",
                      gender: "男",
                      work: "web",
                      id: "z1-1-1",
                    },
                  ],
                },
                {
                  id: "z1-1-2",
                  name: "leglo1-2",
                  age: "18",
                  gender: "男",
                  work: "web",
                },
                {
                  id: "z1-1-3",
                  name: "leglo1-3",
                  age: "18",
                  gender: "男",
                  work: "web",
                },
                {
                  id: "z1-1-4",
                  name: "leglo1-4",
                  age: "18",
                  gender: "男",
                  work: "web",
                },
              ],
            },
            {
              name: "leglo2",
              id: "z1-2",
              age: "18",
              gender: "男",
              work: "web",
            },
          ],
        },
      ],
      showFields: [
        {
          name: "姓名：",
          key: "name",
        },
        {
          name: "年龄：",
          key: "age",
        },
      ],
    };
  },
};
</script>

<style>
.main {
  padding: 20px;
  background-color: antiquewhite;
}
</style>