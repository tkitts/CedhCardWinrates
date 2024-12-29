<script setup>
import { provideApolloClient, useQuery } from '@vue/apollo-composable';
import { GET_POSTS } from './graphql/queries';
import client from './graphql/apollo';

import { TimePeriods } from './timePeriod';


//temp hardcode
const commander = "Yisan, the Wanderer Bard";
const time = "ONE_MONTH";
var after = null;

const variables = {
  "name": commander,
  "filters": {
  "timePeriod": time
  },
  "after": after
};

provideApolloClient(client)

const rq = useQuery(GET_POSTS, variables);
console.log(rq.result);

defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
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
</style>
