import Vue from 'vue';
import { OktaAuth } from '@okta/okta-auth-js';
import oktaVue from '@/plugins/oktaVue';
import App from './App.vue';
import router from './router';
import store from './store';

const oktaAuth = new OktaAuth({
  issuer: '',
  clientId: '',
  redirectUri: `${window.location.origin}/implicit/callback`,
  scopes: ['openid', 'profile', 'email'],
});

Vue.use(oktaVue, { oktaAuth });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
