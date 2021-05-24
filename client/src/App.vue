<template>
  <div id="app" style="margin : 0; padding : 0;">
    <div class="container-fluid p-0 m-0">
        <login-component :adminUser="adminUser" :updateRequestIn="updateRequestIn" @newDeal="newDeal = $event" @loggedin="adminUser = $event" @backTo="newDeal = !newDeal"/>
        <deals-component :adminUser="adminUser" @updateRequestOrigin="updateRequestOrigin = $event" v-if="!newDeal && !updateRequestOrigin"/>  <!-- listing deals --> 
        <my-form :updateRequest="updateRequestOrigin" v-if="newDeal || updateRequestOrigin" @newFormData="newFormData = $event" @updateFinished="updateFinished = $event" /> <!-- OR setup new del --> 
    </div>
  </div>
</template>

<script>
import LoginComponent from './components/Login.vue';
import MyForm from './components/MyForm.vue';
import DealsComponent from './components/DealsComponent.vue';

export default {
  props : ['updateRequestIn'],
  name: 'App',
  components: {
    LoginComponent,
    DealsComponent,
    MyForm
  },
  data() {
    return {
      adminUser : false,
      newFormData : {},
      newDeal : false,
      updateRequestOrigin : null,
      updateFinished : false
    }
  },

    watch: {
        updateFinished: {
        handler: function (val) {
            // Return the object that changed
            if (val) {
                this.updateRequestOrigin = null;
                this.newDeal = null;
                this.updateFinished = false;
            }
        },
        deep: true
        }
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<style scoped>

</style>