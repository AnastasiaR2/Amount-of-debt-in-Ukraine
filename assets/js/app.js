
  import{createApp} from '../../node_modules/vue/dist/vue.esm-browser.prod.js';

  const appConfig = {
    data(){
      return {
        date1: null,
        date2: null
      }
    },

    async mounted() {
      let data = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/ovdp?json');
          data = await data.json();
      
      console.log(data);

      let currencies = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
          currencies = await currencies.json();

      // console.log(currencies);
    }
  }

  const app = createApp(appConfig);

  app.mount('#app');

  