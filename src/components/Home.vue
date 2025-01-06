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
  console.log(GET_COMMANDERS);
  console.log(client);

  const variables = {
        "after": null,
        "first": 99999
    };
  var {loading, load, error} = useLazyQuery(GET_COMMANDERS, variables);
  var resultF = await load();
  while(true){
    for(const card in resultF.commanders.edges){
      //this check shouldn't be necessary
      if(!array.includes(resultF.commanders.edges[card].node.name)){
        array.push(resultF.commanders.edges[card].node.name);
      }
      else{
        console.log("something wrong with the api produced a duplicate")
      }
    }
    if(!(resultF.commanders.pageInfo.hasNextPage)){
        commanders.value = array;
        console.log(array)
        return array;
    }
    else{
      const variables = {
        "after": resultF.commanders.pageInfo.endCursor,
        "first": 99999
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
  <div >
    <div>
      <div>
        Enter your commander and timeframe to get average card winrate
        <v-select
        style="color: blue"
        v-model="commander" 
        label="name"
        placeholder="Select a Commander"
        :options="commanders">
        </v-select>

        <v-select
        style="color: blue"
        v-model="timeFrame" 
        placeholder="Select a Time frame"
        :options="times">
        </v-select>
      </div>
      <br>
      <button @click="getCards">Submit</button>
    <div>
      Winrate: {{ wins/games*100 }}%<br>
      Drawrate: {{ draws/games*100 }}%<br>
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
            winrate: {{ card[1]*100 }}%<br>
            drawrate: {{ card[4]*100 }}%<br>
            inclusionrate: {{ card[2] }}%<br>
            included Games: {{ card[3] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


.greetings h1,
.greetings h3 {
  text-align: center;
}

.gridBox{
  flex-direction: column;
  justify-content: flex-end;
  overflow-y: scroll;
  border: 5px solid var(--color-border);
    background: var(--color-background);
  width: fit-content;
}
.grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(10%, 1fr));
  gap: 10px;
  column-gap:40px;
  flex-direction: column;
  justify-content: flex-end;
  width: fit-content;
}
</style>
