<template>
<div>
<el-form :model="signUp" status-icon label-width="100px" class="demo-ruleForm">
  <el-form-item label="name">
    <el-input v-model="signUp.name"></el-input>
  </el-form-item>
  <el-form-item label="密码">
    <el-input type="password" v-model="signUp.pass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="signup()">注册</el-button>
  </el-form-item>
</el-form>
<!-- // -->
<el-form :model="form" status-icon label-width="100px" class="demo-ruleForm">
  <el-form-item label="name">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="密码">
    <el-input type="password" v-model="form.pass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="login()">登录</el-button>
  </el-form-item>
</el-form>
</div>
</template>
<script>
import { signUp, signIn} from "../apis/apis";
import Axios from 'axios';
  export default {
    data() {
      return {
        form: {
          name: '',
          pass: '',
        },
        signUp:{
            name:'',
            pass:''
        },
        url: "",
        signinurl: "/domain",
      };
    },
    methods: {
      async signup(){
          try{
            let req = {
                username:this.signUp.name,
                password:this.signUp.pass
            }
            let res = await signUp(req);
            if(res.status === 200){
                localStorage.setItem('token',res.data.token);
            }
          }catch(e){
              this.$message.error(e.response.data.message)
          }
        },
       async login(){
            try{
            let res = await signIn({
                username:this.form.name,
                password:this.form.pass
            })
            if(res.status === 200){
                localStorage.setItem('token',res.data.token);
            }
          }catch(e){
              this.$message.error(e.response.data.message)
          }
        }
    }
  }
</script>