import Vue from 'vue';
import Router from 'vue-router';
import Authentication from '@/components/AuthenticationComponent.vue';
import OrgList from '@/components/OrgListComponent.vue';
import OrgDetails from '@/components/OrgDetailsComponent.vue';
import TeamDetails from '@/components/TeamDetailsComponent.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Authentication },
    { path: '/orgs', component: OrgList },
    { path: '/orgs/:id', component: OrgDetails },
    { path: '/teams/:id', component: TeamDetails },
  ]
});
