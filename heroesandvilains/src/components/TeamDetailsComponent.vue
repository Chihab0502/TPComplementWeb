<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="mt-5" color="primary" dark v-bind="attrs" v-on="on">
            Ajouter Noveau Membre
          </v-btn>
        </template>
        <v-card>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="submit">
              <v-card-title>
                <span class="text-h5">Member informa tion</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row v-if="!isEdit">
                    <span class="text-h5">Selection parmis les existants</span>
                    <div class="form-floating">
                      <select
                        @change="submit"
                        class="form-select info"
                        v-model="existantsMemberId"
                        label="Type"
                      >
                        <option value="null">selctionner</option>
                        <option
                          v-for="item in heroesIds"
                          :key="item._id"
                          :value="item._id"
                        >
                          {{ item.publicName }} {{ item.realName }}
                        </option>
                      </select>
                    </div>
                  </v-row>
                  <v-divider class="mt-5">or</v-divider>
                  <v-row>
                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="publicName"
                        rules="required"
                      >
                        <v-text-field
                          label="Public Name*"
                          :error-messages="errors"
                          v-model="publicName"
                          required
                        >
                        </v-text-field>
                      </validation-provider>
                    </v-col>

                    <v-col cols="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="realName"
                        rules="required"
                      >
                        <v-text-field
                          label="real Name*"
                          :error-messages="errors"
                          v-model="realName"
                          required
                        >
                        </v-text-field>
                      </validation-provider>
                    </v-col>
                    <input v-model="member_id" type="hidden" />
                    <v-col cols="12">
                      <v-card-text>
                        <v-card-subtitle>Powers (Optional)</v-card-subtitle>
                        <v-row>
                          <v-col cols="12">
                            <v-card-text>
                              <v-card-subtitle>Powers</v-card-subtitle>
                              <div
                                v-for="(power, index) in heroPowers"
                                :key="index"
                              >
                                <v-row>
                                  <v-col cols="4">
                                    <v-text-field
                                      v-model="power.name"
                                      label="Name"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="4">
                                    <v-select
                                      v-model="power.type"
                                      :items="[1, 2, 3, 4, 5, 6, 7]"
                                      label="Type"
                                      required
                                    ></v-select>
                                  </v-col>
                                  <v-col cols="4">
                                    <v-select
                                      v-model="power.level"
                                      :items="levels"
                                      label="Level"
                                      required
                                    ></v-select>
                                  </v-col>
                                  <v-col cols="1">
                                    <v-icon small @click="removePower(index)">
                                      mdi-delete
                                    </v-icon>
                                  </v-col>
                                </v-row>
                              </div>
                              <v-row align="center" justify="space-between">
                                <p>Number of Powers: {{ heroPowers.length }}</p>
                                <v-btn icon small @click="addPower">
                                  <v-icon>mdi-plus</v-icon>
                                </v-btn>
                                <v-btn
                                  icon
                                  small
                                  :disabled="heroPowers.length === 0"
                                  @click="removePower(heroPowers.length - 1)"
                                >
                                  <v-icon>mdi-minus</v-icon>
                                </v-btn>
                              </v-row>
                            </v-card-text>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-container>
                <small>* c-a-d champ est obligatoire</small>
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
      :items="membersDetails"
      :items-per-page="5"
      class="elevation-1 mx-3 my-3 mt-5"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
    existantsMemberId: null,
    levels: Array.from({ length: 100 }, (_, i) => i + 1),
    isEdit: false,
    member_id: null,
    heroesIds: [],
    headers: [
      {
        text: "Identification",
        align: "start",
        sortable: true,
        value: "_id",
      },
      { text: "public Name", sortable: true, value: "publicName" },
      { text: "real Name", sortable: true, value: "realName" },
      { text: "powers", sortable: true, value: "powers" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    membersDetails: [],
    dialog: false,
    publicName: "",
    realName: "",
    powers: [],
    heroPowers: [],
    newPower: [],
  }),
  mounted: async function () {
    this.fetchMembersDetails();
    const response = await this.$store.dispatch("fetchHeroes");
    this.heroesIds = response.data;
  },
  computed: {
    currentTeam: {
      get() {
        return this.$store.state.currentTeam;
      },
      set(newValue) {
        this.$store.commit("setCurrentTeam", newValue);
      },
    },
  },

  methods: {
    getMemberDetails(memberId) {
      return (
        this.membersDetails.find((member) => member._id === memberId) || {}
      );
    },
    async fetchMembersDetails() {
      if (this.currentTeam && this.currentTeam.members) {
        try {
          for (const memberId of this.currentTeam.members) {
            const heroData = await this.$store.dispatch(
              "fetchHeroById",
              memberId
            );
            const powerNames = heroData.data[0].powers.map(
              (power) => power.name
            );
            this.membersDetails.push({
              ...heroData.data[0],
              powers: powerNames,
            });
          }
        } catch (error) {
          console.error("Error fetching members details:", error);
        }
      }
    },

    addPower() {
      const newPower = {
        name: this.newPower.name,
        type: null,
        level: 0,
      };
      this.heroPowers.push(newPower);
      this.newPower.name = "";
    },
    removePower(index) {
      if (index >= 0 && index < this.heroPowers.length) {
        this.heroPowers.splice(index, 1);
      }
    },
    async submit() {
      if (this.existantsMemberId) {
        await this.$store.dispatch("updateTeamAddHeroes", {
          teamId: this.$store.state.currentTeam._id,
          addheroes: [this.existantsMemberId],
        });
        this.dialog = false;
        this.membersDetails = [];
        this.existantsMemberId = null;
        this.fetchMembersDetails();
        return;
      }

      if (!this.$refs.observer.validate()) {
        return;
      }
      const heroData = {
        id: this.member_id,
        publicName: this.publicName,
        realName: this.realName,
        powers: this.heroPowers,
      };

      try {
        let response = null;

        if (this.member_id) {
          response = await this.$store.dispatch("updateHero", heroData);
        } else {
          if (!this.$store.state.currentTeam._id) {
            eventBus.$emit("show-snackbar", "la current team est invalide");
            return;
          }
          response = await this.$store.dispatch("createHero", heroData);
          // add member to team
          await this.$store.dispatch("updateTeamAddHeroes", {
            teamId: this.$store.state.currentTeam._id,
            addheroes: [response.data._id],
          });
        }

        this.dialog = false;
        this.publicName = "";
        this.realName = "";
        this.heroPowers = [];
        this.membersDetails = [];
        this.fetchMembersDetails();
      } catch (error) {
        console.error("Error creating hero:", error);
      }
    },

    async deleteItem(item) {
      if (confirm("tu veux supprimer le member")) {
        await this.$store.dispatch("updateTeamRemoveHeroes", {
          teamId: this.$store.state.currentTeam._id,
          removeHeroes: [item],
        });
        this.membersDetails = [];
        this.fetchMembersDetails();
      }
    },
    editItem(item) {
      this.isEdit = true;
      Object.assign({}, item);
      const editedItem = Object.assign({}, item);
      this.publicName = editedItem.publicName;
      this.realName = editedItem.realName;
      this.member_id = editedItem._id;

      for (const power of editedItem.powers) {
        this.heroPowers.push({
          name: power,
          type: null,
          level: null,
        });
      }

      this.dialog = true;
    },
  },

  watch: {
    membersDetails(newVal) {
      return newVal;
    },
    isEdit(newVal) {
      return newVal;
    },
  },
};
</script>

<style></style>
