<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Gestion des Heroes</v-toolbar-title>
      <v-btn text to="/orgs">Organisations</v-btn>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            Login
            <v-icon right>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="login">
            <v-list-item-title>Entre la phrase secrète</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "MainLayout",
  data: () => ({
    loggedIn: false,
  }),
  methods: {
    login() {
      this.loggedIn = true;
      this.$router.push('/')
    },
  },
};
</script>
