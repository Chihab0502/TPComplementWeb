<template>
  <div>
    <div v-if="org && org.data !== null">
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mt-5" color="primary" dark v-bind="attrs" v-on="on">
              Ajouter Team
            </v-btn>
          </template>

          <v-card>
            <validation-observer ref="observer" v-slot="{ invalid }">
              <form @submit.prevent="submit">
                <v-card-title>
                  <span class="text-h5">Team information</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <!--eslint-disable-next-line-->
                    <v-row>
                      <span class="text-h5"
                        >Selection parmis les existants</span
                      >
                      <div class="form-floating">
                        <select
                          @change="submit"
                          class="form-select info"
                          v-model="existantsTeamId"
                          label="Type"
                        >
                          <option value="null">selctionner</option>
                          <option
                            v-for="item in allTeams"
                            :key="item._id"
                            :value="item._id"
                          >
                            {{ item.name }}
                          </option>
                        </select>
                      </div>
                    </v-row>
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
        v-if="org"
        :headers="teamsHeders"
        :items="teams"
        :items-per-page="5"
        class="elevation-1 mx-3 my-3 mt-5"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="teamDetails(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </div>
    <v-sheet v-else class="mx-auto" width="300">
      <v-skeleton-loader
        class="mx-auto mt-5"
        max-width="300"
        type="card"
      ></v-skeleton-loader>
      <v-btn @click="auth()" depressed color="primary"> Ok</v-btn>
    </v-sheet>
  </div>
</template>

<script>
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
    org: null,
    nom: null,
    existantsTeamId: null,
    teams: [],
    allTeams: [],
    dialog: false,
    teamsHeders: [
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
    this.getOrgData();
    this.allTeams = await this.$store.dispatch("fetchTeams");
    this.allTeams.filter((team) => {
      !this.teams.includes(team);
    });
  },
  methods: {
    async getOrgData() {

      this.org = await this.$store.dispatch("fetchOrgById", {
        id: this.$route.params.id,
      });

      if(!this.org){
        return
      }
      this.teams = this.org.data[0].teams;
    },
    auth() {
      this.$router.push("/orgs");
    },
    async deleteItem(item) {
      if (confirm("tu veux supprimer la team")) {
        let deleteItem = Object.assign({}, item);
        await this.$store.dispatch("updateOrgRemoveTeam", {
          idTeam: deleteItem._id,
        });
        this.dialog = false;
        this.org = null;
        this.teams = null;
        this.getOrgData();
      }
    },
    async submit() {
      let response = {};
      if (this.existantsTeamId) {
        response.data = {}
        response.data._id = this.existantsTeamId;
      } else {
        if (!this.$refs.observer.validate()) {
          return;
        }
        response = await this.$store.dispatch("createTeam", {
          teamName: this.nom,
        });
      }

      await this.$store.dispatch("updateOrgAddTeam", {
        idTeam: response.data._id,
      });
      this.dialog = false;
      this.org = null;
      this.teams = null;
      this.getOrgData();
    },  
    teamDetails(item) {
      let editedItem = Object.assign({}, item);
      this.$store.dispatch("setCurrentTeam", item);
      this.$router.push(`/teams/${editedItem._id}`);
    },
  },
};
</script>

<style></style>
