<template>
  <div>
    <intro></intro>
    <div id="body">
      <div id="current">
        <current v-bind:currentCurrency.sync="currentCurrency" />
      </div>
      <div id="previous">
        <previous v-bind:previousCurrency.sync="previousCurrency" />
      </div>
    </div>
  </div>
</template>

<script>
import Intro from './components/Intro.vue'
import Current from './components/Current.vue'
import Previous from './components/Previous.vue'
import moment from 'moment'
import axios from 'axios'
import Pusher from 'pusher-js'

export default {
  name: 'app',
  components: {Intro, Current, Previous},
  data () {
    return {
      currentCurrency: {BTC: '', ETH: '', LTC: ''},
      previousCurrency: {
        yesterday: {},
        twoDays: {},
        threeDays: {},
        fourDays: {},
        fiveDays: {}
      }
    }
  },
  methods: {
    _fetchDataFor: function (key, daysAgo) {
      let date = moment().subtract(daysAgo, 'days').unix()
      let tempPreviousCurrency
      let fetch = (curr, date) => axios.get(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${curr}&tsyms=USD&ts=${date}`)

      axios.all([fetch('BTC', date), fetch('ETH', date), fetch('LTC', date)])
        .then(axios.spread((BTC, ETH, LTC) => {
          tempPreviousCurrency = Object.assign({}, this.previousCurrency, {
            [key]: {
              BTC: BTC.data.BTC.USD,
              LTC: LTC.data.LTC.USD,
              ETH: ETH.data.ETH.USD,
              DATE: moment.unix(date).format('MMMM Do YYYY')
            }
          })

          this.previousCurrency = tempPreviousCurrency
          localStorage.setItem(`${key}Prices`, JSON.stringify(this.previousCurrency[key]))
        }))
        .then(() => {
          // console.log(this.$data.previousCurrency)
        })
    },
    _fetchDataForToday: function () {
      let url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD'

      axios.get(url).then(res => {
        this.currentCurrency = Object.assign({}, this.currentCurrency, {
          BTC: res.data.BTC.USD,
          ETH: res.data.ETH.USD,
          LTC: res.data.LTC.USD
        })
        localStorage.setItem('BTC', this.currentCurrency.BTC)
        localStorage.setItem('ETH', this.currentCurrency.ETH)
        localStorage.setItem('LTC', this.currentCurrency.LTC)
      })
    }
  },
  created () {
    if (!window.navigator.onLine) {
      console.log('hello')
      this.currentCurrency = Object.assign({}, this.currentCurrency, {
        BTC: localStorage.getItem('BTC'),
        ETH: localStorage.getItem('ETH'),
        LTC: localStorage.getItem('LTC')
      })

      this.previousCurrency = Object.assign({}, this.previousCurrency, {
        yesterday: JSON.parse(localStorage.getItem('yesterdayPrices')),
        twoDays: JSON.parse(localStorage.getItem('twoDaysPrices')),
        threeDays: JSON.parse(localStorage.getItem('threeDaysPrices')),
        fourDays: JSON.parse(localStorage.getItem('fourDaysPrices')),
        fiveDays: JSON.parse(localStorage.getItem('fiveDaysPrices'))
      })
    } else {
      this._fetchDataFor('yesterday', 1)
      this._fetchDataFor('twoDays', 2)
      this._fetchDataFor('threeDays', 3)
      this._fetchDataFor('fourDays', 4)
      this._fetchDataFor('fiveDays', 5)
      this._fetchDataForToday()

      /* Realtime display */
      var pusher = new Pusher('adefac580c2db395042d', {
        cluster: 'ap1',
        encrypted: true
      })

      var channel = pusher.subscribe('price-updates')
      channel.bind('coin-updates', function (res) {
        this.$data.currentCurrency = Object.assign({}, this.$data.currentCurrency, {
          BTC: res.coin.BTC.USD,
          ETH: res.coin.ETH.USD,
          LTC: res.coin.LTC.USD
        })
      }.bind(this))

      // console.log(this.currentCurrency)
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato');
* {
  margin : 0px;
  padding : 0px;
  font-family: 'Lato', sans-serif;
}
body { height: 100vh; width: 100%; }
.row { display: flex; flex-wrap: wrap; }
h1 { font-size: 48px; }
a { color: #FFFFFF; text-decoration: none; }
a:hover { color: #FFFFFF; }
a:visited { color: #000000; }
.button {
  margin: auto;
  width: 200px;
  height: 60px;
  border: 2px solid #E36F55;
  box-sizing: border-box;
  border-radius: 30px;
}
#body {
  max-width: 90%;
  margin: 0 auto;
  padding: 1.5em;
  text-align: center;
  color:rgb(0, 193, 131);
}
#current { padding: 2em 0em; }
#previous { padding: 2em 0em; }
</style>
