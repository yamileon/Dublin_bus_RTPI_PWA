<template>
  <q-layout ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}">
	<div class="fixed-top">
		<q-toolbar-title class = "layout-header transition-generic top-padding" >
		<q-item-main class="red">
			<q-item class="float-left" >{{status}}</q-item>
			<q-btn class="float-right" color="blue" @click="reset" >clear</q-btn>
		</q-item-main>
		</q-toolbar-title>

		<q-list highlight>
			<q-item>
				<q-item-main>
					<q-input type="text" max-length="16" v-model="stopname" @keyup.enter="addStop(stopname,stopid)" placeholder="input stop name">
						<q-btn class="float-right" color="blue" @click="addStop(stopname,stopid)">Add</q-btn>
					</q-input>
					<q-input type="number" max-length="16" v-model="stopid" @keyup.enter="checkTimes(stopid)" placeholder="input stop number to search">
						<q-btn class="float-right" color="blue" @click="checkTimes(stopid)">Search</q-btn>
					</q-input>
				</q-item-main>
			</q-item>
		</q-list>

		<q-list class="relative-position vertical-middle" highlight>      
		<q-item v-for="v in savedStops">
			<q-item-main @click="checkTimes(v.val.tstopid)">{{v.val.tstopname}}
				<div class="float-right"> {{v.val.tstopid}} </div>
			</q-item-main>
		</q-item>
    	</q-list>
	</div>

    

	<q-list class="fixed-bottom">
		<q-item>
			<q-item-main>
				<q-item-side>
					<q-item-tile v-for="v in routes">
						<q-item-separator />
					<div class="black"> {{v.route}} 
					<div class="float-right black"> {{v.due}} </div>
					</div>
					</q-item-tile>
				</q-item-side>
			</q-item-main>
		</q-item>
	</q-list>

  </q-layout>
</template>

<script>
import {
  dom,
  event,
  openURL,
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  LocalStorage
} from "quasar";
var _ = require("lodash");

export default {
  name: "index",
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain
  },
  data() {
    return {
      status: "Stops",
      routes: ["route", "3"],
      stopid: "",
      stopname: "",
      savedStops: []
    };
  },
  mounted() {
    var it = LocalStorage.get.all();

    for (var key in it) {
      if (it.hasOwnProperty(key)) {
        var val = it[key];
        // console.log(val);
        this.savedStops.push({
          val
        });
      }
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
      this.routes = [];
      this.status = "Stops";

      this.$http
        .get(
          "https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=" +
            num
        )
        .then(response => {
          console.log(response);
          var res = response.body;
          if (res.errorcode == 1) {
            console.log("error");
            this.status = "An error occored or their are no buses availibale";
          } else {
            console.log(res);
            res.results.forEach(bus => {
              this.routes.push({
                route: bus.route,
                due: bus.duetime
              });
              console.log(this.routes);
            });
          }
        });
    },
    addStop(tstopname, tstopid) {
      LocalStorage.set(tstopid, {
        tstopname,
        tstopid
      });
    }
  }
};
</script>

<style lang="stylus">
.logo-container {
	width: 255px;
	height: 242px;
	perspective: 800px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
}

.logo {
	position: absolute;
	transform-style: preserve-3d;
}

.top-padding{
	padding-top:10px;
}

.red {
	color: red;
}

.black{
	color:black;
}
</style>
