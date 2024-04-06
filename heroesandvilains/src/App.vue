<template>
  <MainLayout>
    <router-view></router-view>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      :bottom="true"
      :right="true"
    >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </MainLayout>
</template>

<script>
import MainLayout from "./layouts/MainLayout.vue";
import { eventBus } from "./utilits/eventBus";
export default {
  components: {
    MainLayout,
  },
  data: () => ({
    drawer: false,
    snackbar: {
      show: false,
      text: '',
      color: 'error',
      timeout: 6000,
    },
  }),
  methods: {
    goToAuth() {
      this.$router.push("/auth");
    },
  },
  created() {
    eventBus.$on('show-snackbar', (text) => {
      this.snackbar.text = text;
      this.snackbar.show = true;
    });
  },
};
</script>
