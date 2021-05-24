<template>

    <div class="container mt-4" style="max-width : 500px;">
        <b-row v-if="saved" class="text-center text-white bg-success mb-2">
            <h5 class="py-1 my-0">saved</h5>
        </b-row>
        <b-row>
            <form @submit.prevent="sendData">
                <div class="form-group">
                    <label for="prodName">Product Name</label>
                    <input type="text"
                        id="prodName"
                        class="form-control mb-3"
                        required
                        v-model="dealObj.prodName">

                    <label for="warehouse">Warehouse</label>
                    <input type="text"
                        id="warehouse"
                        class="form-control mb-3"
                        required
                        v-model="dealObj.warehouse">

                    <label for="normPrice">Normal Price</label>
                    <input type="number"
                        id="normPrice"
                        class="form-control mb-3"
                        required
                        v-model="dealObj.normPrice">

                    <label for="reducedPrice">Reduced Price</label>
                    <input type="number"
                        id="reducedPrice"
                        class="form-control mb-3"
                        required
                        v-model="dealObj.reducedPrice">

                    <label for="rate">Reduction Rate</label>
                    <input type="number"
                        style="background-color : #d3d3d3!important;"
                        id="reducedPrice"
                        class="form-control mb-3"
                        disabled
                        v-model="rate">

                    <b-row class="my-4 text-18">
                        Set starting and ending times:
                        <date-range-picker style="margin: 0;"
                            ref="picker"
                            v-model="dealObj.dealPeriod"
                            :timePicker="datePicker.timePicker"
                            :showDropdowns="datePicker.showDropdowns"
                            :showWeekNumbers="datePicker.showWeekNumbers"
                            :ranges="datePicker.ranges"
                            :locale-data="datePicker.format"
                            :timePickerIncrement="datePicker.increment"
                            :timePicker24Hour="datePicker.timePicker24Hour"
                            :timePickerSeconds="datePicker.timePickerSeconds"
                            >
                        </date-range-picker>
                    </b-row>
                    <b-row class="my-3">
                        <b-button v-if="!this.dealObj.imageId" disabled type="submit" block variant="primary" class="my-2">save data</b-button>
                        <b-button v-if="this.dealObj.imageId" type="submit" block variant="primary" class="my-2">save data</b-button>
                    </b-row>
                    <b-row class="mb-5">
                        <my-upload @newImgId="dealObj.imageId = $event"/>
                    </b-row>
                </div>
            </form>
        </b-row>
    </div>
</template>

<script>
    import DateRangePicker from 'vue2-daterange-picker';
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
    import MyUpload from './MyUpload.vue';
/*     import axios from 'axios'; */
//eslint-disable-next-line
    import DealsService from '../dealsService'
export default {
    props : ["updateRequest"],
    components: { 
        DateRangePicker,
        MyUpload,
//eslint-disable-next-line
        DealsService
    },
    data() {
        return {
            updateMode : false,
            saved : false,
            newImage : "",
            dealObj : {
                prodName : '',
                warehouse : '',
                normPrice : null,
                reducedPrice : null,
                dealPeriod : {
                    startDate : null,
                    endDate : null
                },
                imageId : null
            },
                datePicker : {
                    dateRange:  {
                        startDate: null,
                        endDate: null
                    },
                    timePicker : true,
                    showDropdowns : true,
                    showWeekNumbers : false,
                    ranges : false,
                    format : {
                            direction: 'ltr',
                            format: 'yyyy/mm/dd/ HH:MM',
                            separator: ' - ',
                            applyLabel: 'Apply',
                            cancelLabel: 'Cancel',
                            weekLabel: 'W',
                            customRangeLabel: 'Custom Range',
                            daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                            monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            firstDay: 1
                    },
                    increment : 30,
                    timePicker24Hour : true,
                    timePickerSeconds : false

                },            
        }
    },

    watch: {
        updateRequest: {
        immediate: true,
        handler: function (val) {
            console.log('updateRequest : ', this.updateRequest);
            // Return the object that changed
            if (val) {

                this.dealObj = {
                    _id : val._id,
                    prodName : val.prodName,
                    warehouse : val.warehouse,
                    normPrice : val.normPrice,
                    reducedPrice : val.reducedPrice,
                    dealPeriod : {
                        startDate : val.dealPeriod.startDate,
                        endDate : val.dealPeriod.endDate
                    },
                    imageId : val.imageId
                };

                this.updateMode = true;
            }
        },
        deep: true
        }
    },

    methods: {

        async sendData() {
            /* const auth = '/api/deals/login/'+this.username+'/'+this.pass; */
            let vm = this;
            if (this.updateMode) {
                console.log('update triggered');
                try {
                    await DealsService.updateDeals(vm.dealObj._id, vm.dealObj)
                    .then(function (response) {
                            console.log('updateResponse: ', response);
                            vm.$emit('updateFinished', true);
                    });
                } catch (error) {
                    console.log(error);
                } 
            } else {
                try {
                    await DealsService.createDeals(vm.dealObj)
                    .then(function (response) {
                            console.log('createResponse: ', response);
                            vm.saved = true;
                            vm.resetPage();
                    });
                } catch (error) {
                    console.log(error);
                } 
            }
        },

        resetPage() {
            this.dealObj = {
                prodName : '',
                warehouse : '',
                normPrice : null,
                reducedPrice : null,
                dealPeriod : {
                    startDate : null,
                    endDate : null
                },
                imageId : null
            };

        }

    },

    computed : {
        rate() {
            return (this.dealObj.reducedPrice / this.dealObj.normPrice).toFixed(2);
        },

        allowSave() {
            return (this.dealObj.imageId);
        }
    }
}
</script>

<style scoped>
    .date-picker {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: left;
        color: #2c3e50;
    }

    label {
        text-align: left;
    }

    input {
        background-color : #e6f0ff!important;
    }

    ::v-deep .reportrange-text {
        background-color : #e6f0ff!important;
    }
</style>