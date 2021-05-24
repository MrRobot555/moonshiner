<template>
    <div>
        <div>
          <b-table 
            striped
            hover 
            :items="filtered"
            :fields="fields"
            >
          
            <template #cell(Delete)="data">
              <b-button block size="sm" @click = "deleteRow(data.value)" variant="primary">delete</b-button>
            </template>

            <template #cell(Update)="data">
              <b-button block size="sm" @click = "updateRow(data.value)" variant="primary">update</b-button>
            </template>

            <template slot="top-row" slot-scope="{ fields }">
              <td v-for="field in fields" :key="field.key">
                <input v-if="field.label !== 'Deal Period' && field.label !== 'Delete' && field.label !== 'Update' " v-model="filters[field.key]" :placeholder="field.label">
              </td>
            </template> 

            </b-table>
        </div>
    </div>
</template>

<script>
import DealsService from '../dealsService'

export default {
  props : ['adminUser'],
  name: 'XXLDealsPlatform',
  data() {
    return {
      filters: {
        Product_name: '',
        Warehouse: '',
        Normal_price: '',
        Reduced_price: '',
        Reduction_rate: ''
      },
      items : [],
      deals : [],
      error : '',
      text : ''
    }
  },

  created() {
      this.readIn();
  },


  methods: {

  async readIn() {
    this.items = [];
    let vm = this;
    try {
      this.deals = await DealsService.getDeals();
          vm.deals.forEach(function (deal) {
              const startDate = new Date(deal.dealPeriod.startDate);
              const endDate = new Date(deal.dealPeriod.endDate);
              const startDateString = startDate.getFullYear() + ' / ' + Number(startDate.getMonth()+1) + ' / ' + startDate.getDate();
              const endDateString = endDate.getFullYear() + ' / ' + Number(endDate.getMonth()+1) + ' / ' + endDate.getDate();
              vm.items.push({
                Product_name : deal.prodName,
                Warehouse : deal.warehouse,
                Normal_price : deal.normPrice,
                Reduced_price : deal.reducedPrice,
                Reduction_rate : Number(deal.reducedPrice / deal.normPrice).toFixed(2),
                Deal_period : 'start: '+startDateString+' --- end: '+endDateString,
                Delete : deal._id,
                Update : deal
              });
          });
    } catch (error) {
      this.error = error;
    }
  },

        async deleteRow(id) {
            let vm = this;
            try {
                await DealsService.deleteDeals(id)
                .then(function (response) {
                        console.log('deleteResponse: ', response);
                        vm.readIn();
                });
            } catch (error) {
                console.log(error);
            } 
        },

        updateRow(dealObj) {
            this.$emit('updateRequestOrigin', dealObj);
        },

  },

  computed: {
    filtered () {
      const filtered = this.items.filter(item => {
        return Object.keys(this.filters).every(key =>
            String(item[key]).includes(this.filters[key]))
      })
      return filtered.length > 0 ? filtered : [{
        Product_name: '',
        Warehouse: '',
        Normal_price: '',
        Reduced_price: '',
        Reduction_rate: ''
      }]
    },

    fields() {

      if (this.adminUser) {
        return [
          { key: 'Product_name', sortable: true },
          { key: 'Warehouse', sortable: true },
          { key: 'Normal_price', sortable: true },
          { key: 'Reduced_price', sortable: true },
          { key: 'Reduction_rate', sortable: true },
          { key: 'Deal_period', sortable: false },
          { key: 'Delete', sortable: false },
          { key: 'Update', sortable: false }
        ];
      }
      else {
        return [
          { key: 'Product_name', sortable: true },
          { key: 'Warehouse', sortable: true },
          { key: 'Normal_price', sortable: true },
          { key: 'Reduced_price', sortable: true },
          { key: 'Reduction_rate', sortable: true },
          { key: 'Deal_period', sortable: false }
        ];
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
