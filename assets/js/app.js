
  import{createApp} from '../../node_modules/vue/dist/vue.esm-browser.prod.js';

  const appConfig = {
    data(){
      return {
        data: [],
        rateUSD: 0,
        rateEUR: 0,
        date1: null,
        date2: null,
        date3: null,
        date4: null,
        amountTaken1: 0,
        amountReturn1: 0,
        amountTaken2: 0,
        amountReturn2: 0,
        diffTaken: '',
        diffReturn: ''
      }
    },

    async mounted() {
      let arr = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/ovdp?json');
          arr = await arr.json();

      this.data = arr;

      let currencies = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
          currencies = await currencies.json();

      console.log('Data Loaded');

      for(let item of currencies){
        if(item.cc == "USD"){
          this.rateUSD = item.rate;
        }else if(item.cc == "EUR"){
          this.rateEUR = item.rate;
        }
      }
    },

    computed: {
      getValues(){
        let arrTaken1 = [];
        let arrTaken2 = [];
        let arrReturn1 = [];
        let arrReturn2 = [];

        for(let item of this.data){
          if (item.valcode == "USD") {
            item.attraction = item.attraction * this.rateUSD;
          } else if (item.valcode == "EUR") {
            item.attraction = item.attraction * this.rateEUR;
          }

          item.paydate = item.paydate.split('.').reverse().join('-');
          item.repaydate = item.repaydate.split('.').reverse().join('-');

          if (item.paydate >= this.date1 && item.paydate <= this.date2){
            arrTaken1.push(item.attraction);
          } else if (item.repaydate >= this.date1 && item.repaydate <= this.date2) {
            arrReturn1.push(item.attraction);
          } 
          
          if (item.paydate >= this.date3 && item.paydate <= this.date4){
            arrTaken2.push(item.attraction);
          } else if (item.repaydate >= this.date3 && item.repaydate <= this.date4){
            arrReturn2.push(item.attraction);
          }
        }

        this.amountTaken1 = arrTaken1.reduce((a, b) => a + b, 0);
        this.amountReturn1 = arrReturn1.reduce((a, b) => a + b, 0);
        this.amountTaken2 = arrTaken2.reduce((a, b) => a + b, 0);
        this.amountReturn2 = arrReturn2.reduce((a, b) => a + b, 0);
      }
    },

    methods: {
      calculateDiff() {
        this.getValues;
        
        if (this.amountTaken1 > this.amountTaken2 && this.amountTaken1 != 0) {
          this.diffTaken = `-${(((this.amountTaken1 - this.amountTaken2) / this.amountTaken1) * 100).toFixed()}%`;
        } else if (this.amountTaken1 < this.amountTaken2 && this.amountTaken1 != 0) {
          this.diffTaken = `+${(((this.amountTaken2 - this.amountTaken1) / this.amountTaken1) * 100).toFixed()}%`;
        } else if (this.amountTaken1 == this.amountTaken2){
          this.diffTaken = '0%';
        }

        if (this.amountReturn1 > this.amountReturn2 && this.amountTaken1 != 0) {
          this.diffReturn = `-${(((this.amountReturn1 - this.amountReturn2) / this.amountReturn1) * 100).toFixed()}%`;
        } else if (this.amountReturn1 < this.amountReturn2 && this.amountTaken1 != 0) {
          this.diffReturn = `+${(((this.amountReturn2 - this.amountReturn1) / this.amountReturn1) * 100).toFixed()}%`;
        } else if (this.amountReturn1 == this.amountReturn2) {
          this.diffReturn = '0%';
        }
      }
    }
  }

  const app = createApp(appConfig);

  app.mount('#app');