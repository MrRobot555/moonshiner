<template>
   <div class="container">
       <form @submit.prevent="sendFile" enctype="multipart/form-data">
                <div class="upload-panel p-2">
                    <b-icon icon="cloud-upload" aria-hidden="true" font-scale="3"></b-icon>
                    <h2>Deal Image Upload</h2>
                        <b-row class="text-center">
                            <input 
                                type = "file"
                                ref = "file"
                                @change="previewImage"
                                accept="image/*"
                            />
                        </b-row>
                        <b-row class="my-2">
                            <div v-if="imageData.length == 0" class="file-label">
                                    Choose a file!
                            </div>
                            <div v-else class="text-success">
                                <b-overlay :show="inProgress" rounded="sm">
                                    <img :src="imageData" alt="" width="100%">
                                    <div class="done" v-if="ready">
                                        <template v-if="success">
                                            <b-icon icon="check2-circle" aria-hidden="true" font-scale="5" style="color: #01f986 !important;"></b-icon>                     
                                            <h1 class="text-uppercase donetext" style="color: #01f986 !important;">uploaded</h1>
                                        </template>
                                        <template v-else>
                                            <b-icon icon="emoji-frown" aria-hidden="true" font-scale="5" style="color: #f90101!important;"></b-icon>                     
                                            <h1 class="text-uppercase donetext" style="color: #f90101!important;">failed</h1>                                            
                                        </template>
                                    </div>
                                    <b-row class="m-0 p-0">
                                        <b-button type="submit" block variant="primary" class="my-2">upload file</b-button>
                                    </b-row>
                                </b-overlay>
                            </div>
                        </b-row>
                </div>
                
       </form>
   </div>
</template>

<script>
import axios from 'axios';
export default {
 name : "MyUpload",
 data() {
     return {
         file : null,
         imageData : "",
         inProgress : false,
         ready : false,
         success : false
     }
 },

 methods: {
     selectFile() {
         this.file = this.$refs.file.files[0];
         this.ready = false;
     },

        previewImage(event) {
            // Reference to the DOM input element
            const input = event.target;
            // Ensure that you have a file before attempting to read it
            if (input.files && input.files[0]) {
                this.selectFile();
                console.log(this.file);
                // create a new FileReader to read this image and convert to base64 format
                var reader = new FileReader();
                // Define a callback function to run, when FileReader finishes its job
                reader.onload = (e) => {
                    // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                    // Read image as base64 and set to imageData
                    this.imageData = e.target.result;
                }
                // Start the reader job - read file as a data url (base64 format)
                reader.readAsDataURL(input.files[0]);
            }
        },

     async sendFile() {
         this.inProgress = true;
         let vm = this;
         const formData = new FormData();
         formData.append('file', this.file);
         try {
             await axios.post('/upload', formData)
             .then(function (response) {
                    vm.inProgress = false;
                    console.log('response: ', response);
                    vm.ready = true;
                    vm.success = true;
                    console.log('image ID: ', response.data.file.id);
                    vm.$emit('newImgId', response.data.file.id);
              });
         } catch (error) {
             vm.inProgress = false;
             console.log(error);
             vm.ready = true;
             vm.success = false;
         } 
     }
 },
}
</script>

<style scoped>
    .upload-panel {
        width : 100%;
        background-color : lightblue;
        color : black;
    }
    .done {
        position : absolute;
        top : 0;
        width : 100%;
        height : 97%;
        background-color : rgba(0,0,0,0.2);
        display : flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .donetext {
        letter-spacing: 0.08em;
        font-weight: bold;
    }
</style>