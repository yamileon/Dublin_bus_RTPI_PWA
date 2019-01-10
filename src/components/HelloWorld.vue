<template>
  <div class="hello">
	<v-ons-page>

	<v-ons-list>
		<v-ons-list-item>
			<div class="center"> <v-ons-input placeholder="StopName" autogrow float v-model="stopname"></v-ons-input> </div>
			<div class="right"><v-ons-button style="margin: 6px 0" @click="addStop(stopname,stopid)" >Save</v-ons-button></div>
		</v-ons-list-item>
		<v-ons-list-item>
			<div class="center"> <v-ons-input placeholder="StopNumber" autogrow float v-model="stopid"></v-ons-input> </div>
			<div class="right"><v-ons-button style="margin: 6px 0" @click="checkTimes(stopid)" >Search</v-ons-button></div>
		</v-ons-list-item>

		<v-ons-list v-for="(v,key) in savedStops" >
			<div class="center"><v-ons-list-item tappable @click="checkTimes(v)">{{key}}  <div class="right"> {{v}}</div> </v-ons-list-item> </div>
		</v-ons-list>

		<!-- <v-ons-list>
			<v-ons-list-item expandable :expanded.sync="isExpanded">
			Show Saved Stops
			<div class="expandable-content">
				<div v-for="(v,key) in savedStops">
					<v-ons-list-item tappable @click="checkTimes()">{{key}}
					<div class="right"> {{v}} </div> </v-ons-list-item>
				</div>
			</div>
			</v-ons-list-item>
		</v-ons-list> -->
	</v-ons-list>

	<v-ons-fab position="bottom right" :visible="true" cancelable @click="deleteASV = true">
		<v-ons-icon icon="trash"></v-ons-icon>
	</v-ons-fab>

	<v-ons-action-sheet :visible.sync="actionSheetVisible" cancelable title="Buses at Stop">
		<v-ons-list>
			<div v-for="(v,key) in routes">
				<v-ons-list-item tappable>{{key}}
				<div class="right"> {{v}} </div> </v-ons-list-item>
			</div>
		</v-ons-list>
	</v-ons-action-sheet>

	<v-ons-action-sheet :visible.sync="deleteASV" cancelable title="Tap to Delete Stop">
		<v-ons-list>
			<div v-for="(v,key) in savedStops">
				<v-ons-list-item tappable @click="deletestop(key,v)">{{key}}
				<div class="right"> {{v}} </div> </v-ons-list-item>
			</div>
		</v-ons-list>
	</v-ons-action-sheet>

	</v-ons-page>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
	msg: String
  },
  data() {
	return {
	  status: "Stops",
	  routes: [],
	  stopid: "",
	  stopname: "",
	  savedStops:{},
	  isExpanded: false,
	  actionSheetVisible: false,
	  deleteASV:false,
	};
  },
  mounted() {
	var myst = window.localStorage;
	var ss = this.savedStops;
	if(!myst.getItem('stops')){
		myst.setItem('stops',JSON.stringify({}))
	}else{
		this.savedStops = JSON.parse(myst.getItem('stops'))
	}

	// console.log(this.savedStops);
  },
  methods: {
	launch(url) {
	  openURL(url);
	},
	reset() {
	  this.status = "Stops";
	  this.routes = [];
	  this.stopid = "";
	},
	checkTimes(num) {
		var request = require("request");

	  this.routes = [];
	  this.status = "Stops";

	  this.status = "Request sent = " + num;

	  this.actionSheetVisible = true;

		var options = { method: 'POST',
		url: 'https://cors-anywhere.herokuapp.com/http://rtpi.dublinbus.ie/DublinBusRTPIService.asmx',
		qs: { op: 'GetRealTimeStopData' },
		headers: 
		{ 'Postman-Token': '4fdde182-c4ee-4ebe-bccc-fe9fa3a43ca2',
		'cache-control': 'no-cache',
		'Content-Type': 'text/xml' },
		body: '<?xml version="1.0" encoding="utf-8"?>\n<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\n  <soap12:Body>\n    <GetRealTimeStopData_ForceLineNoteVisit xmlns="http://dublinbus.ie/">\n      <stopId>1445</stopId>\n      <forceRefresh>false</forceRefresh>\n      <forceLineNoteVisit></forceLineNoteVisit>\n    </GetRealTimeStopData_ForceLineNoteVisit>\n  </soap12:Body>\n</soap12:Envelope>' };

		request(options, function (error, response, body) {
		if (error) throw new Error(error);

		console.log(body);
		});

		
	},
	addStop(stn, id) {
		var myst = window.localStorage;
		var ss = this.savedStops

		ss[stn]= id
		myst.setItem('stops',JSON.stringify(ss))

		this.$forceUpdate();
	},
	deletestop(stn,id){
		var myst = window.localStorage;
		var ss = this.savedStops

		delete ss[stn]
		myst.setItem('stops',JSON.stringify(ss))

		this.$forceUpdate();
	}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
