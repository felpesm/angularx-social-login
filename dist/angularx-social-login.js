import { Injectable, NgModule } from '@angular/core';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AuthServiceConfig {
    /**
     * @param {?} providers
     */
    constructor(providers) {
        this.lazyLoad = false;
        this.providers = new Map();
        for (let i = 0; i < providers.length; i++) {
            /** @type {?} */
            let element = providers[i];
            this.providers.set(element.id, element.provider);
            this.lazyLoad = this.lazyLoad || element.lazyLoad;
        }
    }
}
class AuthService {
    /**
     * @param {?} config
     */
    constructor(config) {
        this._user = null;
        this._authState = new ReplaySubject(1);
        this._readyState = new BehaviorSubject([]);
        this.initialized = false;
        this.providers = config.providers;
        if (!config.lazyLoad) {
            this.initialize();
        }
    }
    /**
     * @return {?}
     */
    get authState() {
        return this._authState.asObservable();
    }
    /**
     * Provides an array of provider ID's as they become ready
     * @return {?}
     */
    get readyState() {
        return this._readyState.asObservable();
    }
    /**
     * @private
     * @return {?}
     */
    initialize() {
        this.initialized = true;
        this.providers.forEach((/**
         * @param {?} provider
         * @param {?} key
         * @return {?}
         */
        (provider, key) => {
            provider.initialize().then((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                let readyProviders = this._readyState.getValue();
                readyProviders.push(key);
                this._readyState.next(readyProviders);
                provider.getLoginStatus().then((/**
                 * @param {?} user
                 * @return {?}
                 */
                (user) => {
                    user.provider = key;
                    this._user = user;
                    this._authState.next(user);
                })).catch((/**
                 * @param {?} err
                 * @return {?}
                 */
                (err) => {
                    this._authState.next(null);
                }));
            }));
        }));
    }
    /**
     * @param {?} providerId
     * @param {?=} opt
     * @return {?}
     */
    signIn(providerId, opt) {
        if (!this.initialized) {
            this.initialize();
        }
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            /** @type {?} */
            let providerObject = this.providers.get(providerId);
            if (providerObject) {
                providerObject.signIn(opt).then((/**
                 * @param {?} user
                 * @return {?}
                 */
                (user) => {
                    user.provider = providerId;
                    resolve(user);
                    this._user = user;
                    this._authState.next(user);
                })).catch((/**
                 * @param {?} err
                 * @return {?}
                 */
                err => {
                    reject(err);
                }));
            }
            else {
                reject(AuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
            }
        }));
    }
    /**
     * @param {?=} revoke
     * @return {?}
     */
    signOut(revoke = false) {
        if (!this.initialized) {
            this.initialize();
        }
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            if (!this._user) {
                reject(AuthService.ERR_NOT_LOGGED_IN);
            }
            else {
                /** @type {?} */
                let providerId = this._user.provider;
                /** @type {?} */
                let providerObject = this.providers.get(providerId);
                if (providerObject) {
                    providerObject.signOut(revoke).then((/**
                     * @return {?}
                     */
                    () => {
                        resolve();
                        this._user = null;
                        this._authState.next(null);
                    })).catch((/**
                     * @param {?} err
                     * @return {?}
                     */
                    (err) => {
                        reject(err);
                    }));
                }
                else {
                    reject(AuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
        }));
    }
}
AuthService.ERR_LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';
AuthService.ERR_NOT_LOGGED_IN = 'Not logged in';
AuthService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
AuthService.ctorParameters = () => [
    { type: AuthServiceConfig }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SocialLoginModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static initialize(config) {
        return {
            ngModule: SocialLoginModule,
            providers: [
                AuthService,
                {
                    provide: AuthServiceConfig,
                    useValue: config
                }
            ]
        };
    }
}
SocialLoginModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                providers: [
                    AuthService
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SocialUser {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
class BaseLoginProvider {
    constructor() {
        this._readyState = new BehaviorSubject(false);
    }
    /**
     * @protected
     * @return {?}
     */
    onReady() {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this._readyState.subscribe((/**
             * @param {?} isReady
             * @return {?}
             */
            (isReady) => {
                if (isReady) {
                    resolve();
                }
            }));
        }));
    }
    /**
     * @param {?} id
     * @param {?} src
     * @param {?} onload
     * @param {?=} async
     * @param {?=} inner_text_content
     * @return {?}
     */
    loadScript(id, src, onload, async = true, inner_text_content = '') {
        // get document if platform is only browser
        if (typeof document !== 'undefined' && !document.getElementById(id)) {
            /** @type {?} */
            let signInJS = document.createElement('script');
            signInJS.async = async;
            signInJS.src = src;
            signInJS.onload = onload;
            /*
            if (inner_text_content) // LinkedIn
                signInJS.text = inner_text_content;
            */
            document.head.appendChild(signInJS);
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GoogleLoginProvider extends BaseLoginProvider {
    /**
     * @param {?} clientId
     * @param {?=} opt
     */
    constructor(clientId, opt = { scope: 'email' }) {
        super();
        this.clientId = clientId;
        this.opt = opt;
    }
    /**
     * @return {?}
     */
    initialize() {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.loadScript(GoogleLoginProvider.PROVIDER_ID, 'https://apis.google.com/js/platform.js', (/**
             * @return {?}
             */
            () => {
                gapi.load('auth2', (/**
                 * @return {?}
                 */
                () => {
                    this.auth2 = gapi.auth2.init(Object.assign({}, this.opt, { client_id: this.clientId }));
                    this.auth2.then((/**
                     * @return {?}
                     */
                    () => {
                        this._readyState.next(true);
                        resolve();
                    })).catch((/**
                     * @param {?} err
                     * @return {?}
                     */
                    (err) => {
                        reject(err);
                    }));
                }));
            }));
        }));
    }
    /**
     * @return {?}
     */
    getLoginStatus() {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.onReady().then((/**
             * @return {?}
             */
            () => {
                if (this.auth2.isSignedIn.get()) {
                    /** @type {?} */
                    let user = new SocialUser();
                    /** @type {?} */
                    let profile = this.auth2.currentUser.get().getBasicProfile();
                    /** @type {?} */
                    let token = this.auth2.currentUser.get().getAuthResponse(true).access_token;
                    /** @type {?} */
                    let backendToken = this.auth2.currentUser.get().getAuthResponse(true).id_token;
                    user.id = profile.getId();
                    user.name = profile.getName();
                    user.email = profile.getEmail();
                    user.photoUrl = profile.getImageUrl();
                    user.firstName = profile.getGivenName();
                    user.lastName = profile.getFamilyName();
                    user.authToken = token;
                    user.idToken = backendToken;
                    resolve(user);
                }
                else {
                    reject('No user is currently logged in.');
                }
            }));
        }));
    }
    /**
     * @param {?=} opt
     * @return {?}
     */
    signIn(opt) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.onReady().then((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                const offlineAccess = (opt && opt.offline_access) || (this.opt && this.opt.offline_access);
                /** @type {?} */
                let promise = !offlineAccess ? this.auth2.signIn(opt) : this.auth2.grantOfflineAccess(opt);
                promise.then((/**
                 * @param {?} response
                 * @return {?}
                 */
                (response) => {
                    /** @type {?} */
                    let user = new SocialUser();
                    if (response && response.code) {
                        user.authorizationCode = response.code;
                    }
                    else {
                        /** @type {?} */
                        let profile = this.auth2.currentUser.get().getBasicProfile();
                        /** @type {?} */
                        let token = this.auth2.currentUser.get().getAuthResponse(true).access_token;
                        /** @type {?} */
                        let backendToken = this.auth2.currentUser.get().getAuthResponse(true).id_token;
                        user.id = profile.getId();
                        user.name = profile.getName();
                        user.email = profile.getEmail();
                        user.photoUrl = profile.getImageUrl();
                        user.firstName = profile.getGivenName();
                        user.lastName = profile.getFamilyName();
                        user.authToken = token;
                        user.idToken = backendToken;
                    }
                    resolve(user);
                }), (/**
                 * @param {?} closed
                 * @return {?}
                 */
                (closed) => {
                    reject('User cancelled login or did not fully authorize.');
                })).catch((/**
                 * @param {?} err
                 * @return {?}
                 */
                (err) => {
                    reject(err);
                }));
            }));
        }));
    }
    /**
     * @param {?=} revoke
     * @return {?}
     */
    signOut(revoke) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.onReady().then((/**
             * @return {?}
             */
            () => {
                /** @type {?} */
                let signOutPromise;
                if (revoke) {
                    signOutPromise = this.auth2.disconnect();
                }
                else {
                    signOutPromise = this.auth2.signOut();
                }
                signOutPromise.then((/**
                 * @param {?} err
                 * @return {?}
                 */
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                })).catch((/**
                 * @param {?} err
                 * @return {?}
                 */
                (err) => {
                    reject(err);
                }));
            }));
        }));
    }
}
GoogleLoginProvider.PROVIDER_ID = 'GOOGLE';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class FacebookLoginProvider extends BaseLoginProvider {
    /**
     * @param {?} clientId
     * @param {?=} opt
     * @param {?=} locale
     * @param {?=} fields
     * @param {?=} version
     */
    constructor(clientId, opt = { scope: 'email,public_profile' }, locale = 'en_US', fields = 'name,email,picture,first_name,last_name', version = 'v4.0') {
        super();
        this.clientId = clientId;
        this.opt = opt;
        this.locale = locale;
        this.fields = fields;
        this.version = version;
    }
    /**
     * @return {?}
     */
    initialize() {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.loadScript(FacebookLoginProvider.PROVIDER_ID, `//connect.facebook.net/${this.locale}/sdk.js`, (/**
             * @return {?}
             */
            () => {
                FB.init({
                    appId: this.clientId,
                    autoLogAppEvents: true,
                    cookie: true,
                    xfbml: true,
                    version: this.version
                });
                // FB.AppEvents.logPageView(); #FIX for #18
                this._readyState.next(true);
                resolve();
            }));
        }));
    }
    /**
     * @return {?}
     */
    getLoginStatus() {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.onReady().then((/**
             * @return {?}
             */
            () => {
                FB.getLoginStatus((/**
                 * @param {?} response
                 * @return {?}
                 */
                (response) => {
                    if (response.status === 'connected') {
                        /** @type {?} */
                        let authResponse = response.authResponse;
                        FB.api(`/me?fields=${this.fields}`, (/**
                         * @param {?} fbUser
                         * @return {?}
                         */
                        (fbUser) => {
                            /** @type {?} */
                            let user = new SocialUser();
                            user.id = fbUser.id;
                            user.name = fbUser.name;
                            user.email = fbUser.email;
                            user.photoUrl = 'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
                            user.firstName = fbUser.first_name;
                            user.lastName = fbUser.last_name;
                            user.authToken = authResponse.accessToken;
                            user.facebook = fbUser;
                            resolve(user);
                        }));
                    }
                    else {
                        reject('No user is currently logged in.');
                    }
                }));
            }));
        }));
    }
    /**
     * @param {?=} opt
     * @return {?}
     */
    signIn(opt) {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.onReady().then((/**
             * @return {?}
             */
            () => {
                FB.login((/**
                 * @param {?} response
                 * @return {?}
                 */
                (response) => {
                    if (response.authResponse) {
                        /** @type {?} */
                        let authResponse = response.authResponse;
                        FB.api(`/me?fields=${this.fields}`, (/**
                         * @param {?} fbUser
                         * @return {?}
                         */
                        (fbUser) => {
                            /** @type {?} */
                            let user = new SocialUser();
                            user.id = fbUser.id;
                            user.name = fbUser.name;
                            user.email = fbUser.email;
                            user.photoUrl = 'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
                            user.firstName = fbUser.first_name;
                            user.lastName = fbUser.last_name;
                            user.authToken = authResponse.accessToken;
                            user.facebook = fbUser;
                            resolve(user);
                        }));
                    }
                    else {
                        reject('User cancelled login or did not fully authorize.');
                    }
                }), this.opt);
            }));
        }));
    }
    /**
     * @return {?}
     */
    signOut() {
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        (resolve, reject) => {
            this.onReady().then((/**
             * @return {?}
             */
            () => {
                FB.logout((/**
                 * @param {?} response
                 * @return {?}
                 */
                (response) => {
                    resolve();
                }));
            }));
        }));
    }
}
FacebookLoginProvider.PROVIDER_ID = 'FACEBOOK';

export { AuthService, AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule, SocialUser, BaseLoginProvider as ɵa };
//# sourceMappingURL=angularx-social-login.js.map
