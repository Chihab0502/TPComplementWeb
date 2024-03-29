import Vue from "vue";
import Vuex from "vuex";
import teamService from "@/services/team.service";
import heroService from "@/services/hero.service";
import orgService from "@/services/org.service";

Vue.config.devtools = true;
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    orgPassword: null,
    heroesAliases: [],
    currentHero: null,
    teams: [],
    currentTeam: null,
    orgNames: [],
    currentOrg: null,
  },
  mutations: {
    SET_ORG_PASSWORD(state, password) {
      state.orgPassword = password;
    },
    SET_HEROES_ALIASES(state, aliases) {
      state.heroesAliases = aliases;
    },
    SET_CURRENT_HERO(state, hero) {
      state.currentHero = hero;
    },
    SET_TEAMS(state, teams) {
      state.teams = teams;
    },
    SET_CURRENT_TEAM(state, team) {
      state.currentTeam = team;
    },
    SET_ORG_NAMES(state, names) {
      state.orgNames = names;
    },
    SET_CURRENT_ORG(state, org) {
      state.currentOrg = org;
    },
  },
  actions: {
    updateOrgPassword({ commit }, password) {
      commit("SET_ORG_PASSWORD", password.password);
    },
    updateHeroesAliases({ commit }, aliases) {
      commit("SET_HEROES_ALIASES", aliases);
    },
    setCurrentHero({ commit }, hero) {
      commit("SET_CURRENT_HERO", hero);
    },
    updateTeams({ commit }, teams) {
      commit("SET_TEAMS", teams);
    },
    setCurrentTeam({ commit }, team) {
      commit("SET_CURRENT_TEAM", team);
    },
    updateOrgNames({ commit }, names) {
      commit("SET_ORG_NAMES", names);
    },
    setCurrentOrg({ commit }, org) {
      commit("SET_CURRENT_ORG", org);
    },

    // Heroes
    async fetchHeroes({ commit }) {
      const aliases = await heroService.getHeroes();
      commit("SET_HEROES_ALIASES", aliases);
      return aliases;
    },

    async createHero({ dispatch }, { publicName, realName, powers }) {
      const response = await heroService.createHero(
        publicName,
        realName,
        powers
      );
      dispatch("fetchHeroes");
      return response;
    },

    async updateHero(
      { dispatch },
      { id, publicName, realName, powers }
    ) {
      const response = await heroService.updateHero(
        id,
        publicName,
        realName,
        powers,
        this.state.orgPassword
      );
      await dispatch("fetchHeroes");
      return response;
    },

    async fetchHeroById({ commit }, id) {
      const response = await heroService.getHeroById(
        this.state.orgPassword,
        id
      );
      commit("SET_CURRENT_HERO", response);
      return response;
    },

    //Teams
    async fetchTeams({ commit }) {
      const teams = await teamService.getTeams();
      commit("SET_TEAMS", teams);
      return teams.data;
    },

    async createTeam({ dispatch }, data) {
      const response = await teamService.createTeam(data.teamName);
      dispatch("setCurrentTeam", response.data);
      return response;
    },

    async updateTeamAddHeroes({ dispatch }, { teamId, addheroes }) {
      const response = await teamService.updateTeamAddHeroes(teamId, addheroes);
      dispatch("setCurrentTeam", response.data);
      return response;
    },

    async updateTeamRemoveHeroes({ dispatch }, { teamId, removeHeroes }) {
      const response = await teamService.updateTeamRemoveHeroes(
        teamId,
        removeHeroes
      );
      dispatch("setCurrentTeam", response.data);
      return response;
    },

    //Orgs
    async fetchOrgs({ commit }) {
      const organizations = await orgService.getOrg();
      commit("SET_ORG_NAMES", organizations);
      return organizations;
    },

    async createOrg({ dispatch }, { name, password }) {
      await orgService.createOrg(name, password);
      dispatch("updateOrgPassword", password);
      const response = await dispatch("fetchOrgs");
      return response;
    },

    // eslint-disable-next-line
    async updateOrgAddTeam({ dispatch }, { idTeam }) {
      const response = await orgService.updateOrgAddTeam(
        this.state.orgPassword,
        idTeam
      );

      return response;
    },

    async updateOrgRemoveTeam({ dispatch }, { idTeam }) {
      await orgService.updateOrgRemoveTeam(this.state.orgPassword, idTeam);
      const response = await dispatch("fetchOrgs");
      return response;
    },

    async fetchOrgById({ commit }, id) {
      const organization = await orgService.getOrgById(
        this.state.orgPassword,
        id.id
      );
      commit("SET_CURRENT_ORG", organization);
      return organization;
    },
  },
});
