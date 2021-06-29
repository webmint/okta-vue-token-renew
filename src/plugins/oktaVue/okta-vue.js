// eslint-disable-next-line no-unused-vars
import { toRelativeUrl, AuthSdkError } from '@okta/okta-auth-js';

// eslint-disable-next-line no-underscore-dangle
let _oktaAuth;
// eslint-disable-next-line no-underscore-dangle
let _onAuthRequired;
// eslint-disable-next-line no-underscore-dangle,no-unused-vars
let _router;
let originalUriTracker;

const guardSecureRoute = async (authState) => {
  if (!authState.isAuthenticated) {
    _oktaAuth.setOriginalUri(originalUriTracker);
    if (_onAuthRequired) {
      await _onAuthRequired(_oktaAuth);
    } else {
      await _oktaAuth.signInWithRedirect();
    }
  }
};

export const navigationGuard = async (to, from, next) => {
  // clear any subscribed guardSecureRoute
  _oktaAuth.authStateManager.unsubscribe(guardSecureRoute);

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // track the originalUri for guardSecureRoute
    originalUriTracker = to.fullPath;

    // subscribe to authState change to protect secure routes when authState change
    // all secure routes should subscribe before enter the route
    _oktaAuth.authStateManager.subscribe(guardSecureRoute);

    // guard the secure route based on the authState when enter
    const isAuthenticated = await _oktaAuth.isAuthenticated();
    if (!isAuthenticated) {
      const authState = _oktaAuth.authStateManager.getAuthState();
      await guardSecureRoute(authState);
      next(false);
    }

    next();
  }

  next();
};

function install(Vue, { oktaAuth, onAuthRequired, onAuthResume }) {
  if (!oktaAuth) {
    throw new AuthSdkError('No oktaAuth instance passed to OktaVue.');
  }

  _oktaAuth = oktaAuth;
  _onAuthRequired = onAuthRequired;

  if (!oktaAuth.options.restoreOriginalUri) {
    // eslint-disable-next-line no-param-reassign,no-shadow
    oktaAuth.options.restoreOriginalUri = async (oktaAuth, originalUri) => {
      // If a router is available, provide a default implementation
      if (_router && originalUri) {
        const path = toRelativeUrl(originalUri, window.location.origin);
        _router.replace({ path });
      }
    };
  }

  Vue.mixin({
    data() {
      return {
        authState: oktaAuth.authStateManager.getAuthState(),
      };
    },
    beforeCreate() {
      // assign router for the default restoreOriginalUri callback
      _router = this.$router;
    },
    created() {
      // subscribe to the latest authState
      oktaAuth.authStateManager.subscribe(this.$_oktaVue_handleAuthStateUpdate);
      if (!oktaAuth.token.isLoginRedirect()) {
        // Calculates initial auth state and fires change event for listeners
        // Also starts the token auto-renew service
        oktaAuth.start();
      }
    },
    beforeUnmount() {
      oktaAuth.authStateManager.unsubscribe(this.$_oktaVue_handleAuthStateUpdate);
      oktaAuth.stop();
    },
    // private property naming convention follows
    // https://vuejs.org/v2/style-guide/#Private-property-names-essential
    methods: {
      async $_oktaVue_handleAuthStateUpdate(authState) {
        this.authState = Object.assign(this.authState || {}, authState);
      },
    },
  });

  Object.assign(oktaAuth.options, {
    onAuthRequired,
    onAuthResume,
  });

  // eslint-disable-next-line no-param-reassign
  Vue.prototype.$auth = oktaAuth;
}

export default { install };
