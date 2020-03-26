<template>
<div>
  <div style="height:5000px"></div>
  <Select v-model="model1" style="width:200px">
    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
  <i-select v-model="model1" style="width:200px">
    <i-option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
  </i-select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cityList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      model1: ""
    };
  }
};
</script>
