(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs', '@angular/common'], factory) :
    (global = global || self, factory(global.angularxSocialLogin = {}, global.ng.core, global.rxjs, global.ng.common));
}(this, function (exports, core, rxjs, common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var AuthServiceConfig = /** @class */ (function () {
        function AuthServiceConfig(providers) {
            this.lazyLoad = false;
            this.providers = new Map();
            for (var i = 0; i < providers.length; i++) {
                /** @type {?} */
                var element = providers[i];
                this.providers.set(element.id, element.provider);
                this.lazyLoad = this.lazyLoad || element.lazyLoad;
            }
        }
        return AuthServiceConfig;
    }());
    var AuthService = /** @class */ (function () {
        function AuthService(config) {
            this._user = null;
            this._authState = new rxjs.ReplaySubject(1);
            this._readyState = new rxjs.BehaviorSubject([]);
            this.initialized = false;
            this.providers = config.providers;
            if (!config.lazyLoad) {
                this.initialize();
            }
        }
        Object.defineProperty(AuthService.prototype, "authState", {
            get: /**
             * @return {?}
             */
            function () {
                return this._authState.asObservable();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AuthService.prototype, "readyState", {
            /** Provides an array of provider ID's as they become ready */
            get: /**
             * Provides an array of provider ID's as they become ready
             * @return {?}
             */
            function () {
                return this._readyState.asObservable();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         * @return {?}
         */
        AuthService.prototype.initialize = /**
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            this.initialized = true;
            this.providers.forEach((/**
             * @param {?} provider
             * @param {?} key
             * @return {?}
             */
            function (provider, key) {
                provider.initialize().then((/**
                 * @return {?}
                 */
                function () {
                    /** @type {?} */
                    var readyProviders = _this._readyState.getValue();
                    readyProviders.push(key);
                    _this._readyState.next(readyProviders);
                    provider.getLoginStatus().then((/**
                     * @param {?} user
                     * @return {?}
                     */
                    function (user) {
                        user.provider = key;
                        _this._user = user;
                        _this._authState.next(user);
                    })).catch((/**
                     * @param {?} err
                     * @return {?}
                     */
                    function (err) {
                        _this._authState.next(null);
                    }));
                }));
            }));
        };
        /**
         * @param {?} providerId
         * @param {?=} opt
         * @return {?}
         */
        AuthService.prototype.signIn = /**
         * @param {?} providerId
         * @param {?=} opt
         * @return {?}
         */
        function (providerId, opt) {
            var _this = this;
            if (!this.initialized) {
                this.initialize();
            }
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                /** @type {?} */
                var providerObject = _this.providers.get(providerId);
                if (providerObject) {
                    providerObject.signIn(opt).then((/**
                     * @param {?} user
                     * @return {?}
                     */
                    function (user) {
                        user.provider = providerId;
                        resolve(user);
                        _this._user = user;
                        _this._authState.next(user);
                    })).catch((/**
                     * @param {?} err
                     * @return {?}
                     */
                    function (err) {
                        reject(err);
                    }));
                }
                else {
                    reject(AuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }));
        };
        /**
         * @param {?=} revoke
         * @return {?}
         */
        AuthService.prototype.signOut = /**
         * @param {?=} revoke
         * @return {?}
         */
        function (revoke) {
            var _this = this;
            if (revoke === void 0) { revoke = false; }
            if (!this.initialized) {
                this.initialize();
            }
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                if (!_this._user) {
                    reject(AuthService.ERR_NOT_LOGGED_IN);
                }
                else {
                    /** @type {?} */
                    var providerId = _this._user.provider;
                    /** @type {?} */
                    var providerObject = _this.providers.get(providerId);
                    if (providerObject) {
                        providerObject.signOut(revoke).then((/**
                         * @return {?}
                         */
                        function () {
                            resolve();
                            _this._user = null;
                            _this._authState.next(null);
                        })).catch((/**
                         * @param {?} err
                         * @return {?}
                         */
                        function (err) {
                            reject(err);
                        }));
                    }
                    else {
                        reject(AuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                    }
                }
            }));
        };
        AuthService.ERR_LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';
        AuthService.ERR_NOT_LOGGED_IN = 'Not logged in';
        AuthService.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        AuthService.ctorParameters = function () { return [
            { type: AuthServiceConfig }
        ]; };
        return AuthService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var SocialLoginModule = /** @class */ (function () {
        function SocialLoginModule() {
        }
        /**
         * @param {?} config
         * @return {?}
         */
        SocialLoginModule.initialize = /**
         * @param {?} config
         * @return {?}
         */
        function (config) {
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
        };
        SocialLoginModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule
                        ],
                        providers: [
                            AuthService
                        ]
                    },] },
        ];
        return SocialLoginModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var SocialUser = /** @class */ (function () {
        function SocialUser() {
        }
        return SocialUser;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @abstract
     */
    var  /**
     * @abstract
     */
    BaseLoginProvider = /** @class */ (function () {
        function BaseLoginProvider() {
            this._readyState = new rxjs.BehaviorSubject(false);
        }
        /**
         * @protected
         * @return {?}
         */
        BaseLoginProvider.prototype.onReady = /**
         * @protected
         * @return {?}
         */
        function () {
            var _this = this;
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this._readyState.subscribe((/**
                 * @param {?} isReady
                 * @return {?}
                 */
                function (isReady) {
                    if (isReady) {
                        resolve();
                    }
                }));
            }));
        };
        /**
         * @param {?} id
         * @param {?} src
         * @param {?} onload
         * @param {?=} async
         * @param {?=} inner_text_content
         * @return {?}
         */
        BaseLoginProvider.prototype.loadScript = /**
         * @param {?} id
         * @param {?} src
         * @param {?} onload
         * @param {?=} async
         * @param {?=} inner_text_content
         * @return {?}
         */
        function (id, src, onload, async, inner_text_content) {
            if (async === void 0) { async = true; }
            // get document if platform is only browser
            if (typeof document !== 'undefined' && !document.getElementById(id)) {
                /** @type {?} */
                var signInJS = document.createElement('script');
                signInJS.async = async;
                signInJS.src = src;
                signInJS.onload = onload;
                /*
                if (inner_text_content) // LinkedIn
                    signInJS.text = inner_text_content;
                */
                document.head.appendChild(signInJS);
            }
        };
        return BaseLoginProvider;
    }());

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var GoogleLoginProvider = /** @class */ (function (_super) {
        __extends(GoogleLoginProvider, _super);
        function GoogleLoginProvider(clientId, opt) {
            if (opt === void 0) { opt = { scope: 'email' }; }
            var _this = _super.call(this) || this;
            _this.clientId = clientId;
            _this.opt = opt;
            return _this;
        }
        /**
         * @return {?}
         */
        GoogleLoginProvider.prototype.initialize = /**
         * @return {?}
         */
        function () {
            var _this = this;
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.loadScript(GoogleLoginProvider.PROVIDER_ID, 'https://apis.google.com/js/platform.js', (/**
                 * @return {?}
                 */
                function () {
                    gapi.load('auth2', (/**
                     * @return {?}
                     */
                    function () {
                        _this.auth2 = gapi.auth2.init(__assign({}, _this.opt, { client_id: _this.clientId }));
                        _this.auth2.then((/**
                         * @return {?}
                         */
                        function () {
                            _this._readyState.next(true);
                            resolve();
                        })).catch((/**
                         * @param {?} err
                         * @return {?}
                         */
                        function (err) {
                            reject(err);
                        }));
                    }));
                }));
            }));
        };
        /**
         * @return {?}
         */
        GoogleLoginProvider.prototype.getLoginStatus = /**
         * @return {?}
         */
        function () {
            var _this = this;
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.onReady().then((/**
                 * @return {?}
                 */
                function () {
                    if (_this.auth2.isSignedIn.get()) {
                        /** @type {?} */
                        var user = new SocialUser();
                        /** @type {?} */
                        var profile = _this.auth2.currentUser.get().getBasicProfile();
                        /** @type {?} */
                        var token = _this.auth2.currentUser.get().getAuthResponse(true).access_token;
                        /** @type {?} */
                        var backendToken = _this.auth2.currentUser.get().getAuthResponse(true).id_token;
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
        };
        /**
         * @param {?=} opt
         * @return {?}
         */
        GoogleLoginProvider.prototype.signIn = /**
         * @param {?=} opt
         * @return {?}
         */
        function (opt) {
            var _this = this;
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.onReady().then((/**
                 * @return {?}
                 */
                function () {
                    /** @type {?} */
                    var offlineAccess = (opt && opt.offline_access) || (_this.opt && _this.opt.offline_access);
                    /** @type {?} */
                    var promise = !offlineAccess ? _this.auth2.signIn(opt) : _this.auth2.grantOfflineAccess(opt);
                    promise.then((/**
                     * @param {?} response
                     * @return {?}
                     */
                    function (response) {
                        /** @type {?} */
                        var user = new SocialUser();
                        if (response && response.code) {
                            user.authorizationCode = response.code;
                        }
                        else {
                            /** @type {?} */
                            var profile = _this.auth2.currentUser.get().getBasicProfile();
                            /** @type {?} */
                            var token = _this.auth2.currentUser.get().getAuthResponse(true).access_token;
                            /** @type {?} */
                            var backendToken = _this.auth2.currentUser.get().getAuthResponse(true).id_token;
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
                    function (closed) {
                        reject('User cancelled login or did not fully authorize.');
                    })).catch((/**
                     * @param {?} err
                     * @return {?}
                     */
                    function (err) {
                        reject(err);
                    }));
                }));
            }));
        };
        /**
         * @param {?=} revoke
         * @return {?}
         */
        GoogleLoginProvider.prototype.signOut = /**
         * @param {?=} revoke
         * @return {?}
         */
        function (revoke) {
            var _this = this;
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.onReady().then((/**
                 * @return {?}
                 */
                function () {
                    /** @type {?} */
                    var signOutPromise;
                    if (revoke) {
                        signOutPromise = _this.auth2.disconnect();
                    }
                    else {
                        signOutPromise = _this.auth2.signOut();
                    }
                    signOutPromise.then((/**
                     * @param {?} err
                     * @return {?}
                     */
                    function (err) {
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
                    function (err) {
                        reject(err);
                    }));
                }));
            }));
        };
        GoogleLoginProvider.PROVIDER_ID = 'GOOGLE';
        return GoogleLoginProvider;
    }(BaseLoginProvider));

    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var FacebookLoginProvider = /** @class */ (function (_super) {
        __extends$1(FacebookLoginProvider, _super);
        function FacebookLoginProvider(clientId, opt, locale, fields, version) {
            if (opt === void 0) { opt = { scope: 'email,public_profile' }; }
            if (locale === void 0) { locale = 'en_US'; }
            if (fields === void 0) { fields = 'name,email,picture,first_name,last_name'; }
            if (version === void 0) { version = 'v4.0'; }
            var _this = _super.call(this) || this;
            _this.clientId = clientId;
            _this.opt = opt;
            _this.locale = locale;
            _this.fields = fields;
            _this.version = version;
            return _this;
        }
        /**
         * @return {?}
         */
        FacebookLoginProvider.prototype.initialize = /**
         * @return {?}
         */
        function () {
            var _this = this;
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.loadScript(FacebookLoginProvider.PROVIDER_ID, "//connect.facebook.net/" + _this.locale + "/sdk.js", (/**
                 * @return {?}
                 */
                function () {
                    FB.init({
                        appId: _this.clientId,
                        autoLogAppEvents: true,
                        cookie: true,
                        xfbml: true,
                        version: _this.version
                    });
                    // FB.AppEvents.logPageView(); #FIX for #18
                    _this._readyState.next(true);
                    resolve();
                }));
            }));
        };
        /**
         * @return {?}
         */
        FacebookLoginProvider.prototype.getLoginStatus = /**
         * @return {?}
         */
        function () {
            var _this = this;
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.onReady().then((/**
                 * @return {?}
                 */
                function () {
                    FB.getLoginStatus((/**
                     * @param {?} response
                     * @return {?}
                     */
                    function (response) {
                        if (response.status === 'connected') {
                            /** @type {?} */
                            var authResponse_1 = response.authResponse;
                            FB.api("/me?fields=" + _this.fields, (/**
                             * @param {?} fbUser
                             * @return {?}
                             */
                            function (fbUser) {
                                /** @type {?} */
                                var user = new SocialUser();
                                user.id = fbUser.id;
                                user.name = fbUser.name;
                                user.email = fbUser.email;
                                user.photoUrl = 'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
                                user.firstName = fbUser.first_name;
                                user.lastName = fbUser.last_name;
                                user.authToken = authResponse_1.accessToken;
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
        };
        /**
         * @param {?=} opt
         * @return {?}
         */
        FacebookLoginProvider.prototype.signIn = /**
         * @param {?=} opt
         * @return {?}
         */
        function (opt) {
            var _this = this;
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.onReady().then((/**
                 * @return {?}
                 */
                function () {
                    FB.login((/**
                     * @param {?} response
                     * @return {?}
                     */
                    function (response) {
                        if (response.authResponse) {
                            /** @type {?} */
                            var authResponse_2 = response.authResponse;
                            FB.api("/me?fields=" + _this.fields, (/**
                             * @param {?} fbUser
                             * @return {?}
                             */
                            function (fbUser) {
                                /** @type {?} */
                                var user = new SocialUser();
                                user.id = fbUser.id;
                                user.name = fbUser.name;
                                user.email = fbUser.email;
                                user.photoUrl = 'https://graph.facebook.com/' + fbUser.id + '/picture?type=normal';
                                user.firstName = fbUser.first_name;
                                user.lastName = fbUser.last_name;
                                user.authToken = authResponse_2.accessToken;
                                user.facebook = fbUser;
                                resolve(user);
                            }));
                        }
                        else {
                            reject('User cancelled login or did not fully authorize.');
                        }
                    }), _this.opt);
                }));
            }));
        };
        /**
         * @return {?}
         */
        FacebookLoginProvider.prototype.signOut = /**
         * @return {?}
         */
        function () {
            var _this = this;
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                _this.onReady().then((/**
                 * @return {?}
                 */
                function () {
                    FB.logout((/**
                     * @param {?} response
                     * @return {?}
                     */
                    function (response) {
                        resolve();
                    }));
                }));
            }));
        };
        FacebookLoginProvider.PROVIDER_ID = 'FACEBOOK';
        return FacebookLoginProvider;
    }(BaseLoginProvider));

    exports.AuthService = AuthService;
    exports.AuthServiceConfig = AuthServiceConfig;
    exports.FacebookLoginProvider = FacebookLoginProvider;
    exports.GoogleLoginProvider = GoogleLoginProvider;
    exports.SocialLoginModule = SocialLoginModule;
    exports.SocialUser = SocialUser;
    exports.ɵa = BaseLoginProvider;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=angularx-social-login.umd.js.map
