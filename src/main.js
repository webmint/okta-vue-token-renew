import Vue from 'vue';
import { OktaAuth } from '@okta/okta-auth-js';
import oktaVue from '@/plugins/oktaVue';
import App from './App.vue';
import router from './router';
import store from './store';

const authorizationServer = 'ausrra4m2uZ6NegJU0h7';
const oktaHostedUrl = 'https://login-okta.qa.dice-tools.com';
const oktaAuth = new OktaAuth({
  issuer: `${oktaHostedUrl}/oauth2/${authorizationServer}`,
  clientId: '0oatc89q7vqm4AaXu0h7',
  redirectUri: `${window.location.origin}/implicit/callback`,
  scopes: ['openid', 'profile', 'email'],
});

//
// const oktaAuth = new OktaAuth({
//   issuer: 'https://dev-673103.okta.com/oauth2/default',
//   clientId: '0oaa8baxywlxLN7aM4x6',
//   redirectUri: `${window.location.origin}/implicit/callback`,
//   scopes: ['openid', 'profile', 'email'],
// });

Vue.use(oktaVue, { oktaAuth });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
