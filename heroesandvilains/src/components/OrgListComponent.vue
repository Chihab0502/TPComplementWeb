<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mt-5" color="primary" dark v-bind="attrs" v-on="on">
            Ajouter Organisations
          </v-btn>
        </template>
        <v-card>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="submit">
              <v-card-title>
                <span class="text-h5">Organisation information</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <!--eslint-disable-next-line-->

                  <v-row>
                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="nom"
                        rules="required|min:8"
                      >
                        <v-text-field
                          label="Nom*"
                          :error-messages="errors"
                          v-model="nom"
                          required
                        >
                        </v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="secret"
                        rules="required|min:8"
                      >
                        <v-text-field
                          v-model="secret"
                          label="La phrase secrète*"
                          :error-messages="errors"
                          type="password"
                          required
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                  </v-row>
                </v-container>
                <small>* c-a-d champ est obligatoir</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">
                  Close
                </v-btn>
                <v-btn
                  type="submit"
                  :disabled="invalid"
                  color="blue darken-1"
                  text
                >
                  Save
                </v-btn>
              </v-card-actions>
            </form>
          </validation-observer>
        </v-card>
      </v-dialog>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="orgList"
      :items-per-page="5"
      class="elevation-1 mx-3 my-3"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { eventBus } from "./../utilits/eventBus";
import { required, min } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
setInteractionMode("eager");

extend("required", {
  ...required,
  message: "le champe {_field_} est obligatiore",
});

extend("min", {
  ...min,
  message: "le champe {_field_} ne doit pas etre moin de {length} characters",
});
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data: () => ({
    dialog: false,

    nom: null,
    secret: null,
    headers: [
      {
        text: "Identification",
        align: "start",
        sortable: true,
        value: "_id",
      },
      { text: "Name", sortable: true, value: "name" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),
  mounted: async function () {
    this.orgList = await this.$store.dispatch("fetchOrgs");
  },
  computed: {
    orgList: {
      get() {
        return this.$store.state.orgNames.data;
      },
      set(newValue) {
        this.$store.commit("SET_ORG_NAMES", newValue);
      },
    },
  },
  methods: {
    editItem(item) {
      if (!this.$store.state.orgPassword) {
        eventBus.$emit("show-snackbar", "la phrase secrète n'existe pas");
        return;
      }
      let editedItem = Object.assign({}, item);
      this.$store.dispatch("setCurrentOrg", item);
      this.$router.push(`orgs/${editedItem._id}`);
    },
    async submit() {
      this.$refs.observer.validate();
      await this.$store.dispatch("createOrg", {
        name: this.nom,
        password: this.secret,
      });

      this.dialog = false;
    },
    clear() {
      this.secret = "";
      this.nom = "";
      this.$refs.observer.reset();
    },
  },
};
</script>

<style></style>
