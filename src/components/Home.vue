<script setup>
import { provideApolloClient } from '@vue/apollo-composable';
import { GET_CARDS, GET_COMMANDERS } from './graphql/queries';
import client from './graphql/apollo';
import { ref } from 'vue';
import { TimePeriodArray } from './timePeriod';
import { computed } from 'vue';
import { useLazyQuery } from '@vue/apollo-composable';
import {getCardWinrates, dictToSortedArray} from './CalculateWinrate';
import "vue-select/dist/vue-select.css";
import VueSelect from 'vue-select';
//temp hardcode
const commander = defineModel("commander");//"Tayam, Luminous Enigma";
const timeFrame = defineModel("timeFrame");//"POST_BAN";
var after = null;


provideApolloClient(client)

const wins = ref(false);
const games = ref(false);
const draws = ref(false);
const winrate = ref(false);
const winrateArray = ref(false);
const commanders = ref(["a","b"]);//ref(getCommanders());
const times = ref(TimePeriodArray);
getCommanders();

async function getCommanders(){
  var array = [];
  var {loading, load, error} = useLazyQuery(GET_COMMANDERS, null);
  var resultF = await load();
  while(true){
    for(const card in resultF.commanders.edges){
      array.push(resultF.commanders.edges[card].node.name);
    }
    if(!(resultF.commanders.pageInfo.hasNextPage)){
        commanders.value = array;
        console.log(array)
        return array;
    }
    else{
      const variables = {
        "after": resultF.commanders.pageInfo.endCursor
      };
      load = useLazyQuery(GET_COMMANDERS, variables).load;
      resultF = await load();
    }
  }
}

async function getCards (){
  try{
    //resultF.value = await load();
    const [sortedWinrate, totalWins, totalGames, totalDraws] = await getCardWinrates(commander, timeFrame);

    wins.value = totalWins;
    games.value = totalGames;
    draws.value = totalDraws;
    winrate.value = sortedWinrate;
    winrateArray.value = dictToSortedArray(sortedWinrate);
  }
  catch(e){
    console.log("error getting cards: "+e)
  }
}
  // cards.value = results["commander"]["entries"]["edges"];
  //return the component for the card list

</script>

<template>
  <div class="">
    <div class="form">
      <div>
        Enter your commander and timeframe to get average card winrate
        <v-select
        v-model="commander" 
        label="name"
        placeholder="Select a Commander"
        :options="commanders">
        </v-select>

        <v-select
        v-model="timeFrame" 
        placeholder="Select a Time frame"
        :options="times">
        </v-select>
      </div>
      <br>
      <button @click="getCards">Submit</button>
    <div>
      Winrate: {{ wins/games }}%<br>
      Drawrate: {{ draws/games }}%<br>
      Games in dataset: {{ games }}<br>
    </div>
  </div>
    <div class="gridBox">
      <div v-if="winrateArray" class="h-0 grid overflow-hidden">
        <div v-for="card in winrateArray" class="h-0">
          <div class="overflow-hidden">
            <img v-if="card[4] != null" :src="card[5]" >
            <br>
            {{ card[0] }}<br>
            winrate: {{ card[1] }}%<br>
            drawrate: {{ card[4] }}%<br>
            inclusionrate: {{ card[2] }}%<br>
            included Games: {{ card[3] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.form {

}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
.gridBox{
  flex-direction: column;
  justify-content: flex-end;
  overflow-y: scroll;
border: 5px solid var(--color-border);
    background: var(--color-background);

}
.grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(92px,1fr));
  gap: 10px;

  flex-direction: column;
  justify-content: flex-end;
  width:fit-content;
  
}
</style>
