<template>
	<div>
		<h2>Current prices of coins</h2>
		<div class='currency' id='btc'>
			<label>1 BTC</label>
			<p>&dollar;{{ currentCurrency.BTC }}</p>
		</div>
		<div class='currency' id='eth'>
			<label>1 ETH</label>
			<p>&dollar;{{ currentCurrency.ETH }}</p>
		</div>
		<div class='currency' id='ltc'>
			<label>1 LTC</label>
			<p>&dollar;{{ currentCurrency.LTC }}</p>
		</div>
	</div>
</template>

<script>
export default {
  name: 'app',
  props: {
    currentCurrency: {type: Object}
  },
  data () {
    return {}
  },
  created () {
    console.log(this.$props.currentCurrency)
  }
}
</script>

<style scoped>
.currency {
  border: 1px solid #F5CE00;
  border-radius: 15px;
  padding: 2em 0em;
  display: inline-block;
  width: 30%;
}
div p { font-size: 2rem; }
h2 { font-size: 1.5em; }
</style>