<template>

    <v-sheet class="mx-auto" width="300">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <validation-provider
            v-slot="{ errors }"
            name="secret"
            rules="required|min:8"
          >
            <v-text-field
              v-model="secret"
              :error-messages="errors"
              label="entrer la phrase secrète"
              required
            ></v-text-field>
          </validation-provider>
          <v-btn class="mr-4" type="submit" :disabled="invalid">
            Enregistrer
          </v-btn>
          <v-btn @click="clear"> clear </v-btn>
        </form>
      </validation-observer>
    </v-sheet>

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
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    secret: "",
  }),

  methods: {
    submit() {
      this.$refs.observer.validate();
      this.$store.dispatch("updateOrgPassword", {
        password: this.secret,
      });
      this.$router.push("/orgs");
    },
    clear() {
      this.secret = "";
      this.$refs.observer.reset();
    },
  },
};
</script>
