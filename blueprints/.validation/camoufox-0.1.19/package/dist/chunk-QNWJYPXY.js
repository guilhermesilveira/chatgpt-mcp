var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a2, b) => (typeof require !== "undefined" ? require : a2)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/tsup@8.5.0_typescript@5.8.3/node_modules/tsup/assets/esm_shims.js
import path from "path";
import { fileURLToPath } from "url";
var getFilename, getDirname, __dirname;
var init_esm_shims = __esm({
  "node_modules/.pnpm/tsup@8.5.0_typescript@5.8.3/node_modules/tsup/assets/esm_shims.js"() {
    getFilename = () => fileURLToPath(import.meta.url);
    getDirname = () => path.dirname(getFilename());
    __dirname = /* @__PURE__ */ getDirname();
  }
});

// node_modules/.pnpm/defer-to-connect@2.0.1/node_modules/defer-to-connect/dist/source/index.js
var require_source = __commonJS({
  "node_modules/.pnpm/defer-to-connect@2.0.1/node_modules/defer-to-connect/dist/source/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    Object.defineProperty(exports, "__esModule", { value: true });
    function isTLSSocket(socket) {
      return socket.encrypted;
    }
    var deferToConnect2 = (socket, fn) => {
      let listeners;
      if (typeof fn === "function") {
        const connect = fn;
        listeners = { connect };
      } else {
        listeners = fn;
      }
      const hasConnectListener = typeof listeners.connect === "function";
      const hasSecureConnectListener = typeof listeners.secureConnect === "function";
      const hasCloseListener = typeof listeners.close === "function";
      const onConnect = () => {
        if (hasConnectListener) {
          listeners.connect();
        }
        if (isTLSSocket(socket) && hasSecureConnectListener) {
          if (socket.authorized) {
            listeners.secureConnect();
          } else if (!socket.authorizationError) {
            socket.once("secureConnect", listeners.secureConnect);
          }
        }
        if (hasCloseListener) {
          socket.once("close", listeners.close);
        }
      };
      if (socket.writable && !socket.connecting) {
        onConnect();
      } else if (socket.connecting) {
        socket.once("connect", onConnect);
      } else if (socket.destroyed && hasCloseListener) {
        listeners.close(socket._hadError);
      }
    };
    exports.default = deferToConnect2;
    module.exports = deferToConnect2;
    module.exports.default = deferToConnect2;
  }
});

// node_modules/.pnpm/http-cache-semantics@4.2.0/node_modules/http-cache-semantics/index.js
var require_http_cache_semantics = __commonJS({
  "node_modules/.pnpm/http-cache-semantics@4.2.0/node_modules/http-cache-semantics/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var statusCodeCacheableByDefault = /* @__PURE__ */ new Set([
      200,
      203,
      204,
      206,
      300,
      301,
      308,
      404,
      405,
      410,
      414,
      501
    ]);
    var understoodStatuses = /* @__PURE__ */ new Set([
      200,
      203,
      204,
      300,
      301,
      302,
      303,
      307,
      308,
      404,
      405,
      410,
      414,
      501
    ]);
    var errorStatusCodes = /* @__PURE__ */ new Set([
      500,
      502,
      503,
      504
    ]);
    var hopByHopHeaders = {
      date: true,
      // included, because we add Age update Date
      connection: true,
      "keep-alive": true,
      "proxy-authenticate": true,
      "proxy-authorization": true,
      te: true,
      trailer: true,
      "transfer-encoding": true,
      upgrade: true
    };
    var excludedFromRevalidationUpdate = {
      // Since the old body is reused, it doesn't make sense to change properties of the body
      "content-length": true,
      "content-encoding": true,
      "transfer-encoding": true,
      "content-range": true
    };
    function toNumberOrZero(s) {
      const n2 = parseInt(s, 10);
      return isFinite(n2) ? n2 : 0;
    }
    function isErrorResponse(response) {
      if (!response) {
        return true;
      }
      return errorStatusCodes.has(response.status);
    }
    function parseCacheControl(header) {
      const cc = {};
      if (!header) return cc;
      const parts = header.trim().split(/,/);
      for (const part of parts) {
        const [k, v] = part.split(/=/, 2);
        cc[k.trim()] = v === void 0 ? true : v.trim().replace(/^"|"$/g, "");
      }
      return cc;
    }
    function formatCacheControl(cc) {
      let parts = [];
      for (const k in cc) {
        const v = cc[k];
        parts.push(v === true ? k : k + "=" + v);
      }
      if (!parts.length) {
        return void 0;
      }
      return parts.join(", ");
    }
    module.exports = class CachePolicy {
      /**
       * Creates a new CachePolicy instance.
       * @param {HttpRequest} req - Incoming client request.
       * @param {HttpResponse} res - Received server response.
       * @param {Object} [options={}] - Configuration options.
       * @param {boolean} [options.shared=true] - Is the cache shared (a public proxy)? `false` for personal browser caches.
       * @param {number} [options.cacheHeuristic=0.1] - Fallback heuristic (age fraction) for cache duration.
       * @param {number} [options.immutableMinTimeToLive=86400000] - Minimum TTL for immutable responses in milliseconds.
       * @param {boolean} [options.ignoreCargoCult=false] - Detect nonsense cache headers, and override them.
       * @param {any} [options._fromObject] - Internal parameter for deserialization. Do not use.
       */
      constructor(req, res, {
        shared,
        cacheHeuristic,
        immutableMinTimeToLive,
        ignoreCargoCult,
        _fromObject
      } = {}) {
        if (_fromObject) {
          this._fromObject(_fromObject);
          return;
        }
        if (!res || !res.headers) {
          throw Error("Response headers missing");
        }
        this._assertRequestHasHeaders(req);
        this._responseTime = this.now();
        this._isShared = shared !== false;
        this._ignoreCargoCult = !!ignoreCargoCult;
        this._cacheHeuristic = void 0 !== cacheHeuristic ? cacheHeuristic : 0.1;
        this._immutableMinTtl = void 0 !== immutableMinTimeToLive ? immutableMinTimeToLive : 24 * 3600 * 1e3;
        this._status = "status" in res ? res.status : 200;
        this._resHeaders = res.headers;
        this._rescc = parseCacheControl(res.headers["cache-control"]);
        this._method = "method" in req ? req.method : "GET";
        this._url = req.url;
        this._host = req.headers.host;
        this._noAuthorization = !req.headers.authorization;
        this._reqHeaders = res.headers.vary ? req.headers : null;
        this._reqcc = parseCacheControl(req.headers["cache-control"]);
        if (this._ignoreCargoCult && "pre-check" in this._rescc && "post-check" in this._rescc) {
          delete this._rescc["pre-check"];
          delete this._rescc["post-check"];
          delete this._rescc["no-cache"];
          delete this._rescc["no-store"];
          delete this._rescc["must-revalidate"];
          this._resHeaders = Object.assign({}, this._resHeaders, {
            "cache-control": formatCacheControl(this._rescc)
          });
          delete this._resHeaders.expires;
          delete this._resHeaders.pragma;
        }
        if (res.headers["cache-control"] == null && /no-cache/.test(res.headers.pragma)) {
          this._rescc["no-cache"] = true;
        }
      }
      /**
       * You can monkey-patch it for testing.
       * @returns {number} Current time in milliseconds.
       */
      now() {
        return Date.now();
      }
      /**
       * Determines if the response is storable in a cache.
       * @returns {boolean} `false` if can never be cached.
       */
      storable() {
        return !!(!this._reqcc["no-store"] && // A cache MUST NOT store a response to any request, unless:
        // The request method is understood by the cache and defined as being cacheable, and
        ("GET" === this._method || "HEAD" === this._method || "POST" === this._method && this._hasExplicitExpiration()) && // the response status code is understood by the cache, and
        understoodStatuses.has(this._status) && // the "no-store" cache directive does not appear in request or response header fields, and
        !this._rescc["no-store"] && // the "private" response directive does not appear in the response, if the cache is shared, and
        (!this._isShared || !this._rescc.private) && // the Authorization header field does not appear in the request, if the cache is shared,
        (!this._isShared || this._noAuthorization || this._allowsStoringAuthenticated()) && // the response either:
        // contains an Expires header field, or
        (this._resHeaders.expires || // contains a max-age response directive, or
        // contains a s-maxage response directive and the cache is shared, or
        // contains a public response directive.
        this._rescc["max-age"] || this._isShared && this._rescc["s-maxage"] || this._rescc.public || // has a status code that is defined as cacheable by default
        statusCodeCacheableByDefault.has(this._status)));
      }
      /**
       * @returns {boolean} true if expiration is explicitly defined.
       */
      _hasExplicitExpiration() {
        return !!(this._isShared && this._rescc["s-maxage"] || this._rescc["max-age"] || this._resHeaders.expires);
      }
      /**
       * @param {HttpRequest} req - a request
       * @throws {Error} if the headers are missing.
       */
      _assertRequestHasHeaders(req) {
        if (!req || !req.headers) {
          throw Error("Request headers missing");
        }
      }
      /**
       * Checks if the request matches the cache and can be satisfied from the cache immediately,
       * without having to make a request to the server.
       *
       * This doesn't support `stale-while-revalidate`. See `evaluateRequest()` for a more complete solution.
       *
       * @param {HttpRequest} req - The new incoming HTTP request.
       * @returns {boolean} `true`` if the cached response used to construct this cache policy satisfies the request without revalidation.
       */
      satisfiesWithoutRevalidation(req) {
        const result = this.evaluateRequest(req);
        return !result.revalidation;
      }
      /**
       * @param {{headers: Record<string, string>, synchronous: boolean}|undefined} revalidation - Revalidation information, if any.
       * @returns {{response: {headers: Record<string, string>}, revalidation: {headers: Record<string, string>, synchronous: boolean}|undefined}} An object with a cached response headers and revalidation info.
       */
      _evaluateRequestHitResult(revalidation) {
        return {
          response: {
            headers: this.responseHeaders()
          },
          revalidation
        };
      }
      /**
       * @param {HttpRequest} request - new incoming
       * @param {boolean} synchronous - whether revalidation must be synchronous (not s-w-r).
       * @returns {{headers: Record<string, string>, synchronous: boolean}} An object with revalidation headers and a synchronous flag.
       */
      _evaluateRequestRevalidation(request, synchronous) {
        return {
          synchronous,
          headers: this.revalidationHeaders(request)
        };
      }
      /**
       * @param {HttpRequest} request - new incoming
       * @returns {{response: undefined, revalidation: {headers: Record<string, string>, synchronous: boolean}}} An object indicating no cached response and revalidation details.
       */
      _evaluateRequestMissResult(request) {
        return {
          response: void 0,
          revalidation: this._evaluateRequestRevalidation(request, true)
        };
      }
      /**
       * Checks if the given request matches this cache entry, and how the cache can be used to satisfy it. Returns an object with:
       *
       * ```
       * {
       *     // If defined, you must send a request to the server.
       *     revalidation: {
       *         headers: {}, // HTTP headers to use when sending the revalidation response
       *         // If true, you MUST wait for a response from the server before using the cache
       *         // If false, this is stale-while-revalidate. The cache is stale, but you can use it while you update it asynchronously.
       *         synchronous: bool,
       *     },
       *     // If defined, you can use this cached response.
       *     response: {
       *         headers: {}, // Updated cached HTTP headers you must use when responding to the client
       *     },
       * }
       * ```
       * @param {HttpRequest} req - new incoming HTTP request
       * @returns {{response: {headers: Record<string, string>}|undefined, revalidation: {headers: Record<string, string>, synchronous: boolean}|undefined}} An object containing keys:
       *   - revalidation: { headers: Record<string, string>, synchronous: boolean } Set if you should send this to the origin server
       *   - response: { headers: Record<string, string> } Set if you can respond to the client with these cached headers
       */
      evaluateRequest(req) {
        this._assertRequestHasHeaders(req);
        if (this._rescc["must-revalidate"]) {
          return this._evaluateRequestMissResult(req);
        }
        if (!this._requestMatches(req, false)) {
          return this._evaluateRequestMissResult(req);
        }
        const requestCC = parseCacheControl(req.headers["cache-control"]);
        if (requestCC["no-cache"] || /no-cache/.test(req.headers.pragma)) {
          return this._evaluateRequestMissResult(req);
        }
        if (requestCC["max-age"] && this.age() > toNumberOrZero(requestCC["max-age"])) {
          return this._evaluateRequestMissResult(req);
        }
        if (requestCC["min-fresh"] && this.maxAge() - this.age() < toNumberOrZero(requestCC["min-fresh"])) {
          return this._evaluateRequestMissResult(req);
        }
        if (this.stale()) {
          const allowsStaleWithoutRevalidation = "max-stale" in requestCC && (true === requestCC["max-stale"] || requestCC["max-stale"] > this.age() - this.maxAge());
          if (allowsStaleWithoutRevalidation) {
            return this._evaluateRequestHitResult(void 0);
          }
          if (this.useStaleWhileRevalidate()) {
            return this._evaluateRequestHitResult(this._evaluateRequestRevalidation(req, false));
          }
          return this._evaluateRequestMissResult(req);
        }
        return this._evaluateRequestHitResult(void 0);
      }
      /**
       * @param {HttpRequest} req - check if this is for the same cache entry
       * @param {boolean} allowHeadMethod - allow a HEAD method to match.
       * @returns {boolean} `true` if the request matches.
       */
      _requestMatches(req, allowHeadMethod) {
        return !!((!this._url || this._url === req.url) && this._host === req.headers.host && // the request method associated with the stored response allows it to be used for the presented request, and
        (!req.method || this._method === req.method || allowHeadMethod && "HEAD" === req.method) && // selecting header fields nominated by the stored response (if any) match those presented, and
        this._varyMatches(req));
      }
      /**
       * Determines whether storing authenticated responses is allowed.
       * @returns {boolean} `true` if allowed.
       */
      _allowsStoringAuthenticated() {
        return !!(this._rescc["must-revalidate"] || this._rescc.public || this._rescc["s-maxage"]);
      }
      /**
       * Checks whether the Vary header in the response matches the new request.
       * @param {HttpRequest} req - incoming HTTP request
       * @returns {boolean} `true` if the vary headers match.
       */
      _varyMatches(req) {
        if (!this._resHeaders.vary) {
          return true;
        }
        if (this._resHeaders.vary === "*") {
          return false;
        }
        const fields = this._resHeaders.vary.trim().toLowerCase().split(/\s*,\s*/);
        for (const name of fields) {
          if (req.headers[name] !== this._reqHeaders[name]) return false;
        }
        return true;
      }
      /**
       * Creates a copy of the given headers without any hop-by-hop headers.
       * @param {Record<string, string>} inHeaders - old headers from the cached response
       * @returns {Record<string, string>} A new headers object without hop-by-hop headers.
       */
      _copyWithoutHopByHopHeaders(inHeaders) {
        const headers = {};
        for (const name in inHeaders) {
          if (hopByHopHeaders[name]) continue;
          headers[name] = inHeaders[name];
        }
        if (inHeaders.connection) {
          const tokens = inHeaders.connection.trim().split(/\s*,\s*/);
          for (const name of tokens) {
            delete headers[name];
          }
        }
        if (headers.warning) {
          const warnings = headers.warning.split(/,/).filter((warning) => {
            return !/^\s*1[0-9][0-9]/.test(warning);
          });
          if (!warnings.length) {
            delete headers.warning;
          } else {
            headers.warning = warnings.join(",").trim();
          }
        }
        return headers;
      }
      /**
       * Returns the response headers adjusted for serving the cached response.
       * Removes hop-by-hop headers and updates the Age and Date headers.
       * @returns {Record<string, string>} The adjusted response headers.
       */
      responseHeaders() {
        const headers = this._copyWithoutHopByHopHeaders(this._resHeaders);
        const age = this.age();
        if (age > 3600 * 24 && !this._hasExplicitExpiration() && this.maxAge() > 3600 * 24) {
          headers.warning = (headers.warning ? `${headers.warning}, ` : "") + '113 - "rfc7234 5.5.4"';
        }
        headers.age = `${Math.round(age)}`;
        headers.date = new Date(this.now()).toUTCString();
        return headers;
      }
      /**
       * Returns the Date header value from the response or the current time if invalid.
       * @returns {number} Timestamp (in milliseconds) representing the Date header or response time.
       */
      date() {
        const serverDate = Date.parse(this._resHeaders.date);
        if (isFinite(serverDate)) {
          return serverDate;
        }
        return this._responseTime;
      }
      /**
       * Value of the Age header, in seconds, updated for the current time.
       * May be fractional.
       * @returns {number} The age in seconds.
       */
      age() {
        let age = this._ageValue();
        const residentTime = (this.now() - this._responseTime) / 1e3;
        return age + residentTime;
      }
      /**
       * @returns {number} The Age header value as a number.
       */
      _ageValue() {
        return toNumberOrZero(this._resHeaders.age);
      }
      /**
       * Possibly outdated value of applicable max-age (or heuristic equivalent) in seconds.
       * This counts since response's `Date`.
       *
       * For an up-to-date value, see `timeToLive()`.
       *
       * Returns the maximum age (freshness lifetime) of the response in seconds.
       * @returns {number} The max-age value in seconds.
       */
      maxAge() {
        if (!this.storable() || this._rescc["no-cache"]) {
          return 0;
        }
        if (this._isShared && (this._resHeaders["set-cookie"] && !this._rescc.public && !this._rescc.immutable)) {
          return 0;
        }
        if (this._resHeaders.vary === "*") {
          return 0;
        }
        if (this._isShared) {
          if (this._rescc["proxy-revalidate"]) {
            return 0;
          }
          if (this._rescc["s-maxage"]) {
            return toNumberOrZero(this._rescc["s-maxage"]);
          }
        }
        if (this._rescc["max-age"]) {
          return toNumberOrZero(this._rescc["max-age"]);
        }
        const defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0;
        const serverDate = this.date();
        if (this._resHeaders.expires) {
          const expires = Date.parse(this._resHeaders.expires);
          if (Number.isNaN(expires) || expires < serverDate) {
            return 0;
          }
          return Math.max(defaultMinTtl, (expires - serverDate) / 1e3);
        }
        if (this._resHeaders["last-modified"]) {
          const lastModified = Date.parse(this._resHeaders["last-modified"]);
          if (isFinite(lastModified) && serverDate > lastModified) {
            return Math.max(
              defaultMinTtl,
              (serverDate - lastModified) / 1e3 * this._cacheHeuristic
            );
          }
        }
        return defaultMinTtl;
      }
      /**
       * Remaining time this cache entry may be useful for, in *milliseconds*.
       * You can use this as an expiration time for your cache storage.
       *
       * Prefer this method over `maxAge()`, because it includes other factors like `age` and `stale-while-revalidate`.
       * @returns {number} Time-to-live in milliseconds.
       */
      timeToLive() {
        const age = this.maxAge() - this.age();
        const staleIfErrorAge = age + toNumberOrZero(this._rescc["stale-if-error"]);
        const staleWhileRevalidateAge = age + toNumberOrZero(this._rescc["stale-while-revalidate"]);
        return Math.round(Math.max(0, age, staleIfErrorAge, staleWhileRevalidateAge) * 1e3);
      }
      /**
       * If true, this cache entry is past its expiration date.
       * Note that stale cache may be useful sometimes, see `evaluateRequest()`.
       * @returns {boolean} `false` doesn't mean it's fresh nor usable
       */
      stale() {
        return this.maxAge() <= this.age();
      }
      /**
       * @returns {boolean} `true` if `stale-if-error` condition allows use of a stale response.
       */
      _useStaleIfError() {
        return this.maxAge() + toNumberOrZero(this._rescc["stale-if-error"]) > this.age();
      }
      /** See `evaluateRequest()` for a more complete solution
       * @returns {boolean} `true` if `stale-while-revalidate` is currently allowed.
       */
      useStaleWhileRevalidate() {
        const swr = toNumberOrZero(this._rescc["stale-while-revalidate"]);
        return swr > 0 && this.maxAge() + swr > this.age();
      }
      /**
       * Creates a `CachePolicy` instance from a serialized object.
       * @param {Object} obj - The serialized object.
       * @returns {CachePolicy} A new CachePolicy instance.
       */
      static fromObject(obj) {
        return new this(void 0, void 0, { _fromObject: obj });
      }
      /**
       * @param {any} obj - The serialized object.
       * @throws {Error} If already initialized or if the object is invalid.
       */
      _fromObject(obj) {
        if (this._responseTime) throw Error("Reinitialized");
        if (!obj || obj.v !== 1) throw Error("Invalid serialization");
        this._responseTime = obj.t;
        this._isShared = obj.sh;
        this._cacheHeuristic = obj.ch;
        this._immutableMinTtl = obj.imm !== void 0 ? obj.imm : 24 * 3600 * 1e3;
        this._ignoreCargoCult = !!obj.icc;
        this._status = obj.st;
        this._resHeaders = obj.resh;
        this._rescc = obj.rescc;
        this._method = obj.m;
        this._url = obj.u;
        this._host = obj.h;
        this._noAuthorization = obj.a;
        this._reqHeaders = obj.reqh;
        this._reqcc = obj.reqcc;
      }
      /**
       * Serializes the `CachePolicy` instance into a JSON-serializable object.
       * @returns {Object} The serialized object.
       */
      toObject() {
        return {
          v: 1,
          t: this._responseTime,
          sh: this._isShared,
          ch: this._cacheHeuristic,
          imm: this._immutableMinTtl,
          icc: this._ignoreCargoCult,
          st: this._status,
          resh: this._resHeaders,
          rescc: this._rescc,
          m: this._method,
          u: this._url,
          h: this._host,
          a: this._noAuthorization,
          reqh: this._reqHeaders,
          reqcc: this._reqcc
        };
      }
      /**
       * Headers for sending to the origin server to revalidate stale response.
       * Allows server to return 304 to allow reuse of the previous response.
       *
       * Hop by hop headers are always stripped.
       * Revalidation headers may be added or removed, depending on request.
       * @param {HttpRequest} incomingReq - The incoming HTTP request.
       * @returns {Record<string, string>} The headers for the revalidation request.
       */
      revalidationHeaders(incomingReq) {
        this._assertRequestHasHeaders(incomingReq);
        const headers = this._copyWithoutHopByHopHeaders(incomingReq.headers);
        delete headers["if-range"];
        if (!this._requestMatches(incomingReq, true) || !this.storable()) {
          delete headers["if-none-match"];
          delete headers["if-modified-since"];
          return headers;
        }
        if (this._resHeaders.etag) {
          headers["if-none-match"] = headers["if-none-match"] ? `${headers["if-none-match"]}, ${this._resHeaders.etag}` : this._resHeaders.etag;
        }
        const forbidsWeakValidators = headers["accept-ranges"] || headers["if-match"] || headers["if-unmodified-since"] || this._method && this._method != "GET";
        if (forbidsWeakValidators) {
          delete headers["if-modified-since"];
          if (headers["if-none-match"]) {
            const etags = headers["if-none-match"].split(/,/).filter((etag) => {
              return !/^\s*W\//.test(etag);
            });
            if (!etags.length) {
              delete headers["if-none-match"];
            } else {
              headers["if-none-match"] = etags.join(",").trim();
            }
          }
        } else if (this._resHeaders["last-modified"] && !headers["if-modified-since"]) {
          headers["if-modified-since"] = this._resHeaders["last-modified"];
        }
        return headers;
      }
      /**
       * Creates new CachePolicy with information combined from the previews response,
       * and the new revalidation response.
       *
       * Returns {policy, modified} where modified is a boolean indicating
       * whether the response body has been modified, and old cached body can't be used.
       *
       * @param {HttpRequest} request - The latest HTTP request asking for the cached entry.
       * @param {HttpResponse} response - The latest revalidation HTTP response from the origin server.
       * @returns {{policy: CachePolicy, modified: boolean, matches: boolean}} The updated policy and modification status.
       * @throws {Error} If the response headers are missing.
       */
      revalidatedPolicy(request, response) {
        this._assertRequestHasHeaders(request);
        if (this._useStaleIfError() && isErrorResponse(response)) {
          return {
            policy: this,
            modified: false,
            matches: true
          };
        }
        if (!response || !response.headers) {
          throw Error("Response headers missing");
        }
        let matches = false;
        if (response.status !== void 0 && response.status != 304) {
          matches = false;
        } else if (response.headers.etag && !/^\s*W\//.test(response.headers.etag)) {
          matches = this._resHeaders.etag && this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag;
        } else if (this._resHeaders.etag && response.headers.etag) {
          matches = this._resHeaders.etag.replace(/^\s*W\//, "") === response.headers.etag.replace(/^\s*W\//, "");
        } else if (this._resHeaders["last-modified"]) {
          matches = this._resHeaders["last-modified"] === response.headers["last-modified"];
        } else {
          if (!this._resHeaders.etag && !this._resHeaders["last-modified"] && !response.headers.etag && !response.headers["last-modified"]) {
            matches = true;
          }
        }
        const optionsCopy = {
          shared: this._isShared,
          cacheHeuristic: this._cacheHeuristic,
          immutableMinTimeToLive: this._immutableMinTtl,
          ignoreCargoCult: this._ignoreCargoCult
        };
        if (!matches) {
          return {
            policy: new this.constructor(request, response, optionsCopy),
            // Client receiving 304 without body, even if it's invalid/mismatched has no option
            // but to reuse a cached body. We don't have a good way to tell clients to do
            // error recovery in such case.
            modified: response.status != 304,
            matches: false
          };
        }
        const headers = {};
        for (const k in this._resHeaders) {
          headers[k] = k in response.headers && !excludedFromRevalidationUpdate[k] ? response.headers[k] : this._resHeaders[k];
        }
        const newResponse = Object.assign({}, response, {
          status: this._status,
          method: this._method,
          headers
        });
        return {
          policy: new this.constructor(request, newResponse, optionsCopy),
          modified: false,
          matches: true
        };
      }
    };
  }
});

// node_modules/.pnpm/json-buffer@3.0.1/node_modules/json-buffer/index.js
var require_json_buffer = __commonJS({
  "node_modules/.pnpm/json-buffer@3.0.1/node_modules/json-buffer/index.js"(exports) {
    init_esm_shims();
    exports.stringify = function stringify(o2) {
      if ("undefined" == typeof o2) return o2;
      if (o2 && Buffer.isBuffer(o2))
        return JSON.stringify(":base64:" + o2.toString("base64"));
      if (o2 && o2.toJSON)
        o2 = o2.toJSON();
      if (o2 && "object" === typeof o2) {
        var s = "";
        var array = Array.isArray(o2);
        s = array ? "[" : "{";
        var first = true;
        for (var k in o2) {
          var ignore = "function" == typeof o2[k] || !array && "undefined" === typeof o2[k];
          if (Object.hasOwnProperty.call(o2, k) && !ignore) {
            if (!first)
              s += ",";
            first = false;
            if (array) {
              if (o2[k] == void 0)
                s += "null";
              else
                s += stringify(o2[k]);
            } else if (o2[k] !== void 0) {
              s += stringify(k) + ":" + stringify(o2[k]);
            }
          }
        }
        s += array ? "]" : "}";
        return s;
      } else if ("string" === typeof o2) {
        return JSON.stringify(/^:/.test(o2) ? ":" + o2 : o2);
      } else if ("undefined" === typeof o2) {
        return "null";
      } else
        return JSON.stringify(o2);
    };
    exports.parse = function(s) {
      return JSON.parse(s, function(key, value) {
        if ("string" === typeof value) {
          if (/^:base64:/.test(value))
            return Buffer.from(value.substring(8), "base64");
          else
            return /^:/.test(value) ? value.substring(1) : value;
        }
        return value;
      });
    };
  }
});

// node_modules/.pnpm/keyv@4.5.4/node_modules/keyv/src/index.js
var require_src = __commonJS({
  "node_modules/.pnpm/keyv@4.5.4/node_modules/keyv/src/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var EventEmitter3 = __require("events");
    var JSONB = require_json_buffer();
    var loadStore = (options) => {
      const adapters = {
        redis: "@keyv/redis",
        rediss: "@keyv/redis",
        mongodb: "@keyv/mongo",
        mongo: "@keyv/mongo",
        sqlite: "@keyv/sqlite",
        postgresql: "@keyv/postgres",
        postgres: "@keyv/postgres",
        mysql: "@keyv/mysql",
        etcd: "@keyv/etcd",
        offline: "@keyv/offline",
        tiered: "@keyv/tiered"
      };
      if (options.adapter || options.uri) {
        const adapter = options.adapter || /^[^:+]*/.exec(options.uri)[0];
        return new (__require(adapters[adapter]))(options);
      }
      return /* @__PURE__ */ new Map();
    };
    var iterableAdapters = [
      "sqlite",
      "postgres",
      "mysql",
      "mongo",
      "redis",
      "tiered"
    ];
    var Keyv2 = class extends EventEmitter3 {
      constructor(uri, { emitErrors = true, ...options } = {}) {
        super();
        this.opts = {
          namespace: "keyv",
          serialize: JSONB.stringify,
          deserialize: JSONB.parse,
          ...typeof uri === "string" ? { uri } : uri,
          ...options
        };
        if (!this.opts.store) {
          const adapterOptions = { ...this.opts };
          this.opts.store = loadStore(adapterOptions);
        }
        if (this.opts.compression) {
          const compression = this.opts.compression;
          this.opts.serialize = compression.serialize.bind(compression);
          this.opts.deserialize = compression.deserialize.bind(compression);
        }
        if (typeof this.opts.store.on === "function" && emitErrors) {
          this.opts.store.on("error", (error) => this.emit("error", error));
        }
        this.opts.store.namespace = this.opts.namespace;
        const generateIterator = (iterator) => async function* () {
          for await (const [key, raw] of typeof iterator === "function" ? iterator(this.opts.store.namespace) : iterator) {
            const data = await this.opts.deserialize(raw);
            if (this.opts.store.namespace && !key.includes(this.opts.store.namespace)) {
              continue;
            }
            if (typeof data.expires === "number" && Date.now() > data.expires) {
              this.delete(key);
              continue;
            }
            yield [this._getKeyUnprefix(key), data.value];
          }
        };
        if (typeof this.opts.store[Symbol.iterator] === "function" && this.opts.store instanceof Map) {
          this.iterator = generateIterator(this.opts.store);
        } else if (typeof this.opts.store.iterator === "function" && this.opts.store.opts && this._checkIterableAdaptar()) {
          this.iterator = generateIterator(this.opts.store.iterator.bind(this.opts.store));
        }
      }
      _checkIterableAdaptar() {
        return iterableAdapters.includes(this.opts.store.opts.dialect) || iterableAdapters.findIndex((element) => this.opts.store.opts.url.includes(element)) >= 0;
      }
      _getKeyPrefix(key) {
        return `${this.opts.namespace}:${key}`;
      }
      _getKeyPrefixArray(keys) {
        return keys.map((key) => `${this.opts.namespace}:${key}`);
      }
      _getKeyUnprefix(key) {
        return key.split(":").splice(1).join(":");
      }
      get(key, options) {
        const { store } = this.opts;
        const isArray2 = Array.isArray(key);
        const keyPrefixed = isArray2 ? this._getKeyPrefixArray(key) : this._getKeyPrefix(key);
        if (isArray2 && store.getMany === void 0) {
          const promises2 = [];
          for (const key2 of keyPrefixed) {
            promises2.push(
              Promise.resolve().then(() => store.get(key2)).then((data) => typeof data === "string" ? this.opts.deserialize(data) : this.opts.compression ? this.opts.deserialize(data) : data).then((data) => {
                if (data === void 0 || data === null) {
                  return void 0;
                }
                if (typeof data.expires === "number" && Date.now() > data.expires) {
                  return this.delete(key2).then(() => void 0);
                }
                return options && options.raw ? data : data.value;
              })
            );
          }
          return Promise.allSettled(promises2).then((values) => {
            const data = [];
            for (const value of values) {
              data.push(value.value);
            }
            return data;
          });
        }
        return Promise.resolve().then(() => isArray2 ? store.getMany(keyPrefixed) : store.get(keyPrefixed)).then((data) => typeof data === "string" ? this.opts.deserialize(data) : this.opts.compression ? this.opts.deserialize(data) : data).then((data) => {
          if (data === void 0 || data === null) {
            return void 0;
          }
          if (isArray2) {
            return data.map((row, index) => {
              if (typeof row === "string") {
                row = this.opts.deserialize(row);
              }
              if (row === void 0 || row === null) {
                return void 0;
              }
              if (typeof row.expires === "number" && Date.now() > row.expires) {
                this.delete(key[index]).then(() => void 0);
                return void 0;
              }
              return options && options.raw ? row : row.value;
            });
          }
          if (typeof data.expires === "number" && Date.now() > data.expires) {
            return this.delete(key).then(() => void 0);
          }
          return options && options.raw ? data : data.value;
        });
      }
      set(key, value, ttl2) {
        const keyPrefixed = this._getKeyPrefix(key);
        if (typeof ttl2 === "undefined") {
          ttl2 = this.opts.ttl;
        }
        if (ttl2 === 0) {
          ttl2 = void 0;
        }
        const { store } = this.opts;
        return Promise.resolve().then(() => {
          const expires = typeof ttl2 === "number" ? Date.now() + ttl2 : null;
          if (typeof value === "symbol") {
            this.emit("error", "symbol cannot be serialized");
          }
          value = { value, expires };
          return this.opts.serialize(value);
        }).then((value2) => store.set(keyPrefixed, value2, ttl2)).then(() => true);
      }
      delete(key) {
        const { store } = this.opts;
        if (Array.isArray(key)) {
          const keyPrefixed2 = this._getKeyPrefixArray(key);
          if (store.deleteMany === void 0) {
            const promises2 = [];
            for (const key2 of keyPrefixed2) {
              promises2.push(store.delete(key2));
            }
            return Promise.allSettled(promises2).then((values) => values.every((x) => x.value === true));
          }
          return Promise.resolve().then(() => store.deleteMany(keyPrefixed2));
        }
        const keyPrefixed = this._getKeyPrefix(key);
        return Promise.resolve().then(() => store.delete(keyPrefixed));
      }
      clear() {
        const { store } = this.opts;
        return Promise.resolve().then(() => store.clear());
      }
      has(key) {
        const keyPrefixed = this._getKeyPrefix(key);
        const { store } = this.opts;
        return Promise.resolve().then(async () => {
          if (typeof store.has === "function") {
            return store.has(keyPrefixed);
          }
          const value = await store.get(keyPrefixed);
          return value !== void 0;
        });
      }
      disconnect() {
        const { store } = this.opts;
        if (typeof store.disconnect === "function") {
          return store.disconnect();
        }
      }
    };
    module.exports = Keyv2;
  }
});

// node_modules/.pnpm/mimic-response@3.1.0/node_modules/mimic-response/index.js
var require_mimic_response = __commonJS({
  "node_modules/.pnpm/mimic-response@3.1.0/node_modules/mimic-response/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var knownProperties2 = [
      "aborted",
      "complete",
      "headers",
      "httpVersion",
      "httpVersionMinor",
      "httpVersionMajor",
      "method",
      "rawHeaders",
      "rawTrailers",
      "setTimeout",
      "socket",
      "statusCode",
      "statusMessage",
      "trailers",
      "url"
    ];
    module.exports = (fromStream, toStream) => {
      if (toStream._readableState.autoDestroy) {
        throw new Error("The second stream must have the `autoDestroy` option set to `false`");
      }
      const fromProperties = new Set(Object.keys(fromStream).concat(knownProperties2));
      const properties = {};
      for (const property of fromProperties) {
        if (property in toStream) {
          continue;
        }
        properties[property] = {
          get() {
            const value = fromStream[property];
            const isFunction3 = typeof value === "function";
            return isFunction3 ? value.bind(fromStream) : value;
          },
          set(value) {
            fromStream[property] = value;
          },
          enumerable: true,
          configurable: false
        };
      }
      Object.defineProperties(toStream, properties);
      fromStream.once("aborted", () => {
        toStream.destroy();
        toStream.emit("aborted");
      });
      fromStream.once("close", () => {
        if (fromStream.complete) {
          if (toStream.readable) {
            toStream.once("end", () => {
              toStream.emit("close");
            });
          } else {
            toStream.emit("close");
          }
        } else {
          toStream.emit("close");
        }
      });
      return toStream;
    };
  }
});

// node_modules/.pnpm/decompress-response@6.0.0/node_modules/decompress-response/index.js
var require_decompress_response = __commonJS({
  "node_modules/.pnpm/decompress-response@6.0.0/node_modules/decompress-response/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { Transform, PassThrough } = __require("stream");
    var zlib = __require("zlib");
    var mimicResponse2 = require_mimic_response();
    module.exports = (response) => {
      const contentEncoding = (response.headers["content-encoding"] || "").toLowerCase();
      if (!["gzip", "deflate", "br"].includes(contentEncoding)) {
        return response;
      }
      const isBrotli = contentEncoding === "br";
      if (isBrotli && typeof zlib.createBrotliDecompress !== "function") {
        response.destroy(new Error("Brotli is not supported on Node.js < 12"));
        return response;
      }
      let isEmpty = true;
      const checker = new Transform({
        transform(data, _encoding, callback) {
          isEmpty = false;
          callback(null, data);
        },
        flush(callback) {
          callback();
        }
      });
      const finalStream = new PassThrough({
        autoDestroy: false,
        destroy(error, callback) {
          response.destroy();
          callback(error);
        }
      });
      const decompressStream = isBrotli ? zlib.createBrotliDecompress() : zlib.createUnzip();
      decompressStream.once("error", (error) => {
        if (isEmpty && !response.readable) {
          finalStream.end();
          return;
        }
        finalStream.destroy(error);
      });
      mimicResponse2(response, finalStream);
      response.pipe(checker).pipe(decompressStream).pipe(finalStream);
      return finalStream;
    };
  }
});

// node_modules/.pnpm/quick-lru@5.1.1/node_modules/quick-lru/index.js
var require_quick_lru = __commonJS({
  "node_modules/.pnpm/quick-lru@5.1.1/node_modules/quick-lru/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var QuickLRU = class {
      constructor(options = {}) {
        if (!(options.maxSize && options.maxSize > 0)) {
          throw new TypeError("`maxSize` must be a number greater than 0");
        }
        this.maxSize = options.maxSize;
        this.onEviction = options.onEviction;
        this.cache = /* @__PURE__ */ new Map();
        this.oldCache = /* @__PURE__ */ new Map();
        this._size = 0;
      }
      _set(key, value) {
        this.cache.set(key, value);
        this._size++;
        if (this._size >= this.maxSize) {
          this._size = 0;
          if (typeof this.onEviction === "function") {
            for (const [key2, value2] of this.oldCache.entries()) {
              this.onEviction(key2, value2);
            }
          }
          this.oldCache = this.cache;
          this.cache = /* @__PURE__ */ new Map();
        }
      }
      get(key) {
        if (this.cache.has(key)) {
          return this.cache.get(key);
        }
        if (this.oldCache.has(key)) {
          const value = this.oldCache.get(key);
          this.oldCache.delete(key);
          this._set(key, value);
          return value;
        }
      }
      set(key, value) {
        if (this.cache.has(key)) {
          this.cache.set(key, value);
        } else {
          this._set(key, value);
        }
        return this;
      }
      has(key) {
        return this.cache.has(key) || this.oldCache.has(key);
      }
      peek(key) {
        if (this.cache.has(key)) {
          return this.cache.get(key);
        }
        if (this.oldCache.has(key)) {
          return this.oldCache.get(key);
        }
      }
      delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
          this._size--;
        }
        return this.oldCache.delete(key) || deleted;
      }
      clear() {
        this.cache.clear();
        this.oldCache.clear();
        this._size = 0;
      }
      *keys() {
        for (const [key] of this) {
          yield key;
        }
      }
      *values() {
        for (const [, value] of this) {
          yield value;
        }
      }
      *[Symbol.iterator]() {
        for (const item of this.cache) {
          yield item;
        }
        for (const item of this.oldCache) {
          const [key] = item;
          if (!this.cache.has(key)) {
            yield item;
          }
        }
      }
      get size() {
        let oldCacheSize = 0;
        for (const key of this.oldCache.keys()) {
          if (!this.cache.has(key)) {
            oldCacheSize++;
          }
        }
        return Math.min(this._size + oldCacheSize, this.maxSize);
      }
    };
    module.exports = QuickLRU;
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/delay-async-destroy.js
var require_delay_async_destroy = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/delay-async-destroy.js"(exports, module) {
    "use strict";
    init_esm_shims();
    module.exports = (stream2) => {
      if (stream2.listenerCount("error") !== 0) {
        return stream2;
      }
      stream2.__destroy = stream2._destroy;
      stream2._destroy = (...args) => {
        const callback = args.pop();
        stream2.__destroy(...args, async (error) => {
          await Promise.resolve();
          callback(error);
        });
      };
      const onError = (error) => {
        Promise.resolve().then(() => {
          stream2.emit("error", error);
        });
      };
      stream2.once("error", onError);
      Promise.resolve().then(() => {
        stream2.off("error", onError);
      });
      return stream2;
    };
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/agent.js
var require_agent = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/agent.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { URL: URL2 } = __require("url");
    var EventEmitter3 = __require("events");
    var tls = __require("tls");
    var http22 = __require("http2");
    var QuickLRU = require_quick_lru();
    var delayAsyncDestroy = require_delay_async_destroy();
    var kCurrentStreamCount = Symbol("currentStreamCount");
    var kRequest = Symbol("request");
    var kOriginSet = Symbol("cachedOriginSet");
    var kGracefullyClosing = Symbol("gracefullyClosing");
    var kLength = Symbol("length");
    var nameKeys = [
      // Not an Agent option actually
      "createConnection",
      // `http2.connect()` options
      "maxDeflateDynamicTableSize",
      "maxSettings",
      "maxSessionMemory",
      "maxHeaderListPairs",
      "maxOutstandingPings",
      "maxReservedRemoteStreams",
      "maxSendHeaderBlockLength",
      "paddingStrategy",
      "peerMaxConcurrentStreams",
      "settings",
      // `tls.connect()` source options
      "family",
      "localAddress",
      "rejectUnauthorized",
      // `tls.connect()` secure context options
      "pskCallback",
      "minDHSize",
      // `tls.connect()` destination options
      // - `servername` is automatically validated, skip it
      // - `host` and `port` just describe the destination server,
      "path",
      "socket",
      // `tls.createSecureContext()` options
      "ca",
      "cert",
      "sigalgs",
      "ciphers",
      "clientCertEngine",
      "crl",
      "dhparam",
      "ecdhCurve",
      "honorCipherOrder",
      "key",
      "privateKeyEngine",
      "privateKeyIdentifier",
      "maxVersion",
      "minVersion",
      "pfx",
      "secureOptions",
      "secureProtocol",
      "sessionIdContext",
      "ticketKeys"
    ];
    var getSortedIndex = (array, value, compare) => {
      let low = 0;
      let high = array.length;
      while (low < high) {
        const mid = low + high >>> 1;
        if (compare(array[mid], value)) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return low;
    };
    var compareSessions = (a2, b) => a2.remoteSettings.maxConcurrentStreams > b.remoteSettings.maxConcurrentStreams;
    var closeCoveredSessions = (where, session) => {
      for (let index = 0; index < where.length; index++) {
        const coveredSession = where[index];
        if (
          // Unfortunately `.every()` returns true for an empty array
          coveredSession[kOriginSet].length > 0 && coveredSession[kOriginSet].length < session[kOriginSet].length && coveredSession[kOriginSet].every((origin) => session[kOriginSet].includes(origin)) && coveredSession[kCurrentStreamCount] + session[kCurrentStreamCount] <= session.remoteSettings.maxConcurrentStreams
        ) {
          gracefullyClose(coveredSession);
        }
      }
    };
    var closeSessionIfCovered = (where, coveredSession) => {
      for (let index = 0; index < where.length; index++) {
        const session = where[index];
        if (coveredSession[kOriginSet].length > 0 && coveredSession[kOriginSet].length < session[kOriginSet].length && coveredSession[kOriginSet].every((origin) => session[kOriginSet].includes(origin)) && coveredSession[kCurrentStreamCount] + session[kCurrentStreamCount] <= session.remoteSettings.maxConcurrentStreams) {
          gracefullyClose(coveredSession);
          return true;
        }
      }
      return false;
    };
    var gracefullyClose = (session) => {
      session[kGracefullyClosing] = true;
      if (session[kCurrentStreamCount] === 0) {
        session.close();
      }
    };
    var Agent = class _Agent extends EventEmitter3 {
      constructor({ timeout = 0, maxSessions = Number.POSITIVE_INFINITY, maxEmptySessions = 10, maxCachedTlsSessions = 100 } = {}) {
        super();
        this.sessions = {};
        this.queue = {};
        this.timeout = timeout;
        this.maxSessions = maxSessions;
        this.maxEmptySessions = maxEmptySessions;
        this._emptySessionCount = 0;
        this._sessionCount = 0;
        this.settings = {
          enablePush: false,
          initialWindowSize: 1024 * 1024 * 32
          // 32MB, see https://github.com/nodejs/node/issues/38426
        };
        this.tlsSessionCache = new QuickLRU({ maxSize: maxCachedTlsSessions });
      }
      get protocol() {
        return "https:";
      }
      normalizeOptions(options) {
        let normalized = "";
        for (let index = 0; index < nameKeys.length; index++) {
          const key = nameKeys[index];
          normalized += ":";
          if (options && options[key] !== void 0) {
            normalized += options[key];
          }
        }
        return normalized;
      }
      _processQueue() {
        if (this._sessionCount >= this.maxSessions) {
          this.closeEmptySessions(this.maxSessions - this._sessionCount + 1);
          return;
        }
        for (const normalizedOptions in this.queue) {
          for (const normalizedOrigin in this.queue[normalizedOptions]) {
            const item = this.queue[normalizedOptions][normalizedOrigin];
            if (!item.completed) {
              item.completed = true;
              item();
            }
          }
        }
      }
      _isBetterSession(thisStreamCount, thatStreamCount) {
        return thisStreamCount > thatStreamCount;
      }
      _accept(session, listeners, normalizedOrigin, options) {
        let index = 0;
        while (index < listeners.length && session[kCurrentStreamCount] < session.remoteSettings.maxConcurrentStreams) {
          listeners[index].resolve(session);
          index++;
        }
        listeners.splice(0, index);
        if (listeners.length > 0) {
          this.getSession(normalizedOrigin, options, listeners);
          listeners.length = 0;
        }
      }
      getSession(origin, options, listeners) {
        return new Promise((resolve2, reject) => {
          if (Array.isArray(listeners) && listeners.length > 0) {
            listeners = [...listeners];
            resolve2();
          } else {
            listeners = [{ resolve: resolve2, reject }];
          }
          try {
            if (typeof origin === "string") {
              origin = new URL2(origin);
            } else if (!(origin instanceof URL2)) {
              throw new TypeError("The `origin` argument needs to be a string or an URL object");
            }
            if (options) {
              const { servername } = options;
              const { hostname } = origin;
              if (servername && hostname !== servername) {
                throw new Error(`Origin ${hostname} differs from servername ${servername}`);
              }
            }
          } catch (error) {
            for (let index = 0; index < listeners.length; index++) {
              listeners[index].reject(error);
            }
            return;
          }
          const normalizedOptions = this.normalizeOptions(options);
          const normalizedOrigin = origin.origin;
          if (normalizedOptions in this.sessions) {
            const sessions = this.sessions[normalizedOptions];
            let maxConcurrentStreams = -1;
            let currentStreamsCount = -1;
            let optimalSession;
            for (let index = 0; index < sessions.length; index++) {
              const session = sessions[index];
              const sessionMaxConcurrentStreams = session.remoteSettings.maxConcurrentStreams;
              if (sessionMaxConcurrentStreams < maxConcurrentStreams) {
                break;
              }
              if (!session[kOriginSet].includes(normalizedOrigin)) {
                continue;
              }
              const sessionCurrentStreamsCount = session[kCurrentStreamCount];
              if (sessionCurrentStreamsCount >= sessionMaxConcurrentStreams || session[kGracefullyClosing] || session.destroyed) {
                continue;
              }
              if (!optimalSession) {
                maxConcurrentStreams = sessionMaxConcurrentStreams;
              }
              if (this._isBetterSession(sessionCurrentStreamsCount, currentStreamsCount)) {
                optimalSession = session;
                currentStreamsCount = sessionCurrentStreamsCount;
              }
            }
            if (optimalSession) {
              this._accept(optimalSession, listeners, normalizedOrigin, options);
              return;
            }
          }
          if (normalizedOptions in this.queue) {
            if (normalizedOrigin in this.queue[normalizedOptions]) {
              this.queue[normalizedOptions][normalizedOrigin].listeners.push(...listeners);
              return;
            }
          } else {
            this.queue[normalizedOptions] = {
              [kLength]: 0
            };
          }
          const removeFromQueue = () => {
            if (normalizedOptions in this.queue && this.queue[normalizedOptions][normalizedOrigin] === entry) {
              delete this.queue[normalizedOptions][normalizedOrigin];
              if (--this.queue[normalizedOptions][kLength] === 0) {
                delete this.queue[normalizedOptions];
              }
            }
          };
          const entry = async () => {
            this._sessionCount++;
            const name = `${normalizedOrigin}:${normalizedOptions}`;
            let receivedSettings = false;
            let socket;
            try {
              const computedOptions = { ...options };
              if (computedOptions.settings === void 0) {
                computedOptions.settings = this.settings;
              }
              if (computedOptions.session === void 0) {
                computedOptions.session = this.tlsSessionCache.get(name);
              }
              const createConnection = computedOptions.createConnection || this.createConnection;
              socket = await createConnection.call(this, origin, computedOptions);
              computedOptions.createConnection = () => socket;
              const session = http22.connect(origin, computedOptions);
              session[kCurrentStreamCount] = 0;
              session[kGracefullyClosing] = false;
              const getOriginSet = () => {
                const { socket: socket2 } = session;
                let originSet;
                if (socket2.servername === false) {
                  socket2.servername = socket2.remoteAddress;
                  originSet = session.originSet;
                  socket2.servername = false;
                } else {
                  originSet = session.originSet;
                }
                return originSet;
              };
              const isFree = () => session[kCurrentStreamCount] < session.remoteSettings.maxConcurrentStreams;
              session.socket.once("session", (tlsSession) => {
                this.tlsSessionCache.set(name, tlsSession);
              });
              session.once("error", (error) => {
                for (let index = 0; index < listeners.length; index++) {
                  listeners[index].reject(error);
                }
                this.tlsSessionCache.delete(name);
              });
              session.setTimeout(this.timeout, () => {
                session.destroy();
              });
              session.once("close", () => {
                this._sessionCount--;
                if (receivedSettings) {
                  this._emptySessionCount--;
                  const where = this.sessions[normalizedOptions];
                  if (where.length === 1) {
                    delete this.sessions[normalizedOptions];
                  } else {
                    where.splice(where.indexOf(session), 1);
                  }
                } else {
                  removeFromQueue();
                  const error = new Error("Session closed without receiving a SETTINGS frame");
                  error.code = "HTTP2WRAPPER_NOSETTINGS";
                  for (let index = 0; index < listeners.length; index++) {
                    listeners[index].reject(error);
                  }
                }
                this._processQueue();
              });
              const processListeners = () => {
                const queue = this.queue[normalizedOptions];
                if (!queue) {
                  return;
                }
                const originSet = session[kOriginSet];
                for (let index = 0; index < originSet.length; index++) {
                  const origin2 = originSet[index];
                  if (origin2 in queue) {
                    const { listeners: listeners2, completed } = queue[origin2];
                    let index2 = 0;
                    while (index2 < listeners2.length && isFree()) {
                      listeners2[index2].resolve(session);
                      index2++;
                    }
                    queue[origin2].listeners.splice(0, index2);
                    if (queue[origin2].listeners.length === 0 && !completed) {
                      delete queue[origin2];
                      if (--queue[kLength] === 0) {
                        delete this.queue[normalizedOptions];
                        break;
                      }
                    }
                    if (!isFree()) {
                      break;
                    }
                  }
                }
              };
              session.on("origin", () => {
                session[kOriginSet] = getOriginSet() || [];
                session[kGracefullyClosing] = false;
                closeSessionIfCovered(this.sessions[normalizedOptions], session);
                if (session[kGracefullyClosing] || !isFree()) {
                  return;
                }
                processListeners();
                if (!isFree()) {
                  return;
                }
                closeCoveredSessions(this.sessions[normalizedOptions], session);
              });
              session.once("remoteSettings", () => {
                if (entry.destroyed) {
                  const error = new Error("Agent has been destroyed");
                  for (let index = 0; index < listeners.length; index++) {
                    listeners[index].reject(error);
                  }
                  session.destroy();
                  return;
                }
                if (session.setLocalWindowSize) {
                  session.setLocalWindowSize(1024 * 1024 * 4);
                }
                session[kOriginSet] = getOriginSet() || [];
                if (session.socket.encrypted) {
                  const mainOrigin = session[kOriginSet][0];
                  if (mainOrigin !== normalizedOrigin) {
                    const error = new Error(`Requested origin ${normalizedOrigin} does not match server ${mainOrigin}`);
                    for (let index = 0; index < listeners.length; index++) {
                      listeners[index].reject(error);
                    }
                    session.destroy();
                    return;
                  }
                }
                removeFromQueue();
                {
                  const where = this.sessions;
                  if (normalizedOptions in where) {
                    const sessions = where[normalizedOptions];
                    sessions.splice(getSortedIndex(sessions, session, compareSessions), 0, session);
                  } else {
                    where[normalizedOptions] = [session];
                  }
                }
                receivedSettings = true;
                this._emptySessionCount++;
                this.emit("session", session);
                this._accept(session, listeners, normalizedOrigin, options);
                if (session[kCurrentStreamCount] === 0 && this._emptySessionCount > this.maxEmptySessions) {
                  this.closeEmptySessions(this._emptySessionCount - this.maxEmptySessions);
                }
                session.on("remoteSettings", () => {
                  if (!isFree()) {
                    return;
                  }
                  processListeners();
                  if (!isFree()) {
                    return;
                  }
                  closeCoveredSessions(this.sessions[normalizedOptions], session);
                });
              });
              session[kRequest] = session.request;
              session.request = (headers, streamOptions) => {
                if (session[kGracefullyClosing]) {
                  throw new Error("The session is gracefully closing. No new streams are allowed.");
                }
                const stream2 = session[kRequest](headers, streamOptions);
                session.ref();
                if (session[kCurrentStreamCount]++ === 0) {
                  this._emptySessionCount--;
                }
                stream2.once("close", () => {
                  if (--session[kCurrentStreamCount] === 0) {
                    this._emptySessionCount++;
                    session.unref();
                    if (this._emptySessionCount > this.maxEmptySessions || session[kGracefullyClosing]) {
                      session.close();
                      return;
                    }
                  }
                  if (session.destroyed || session.closed) {
                    return;
                  }
                  if (isFree() && !closeSessionIfCovered(this.sessions[normalizedOptions], session)) {
                    closeCoveredSessions(this.sessions[normalizedOptions], session);
                    processListeners();
                    if (session[kCurrentStreamCount] === 0) {
                      this._processQueue();
                    }
                  }
                });
                return stream2;
              };
            } catch (error) {
              removeFromQueue();
              this._sessionCount--;
              for (let index = 0; index < listeners.length; index++) {
                listeners[index].reject(error);
              }
            }
          };
          entry.listeners = listeners;
          entry.completed = false;
          entry.destroyed = false;
          this.queue[normalizedOptions][normalizedOrigin] = entry;
          this.queue[normalizedOptions][kLength]++;
          this._processQueue();
        });
      }
      request(origin, options, headers, streamOptions) {
        return new Promise((resolve2, reject) => {
          this.getSession(origin, options, [{
            reject,
            resolve: (session) => {
              try {
                const stream2 = session.request(headers, streamOptions);
                delayAsyncDestroy(stream2);
                resolve2(stream2);
              } catch (error) {
                reject(error);
              }
            }
          }]);
        });
      }
      async createConnection(origin, options) {
        return _Agent.connect(origin, options);
      }
      static connect(origin, options) {
        options.ALPNProtocols = ["h2"];
        const port = origin.port || 443;
        const host = origin.hostname;
        if (typeof options.servername === "undefined") {
          options.servername = host;
        }
        const socket = tls.connect(port, host, options);
        if (options.socket) {
          socket._peername = {
            family: void 0,
            address: void 0,
            port
          };
        }
        return socket;
      }
      closeEmptySessions(maxCount = Number.POSITIVE_INFINITY) {
        let closedCount = 0;
        const { sessions } = this;
        for (const key in sessions) {
          const thisSessions = sessions[key];
          for (let index = 0; index < thisSessions.length; index++) {
            const session = thisSessions[index];
            if (session[kCurrentStreamCount] === 0) {
              closedCount++;
              session.close();
              if (closedCount >= maxCount) {
                return closedCount;
              }
            }
          }
        }
        return closedCount;
      }
      destroy(reason) {
        const { sessions, queue } = this;
        for (const key in sessions) {
          const thisSessions = sessions[key];
          for (let index = 0; index < thisSessions.length; index++) {
            thisSessions[index].destroy(reason);
          }
        }
        for (const normalizedOptions in queue) {
          const entries2 = queue[normalizedOptions];
          for (const normalizedOrigin in entries2) {
            entries2[normalizedOrigin].destroyed = true;
          }
        }
        this.queue = {};
        this.tlsSessionCache.clear();
      }
      get emptySessionCount() {
        return this._emptySessionCount;
      }
      get pendingSessionCount() {
        return this._sessionCount - this._emptySessionCount;
      }
      get sessionCount() {
        return this._sessionCount;
      }
    };
    Agent.kCurrentStreamCount = kCurrentStreamCount;
    Agent.kGracefullyClosing = kGracefullyClosing;
    module.exports = {
      Agent,
      globalAgent: new Agent()
    };
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/incoming-message.js
var require_incoming_message = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/incoming-message.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { Readable } = __require("stream");
    var IncomingMessage = class extends Readable {
      constructor(socket, highWaterMark) {
        super({
          emitClose: false,
          autoDestroy: true,
          highWaterMark
        });
        this.statusCode = null;
        this.statusMessage = "";
        this.httpVersion = "2.0";
        this.httpVersionMajor = 2;
        this.httpVersionMinor = 0;
        this.headers = {};
        this.trailers = {};
        this.req = null;
        this.aborted = false;
        this.complete = false;
        this.upgrade = null;
        this.rawHeaders = [];
        this.rawTrailers = [];
        this.socket = socket;
        this._dumped = false;
      }
      get connection() {
        return this.socket;
      }
      set connection(value) {
        this.socket = value;
      }
      _destroy(error, callback) {
        if (!this.readableEnded) {
          this.aborted = true;
        }
        callback();
        this.req._request.destroy(error);
      }
      setTimeout(ms, callback) {
        this.req.setTimeout(ms, callback);
        return this;
      }
      _dump() {
        if (!this._dumped) {
          this._dumped = true;
          this.removeAllListeners("data");
          this.resume();
        }
      }
      _read() {
        if (this.req) {
          this.req._request.resume();
        }
      }
    };
    module.exports = IncomingMessage;
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/proxy-events.js
var require_proxy_events = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/proxy-events.js"(exports, module) {
    "use strict";
    init_esm_shims();
    module.exports = (from, to, events) => {
      for (const event of events) {
        from.on(event, (...args) => to.emit(event, ...args));
      }
    };
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/errors.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var makeError = (Base, key, getMessage) => {
      module.exports[key] = class NodeError extends Base {
        constructor(...args) {
          super(typeof getMessage === "string" ? getMessage : getMessage(args));
          this.name = `${super.name} [${key}]`;
          this.code = key;
        }
      };
    };
    makeError(TypeError, "ERR_INVALID_ARG_TYPE", (args) => {
      const type = args[0].includes(".") ? "property" : "argument";
      let valid = args[1];
      const isManyTypes = Array.isArray(valid);
      if (isManyTypes) {
        valid = `${valid.slice(0, -1).join(", ")} or ${valid.slice(-1)}`;
      }
      return `The "${args[0]}" ${type} must be ${isManyTypes ? "one of" : "of"} type ${valid}. Received ${typeof args[2]}`;
    });
    makeError(
      TypeError,
      "ERR_INVALID_PROTOCOL",
      (args) => `Protocol "${args[0]}" not supported. Expected "${args[1]}"`
    );
    makeError(
      Error,
      "ERR_HTTP_HEADERS_SENT",
      (args) => `Cannot ${args[0]} headers after they are sent to the client`
    );
    makeError(
      TypeError,
      "ERR_INVALID_HTTP_TOKEN",
      (args) => `${args[0]} must be a valid HTTP token [${args[1]}]`
    );
    makeError(
      TypeError,
      "ERR_HTTP_INVALID_HEADER_VALUE",
      (args) => `Invalid value "${args[0]} for header "${args[1]}"`
    );
    makeError(
      TypeError,
      "ERR_INVALID_CHAR",
      (args) => `Invalid character in ${args[0]} [${args[1]}]`
    );
    makeError(
      Error,
      "ERR_HTTP2_NO_SOCKET_MANIPULATION",
      "HTTP/2 sockets should not be directly manipulated (e.g. read and written)"
    );
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/is-request-pseudo-header.js
var require_is_request_pseudo_header = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/is-request-pseudo-header.js"(exports, module) {
    "use strict";
    init_esm_shims();
    module.exports = (header) => {
      switch (header) {
        case ":method":
        case ":scheme":
        case ":authority":
        case ":path":
          return true;
        default:
          return false;
      }
    };
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/validate-header-name.js
var require_validate_header_name = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/validate-header-name.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { ERR_INVALID_HTTP_TOKEN } = require_errors();
    var isRequestPseudoHeader = require_is_request_pseudo_header();
    var isValidHttpToken = /^[\^`\-\w!#$%&*+.|~]+$/;
    module.exports = (name) => {
      if (typeof name !== "string" || !isValidHttpToken.test(name) && !isRequestPseudoHeader(name)) {
        throw new ERR_INVALID_HTTP_TOKEN("Header name", name);
      }
    };
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/validate-header-value.js
var require_validate_header_value = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/validate-header-value.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var {
      ERR_HTTP_INVALID_HEADER_VALUE,
      ERR_INVALID_CHAR
    } = require_errors();
    var isInvalidHeaderValue = /[^\t\u0020-\u007E\u0080-\u00FF]/;
    module.exports = (name, value) => {
      if (typeof value === "undefined") {
        throw new ERR_HTTP_INVALID_HEADER_VALUE(value, name);
      }
      if (isInvalidHeaderValue.test(value)) {
        throw new ERR_INVALID_CHAR("header content", name);
      }
    };
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/proxy-socket-handler.js
var require_proxy_socket_handler = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/proxy-socket-handler.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { ERR_HTTP2_NO_SOCKET_MANIPULATION } = require_errors();
    var proxySocketHandler = {
      has(stream2, property) {
        const reference = stream2.session === void 0 ? stream2 : stream2.session.socket;
        return property in stream2 || property in reference;
      },
      get(stream2, property) {
        switch (property) {
          case "on":
          case "once":
          case "end":
          case "emit":
          case "destroy":
            return stream2[property].bind(stream2);
          case "writable":
          case "destroyed":
            return stream2[property];
          case "readable":
            if (stream2.destroyed) {
              return false;
            }
            return stream2.readable;
          case "setTimeout": {
            const { session } = stream2;
            if (session !== void 0) {
              return session.setTimeout.bind(session);
            }
            return stream2.setTimeout.bind(stream2);
          }
          case "write":
          case "read":
          case "pause":
          case "resume":
            throw new ERR_HTTP2_NO_SOCKET_MANIPULATION();
          default: {
            const reference = stream2.session === void 0 ? stream2 : stream2.session.socket;
            const value = reference[property];
            return typeof value === "function" ? value.bind(reference) : value;
          }
        }
      },
      getPrototypeOf(stream2) {
        if (stream2.session !== void 0) {
          return Reflect.getPrototypeOf(stream2.session.socket);
        }
        return Reflect.getPrototypeOf(stream2);
      },
      set(stream2, property, value) {
        switch (property) {
          case "writable":
          case "readable":
          case "destroyed":
          case "on":
          case "once":
          case "end":
          case "emit":
          case "destroy":
            stream2[property] = value;
            return true;
          case "setTimeout": {
            const { session } = stream2;
            if (session === void 0) {
              stream2.setTimeout = value;
            } else {
              session.setTimeout = value;
            }
            return true;
          }
          case "write":
          case "read":
          case "pause":
          case "resume":
            throw new ERR_HTTP2_NO_SOCKET_MANIPULATION();
          default: {
            const reference = stream2.session === void 0 ? stream2 : stream2.session.socket;
            reference[property] = value;
            return true;
          }
        }
      }
    };
    module.exports = proxySocketHandler;
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/client-request.js
var require_client_request = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/client-request.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { URL: URL2, urlToHttpOptions } = __require("url");
    var http22 = __require("http2");
    var { Writable } = __require("stream");
    var { Agent, globalAgent } = require_agent();
    var IncomingMessage = require_incoming_message();
    var proxyEvents2 = require_proxy_events();
    var {
      ERR_INVALID_ARG_TYPE,
      ERR_INVALID_PROTOCOL,
      ERR_HTTP_HEADERS_SENT
    } = require_errors();
    var validateHeaderName = require_validate_header_name();
    var validateHeaderValue = require_validate_header_value();
    var proxySocketHandler = require_proxy_socket_handler();
    var {
      HTTP2_HEADER_STATUS,
      HTTP2_HEADER_METHOD,
      HTTP2_HEADER_PATH,
      HTTP2_HEADER_AUTHORITY,
      HTTP2_METHOD_CONNECT
    } = http22.constants;
    var kHeaders = Symbol("headers");
    var kOrigin = Symbol("origin");
    var kSession = Symbol("session");
    var kOptions = Symbol("options");
    var kFlushedHeaders = Symbol("flushedHeaders");
    var kJobs = Symbol("jobs");
    var kPendingAgentPromise = Symbol("pendingAgentPromise");
    var ClientRequest = class extends Writable {
      constructor(input, options, callback) {
        super({
          autoDestroy: false,
          emitClose: false
        });
        if (typeof input === "string") {
          input = urlToHttpOptions(new URL2(input));
        } else if (input instanceof URL2) {
          input = urlToHttpOptions(input);
        } else {
          input = { ...input };
        }
        if (typeof options === "function" || options === void 0) {
          callback = options;
          options = input;
        } else {
          options = Object.assign(input, options);
        }
        if (options.h2session) {
          this[kSession] = options.h2session;
          if (this[kSession].destroyed) {
            throw new Error("The session has been closed already");
          }
          this.protocol = this[kSession].socket.encrypted ? "https:" : "http:";
        } else if (options.agent === false) {
          this.agent = new Agent({ maxEmptySessions: 0 });
        } else if (typeof options.agent === "undefined" || options.agent === null) {
          this.agent = globalAgent;
        } else if (typeof options.agent.request === "function") {
          this.agent = options.agent;
        } else {
          throw new ERR_INVALID_ARG_TYPE("options.agent", ["http2wrapper.Agent-like Object", "undefined", "false"], options.agent);
        }
        if (this.agent) {
          this.protocol = this.agent.protocol;
        }
        if (options.protocol && options.protocol !== this.protocol) {
          throw new ERR_INVALID_PROTOCOL(options.protocol, this.protocol);
        }
        if (!options.port) {
          options.port = options.defaultPort || this.agent && this.agent.defaultPort || 443;
        }
        options.host = options.hostname || options.host || "localhost";
        delete options.hostname;
        const { timeout } = options;
        options.timeout = void 0;
        this[kHeaders] = /* @__PURE__ */ Object.create(null);
        this[kJobs] = [];
        this[kPendingAgentPromise] = void 0;
        this.socket = null;
        this.connection = null;
        this.method = options.method || "GET";
        if (!(this.method === "CONNECT" && (options.path === "/" || options.path === void 0))) {
          this.path = options.path;
        }
        this.res = null;
        this.aborted = false;
        this.reusedSocket = false;
        const { headers } = options;
        if (headers) {
          for (const header in headers) {
            this.setHeader(header, headers[header]);
          }
        }
        if (options.auth && !("authorization" in this[kHeaders])) {
          this[kHeaders].authorization = "Basic " + Buffer.from(options.auth).toString("base64");
        }
        options.session = options.tlsSession;
        options.path = options.socketPath;
        this[kOptions] = options;
        this[kOrigin] = new URL2(`${this.protocol}//${options.servername || options.host}:${options.port}`);
        const reuseSocket = options._reuseSocket;
        if (reuseSocket) {
          options.createConnection = (...args) => {
            if (reuseSocket.destroyed) {
              return this.agent.createConnection(...args);
            }
            return reuseSocket;
          };
          this.agent.getSession(this[kOrigin], this[kOptions]).catch(() => {
          });
        }
        if (timeout) {
          this.setTimeout(timeout);
        }
        if (callback) {
          this.once("response", callback);
        }
        this[kFlushedHeaders] = false;
      }
      get method() {
        return this[kHeaders][HTTP2_HEADER_METHOD];
      }
      set method(value) {
        if (value) {
          this[kHeaders][HTTP2_HEADER_METHOD] = value.toUpperCase();
        }
      }
      get path() {
        const header = this.method === "CONNECT" ? HTTP2_HEADER_AUTHORITY : HTTP2_HEADER_PATH;
        return this[kHeaders][header];
      }
      set path(value) {
        if (value) {
          const header = this.method === "CONNECT" ? HTTP2_HEADER_AUTHORITY : HTTP2_HEADER_PATH;
          this[kHeaders][header] = value;
        }
      }
      get host() {
        return this[kOrigin].hostname;
      }
      set host(_value) {
      }
      get _mustNotHaveABody() {
        return this.method === "GET" || this.method === "HEAD" || this.method === "DELETE";
      }
      _write(chunk2, encoding, callback) {
        if (this._mustNotHaveABody) {
          callback(new Error("The GET, HEAD and DELETE methods must NOT have a body"));
          return;
        }
        this.flushHeaders();
        const callWrite = () => this._request.write(chunk2, encoding, callback);
        if (this._request) {
          callWrite();
        } else {
          this[kJobs].push(callWrite);
        }
      }
      _final(callback) {
        this.flushHeaders();
        const callEnd = () => {
          if (this._mustNotHaveABody || this.method === "CONNECT") {
            callback();
            return;
          }
          this._request.end(callback);
        };
        if (this._request) {
          callEnd();
        } else {
          this[kJobs].push(callEnd);
        }
      }
      abort() {
        if (this.res && this.res.complete) {
          return;
        }
        if (!this.aborted) {
          process.nextTick(() => this.emit("abort"));
        }
        this.aborted = true;
        this.destroy();
      }
      async _destroy(error, callback) {
        if (this.res) {
          this.res._dump();
        }
        if (this._request) {
          this._request.destroy();
        } else {
          process.nextTick(() => {
            this.emit("close");
          });
        }
        try {
          await this[kPendingAgentPromise];
        } catch (internalError) {
          if (this.aborted) {
            error = internalError;
          }
        }
        callback(error);
      }
      async flushHeaders() {
        if (this[kFlushedHeaders] || this.destroyed) {
          return;
        }
        this[kFlushedHeaders] = true;
        const isConnectMethod = this.method === HTTP2_METHOD_CONNECT;
        const onStream = (stream2) => {
          this._request = stream2;
          if (this.destroyed) {
            stream2.destroy();
            return;
          }
          if (!isConnectMethod) {
            proxyEvents2(stream2, this, ["timeout", "continue"]);
          }
          stream2.once("error", (error) => {
            this.destroy(error);
          });
          stream2.once("aborted", () => {
            const { res } = this;
            if (res) {
              res.aborted = true;
              res.emit("aborted");
              res.destroy();
            } else {
              this.destroy(new Error("The server aborted the HTTP/2 stream"));
            }
          });
          const onResponse = (headers, flags, rawHeaders) => {
            const response = new IncomingMessage(this.socket, stream2.readableHighWaterMark);
            this.res = response;
            response.url = `${this[kOrigin].origin}${this.path}`;
            response.req = this;
            response.statusCode = headers[HTTP2_HEADER_STATUS];
            response.headers = headers;
            response.rawHeaders = rawHeaders;
            response.once("end", () => {
              response.complete = true;
              response.socket = null;
              response.connection = null;
            });
            if (isConnectMethod) {
              response.upgrade = true;
              if (this.emit("connect", response, stream2, Buffer.alloc(0))) {
                this.emit("close");
              } else {
                stream2.destroy();
              }
            } else {
              stream2.on("data", (chunk2) => {
                if (!response._dumped && !response.push(chunk2)) {
                  stream2.pause();
                }
              });
              stream2.once("end", () => {
                if (!this.aborted) {
                  response.push(null);
                }
              });
              if (!this.emit("response", response)) {
                response._dump();
              }
            }
          };
          stream2.once("response", onResponse);
          stream2.once("headers", (headers) => this.emit("information", { statusCode: headers[HTTP2_HEADER_STATUS] }));
          stream2.once("trailers", (trailers, flags, rawTrailers) => {
            const { res } = this;
            if (res === null) {
              onResponse(trailers, flags, rawTrailers);
              return;
            }
            res.trailers = trailers;
            res.rawTrailers = rawTrailers;
          });
          stream2.once("close", () => {
            const { aborted, res } = this;
            if (res) {
              if (aborted) {
                res.aborted = true;
                res.emit("aborted");
                res.destroy();
              }
              const finish = () => {
                res.emit("close");
                this.destroy();
                this.emit("close");
              };
              if (res.readable) {
                res.once("end", finish);
              } else {
                finish();
              }
              return;
            }
            if (!this.destroyed) {
              this.destroy(new Error("The HTTP/2 stream has been early terminated"));
              this.emit("close");
              return;
            }
            this.destroy();
            this.emit("close");
          });
          this.socket = new Proxy(stream2, proxySocketHandler);
          for (const job of this[kJobs]) {
            job();
          }
          this[kJobs].length = 0;
          this.emit("socket", this.socket);
        };
        if (!(HTTP2_HEADER_AUTHORITY in this[kHeaders]) && !isConnectMethod) {
          this[kHeaders][HTTP2_HEADER_AUTHORITY] = this[kOrigin].host;
        }
        if (this[kSession]) {
          try {
            onStream(this[kSession].request(this[kHeaders]));
          } catch (error) {
            this.destroy(error);
          }
        } else {
          this.reusedSocket = true;
          try {
            const promise = this.agent.request(this[kOrigin], this[kOptions], this[kHeaders]);
            this[kPendingAgentPromise] = promise;
            onStream(await promise);
            this[kPendingAgentPromise] = false;
          } catch (error) {
            this[kPendingAgentPromise] = false;
            this.destroy(error);
          }
        }
      }
      get connection() {
        return this.socket;
      }
      set connection(value) {
        this.socket = value;
      }
      getHeaderNames() {
        return Object.keys(this[kHeaders]);
      }
      hasHeader(name) {
        if (typeof name !== "string") {
          throw new ERR_INVALID_ARG_TYPE("name", "string", name);
        }
        return Boolean(this[kHeaders][name.toLowerCase()]);
      }
      getHeader(name) {
        if (typeof name !== "string") {
          throw new ERR_INVALID_ARG_TYPE("name", "string", name);
        }
        return this[kHeaders][name.toLowerCase()];
      }
      get headersSent() {
        return this[kFlushedHeaders];
      }
      removeHeader(name) {
        if (typeof name !== "string") {
          throw new ERR_INVALID_ARG_TYPE("name", "string", name);
        }
        if (this.headersSent) {
          throw new ERR_HTTP_HEADERS_SENT("remove");
        }
        delete this[kHeaders][name.toLowerCase()];
      }
      setHeader(name, value) {
        if (this.headersSent) {
          throw new ERR_HTTP_HEADERS_SENT("set");
        }
        validateHeaderName(name);
        validateHeaderValue(name, value);
        const lowercased = name.toLowerCase();
        if (lowercased === "connection") {
          if (value.toLowerCase() === "keep-alive") {
            return;
          }
          throw new Error(`Invalid 'connection' header: ${value}`);
        }
        if (lowercased === "host" && this.method === "CONNECT") {
          this[kHeaders][HTTP2_HEADER_AUTHORITY] = value;
        } else {
          this[kHeaders][lowercased] = value;
        }
      }
      setNoDelay() {
      }
      setSocketKeepAlive() {
      }
      setTimeout(ms, callback) {
        const applyTimeout = () => this._request.setTimeout(ms, callback);
        if (this._request) {
          applyTimeout();
        } else {
          this[kJobs].push(applyTimeout);
        }
        return this;
      }
      get maxHeadersCount() {
        if (!this.destroyed && this._request) {
          return this._request.session.localSettings.maxHeaderListSize;
        }
        return void 0;
      }
      set maxHeadersCount(_value) {
      }
    };
    module.exports = ClientRequest;
  }
});

// node_modules/.pnpm/resolve-alpn@1.2.1/node_modules/resolve-alpn/index.js
var require_resolve_alpn = __commonJS({
  "node_modules/.pnpm/resolve-alpn@1.2.1/node_modules/resolve-alpn/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var tls = __require("tls");
    module.exports = (options = {}, connect = tls.connect) => new Promise((resolve2, reject) => {
      let timeout = false;
      let socket;
      const callback = async () => {
        await socketPromise;
        socket.off("timeout", onTimeout);
        socket.off("error", reject);
        if (options.resolveSocket) {
          resolve2({ alpnProtocol: socket.alpnProtocol, socket, timeout });
          if (timeout) {
            await Promise.resolve();
            socket.emit("timeout");
          }
        } else {
          socket.destroy();
          resolve2({ alpnProtocol: socket.alpnProtocol, timeout });
        }
      };
      const onTimeout = async () => {
        timeout = true;
        callback();
      };
      const socketPromise = (async () => {
        try {
          socket = await connect(options, callback);
          socket.on("error", reject);
          socket.once("timeout", onTimeout);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/calculate-server-name.js
var require_calculate_server_name = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/calculate-server-name.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { isIP } = __require("net");
    var assert2 = __require("assert");
    var getHost = (host) => {
      if (host[0] === "[") {
        const idx2 = host.indexOf("]");
        assert2(idx2 !== -1);
        return host.slice(1, idx2);
      }
      const idx = host.indexOf(":");
      if (idx === -1) {
        return host;
      }
      return host.slice(0, idx);
    };
    module.exports = (host) => {
      const servername = getHost(host);
      if (isIP(servername)) {
        return "";
      }
      return servername;
    };
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/auto.js
var require_auto = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/auto.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { URL: URL2, urlToHttpOptions } = __require("url");
    var http3 = __require("http");
    var https2 = __require("https");
    var resolveALPN = require_resolve_alpn();
    var QuickLRU = require_quick_lru();
    var { Agent, globalAgent } = require_agent();
    var Http2ClientRequest = require_client_request();
    var calculateServerName = require_calculate_server_name();
    var delayAsyncDestroy = require_delay_async_destroy();
    var cache = new QuickLRU({ maxSize: 100 });
    var queue = /* @__PURE__ */ new Map();
    var installSocket = (agent, socket, options) => {
      socket._httpMessage = { shouldKeepAlive: true };
      const onFree = () => {
        agent.emit("free", socket, options);
      };
      socket.on("free", onFree);
      const onClose = () => {
        agent.removeSocket(socket, options);
      };
      socket.on("close", onClose);
      const onTimeout = () => {
        const { freeSockets } = agent;
        for (const sockets of Object.values(freeSockets)) {
          if (sockets.includes(socket)) {
            socket.destroy();
            return;
          }
        }
      };
      socket.on("timeout", onTimeout);
      const onRemove = () => {
        agent.removeSocket(socket, options);
        socket.off("close", onClose);
        socket.off("free", onFree);
        socket.off("timeout", onTimeout);
        socket.off("agentRemove", onRemove);
      };
      socket.on("agentRemove", onRemove);
      agent.emit("free", socket, options);
    };
    var createResolveProtocol = (cache2, queue2 = /* @__PURE__ */ new Map(), connect = void 0) => {
      return async (options) => {
        const name = `${options.host}:${options.port}:${options.ALPNProtocols.sort()}`;
        if (!cache2.has(name)) {
          if (queue2.has(name)) {
            const result = await queue2.get(name);
            return { alpnProtocol: result.alpnProtocol };
          }
          const { path: path6 } = options;
          options.path = options.socketPath;
          const resultPromise = resolveALPN(options, connect);
          queue2.set(name, resultPromise);
          try {
            const result = await resultPromise;
            cache2.set(name, result.alpnProtocol);
            queue2.delete(name);
            options.path = path6;
            return result;
          } catch (error) {
            queue2.delete(name);
            options.path = path6;
            throw error;
          }
        }
        return { alpnProtocol: cache2.get(name) };
      };
    };
    var defaultResolveProtocol = createResolveProtocol(cache, queue);
    module.exports = async (input, options, callback) => {
      if (typeof input === "string") {
        input = urlToHttpOptions(new URL2(input));
      } else if (input instanceof URL2) {
        input = urlToHttpOptions(input);
      } else {
        input = { ...input };
      }
      if (typeof options === "function" || options === void 0) {
        callback = options;
        options = input;
      } else {
        options = Object.assign(input, options);
      }
      options.ALPNProtocols = options.ALPNProtocols || ["h2", "http/1.1"];
      if (!Array.isArray(options.ALPNProtocols) || options.ALPNProtocols.length === 0) {
        throw new Error("The `ALPNProtocols` option must be an Array with at least one entry");
      }
      options.protocol = options.protocol || "https:";
      const isHttps = options.protocol === "https:";
      options.host = options.hostname || options.host || "localhost";
      options.session = options.tlsSession;
      options.servername = options.servername || calculateServerName(options.headers && options.headers.host || options.host);
      options.port = options.port || (isHttps ? 443 : 80);
      options._defaultAgent = isHttps ? https2.globalAgent : http3.globalAgent;
      const resolveProtocol = options.resolveProtocol || defaultResolveProtocol;
      let { agent } = options;
      if (agent !== void 0 && agent !== false && agent.constructor.name !== "Object") {
        throw new Error("The `options.agent` can be only an object `http`, `https` or `http2` properties");
      }
      if (isHttps) {
        options.resolveSocket = true;
        let { socket, alpnProtocol, timeout } = await resolveProtocol(options);
        if (timeout) {
          if (socket) {
            socket.destroy();
          }
          const error = new Error(`Timed out resolving ALPN: ${options.timeout} ms`);
          error.code = "ETIMEDOUT";
          error.ms = options.timeout;
          throw error;
        }
        if (socket && options.createConnection) {
          socket.destroy();
          socket = void 0;
        }
        delete options.resolveSocket;
        const isHttp2 = alpnProtocol === "h2";
        if (agent) {
          agent = isHttp2 ? agent.http2 : agent.https;
          options.agent = agent;
        }
        if (agent === void 0) {
          agent = isHttp2 ? globalAgent : https2.globalAgent;
        }
        if (socket) {
          if (agent === false) {
            socket.destroy();
          } else {
            const defaultCreateConnection = (isHttp2 ? Agent : https2.Agent).prototype.createConnection;
            if (agent.createConnection === defaultCreateConnection) {
              if (isHttp2) {
                options._reuseSocket = socket;
              } else {
                installSocket(agent, socket, options);
              }
            } else {
              socket.destroy();
            }
          }
        }
        if (isHttp2) {
          return delayAsyncDestroy(new Http2ClientRequest(options, callback));
        }
      } else if (agent) {
        options.agent = agent.http;
      }
      if (options.headers) {
        options.headers = { ...options.headers };
        if (options.headers[":authority"]) {
          if (!options.headers.host) {
            options.headers.host = options.headers[":authority"];
          }
          delete options.headers[":authority"];
        }
        delete options.headers[":method"];
        delete options.headers[":scheme"];
        delete options.headers[":path"];
      }
      return delayAsyncDestroy(http3.request(options, callback));
    };
    module.exports.protocolCache = cache;
    module.exports.resolveProtocol = defaultResolveProtocol;
    module.exports.createResolveProtocol = createResolveProtocol;
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/js-stream-socket.js
var require_js_stream_socket = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/js-stream-socket.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var stream2 = __require("stream");
    var tls = __require("tls");
    var JSStreamSocket = new tls.TLSSocket(new stream2.PassThrough())._handle._parentWrap.constructor;
    module.exports = JSStreamSocket;
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/unexpected-status-code-error.js
var require_unexpected_status_code_error = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/unexpected-status-code-error.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var UnexpectedStatusCodeError = class extends Error {
      constructor(statusCode, statusMessage = "") {
        super(`The proxy server rejected the request with status code ${statusCode} (${statusMessage || "empty status message"})`);
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
      }
    };
    module.exports = UnexpectedStatusCodeError;
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/check-type.js
var require_check_type = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/utils/check-type.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var checkType = (name, value, types2) => {
      const valid = types2.some((type) => {
        const typeofType = typeof type;
        if (typeofType === "string") {
          return typeof value === type;
        }
        return value instanceof type;
      });
      if (!valid) {
        const names = types2.map((type) => typeof type === "string" ? type : type.name);
        throw new TypeError(`Expected '${name}' to be a type of ${names.join(" or ")}, got ${typeof value}`);
      }
    };
    module.exports = checkType;
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/initialize.js
var require_initialize = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/initialize.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { URL: URL2 } = __require("url");
    var checkType = require_check_type();
    module.exports = (self, proxyOptions) => {
      checkType("proxyOptions", proxyOptions, ["object"]);
      checkType("proxyOptions.headers", proxyOptions.headers, ["object", "undefined"]);
      checkType("proxyOptions.raw", proxyOptions.raw, ["boolean", "undefined"]);
      checkType("proxyOptions.url", proxyOptions.url, [URL2, "string"]);
      const url = new URL2(proxyOptions.url);
      self.proxyOptions = {
        raw: true,
        ...proxyOptions,
        headers: { ...proxyOptions.headers },
        url
      };
    };
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/get-auth-headers.js
var require_get_auth_headers = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/get-auth-headers.js"(exports, module) {
    "use strict";
    init_esm_shims();
    module.exports = (self) => {
      const { username, password } = self.proxyOptions.url;
      if (username || password) {
        const data = `${username}:${password}`;
        const authorization = `Basic ${Buffer.from(data).toString("base64")}`;
        return {
          "proxy-authorization": authorization,
          authorization
        };
      }
      return {};
    };
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/h1-over-h2.js
var require_h1_over_h2 = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/h1-over-h2.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var tls = __require("tls");
    var http3 = __require("http");
    var https2 = __require("https");
    var JSStreamSocket = require_js_stream_socket();
    var { globalAgent } = require_agent();
    var UnexpectedStatusCodeError = require_unexpected_status_code_error();
    var initialize = require_initialize();
    var getAuthorizationHeaders = require_get_auth_headers();
    var createConnection = (self, options, callback) => {
      (async () => {
        try {
          const { proxyOptions } = self;
          const { url, headers, raw } = proxyOptions;
          const stream2 = await globalAgent.request(url, proxyOptions, {
            ...getAuthorizationHeaders(self),
            ...headers,
            ":method": "CONNECT",
            ":authority": `${options.host}:${options.port}`
          });
          stream2.once("error", callback);
          stream2.once("response", (headers2) => {
            const statusCode = headers2[":status"];
            if (statusCode !== 200) {
              callback(new UnexpectedStatusCodeError(statusCode, ""));
              return;
            }
            const encrypted = self instanceof https2.Agent;
            if (raw && encrypted) {
              options.socket = stream2;
              const secureStream = tls.connect(options);
              secureStream.once("close", () => {
                stream2.destroy();
              });
              callback(null, secureStream);
              return;
            }
            const socket = new JSStreamSocket(stream2);
            socket.encrypted = false;
            socket._handle.getpeername = (out) => {
              out.family = void 0;
              out.address = void 0;
              out.port = void 0;
            };
            callback(null, socket);
          });
        } catch (error) {
          callback(error);
        }
      })();
    };
    var HttpOverHttp2 = class extends http3.Agent {
      constructor(options) {
        super(options);
        initialize(this, options.proxyOptions);
      }
      createConnection(options, callback) {
        createConnection(this, options, callback);
      }
    };
    var HttpsOverHttp2 = class extends https2.Agent {
      constructor(options) {
        super(options);
        initialize(this, options.proxyOptions);
      }
      createConnection(options, callback) {
        createConnection(this, options, callback);
      }
    };
    module.exports = {
      HttpOverHttp2,
      HttpsOverHttp2
    };
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/h2-over-hx.js
var require_h2_over_hx = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/h2-over-hx.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { Agent } = require_agent();
    var JSStreamSocket = require_js_stream_socket();
    var UnexpectedStatusCodeError = require_unexpected_status_code_error();
    var initialize = require_initialize();
    var Http2OverHttpX = class extends Agent {
      constructor(options) {
        super(options);
        initialize(this, options.proxyOptions);
      }
      async createConnection(origin, options) {
        const authority = `${origin.hostname}:${origin.port || 443}`;
        const [stream2, statusCode, statusMessage] = await this._getProxyStream(authority);
        if (statusCode !== 200) {
          throw new UnexpectedStatusCodeError(statusCode, statusMessage);
        }
        if (this.proxyOptions.raw) {
          options.socket = stream2;
        } else {
          const socket = new JSStreamSocket(stream2);
          socket.encrypted = false;
          socket._handle.getpeername = (out) => {
            out.family = void 0;
            out.address = void 0;
            out.port = void 0;
          };
          return socket;
        }
        return super.createConnection(origin, options);
      }
    };
    module.exports = Http2OverHttpX;
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/h2-over-h2.js
var require_h2_over_h2 = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/h2-over-h2.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var { globalAgent } = require_agent();
    var Http2OverHttpX = require_h2_over_hx();
    var getAuthorizationHeaders = require_get_auth_headers();
    var getStatusCode = (stream2) => new Promise((resolve2, reject) => {
      stream2.once("error", reject);
      stream2.once("response", (headers) => {
        stream2.off("error", reject);
        resolve2(headers[":status"]);
      });
    });
    var Http2OverHttp2 = class extends Http2OverHttpX {
      async _getProxyStream(authority) {
        const { proxyOptions } = this;
        const headers = {
          ...getAuthorizationHeaders(this),
          ...proxyOptions.headers,
          ":method": "CONNECT",
          ":authority": authority
        };
        const stream2 = await globalAgent.request(proxyOptions.url, proxyOptions, headers);
        const statusCode = await getStatusCode(stream2);
        return [stream2, statusCode, ""];
      }
    };
    module.exports = Http2OverHttp2;
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/h2-over-h1.js
var require_h2_over_h1 = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/proxies/h2-over-h1.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var http3 = __require("http");
    var https2 = __require("https");
    var Http2OverHttpX = require_h2_over_hx();
    var getAuthorizationHeaders = require_get_auth_headers();
    var getStream = (request) => new Promise((resolve2, reject) => {
      const onConnect = (response, socket, head) => {
        socket.unshift(head);
        request.off("error", reject);
        resolve2([socket, response.statusCode, response.statusMessage]);
      };
      request.once("error", reject);
      request.once("connect", onConnect);
    });
    var Http2OverHttp = class extends Http2OverHttpX {
      async _getProxyStream(authority) {
        const { proxyOptions } = this;
        const { url, headers } = this.proxyOptions;
        const network = url.protocol === "https:" ? https2 : http3;
        const request = network.request({
          ...proxyOptions,
          hostname: url.hostname,
          port: url.port,
          path: authority,
          headers: {
            ...getAuthorizationHeaders(this),
            ...headers,
            host: authority
          },
          method: "CONNECT"
        }).end();
        return getStream(request);
      }
    };
    module.exports = {
      Http2OverHttp,
      Http2OverHttps: Http2OverHttp
    };
  }
});

// node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/index.js
var require_source2 = __commonJS({
  "node_modules/.pnpm/http2-wrapper@2.2.1/node_modules/http2-wrapper/source/index.js"(exports, module) {
    "use strict";
    init_esm_shims();
    var http22 = __require("http2");
    var {
      Agent,
      globalAgent
    } = require_agent();
    var ClientRequest = require_client_request();
    var IncomingMessage = require_incoming_message();
    var auto = require_auto();
    var {
      HttpOverHttp2,
      HttpsOverHttp2
    } = require_h1_over_h2();
    var Http2OverHttp2 = require_h2_over_h2();
    var {
      Http2OverHttp,
      Http2OverHttps
    } = require_h2_over_h1();
    var validateHeaderName = require_validate_header_name();
    var validateHeaderValue = require_validate_header_value();
    var request = (url, options, callback) => new ClientRequest(url, options, callback);
    var get = (url, options, callback) => {
      const req = new ClientRequest(url, options, callback);
      req.end();
      return req;
    };
    module.exports = {
      ...http22,
      ClientRequest,
      IncomingMessage,
      Agent,
      globalAgent,
      request,
      get,
      auto,
      proxies: {
        HttpOverHttp2,
        HttpsOverHttp2,
        Http2OverHttp2,
        Http2OverHttp,
        Http2OverHttps
      },
      validateHeaderName,
      validateHeaderValue
    };
  }
});

// src/pkgman.ts
init_esm_shims();

// src/__version__.ts
init_esm_shims();
var CONSTRAINTS = class _CONSTRAINTS {
  /**
   * The minimum and maximum supported versions of the Camoufox browser.
   */
  static MIN_VERSION = "beta.19";
  static MAX_VERSION = "1";
  static asRange() {
    return `>=${_CONSTRAINTS.MIN_VERSION}, <${_CONSTRAINTS.MAX_VERSION}`;
  }
};

// src/pkgman.ts
import * as os from "os";
import * as path2 from "path";
import * as fs from "fs";
import { execSync } from "child_process";

// src/exceptions.ts
init_esm_shims();
var UnsupportedVersion = class extends Error {
  constructor(message) {
    super(message ?? "The Camoufox executable is outdated.");
    this.name = "UnsupportedVersion";
  }
};
var MissingRelease = class extends Error {
  constructor(message) {
    super(message ?? "A required GitHub release asset is missing.");
    this.name = "MissingRelease";
  }
};
var UnsupportedArchitecture = class extends Error {
  constructor(message) {
    super(message ?? "The architecture is not supported.");
    this.name = "UnsupportedArchitecture";
  }
};
var UnsupportedOS = class extends Error {
  constructor(message) {
    super(message ?? "The OS is not supported.");
    this.name = "UnsupportedOS";
  }
};
var UnknownProperty = class extends Error {
  constructor(message) {
    super(message ?? "The property is unknown.");
    this.name = "UnknownProperty";
  }
};
var InvalidPropertyType = class extends Error {
  constructor(message) {
    super(message ?? "The property type is invalid.");
    this.name = "InvalidPropertyType";
  }
};
var InvalidAddonPath = class extends Error {
  constructor(message) {
    super(message ?? "The addon path is invalid.");
    this.name = "InvalidAddonPath";
  }
};
var LocaleError = class extends Error {
  constructor(message) {
    super(message ?? "The locale is invalid.");
    this.name = "LocaleError";
  }
};
var UnknownIPLocation = class extends LocaleError {
  constructor(message) {
    super(message ?? "The location of an IP is unknown.");
    this.name = "UnknownIPLocation";
  }
};
var InvalidLocale = class _InvalidLocale extends LocaleError {
  constructor(message) {
    super(message ?? "The locale input is invalid.");
    this.name = "InvalidLocale";
  }
  static invalidInput(locale) {
    return new _InvalidLocale(
      `Invalid locale: '${locale}'. Must be either a region, language, language-region, or language-script-region.`
    );
  }
};
var UnknownTerritory = class extends InvalidLocale {
  constructor(message) {
    super(message ?? "The territory is unknown.");
    this.name = "UnknownTerritory";
  }
};
var UnknownLanguage = class extends InvalidLocale {
  constructor(message) {
    super(message ?? "The language is unknown.");
    this.name = "UnknownLanguage";
  }
};
var NotInstalledGeoIPExtra = class extends Error {
  constructor(message) {
    super(message ?? "The geoip2 module is not installed.");
    this.name = "NotInstalledGeoIPExtra";
  }
};
var NonFirefoxFingerprint = class extends Error {
  constructor(message) {
    super(message ?? "A passed Browserforge fingerprint is invalid.");
    this.name = "NonFirefoxFingerprint";
  }
};
var InvalidOS = class extends Error {
  constructor(message) {
    super(message ?? "The target OS is invalid.");
    this.name = "InvalidOS";
  }
};
var VirtualDisplayError = class extends Error {
  constructor(message) {
    super(message ?? "There is an error with the virtual display.");
    this.name = "VirtualDisplayError";
  }
};
var CannotFindXvfb = class extends VirtualDisplayError {
  constructor(message) {
    super(message ?? "Xvfb cannot be found.");
    this.name = "CannotFindXvfb";
  }
};
var CannotExecuteXvfb = class extends VirtualDisplayError {
  constructor(message) {
    super(message ?? "Xvfb cannot be executed.");
    this.name = "CannotExecuteXvfb";
  }
};
var VirtualDisplayNotSupported = class extends VirtualDisplayError {
  constructor(message) {
    super(message ?? "The user tried to use a virtual display on a non-Linux OS.");
    this.name = "VirtualDisplayNotSupported";
  }
};
var CamoufoxNotInstalled = class extends Error {
  constructor(message) {
    super(message ?? "Camoufox is not installed.");
    this.name = "CamoufoxNotInstalled";
  }
};
var FileNotFoundError = class extends Error {
  constructor(message) {
    super(message ?? "File couldn't be found.");
    this.name = "FileNotFoundError";
  }
};

// src/pkgman.ts
import AdmZip from "adm-zip";
import * as yaml from "js-yaml";
import ProgressBar from "progress";
var ARCH_MAP = {
  "x64": "x86_64",
  "ia32": "i686",
  "arm64": "arm64",
  "arm": "arm64"
};
var OS_MAP = {
  "darwin": "mac",
  "linux": "lin",
  "win32": "win"
};
if (!(process.platform in OS_MAP)) {
  throw new UnsupportedOS(`OS ${process.platform} is not supported`);
}
var OS_NAME = OS_MAP[process.platform];
var INSTALL_DIR = userCacheDir("camoufox");
var LOCAL_DATA = path2.join(__dirname, "../data-files");
var PACKAGE_DATA = path2.join(process.cwd(), "data-files");
var OS_ARCH_MATRIX = {
  "win": ["x86_64", "i686"],
  "mac": ["x86_64", "arm64"],
  "lin": ["x86_64", "arm64", "i686"]
};
var LAUNCH_FILE = {
  "win": "camoufox.exe",
  "mac": "../MacOS/camoufox",
  "lin": "camoufox-bin"
};
var Version = class _Version {
  release;
  version;
  sorted_rel;
  constructor(release, version) {
    this.release = release;
    this.version = version;
    this.sorted_rel = this.buildSortedRel();
  }
  buildSortedRel() {
    const parts = this.release.split(".").map((x) => isNaN(Number(x)) ? x.charCodeAt(0) - 1024 : Number(x));
    while (parts.length < 5) {
      parts.push(0);
    }
    return parts;
  }
  get fullString() {
    return `${this.version}-${this.release}`;
  }
  equals(other) {
    return this.sorted_rel.join(".") === other.sorted_rel.join(".");
  }
  lessThan(other) {
    for (let i2 = 0; i2 < this.sorted_rel.length; i2++) {
      if (this.sorted_rel[i2] < other.sorted_rel[i2]) return true;
      if (this.sorted_rel[i2] > other.sorted_rel[i2]) return false;
    }
    return false;
  }
  isSupported() {
    return VERSION_MIN.lessThan(this) && this.lessThan(VERSION_MAX);
  }
  static fromPath(filePath = INSTALL_DIR) {
    const versionPath = path2.join(filePath.toString(), "version.json");
    if (!fs.existsSync(versionPath)) {
      throw new FileNotFoundError(`Version information not found at ${versionPath}. Please run \`camoufox fetch\` to install.`);
    }
    const versionData = JSON.parse(fs.readFileSync(versionPath, "utf-8"));
    return new _Version(versionData.release, versionData.version);
  }
  static isSupportedPath(path6) {
    return _Version.fromPath(path6).isSupported();
  }
  static buildMinMax() {
    return [new _Version(CONSTRAINTS.MIN_VERSION), new _Version(CONSTRAINTS.MAX_VERSION)];
  }
};
var [VERSION_MIN, VERSION_MAX] = Version.buildMinMax();
var GitHubDownloader = class {
  githubRepo;
  apiUrl;
  proxy;
  constructor(githubRepo, proxy) {
    this.githubRepo = githubRepo;
    this.apiUrl = `https://api.github.com/repos/${githubRepo}/releases`;
    this.proxy = proxy;
  }
  checkAsset(asset) {
    return asset.browser_download_url;
  }
  missingAssetError() {
    throw new MissingRelease(`Could not find a release asset in ${this.githubRepo}.`);
  }
  async getAsset() {
    let options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36"
      }
    };
    if (this.proxy) {
      if (typeof Bun !== "undefined") {
        process.env.GLOBAL_AGENT_HTTP_PROXY = this.proxy;
      } else {
        options.proxy = this.proxy;
      }
    }
    try {
      const response = await fetch(this.apiUrl, options);
      const releases = await response.json();
      for (const release of releases) {
        for (const asset of release.assets) {
          const data = this.checkAsset(asset);
          if (data) {
            return data;
          }
        }
      }
      this.missingAssetError();
    } catch (error) {
      throw new Error(`Failed to fetch releases from ${this.apiUrl}: ${error}`);
    }
  }
};
var CamoufoxFetcher = class _CamoufoxFetcher extends GitHubDownloader {
  arch;
  _version_obj;
  pattern;
  _url;
  installDir;
  constructor(installDir = INSTALL_DIR, proxy) {
    super("daijro/camoufox", proxy);
    this.arch = _CamoufoxFetcher.getPlatformArch();
    this.pattern = new RegExp(`camoufox-(.+)-(.+)-${OS_NAME}\\.${this.arch}\\.zip`);
    this.installDir = installDir;
  }
  async init() {
    await this.fetchLatest();
  }
  checkAsset(asset) {
    const match = asset.name.match(this.pattern);
    if (!match) return null;
    const version = new Version(match[2], match[1]);
    if (!version.isSupported()) return null;
    return [version, asset.browser_download_url];
  }
  missingAssetError() {
    throw new MissingRelease(`No matching release found for ${OS_NAME} ${this.arch} in the supported range: (${CONSTRAINTS.asRange()}). Please update the library.`);
  }
  static getPlatformArch() {
    const platArch = os.arch().toLowerCase();
    if (!(platArch in ARCH_MAP)) {
      throw new UnsupportedArchitecture(`Architecture ${platArch} is not supported`);
    }
    const arch2 = ARCH_MAP[platArch];
    if (!OS_ARCH_MATRIX[OS_NAME].includes(arch2)) {
      throw new UnsupportedArchitecture(`Architecture ${arch2} is not supported for ${OS_NAME}`);
    }
    return arch2;
  }
  async fetchLatest() {
    if (this._version_obj) return;
    const releaseData = await this.getAsset();
    this._version_obj = releaseData[0];
    this._url = releaseData[1];
  }
  static async downloadFile(url) {
    const response = await fetch(url);
    return Buffer.from(await response.arrayBuffer());
  }
  async extractZip(zipFile) {
    const zip = AdmZip(zipFile);
    zip.extractAllTo(this.installDir.toString(), true);
  }
  static cleanup(installDir = INSTALL_DIR) {
    if (fs.existsSync(installDir)) {
      fs.rmSync(installDir, { recursive: true });
      return true;
    }
    return false;
  }
  setVersion() {
    fs.writeFileSync(path2.join(this.installDir.toString(), "version.json"), JSON.stringify({ version: this.version, release: this.release }));
  }
  async install() {
    await this.init();
    await _CamoufoxFetcher.cleanup(this.installDir);
    try {
      fs.mkdirSync(this.installDir, { recursive: true });
      const zipFile = await webdl(this.url, "Downloading Camoufox...", true);
      await this.extractZip(zipFile);
      this.setVersion();
      if (OS_NAME !== "win") {
        execSync(`chmod -R 755 ${this.installDir}`);
      }
      console.log("Camoufox successfully installed.");
    } catch (e) {
      console.error(`Error installing Camoufox: ${e}`);
      await _CamoufoxFetcher.cleanup(this.installDir);
      throw e;
    }
  }
  get url() {
    if (!this._url) {
      throw new Error("Url is not available. Make sure to run fetchLatest first.");
    }
    return this._url;
  }
  get version() {
    if (!this._version_obj || !this._version_obj.version) {
      throw new Error("Version is not available. Make sure to run fetchLatest first.");
    }
    return this._version_obj.version;
  }
  get release() {
    if (!this._version_obj) {
      throw new Error("Release information is not available. Make sure to run the installation first.");
    }
    return this._version_obj.release;
  }
  get verstr() {
    if (!this._version_obj) {
      throw new Error("Version is not available. Make sure to run the installation first.");
    }
    return this._version_obj.fullString;
  }
};
function userCacheDir(appName) {
  if (OS_NAME === "win") {
    return path2.join(os.homedir(), "AppData", "Local", appName, appName, "Cache");
  } else if (OS_NAME === "mac") {
    return path2.join(os.homedir(), "Library", "Caches", appName);
  } else {
    return path2.join(os.homedir(), ".cache", appName);
  }
}
function installedVerStr() {
  return Version.fromPath().fullString;
}
function camoufoxPath(installDir = INSTALL_DIR, downloadIfMissing = true) {
  if (!fs.existsSync(installDir) || fs.readdirSync(installDir).length === 0) {
    if (!downloadIfMissing) {
      throw new Error(`Camoufox executable not found at ${installDir}`);
    }
  } else if (fs.existsSync(installDir) && Version.isSupportedPath(installDir)) {
    return installDir;
  } else {
    if (!downloadIfMissing) {
      throw new UnsupportedVersion("Camoufox executable is outdated.");
    }
  }
  const fetcher = new CamoufoxFetcher();
  fetcher.install().then(() => camoufoxPath(installDir, downloadIfMissing));
  return installDir;
}
function getPath(file, installDir = INSTALL_DIR) {
  if (OS_NAME === "mac") {
    return path2.resolve(camoufoxPath(installDir).toString(), "Camoufox.app", "Contents", "Resources", file);
  }
  return path2.join(camoufoxPath(installDir).toString(), file);
}
function getLaunchPath(installDir = INSTALL_DIR) {
  return getPath(LAUNCH_FILE[OS_NAME], installDir);
}
function launchPath(installDir = INSTALL_DIR) {
  const launchPath2 = getPath(LAUNCH_FILE[OS_NAME], installDir);
  if (!fs.existsSync(launchPath2)) {
    throw new CamoufoxNotInstalled(
      `Camoufox is not installed at ${launchPath2}. Please run \`camoufox fetch\` to install.`
    );
  }
  return launchPath2;
}
async function webdl(url, desc = "", bar = true, buffer = null) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file from ${url}`);
  }
  const totalSize = parseInt(response.headers.get("content-length") || "0", 10);
  const progressBar = bar ? new ProgressBar(`${desc} [:bar] :percent :etas`, {
    total: totalSize,
    width: 40
  }) : null;
  const chunks = [];
  for await (const chunk2 of response.body) {
    if (buffer) {
      buffer.write(chunk2);
    } else {
      chunks.push(chunk2);
    }
    if (progressBar) {
      progressBar.tick(chunk2.length, "X");
    }
  }
  const fileBuffer = Buffer.concat(chunks);
  return fileBuffer;
}
async function unzip(zipFile, extractPath, desc, bar = true) {
  const zip = AdmZip(zipFile);
  const zipEntries = zip.getEntries();
  if (bar) {
    console.log(desc || "Extracting files...");
  }
  for (const entry of zipEntries) {
    if (bar) {
      console.log(`Extracting ${entry.entryName}`);
    }
    zip.extractEntryTo(entry, extractPath, false, true);
  }
  if (bar) {
    console.log("Extraction complete.");
  }
}
function loadYaml(file) {
  let filePath = file;
  if (!path2.isAbsolute(file)) {
    filePath = path2.join(LOCAL_DATA.toString(), file);
  }
  const fileContents = fs.readFileSync(filePath, "utf8");
  return yaml.load(fileContents);
}

// src/addons.ts
init_esm_shims();
import fs4 from "fs";
import { join as join6 } from "path";

// src/utils.ts
init_esm_shims();
import path5 from "path";

// src/fingerprints.ts
init_esm_shims();
import { join as join2 } from "path";
import { FingerprintGenerator } from "fingerprint-generator";
var BROWSERFORGE_DATA = loadYaml(join2(LOCAL_DATA.toString(), "browserforge.yml"));
var FP_GENERATOR = new FingerprintGenerator({
  browsers: ["firefox"]
  // operatingSystems: ['linux', 'macos', 'windows'],
});
function randrange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function _castToProperties(camoufoxData, castEnum, bfDict, ffVersion) {
  for (let [key, data] of Object.entries(bfDict)) {
    if (!data) continue;
    const typeKey = castEnum[key];
    if (!typeKey) continue;
    if (typeof data === "object" && !Array.isArray(data)) {
      _castToProperties(camoufoxData, typeKey, data, ffVersion);
      continue;
    }
    if (typeKey.startsWith("screen.") && typeof data === "number" && data < 0) {
      data = 0;
    }
    if (ffVersion && typeof data === "string") {
      data = data.replace(/(?<!\d)(1[0-9]{2})(\.0)(?!\d)/, `${ffVersion}$2`);
    }
    camoufoxData[typeKey] = data;
  }
}
function handleScreenXY(camoufoxData, fpScreen) {
  if ("window.screenY" in camoufoxData) return;
  let screenX = fpScreen.screenX;
  if (!screenX) {
    camoufoxData["window.screenX"] = 0;
    camoufoxData["window.screenY"] = 0;
    return;
  }
  if (screenX >= -50 && screenX <= 50) {
    camoufoxData["window.screenY"] = screenX;
    return;
  }
  let screenY = fpScreen.availHeight - fpScreen.outerHeight;
  if (screenY === 0) {
    camoufoxData["window.screenY"] = 0;
  } else if (screenY > 0) {
    camoufoxData["window.screenY"] = randrange(0, screenY);
  } else {
    camoufoxData["window.screenY"] = randrange(screenY, 0);
  }
}
function fromBrowserforge(fingerprint, ffVersion) {
  const camoufoxData = {};
  _castToProperties(camoufoxData, BROWSERFORGE_DATA, { ...fingerprint }, ffVersion);
  handleScreenXY(camoufoxData, fingerprint.screen);
  return camoufoxData;
}
function handleWindowSize(fp, outerWidth, outerHeight) {
  const sc = { ...fp.screen, screenY: void 0 };
  sc.screenX += (sc.width - outerWidth) / 2;
  sc.screenY = (sc.height - outerHeight) / 2;
  if (sc.innerWidth) {
    sc.innerWidth = Math.max(outerWidth - sc.outerWidth + sc.innerWidth, 0);
  }
  if (sc.innerHeight) {
    sc.innerHeight = Math.max(outerHeight - sc.outerHeight + sc.innerHeight, 0);
  }
  sc.outerWidth = outerWidth;
  sc.outerHeight = outerHeight;
  fp.screen = sc;
}
function generateFingerprint(window, config = {}) {
  if (window) {
    const { fingerprint } = FP_GENERATOR.getFingerprint(config);
    handleWindowSize(fingerprint, window[0], window[1]);
    return fingerprint;
  }
  return FP_GENERATOR.getFingerprint(config).fingerprint;
}

// src/ip.ts
init_esm_shims();

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/index.js
init_esm_shims();

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/create.js
init_esm_shims();
import { setTimeout as delay } from "timers/promises";

// node_modules/.pnpm/@sindresorhus+is@7.0.2/node_modules/@sindresorhus/is/distribution/index.js
init_esm_shims();
var typedArrayTypeNames = [
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  "BigInt64Array",
  "BigUint64Array"
];
function isTypedArrayName(name) {
  return typedArrayTypeNames.includes(name);
}
var objectTypeNames = [
  "Function",
  "Generator",
  "AsyncGenerator",
  "GeneratorFunction",
  "AsyncGeneratorFunction",
  "AsyncFunction",
  "Observable",
  "Array",
  "Buffer",
  "Blob",
  "Object",
  "RegExp",
  "Date",
  "Error",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "WeakRef",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Promise",
  "URL",
  "FormData",
  "URLSearchParams",
  "HTMLElement",
  "NaN",
  ...typedArrayTypeNames
];
function isObjectTypeName(name) {
  return objectTypeNames.includes(name);
}
var primitiveTypeNames = [
  "null",
  "undefined",
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol"
];
function isPrimitiveTypeName(name) {
  return primitiveTypeNames.includes(name);
}
var assertionTypeDescriptions = [
  "positive number",
  "negative number",
  "Class",
  "string with a number",
  "null or undefined",
  "Iterable",
  "AsyncIterable",
  "native Promise",
  "EnumCase",
  "string with a URL",
  "truthy",
  "falsy",
  "primitive",
  "integer",
  "plain object",
  "TypedArray",
  "array-like",
  "tuple-like",
  "Node.js Stream",
  "infinite number",
  "empty array",
  "non-empty array",
  "empty string",
  "empty string or whitespace",
  "non-empty string",
  "non-empty string and not whitespace",
  "empty object",
  "non-empty object",
  "empty set",
  "non-empty set",
  "empty map",
  "non-empty map",
  "PropertyKey",
  "even integer",
  "odd integer",
  "T",
  "in range",
  "predicate returns truthy for any value",
  "predicate returns truthy for all values",
  "valid Date",
  "valid length",
  "whitespace string",
  ...objectTypeNames,
  ...primitiveTypeNames
];
var getObjectType = (value) => {
  const objectTypeName = Object.prototype.toString.call(value).slice(8, -1);
  if (/HTML\w+Element/.test(objectTypeName) && isHtmlElement(value)) {
    return "HTMLElement";
  }
  if (isObjectTypeName(objectTypeName)) {
    return objectTypeName;
  }
  return void 0;
};
function detect(value) {
  if (value === null) {
    return "null";
  }
  switch (typeof value) {
    case "undefined": {
      return "undefined";
    }
    case "string": {
      return "string";
    }
    case "number": {
      return Number.isNaN(value) ? "NaN" : "number";
    }
    case "boolean": {
      return "boolean";
    }
    case "function": {
      return "Function";
    }
    case "bigint": {
      return "bigint";
    }
    case "symbol": {
      return "symbol";
    }
    default:
  }
  if (isObservable(value)) {
    return "Observable";
  }
  if (isArray(value)) {
    return "Array";
  }
  if (isBuffer(value)) {
    return "Buffer";
  }
  const tagType = getObjectType(value);
  if (tagType) {
    return tagType;
  }
  if (value instanceof String || value instanceof Boolean || value instanceof Number) {
    throw new TypeError("Please don't use object wrappers for primitive types");
  }
  return "Object";
}
function hasPromiseApi(value) {
  return isFunction(value == null ? void 0 : value.then) && isFunction(value == null ? void 0 : value.catch);
}
var is = Object.assign(detect, {
  all: isAll,
  any: isAny,
  array: isArray,
  arrayBuffer: isArrayBuffer,
  arrayLike: isArrayLike,
  asyncFunction: isAsyncFunction,
  asyncGenerator: isAsyncGenerator,
  asyncGeneratorFunction: isAsyncGeneratorFunction,
  asyncIterable: isAsyncIterable,
  bigint: isBigint,
  bigInt64Array: isBigInt64Array,
  bigUint64Array: isBigUint64Array,
  blob: isBlob,
  boolean: isBoolean,
  boundFunction: isBoundFunction,
  buffer: isBuffer,
  class: isClass,
  dataView: isDataView,
  date: isDate,
  detect,
  directInstanceOf: isDirectInstanceOf,
  emptyArray: isEmptyArray,
  emptyMap: isEmptyMap,
  emptyObject: isEmptyObject,
  emptySet: isEmptySet,
  emptyString: isEmptyString,
  emptyStringOrWhitespace: isEmptyStringOrWhitespace,
  enumCase: isEnumCase,
  error: isError,
  evenInteger: isEvenInteger,
  falsy: isFalsy,
  float32Array: isFloat32Array,
  float64Array: isFloat64Array,
  formData: isFormData,
  function: isFunction,
  generator: isGenerator,
  generatorFunction: isGeneratorFunction,
  htmlElement: isHtmlElement,
  infinite: isInfinite,
  inRange: isInRange,
  int16Array: isInt16Array,
  int32Array: isInt32Array,
  int8Array: isInt8Array,
  integer: isInteger,
  iterable: isIterable,
  map: isMap,
  nan: isNan,
  nativePromise: isNativePromise,
  negativeNumber: isNegativeNumber,
  nodeStream: isNodeStream,
  nonEmptyArray: isNonEmptyArray,
  nonEmptyMap: isNonEmptyMap,
  nonEmptyObject: isNonEmptyObject,
  nonEmptySet: isNonEmptySet,
  nonEmptyString: isNonEmptyString,
  nonEmptyStringAndNotWhitespace: isNonEmptyStringAndNotWhitespace,
  null: isNull,
  nullOrUndefined: isNullOrUndefined,
  number: isNumber,
  numericString: isNumericString,
  object: isObject,
  observable: isObservable,
  oddInteger: isOddInteger,
  plainObject: isPlainObject,
  positiveNumber: isPositiveNumber,
  primitive: isPrimitive,
  promise: isPromise,
  propertyKey: isPropertyKey,
  regExp: isRegExp,
  safeInteger: isSafeInteger,
  set: isSet,
  sharedArrayBuffer: isSharedArrayBuffer,
  string: isString,
  symbol: isSymbol,
  truthy: isTruthy,
  tupleLike: isTupleLike,
  typedArray: isTypedArray,
  uint16Array: isUint16Array,
  uint32Array: isUint32Array,
  uint8Array: isUint8Array,
  uint8ClampedArray: isUint8ClampedArray,
  undefined: isUndefined,
  urlInstance: isUrlInstance,
  urlSearchParams: isUrlSearchParams,
  urlString: isUrlString,
  validDate: isValidDate,
  validLength: isValidLength,
  weakMap: isWeakMap,
  weakRef: isWeakRef,
  weakSet: isWeakSet,
  whitespaceString: isWhitespaceString
});
function isAbsoluteModule2(remainder) {
  return (value) => isInteger(value) && Math.abs(value % 2) === remainder;
}
function isAll(predicate, ...values) {
  return predicateOnArray(Array.prototype.every, predicate, values);
}
function isAny(predicate, ...values) {
  const predicates = isArray(predicate) ? predicate : [predicate];
  return predicates.some((singlePredicate) => predicateOnArray(Array.prototype.some, singlePredicate, values));
}
function isArray(value, assertion) {
  if (!Array.isArray(value)) {
    return false;
  }
  if (!isFunction(assertion)) {
    return true;
  }
  return value.every((element) => assertion(element));
}
function isArrayBuffer(value) {
  return getObjectType(value) === "ArrayBuffer";
}
function isArrayLike(value) {
  return !isNullOrUndefined(value) && !isFunction(value) && isValidLength(value.length);
}
function isAsyncFunction(value) {
  return getObjectType(value) === "AsyncFunction";
}
function isAsyncGenerator(value) {
  return isAsyncIterable(value) && isFunction(value.next) && isFunction(value.throw);
}
function isAsyncGeneratorFunction(value) {
  return getObjectType(value) === "AsyncGeneratorFunction";
}
function isAsyncIterable(value) {
  return isFunction(value == null ? void 0 : value[Symbol.asyncIterator]);
}
function isBigint(value) {
  return typeof value === "bigint";
}
function isBigInt64Array(value) {
  return getObjectType(value) === "BigInt64Array";
}
function isBigUint64Array(value) {
  return getObjectType(value) === "BigUint64Array";
}
function isBlob(value) {
  return getObjectType(value) === "Blob";
}
function isBoolean(value) {
  return value === true || value === false;
}
function isBoundFunction(value) {
  return isFunction(value) && !Object.hasOwn(value, "prototype");
}
function isBuffer(value) {
  var _a, _b;
  return ((_b = (_a = value == null ? void 0 : value.constructor) == null ? void 0 : _a.isBuffer) == null ? void 0 : _b.call(_a, value)) ?? false;
}
function isClass(value) {
  return isFunction(value) && value.toString().startsWith("class ");
}
function isDataView(value) {
  return getObjectType(value) === "DataView";
}
function isDate(value) {
  return getObjectType(value) === "Date";
}
function isDirectInstanceOf(instance, class_) {
  if (instance === void 0 || instance === null) {
    return false;
  }
  return Object.getPrototypeOf(instance) === class_.prototype;
}
function isEmptyArray(value) {
  return isArray(value) && value.length === 0;
}
function isEmptyMap(value) {
  return isMap(value) && value.size === 0;
}
function isEmptyObject(value) {
  return isObject(value) && !isMap(value) && !isSet(value) && Object.keys(value).length === 0;
}
function isEmptySet(value) {
  return isSet(value) && value.size === 0;
}
function isEmptyString(value) {
  return isString(value) && value.length === 0;
}
function isEmptyStringOrWhitespace(value) {
  return isEmptyString(value) || isWhitespaceString(value);
}
function isEnumCase(value, targetEnum) {
  return Object.values(targetEnum).includes(value);
}
function isError(value) {
  return getObjectType(value) === "Error";
}
function isEvenInteger(value) {
  return isAbsoluteModule2(0)(value);
}
function isFalsy(value) {
  return !value;
}
function isFloat32Array(value) {
  return getObjectType(value) === "Float32Array";
}
function isFloat64Array(value) {
  return getObjectType(value) === "Float64Array";
}
function isFormData(value) {
  return getObjectType(value) === "FormData";
}
function isFunction(value) {
  return typeof value === "function";
}
function isGenerator(value) {
  return isIterable(value) && isFunction(value == null ? void 0 : value.next) && isFunction(value == null ? void 0 : value.throw);
}
function isGeneratorFunction(value) {
  return getObjectType(value) === "GeneratorFunction";
}
var NODE_TYPE_ELEMENT = 1;
var DOM_PROPERTIES_TO_CHECK = [
  "innerHTML",
  "ownerDocument",
  "style",
  "attributes",
  "nodeValue"
];
function isHtmlElement(value) {
  return isObject(value) && value.nodeType === NODE_TYPE_ELEMENT && isString(value.nodeName) && !isPlainObject(value) && DOM_PROPERTIES_TO_CHECK.every((property) => property in value);
}
function isInfinite(value) {
  return value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY;
}
function isInRange(value, range) {
  if (isNumber(range)) {
    return value >= Math.min(0, range) && value <= Math.max(range, 0);
  }
  if (isArray(range) && range.length === 2) {
    return value >= Math.min(...range) && value <= Math.max(...range);
  }
  throw new TypeError(`Invalid range: ${JSON.stringify(range)}`);
}
function isInt16Array(value) {
  return getObjectType(value) === "Int16Array";
}
function isInt32Array(value) {
  return getObjectType(value) === "Int32Array";
}
function isInt8Array(value) {
  return getObjectType(value) === "Int8Array";
}
function isInteger(value) {
  return Number.isInteger(value);
}
function isIterable(value) {
  return isFunction(value == null ? void 0 : value[Symbol.iterator]);
}
function isMap(value) {
  return getObjectType(value) === "Map";
}
function isNan(value) {
  return Number.isNaN(value);
}
function isNativePromise(value) {
  return getObjectType(value) === "Promise";
}
function isNegativeNumber(value) {
  return isNumber(value) && value < 0;
}
function isNodeStream(value) {
  return isObject(value) && isFunction(value.pipe) && !isObservable(value);
}
function isNonEmptyArray(value) {
  return isArray(value) && value.length > 0;
}
function isNonEmptyMap(value) {
  return isMap(value) && value.size > 0;
}
function isNonEmptyObject(value) {
  return isObject(value) && !isMap(value) && !isSet(value) && Object.keys(value).length > 0;
}
function isNonEmptySet(value) {
  return isSet(value) && value.size > 0;
}
function isNonEmptyString(value) {
  return isString(value) && value.length > 0;
}
function isNonEmptyStringAndNotWhitespace(value) {
  return isString(value) && !isEmptyStringOrWhitespace(value);
}
function isNull(value) {
  return value === null;
}
function isNullOrUndefined(value) {
  return isNull(value) || isUndefined(value);
}
function isNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}
function isNumericString(value) {
  return isString(value) && !isEmptyStringOrWhitespace(value) && !Number.isNaN(Number(value));
}
function isObject(value) {
  return !isNull(value) && (typeof value === "object" || isFunction(value));
}
function isObservable(value) {
  var _a, _b;
  if (!value) {
    return false;
  }
  if (Symbol.observable !== void 0 && value === ((_a = value[Symbol.observable]) == null ? void 0 : _a.call(value))) {
    return true;
  }
  if (value === ((_b = value["@@observable"]) == null ? void 0 : _b.call(value))) {
    return true;
  }
  return false;
}
function isOddInteger(value) {
  return isAbsoluteModule2(1)(value);
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}
function isPositiveNumber(value) {
  return isNumber(value) && value > 0;
}
function isPrimitive(value) {
  return isNull(value) || isPrimitiveTypeName(typeof value);
}
function isPromise(value) {
  return isNativePromise(value) || hasPromiseApi(value);
}
function isPropertyKey(value) {
  return isAny([isString, isNumber, isSymbol], value);
}
function isRegExp(value) {
  return getObjectType(value) === "RegExp";
}
function isSafeInteger(value) {
  return Number.isSafeInteger(value);
}
function isSet(value) {
  return getObjectType(value) === "Set";
}
function isSharedArrayBuffer(value) {
  return getObjectType(value) === "SharedArrayBuffer";
}
function isString(value) {
  return typeof value === "string";
}
function isSymbol(value) {
  return typeof value === "symbol";
}
function isTruthy(value) {
  return Boolean(value);
}
function isTupleLike(value, guards) {
  if (isArray(guards) && isArray(value) && guards.length === value.length) {
    return guards.every((guard, index) => guard(value[index]));
  }
  return false;
}
function isTypedArray(value) {
  return isTypedArrayName(getObjectType(value));
}
function isUint16Array(value) {
  return getObjectType(value) === "Uint16Array";
}
function isUint32Array(value) {
  return getObjectType(value) === "Uint32Array";
}
function isUint8Array(value) {
  return getObjectType(value) === "Uint8Array";
}
function isUint8ClampedArray(value) {
  return getObjectType(value) === "Uint8ClampedArray";
}
function isUndefined(value) {
  return value === void 0;
}
function isUrlInstance(value) {
  return getObjectType(value) === "URL";
}
function isUrlSearchParams(value) {
  return getObjectType(value) === "URLSearchParams";
}
function isUrlString(value) {
  if (!isString(value)) {
    return false;
  }
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
function isValidDate(value) {
  return isDate(value) && !isNan(Number(value));
}
function isValidLength(value) {
  return isSafeInteger(value) && value >= 0;
}
function isWeakMap(value) {
  return getObjectType(value) === "WeakMap";
}
function isWeakRef(value) {
  return getObjectType(value) === "WeakRef";
}
function isWeakSet(value) {
  return getObjectType(value) === "WeakSet";
}
function isWhitespaceString(value) {
  return isString(value) && /^\s+$/.test(value);
}
function predicateOnArray(method, predicate, values) {
  if (!isFunction(predicate)) {
    throw new TypeError(`Invalid predicate: ${JSON.stringify(predicate)}`);
  }
  if (values.length === 0) {
    throw new TypeError("Invalid number of values");
  }
  return method.call(values, predicate);
}
function typeErrorMessage(description, value) {
  return `Expected value which is \`${description}\`, received value of type \`${is(value)}\`.`;
}
function unique(values) {
  return Array.from(new Set(values));
}
var andFormatter = new Intl.ListFormat("en", { style: "long", type: "conjunction" });
var orFormatter = new Intl.ListFormat("en", { style: "long", type: "disjunction" });
function typeErrorMessageMultipleValues(expectedType, values) {
  const uniqueExpectedTypes = unique((isArray(expectedType) ? expectedType : [expectedType]).map((value) => `\`${value}\``));
  const uniqueValueTypes = unique(values.map((value) => `\`${is(value)}\``));
  return `Expected values which are ${orFormatter.format(uniqueExpectedTypes)}. Received values of type${uniqueValueTypes.length > 1 ? "s" : ""} ${andFormatter.format(uniqueValueTypes)}.`;
}
var assert = {
  all: assertAll,
  any: assertAny,
  array: assertArray,
  arrayBuffer: assertArrayBuffer,
  arrayLike: assertArrayLike,
  asyncFunction: assertAsyncFunction,
  asyncGenerator: assertAsyncGenerator,
  asyncGeneratorFunction: assertAsyncGeneratorFunction,
  asyncIterable: assertAsyncIterable,
  bigint: assertBigint,
  bigInt64Array: assertBigInt64Array,
  bigUint64Array: assertBigUint64Array,
  blob: assertBlob,
  boolean: assertBoolean,
  boundFunction: assertBoundFunction,
  buffer: assertBuffer,
  class: assertClass,
  dataView: assertDataView,
  date: assertDate,
  directInstanceOf: assertDirectInstanceOf,
  emptyArray: assertEmptyArray,
  emptyMap: assertEmptyMap,
  emptyObject: assertEmptyObject,
  emptySet: assertEmptySet,
  emptyString: assertEmptyString,
  emptyStringOrWhitespace: assertEmptyStringOrWhitespace,
  enumCase: assertEnumCase,
  error: assertError,
  evenInteger: assertEvenInteger,
  falsy: assertFalsy,
  float32Array: assertFloat32Array,
  float64Array: assertFloat64Array,
  formData: assertFormData,
  function: assertFunction,
  generator: assertGenerator,
  generatorFunction: assertGeneratorFunction,
  htmlElement: assertHtmlElement,
  infinite: assertInfinite,
  inRange: assertInRange,
  int16Array: assertInt16Array,
  int32Array: assertInt32Array,
  int8Array: assertInt8Array,
  integer: assertInteger,
  iterable: assertIterable,
  map: assertMap,
  nan: assertNan,
  nativePromise: assertNativePromise,
  negativeNumber: assertNegativeNumber,
  nodeStream: assertNodeStream,
  nonEmptyArray: assertNonEmptyArray,
  nonEmptyMap: assertNonEmptyMap,
  nonEmptyObject: assertNonEmptyObject,
  nonEmptySet: assertNonEmptySet,
  nonEmptyString: assertNonEmptyString,
  nonEmptyStringAndNotWhitespace: assertNonEmptyStringAndNotWhitespace,
  null: assertNull,
  nullOrUndefined: assertNullOrUndefined,
  number: assertNumber,
  numericString: assertNumericString,
  object: assertObject,
  observable: assertObservable,
  oddInteger: assertOddInteger,
  plainObject: assertPlainObject,
  positiveNumber: assertPositiveNumber,
  primitive: assertPrimitive,
  promise: assertPromise,
  propertyKey: assertPropertyKey,
  regExp: assertRegExp,
  safeInteger: assertSafeInteger,
  set: assertSet,
  sharedArrayBuffer: assertSharedArrayBuffer,
  string: assertString,
  symbol: assertSymbol,
  truthy: assertTruthy,
  tupleLike: assertTupleLike,
  typedArray: assertTypedArray,
  uint16Array: assertUint16Array,
  uint32Array: assertUint32Array,
  uint8Array: assertUint8Array,
  uint8ClampedArray: assertUint8ClampedArray,
  undefined: assertUndefined,
  urlInstance: assertUrlInstance,
  urlSearchParams: assertUrlSearchParams,
  urlString: assertUrlString,
  validDate: assertValidDate,
  validLength: assertValidLength,
  weakMap: assertWeakMap,
  weakRef: assertWeakRef,
  weakSet: assertWeakSet,
  whitespaceString: assertWhitespaceString
};
var methodTypeMap = {
  isArray: "Array",
  isArrayBuffer: "ArrayBuffer",
  isArrayLike: "array-like",
  isAsyncFunction: "AsyncFunction",
  isAsyncGenerator: "AsyncGenerator",
  isAsyncGeneratorFunction: "AsyncGeneratorFunction",
  isAsyncIterable: "AsyncIterable",
  isBigint: "bigint",
  isBigInt64Array: "BigInt64Array",
  isBigUint64Array: "BigUint64Array",
  isBlob: "Blob",
  isBoolean: "boolean",
  isBoundFunction: "Function",
  isBuffer: "Buffer",
  isClass: "Class",
  isDataView: "DataView",
  isDate: "Date",
  isDirectInstanceOf: "T",
  isEmptyArray: "empty array",
  isEmptyMap: "empty map",
  isEmptyObject: "empty object",
  isEmptySet: "empty set",
  isEmptyString: "empty string",
  isEmptyStringOrWhitespace: "empty string or whitespace",
  isEnumCase: "EnumCase",
  isError: "Error",
  isEvenInteger: "even integer",
  isFalsy: "falsy",
  isFloat32Array: "Float32Array",
  isFloat64Array: "Float64Array",
  isFormData: "FormData",
  isFunction: "Function",
  isGenerator: "Generator",
  isGeneratorFunction: "GeneratorFunction",
  isHtmlElement: "HTMLElement",
  isInfinite: "infinite number",
  isInRange: "in range",
  isInt16Array: "Int16Array",
  isInt32Array: "Int32Array",
  isInt8Array: "Int8Array",
  isInteger: "integer",
  isIterable: "Iterable",
  isMap: "Map",
  isNan: "NaN",
  isNativePromise: "native Promise",
  isNegativeNumber: "negative number",
  isNodeStream: "Node.js Stream",
  isNonEmptyArray: "non-empty array",
  isNonEmptyMap: "non-empty map",
  isNonEmptyObject: "non-empty object",
  isNonEmptySet: "non-empty set",
  isNonEmptyString: "non-empty string",
  isNonEmptyStringAndNotWhitespace: "non-empty string and not whitespace",
  isNull: "null",
  isNullOrUndefined: "null or undefined",
  isNumber: "number",
  isNumericString: "string with a number",
  isObject: "Object",
  isObservable: "Observable",
  isOddInteger: "odd integer",
  isPlainObject: "plain object",
  isPositiveNumber: "positive number",
  isPrimitive: "primitive",
  isPromise: "Promise",
  isPropertyKey: "PropertyKey",
  isRegExp: "RegExp",
  isSafeInteger: "integer",
  isSet: "Set",
  isSharedArrayBuffer: "SharedArrayBuffer",
  isString: "string",
  isSymbol: "symbol",
  isTruthy: "truthy",
  isTupleLike: "tuple-like",
  isTypedArray: "TypedArray",
  isUint16Array: "Uint16Array",
  isUint32Array: "Uint32Array",
  isUint8Array: "Uint8Array",
  isUint8ClampedArray: "Uint8ClampedArray",
  isUndefined: "undefined",
  isUrlInstance: "URL",
  isUrlSearchParams: "URLSearchParams",
  isUrlString: "string with a URL",
  isValidDate: "valid Date",
  isValidLength: "valid length",
  isWeakMap: "WeakMap",
  isWeakRef: "WeakRef",
  isWeakSet: "WeakSet",
  isWhitespaceString: "whitespace string"
};
function keysOf(value) {
  return Object.keys(value);
}
var isMethodNames = keysOf(methodTypeMap);
function isIsMethodName(value) {
  return isMethodNames.includes(value);
}
function assertAll(predicate, ...values) {
  if (!isAll(predicate, ...values)) {
    const expectedType = isIsMethodName(predicate.name) ? methodTypeMap[predicate.name] : "predicate returns truthy for all values";
    throw new TypeError(typeErrorMessageMultipleValues(expectedType, values));
  }
}
function assertAny(predicate, ...values) {
  if (!isAny(predicate, ...values)) {
    const predicates = isArray(predicate) ? predicate : [predicate];
    const expectedTypes = predicates.map((predicate2) => isIsMethodName(predicate2.name) ? methodTypeMap[predicate2.name] : "predicate returns truthy for any value");
    throw new TypeError(typeErrorMessageMultipleValues(expectedTypes, values));
  }
}
function assertArray(value, assertion, message) {
  if (!isArray(value)) {
    throw new TypeError(message ?? typeErrorMessage("Array", value));
  }
  if (assertion) {
    for (const element of value) {
      assertion(element, message);
    }
  }
}
function assertArrayBuffer(value, message) {
  if (!isArrayBuffer(value)) {
    throw new TypeError(message ?? typeErrorMessage("ArrayBuffer", value));
  }
}
function assertArrayLike(value, message) {
  if (!isArrayLike(value)) {
    throw new TypeError(message ?? typeErrorMessage("array-like", value));
  }
}
function assertAsyncFunction(value, message) {
  if (!isAsyncFunction(value)) {
    throw new TypeError(message ?? typeErrorMessage("AsyncFunction", value));
  }
}
function assertAsyncGenerator(value, message) {
  if (!isAsyncGenerator(value)) {
    throw new TypeError(message ?? typeErrorMessage("AsyncGenerator", value));
  }
}
function assertAsyncGeneratorFunction(value, message) {
  if (!isAsyncGeneratorFunction(value)) {
    throw new TypeError(message ?? typeErrorMessage("AsyncGeneratorFunction", value));
  }
}
function assertAsyncIterable(value, message) {
  if (!isAsyncIterable(value)) {
    throw new TypeError(message ?? typeErrorMessage("AsyncIterable", value));
  }
}
function assertBigint(value, message) {
  if (!isBigint(value)) {
    throw new TypeError(message ?? typeErrorMessage("bigint", value));
  }
}
function assertBigInt64Array(value, message) {
  if (!isBigInt64Array(value)) {
    throw new TypeError(message ?? typeErrorMessage("BigInt64Array", value));
  }
}
function assertBigUint64Array(value, message) {
  if (!isBigUint64Array(value)) {
    throw new TypeError(message ?? typeErrorMessage("BigUint64Array", value));
  }
}
function assertBlob(value, message) {
  if (!isBlob(value)) {
    throw new TypeError(message ?? typeErrorMessage("Blob", value));
  }
}
function assertBoolean(value, message) {
  if (!isBoolean(value)) {
    throw new TypeError(message ?? typeErrorMessage("boolean", value));
  }
}
function assertBoundFunction(value, message) {
  if (!isBoundFunction(value)) {
    throw new TypeError(message ?? typeErrorMessage("Function", value));
  }
}
function assertBuffer(value, message) {
  if (!isBuffer(value)) {
    throw new TypeError(message ?? typeErrorMessage("Buffer", value));
  }
}
function assertClass(value, message) {
  if (!isClass(value)) {
    throw new TypeError(message ?? typeErrorMessage("Class", value));
  }
}
function assertDataView(value, message) {
  if (!isDataView(value)) {
    throw new TypeError(message ?? typeErrorMessage("DataView", value));
  }
}
function assertDate(value, message) {
  if (!isDate(value)) {
    throw new TypeError(message ?? typeErrorMessage("Date", value));
  }
}
function assertDirectInstanceOf(instance, class_, message) {
  if (!isDirectInstanceOf(instance, class_)) {
    throw new TypeError(message ?? typeErrorMessage("T", instance));
  }
}
function assertEmptyArray(value, message) {
  if (!isEmptyArray(value)) {
    throw new TypeError(message ?? typeErrorMessage("empty array", value));
  }
}
function assertEmptyMap(value, message) {
  if (!isEmptyMap(value)) {
    throw new TypeError(message ?? typeErrorMessage("empty map", value));
  }
}
function assertEmptyObject(value, message) {
  if (!isEmptyObject(value)) {
    throw new TypeError(message ?? typeErrorMessage("empty object", value));
  }
}
function assertEmptySet(value, message) {
  if (!isEmptySet(value)) {
    throw new TypeError(message ?? typeErrorMessage("empty set", value));
  }
}
function assertEmptyString(value, message) {
  if (!isEmptyString(value)) {
    throw new TypeError(message ?? typeErrorMessage("empty string", value));
  }
}
function assertEmptyStringOrWhitespace(value, message) {
  if (!isEmptyStringOrWhitespace(value)) {
    throw new TypeError(message ?? typeErrorMessage("empty string or whitespace", value));
  }
}
function assertEnumCase(value, targetEnum, message) {
  if (!isEnumCase(value, targetEnum)) {
    throw new TypeError(message ?? typeErrorMessage("EnumCase", value));
  }
}
function assertError(value, message) {
  if (!isError(value)) {
    throw new TypeError(message ?? typeErrorMessage("Error", value));
  }
}
function assertEvenInteger(value, message) {
  if (!isEvenInteger(value)) {
    throw new TypeError(message ?? typeErrorMessage("even integer", value));
  }
}
function assertFalsy(value, message) {
  if (!isFalsy(value)) {
    throw new TypeError(message ?? typeErrorMessage("falsy", value));
  }
}
function assertFloat32Array(value, message) {
  if (!isFloat32Array(value)) {
    throw new TypeError(message ?? typeErrorMessage("Float32Array", value));
  }
}
function assertFloat64Array(value, message) {
  if (!isFloat64Array(value)) {
    throw new TypeError(message ?? typeErrorMessage("Float64Array", value));
  }
}
function assertFormData(value, message) {
  if (!isFormData(value)) {
    throw new TypeError(message ?? typeErrorMessage("FormData", value));
  }
}
function assertFunction(value, message) {
  if (!isFunction(value)) {
    throw new TypeError(message ?? typeErrorMessage("Function", value));
  }
}
function assertGenerator(value, message) {
  if (!isGenerator(value)) {
    throw new TypeError(message ?? typeErrorMessage("Generator", value));
  }
}
function assertGeneratorFunction(value, message) {
  if (!isGeneratorFunction(value)) {
    throw new TypeError(message ?? typeErrorMessage("GeneratorFunction", value));
  }
}
function assertHtmlElement(value, message) {
  if (!isHtmlElement(value)) {
    throw new TypeError(message ?? typeErrorMessage("HTMLElement", value));
  }
}
function assertInfinite(value, message) {
  if (!isInfinite(value)) {
    throw new TypeError(message ?? typeErrorMessage("infinite number", value));
  }
}
function assertInRange(value, range, message) {
  if (!isInRange(value, range)) {
    throw new TypeError(message ?? typeErrorMessage("in range", value));
  }
}
function assertInt16Array(value, message) {
  if (!isInt16Array(value)) {
    throw new TypeError(message ?? typeErrorMessage("Int16Array", value));
  }
}
function assertInt32Array(value, message) {
  if (!isInt32Array(value)) {
    throw new TypeError(message ?? typeErrorMessage("Int32Array", value));
  }
}
function assertInt8Array(value, message) {
  if (!isInt8Array(value)) {
    throw new TypeError(message ?? typeErrorMessage("Int8Array", value));
  }
}
function assertInteger(value, message) {
  if (!isInteger(value)) {
    throw new TypeError(message ?? typeErrorMessage("integer", value));
  }
}
function assertIterable(value, message) {
  if (!isIterable(value)) {
    throw new TypeError(message ?? typeErrorMessage("Iterable", value));
  }
}
function assertMap(value, message) {
  if (!isMap(value)) {
    throw new TypeError(message ?? typeErrorMessage("Map", value));
  }
}
function assertNan(value, message) {
  if (!isNan(value)) {
    throw new TypeError(message ?? typeErrorMessage("NaN", value));
  }
}
function assertNativePromise(value, message) {
  if (!isNativePromise(value)) {
    throw new TypeError(message ?? typeErrorMessage("native Promise", value));
  }
}
function assertNegativeNumber(value, message) {
  if (!isNegativeNumber(value)) {
    throw new TypeError(message ?? typeErrorMessage("negative number", value));
  }
}
function assertNodeStream(value, message) {
  if (!isNodeStream(value)) {
    throw new TypeError(message ?? typeErrorMessage("Node.js Stream", value));
  }
}
function assertNonEmptyArray(value, message) {
  if (!isNonEmptyArray(value)) {
    throw new TypeError(message ?? typeErrorMessage("non-empty array", value));
  }
}
function assertNonEmptyMap(value, message) {
  if (!isNonEmptyMap(value)) {
    throw new TypeError(message ?? typeErrorMessage("non-empty map", value));
  }
}
function assertNonEmptyObject(value, message) {
  if (!isNonEmptyObject(value)) {
    throw new TypeError(message ?? typeErrorMessage("non-empty object", value));
  }
}
function assertNonEmptySet(value, message) {
  if (!isNonEmptySet(value)) {
    throw new TypeError(message ?? typeErrorMessage("non-empty set", value));
  }
}
function assertNonEmptyString(value, message) {
  if (!isNonEmptyString(value)) {
    throw new TypeError(message ?? typeErrorMessage("non-empty string", value));
  }
}
function assertNonEmptyStringAndNotWhitespace(value, message) {
  if (!isNonEmptyStringAndNotWhitespace(value)) {
    throw new TypeError(message ?? typeErrorMessage("non-empty string and not whitespace", value));
  }
}
function assertNull(value, message) {
  if (!isNull(value)) {
    throw new TypeError(message ?? typeErrorMessage("null", value));
  }
}
function assertNullOrUndefined(value, message) {
  if (!isNullOrUndefined(value)) {
    throw new TypeError(message ?? typeErrorMessage("null or undefined", value));
  }
}
function assertNumber(value, message) {
  if (!isNumber(value)) {
    throw new TypeError(message ?? typeErrorMessage("number", value));
  }
}
function assertNumericString(value, message) {
  if (!isNumericString(value)) {
    throw new TypeError(message ?? typeErrorMessage("string with a number", value));
  }
}
function assertObject(value, message) {
  if (!isObject(value)) {
    throw new TypeError(message ?? typeErrorMessage("Object", value));
  }
}
function assertObservable(value, message) {
  if (!isObservable(value)) {
    throw new TypeError(message ?? typeErrorMessage("Observable", value));
  }
}
function assertOddInteger(value, message) {
  if (!isOddInteger(value)) {
    throw new TypeError(message ?? typeErrorMessage("odd integer", value));
  }
}
function assertPlainObject(value, message) {
  if (!isPlainObject(value)) {
    throw new TypeError(message ?? typeErrorMessage("plain object", value));
  }
}
function assertPositiveNumber(value, message) {
  if (!isPositiveNumber(value)) {
    throw new TypeError(message ?? typeErrorMessage("positive number", value));
  }
}
function assertPrimitive(value, message) {
  if (!isPrimitive(value)) {
    throw new TypeError(message ?? typeErrorMessage("primitive", value));
  }
}
function assertPromise(value, message) {
  if (!isPromise(value)) {
    throw new TypeError(message ?? typeErrorMessage("Promise", value));
  }
}
function assertPropertyKey(value, message) {
  if (!isPropertyKey(value)) {
    throw new TypeError(message ?? typeErrorMessage("PropertyKey", value));
  }
}
function assertRegExp(value, message) {
  if (!isRegExp(value)) {
    throw new TypeError(message ?? typeErrorMessage("RegExp", value));
  }
}
function assertSafeInteger(value, message) {
  if (!isSafeInteger(value)) {
    throw new TypeError(message ?? typeErrorMessage("integer", value));
  }
}
function assertSet(value, message) {
  if (!isSet(value)) {
    throw new TypeError(message ?? typeErrorMessage("Set", value));
  }
}
function assertSharedArrayBuffer(value, message) {
  if (!isSharedArrayBuffer(value)) {
    throw new TypeError(message ?? typeErrorMessage("SharedArrayBuffer", value));
  }
}
function assertString(value, message) {
  if (!isString(value)) {
    throw new TypeError(message ?? typeErrorMessage("string", value));
  }
}
function assertSymbol(value, message) {
  if (!isSymbol(value)) {
    throw new TypeError(message ?? typeErrorMessage("symbol", value));
  }
}
function assertTruthy(value, message) {
  if (!isTruthy(value)) {
    throw new TypeError(message ?? typeErrorMessage("truthy", value));
  }
}
function assertTupleLike(value, guards, message) {
  if (!isTupleLike(value, guards)) {
    throw new TypeError(message ?? typeErrorMessage("tuple-like", value));
  }
}
function assertTypedArray(value, message) {
  if (!isTypedArray(value)) {
    throw new TypeError(message ?? typeErrorMessage("TypedArray", value));
  }
}
function assertUint16Array(value, message) {
  if (!isUint16Array(value)) {
    throw new TypeError(message ?? typeErrorMessage("Uint16Array", value));
  }
}
function assertUint32Array(value, message) {
  if (!isUint32Array(value)) {
    throw new TypeError(message ?? typeErrorMessage("Uint32Array", value));
  }
}
function assertUint8Array(value, message) {
  if (!isUint8Array(value)) {
    throw new TypeError(message ?? typeErrorMessage("Uint8Array", value));
  }
}
function assertUint8ClampedArray(value, message) {
  if (!isUint8ClampedArray(value)) {
    throw new TypeError(message ?? typeErrorMessage("Uint8ClampedArray", value));
  }
}
function assertUndefined(value, message) {
  if (!isUndefined(value)) {
    throw new TypeError(message ?? typeErrorMessage("undefined", value));
  }
}
function assertUrlInstance(value, message) {
  if (!isUrlInstance(value)) {
    throw new TypeError(message ?? typeErrorMessage("URL", value));
  }
}
function assertUrlSearchParams(value, message) {
  if (!isUrlSearchParams(value)) {
    throw new TypeError(message ?? typeErrorMessage("URLSearchParams", value));
  }
}
function assertUrlString(value, message) {
  if (!isUrlString(value)) {
    throw new TypeError(message ?? typeErrorMessage("string with a URL", value));
  }
}
function assertValidDate(value, message) {
  if (!isValidDate(value)) {
    throw new TypeError(message ?? typeErrorMessage("valid Date", value));
  }
}
function assertValidLength(value, message) {
  if (!isValidLength(value)) {
    throw new TypeError(message ?? typeErrorMessage("valid length", value));
  }
}
function assertWeakMap(value, message) {
  if (!isWeakMap(value)) {
    throw new TypeError(message ?? typeErrorMessage("WeakMap", value));
  }
}
function assertWeakRef(value, message) {
  if (!isWeakRef(value)) {
    throw new TypeError(message ?? typeErrorMessage("WeakRef", value));
  }
}
function assertWeakSet(value, message) {
  if (!isWeakSet(value)) {
    throw new TypeError(message ?? typeErrorMessage("WeakSet", value));
  }
}
function assertWhitespaceString(value, message) {
  if (!isWhitespaceString(value)) {
    throw new TypeError(message ?? typeErrorMessage("whitespace string", value));
  }
}
var distribution_default = is;

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/as-promise/index.js
init_esm_shims();
import { EventEmitter as EventEmitter2 } from "events";

// node_modules/.pnpm/p-cancelable@4.0.1/node_modules/p-cancelable/index.js
init_esm_shims();
var CancelError = class extends Error {
  constructor(reason) {
    super(reason || "Promise was canceled");
    this.name = "CancelError";
  }
  get isCanceled() {
    return true;
  }
};
var promiseState = Object.freeze({
  pending: Symbol("pending"),
  canceled: Symbol("canceled"),
  resolved: Symbol("resolved"),
  rejected: Symbol("rejected")
});
var PCancelable = class _PCancelable {
  static fn(userFunction) {
    return (...arguments_) => new _PCancelable((resolve2, reject, onCancel) => {
      arguments_.push(onCancel);
      userFunction(...arguments_).then(resolve2, reject);
    });
  }
  #cancelHandlers = [];
  #rejectOnCancel = true;
  #state = promiseState.pending;
  #promise;
  #reject;
  constructor(executor) {
    this.#promise = new Promise((resolve2, reject) => {
      this.#reject = reject;
      const onResolve = (value) => {
        if (this.#state !== promiseState.canceled || !onCancel.shouldReject) {
          resolve2(value);
          this.#setState(promiseState.resolved);
        }
      };
      const onReject = (error) => {
        if (this.#state !== promiseState.canceled || !onCancel.shouldReject) {
          reject(error);
          this.#setState(promiseState.rejected);
        }
      };
      const onCancel = (handler) => {
        if (this.#state !== promiseState.pending) {
          throw new Error(`The \`onCancel\` handler was attached after the promise ${this.#state.description}.`);
        }
        this.#cancelHandlers.push(handler);
      };
      Object.defineProperties(onCancel, {
        shouldReject: {
          get: () => this.#rejectOnCancel,
          set: (boolean) => {
            this.#rejectOnCancel = boolean;
          }
        }
      });
      executor(onResolve, onReject, onCancel);
    });
  }
  // eslint-disable-next-line unicorn/no-thenable
  then(onFulfilled, onRejected) {
    return this.#promise.then(onFulfilled, onRejected);
  }
  catch(onRejected) {
    return this.#promise.catch(onRejected);
  }
  finally(onFinally) {
    return this.#promise.finally(onFinally);
  }
  cancel(reason) {
    if (this.#state !== promiseState.pending) {
      return;
    }
    this.#setState(promiseState.canceled);
    if (this.#cancelHandlers.length > 0) {
      try {
        for (const handler of this.#cancelHandlers) {
          handler();
        }
      } catch (error) {
        this.#reject(error);
        return;
      }
    }
    if (this.#rejectOnCancel) {
      this.#reject(new CancelError(reason));
    }
  }
  get isCanceled() {
    return this.#state === promiseState.canceled;
  }
  #setState(state) {
    if (this.#state === promiseState.pending) {
      this.#state = state;
    }
  }
};
Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/errors.js
init_esm_shims();
function isRequest(x) {
  return distribution_default.object(x) && "_onResponse" in x;
}
var RequestError = class extends Error {
  input;
  code;
  stack;
  response;
  request;
  timings;
  constructor(message, error, self) {
    var _a;
    super(message, { cause: error });
    Error.captureStackTrace(this, this.constructor);
    this.name = "RequestError";
    this.code = error.code ?? "ERR_GOT_REQUEST_ERROR";
    this.input = error.input;
    if (isRequest(self)) {
      Object.defineProperty(this, "request", {
        enumerable: false,
        value: self
      });
      Object.defineProperty(this, "response", {
        enumerable: false,
        value: self.response
      });
      this.options = self.options;
    } else {
      this.options = self;
    }
    this.timings = (_a = this.request) == null ? void 0 : _a.timings;
    if (distribution_default.string(error.stack) && distribution_default.string(this.stack)) {
      const indexOfMessage = this.stack.indexOf(this.message) + this.message.length;
      const thisStackTrace = this.stack.slice(indexOfMessage).split("\n").reverse();
      const errorStackTrace = error.stack.slice(error.stack.indexOf(error.message) + error.message.length).split("\n").reverse();
      while (errorStackTrace.length > 0 && errorStackTrace[0] === thisStackTrace[0]) {
        thisStackTrace.shift();
      }
      this.stack = `${this.stack.slice(0, indexOfMessage)}${thisStackTrace.reverse().join("\n")}${errorStackTrace.reverse().join("\n")}`;
    }
  }
};
var MaxRedirectsError = class extends RequestError {
  constructor(request) {
    super(`Redirected ${request.options.maxRedirects} times. Aborting.`, {}, request);
    this.name = "MaxRedirectsError";
    this.code = "ERR_TOO_MANY_REDIRECTS";
  }
};
var HTTPError = class extends RequestError {
  constructor(response) {
    super(`Response code ${response.statusCode} (${response.statusMessage})`, {}, response.request);
    this.name = "HTTPError";
    this.code = "ERR_NON_2XX_3XX_RESPONSE";
  }
};
var CacheError = class extends RequestError {
  constructor(error, request) {
    super(error.message, error, request);
    this.name = "CacheError";
    this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_CACHE_ACCESS" : this.code;
  }
};
var UploadError = class extends RequestError {
  constructor(error, request) {
    super(error.message, error, request);
    this.name = "UploadError";
    this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_UPLOAD" : this.code;
  }
};
var TimeoutError = class extends RequestError {
  timings;
  event;
  constructor(error, timings, request) {
    super(error.message, error, request);
    this.name = "TimeoutError";
    this.event = error.event;
    this.timings = timings;
  }
};
var ReadError = class extends RequestError {
  constructor(error, request) {
    super(error.message, error, request);
    this.name = "ReadError";
    this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_READING_RESPONSE_STREAM" : this.code;
  }
};
var RetryError = class extends RequestError {
  constructor(request) {
    super("Retrying", {}, request);
    this.name = "RetryError";
    this.code = "ERR_RETRYING";
  }
};
var AbortError = class extends RequestError {
  constructor(request) {
    super("This operation was aborted.", {}, request);
    this.code = "ERR_ABORTED";
    this.name = "AbortError";
  }
};

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/index.js
init_esm_shims();
import process3 from "process";
import { Buffer as Buffer3 } from "buffer";
import { Duplex } from "stream";
import http2, { ServerResponse } from "http";

// node_modules/.pnpm/@szmarczak+http-timer@5.0.1/node_modules/@szmarczak/http-timer/dist/source/index.js
init_esm_shims();
var import_defer_to_connect = __toESM(require_source(), 1);
import { errorMonitor } from "events";
import { types } from "util";
var timer = (request) => {
  if (request.timings) {
    return request.timings;
  }
  const timings = {
    start: Date.now(),
    socket: void 0,
    lookup: void 0,
    connect: void 0,
    secureConnect: void 0,
    upload: void 0,
    response: void 0,
    end: void 0,
    error: void 0,
    abort: void 0,
    phases: {
      wait: void 0,
      dns: void 0,
      tcp: void 0,
      tls: void 0,
      request: void 0,
      firstByte: void 0,
      download: void 0,
      total: void 0
    }
  };
  request.timings = timings;
  const handleError = (origin) => {
    origin.once(errorMonitor, () => {
      timings.error = Date.now();
      timings.phases.total = timings.error - timings.start;
    });
  };
  handleError(request);
  const onAbort = () => {
    timings.abort = Date.now();
    timings.phases.total = timings.abort - timings.start;
  };
  request.prependOnceListener("abort", onAbort);
  const onSocket = (socket) => {
    timings.socket = Date.now();
    timings.phases.wait = timings.socket - timings.start;
    if (types.isProxy(socket)) {
      return;
    }
    const lookupListener = () => {
      timings.lookup = Date.now();
      timings.phases.dns = timings.lookup - timings.socket;
    };
    socket.prependOnceListener("lookup", lookupListener);
    (0, import_defer_to_connect.default)(socket, {
      connect: () => {
        timings.connect = Date.now();
        if (timings.lookup === void 0) {
          socket.removeListener("lookup", lookupListener);
          timings.lookup = timings.connect;
          timings.phases.dns = timings.lookup - timings.socket;
        }
        timings.phases.tcp = timings.connect - timings.lookup;
      },
      secureConnect: () => {
        timings.secureConnect = Date.now();
        timings.phases.tls = timings.secureConnect - timings.connect;
      }
    });
  };
  if (request.socket) {
    onSocket(request.socket);
  } else {
    request.prependOnceListener("socket", onSocket);
  }
  const onUpload = () => {
    timings.upload = Date.now();
    timings.phases.request = timings.upload - (timings.secureConnect ?? timings.connect);
  };
  if (request.writableFinished) {
    onUpload();
  } else {
    request.prependOnceListener("finish", onUpload);
  }
  request.prependOnceListener("response", (response) => {
    timings.response = Date.now();
    timings.phases.firstByte = timings.response - timings.upload;
    response.timings = timings;
    handleError(response);
    response.prependOnceListener("end", () => {
      request.off("abort", onAbort);
      response.off("aborted", onAbort);
      if (timings.phases.total) {
        return;
      }
      timings.end = Date.now();
      timings.phases.download = timings.end - timings.response;
      timings.phases.total = timings.end - timings.start;
    });
    response.prependOnceListener("aborted", onAbort);
  });
  return timings;
};
var source_default = timer;

// node_modules/.pnpm/cacheable-request@12.0.1/node_modules/cacheable-request/dist/index.js
init_esm_shims();
import EventEmitter from "events";
import urlLib from "url";
import crypto from "crypto";
import stream, { PassThrough as PassThroughStream } from "stream";

// node_modules/.pnpm/normalize-url@8.0.2/node_modules/normalize-url/index.js
init_esm_shims();
var DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
var DATA_URL_DEFAULT_CHARSET = "us-ascii";
var testParameter = (name, filters) => filters.some((filter) => filter instanceof RegExp ? filter.test(name) : filter === name);
var supportedProtocols = /* @__PURE__ */ new Set([
  "https:",
  "http:",
  "file:"
]);
var hasCustomProtocol = (urlString) => {
  try {
    const { protocol } = new URL(urlString);
    return protocol.endsWith(":") && !protocol.includes(".") && !supportedProtocols.has(protocol);
  } catch {
    return false;
  }
};
var normalizeDataURL = (urlString, { stripHash }) => {
  var _a;
  const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);
  if (!match) {
    throw new Error(`Invalid URL: ${urlString}`);
  }
  let { type, data, hash } = match.groups;
  const mediaType = type.split(";");
  hash = stripHash ? "" : hash;
  let isBase64 = false;
  if (mediaType[mediaType.length - 1] === "base64") {
    mediaType.pop();
    isBase64 = true;
  }
  const mimeType = ((_a = mediaType.shift()) == null ? void 0 : _a.toLowerCase()) ?? "";
  const attributes = mediaType.map((attribute) => {
    let [key, value = ""] = attribute.split("=").map((string) => string.trim());
    if (key === "charset") {
      value = value.toLowerCase();
      if (value === DATA_URL_DEFAULT_CHARSET) {
        return "";
      }
    }
    return `${key}${value ? `=${value}` : ""}`;
  }).filter(Boolean);
  const normalizedMediaType = [
    ...attributes
  ];
  if (isBase64) {
    normalizedMediaType.push("base64");
  }
  if (normalizedMediaType.length > 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) {
    normalizedMediaType.unshift(mimeType);
  }
  return `data:${normalizedMediaType.join(";")},${isBase64 ? data.trim() : data}${hash ? `#${hash}` : ""}`;
};
function normalizeUrl(urlString, options) {
  options = {
    defaultProtocol: "http",
    normalizeProtocol: true,
    forceHttp: false,
    forceHttps: false,
    stripAuthentication: true,
    stripHash: false,
    stripTextFragment: true,
    stripWWW: true,
    removeQueryParameters: [/^utm_\w+/i],
    removeTrailingSlash: true,
    removeSingleSlash: true,
    removeDirectoryIndex: false,
    removeExplicitPort: false,
    sortQueryParameters: true,
    ...options
  };
  if (typeof options.defaultProtocol === "string" && !options.defaultProtocol.endsWith(":")) {
    options.defaultProtocol = `${options.defaultProtocol}:`;
  }
  urlString = urlString.trim();
  if (/^data:/i.test(urlString)) {
    return normalizeDataURL(urlString, options);
  }
  if (hasCustomProtocol(urlString)) {
    return urlString;
  }
  const hasRelativeProtocol = urlString.startsWith("//");
  const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);
  if (!isRelativeUrl) {
    urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
  }
  const urlObject = new URL(urlString);
  if (options.forceHttp && options.forceHttps) {
    throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
  }
  if (options.forceHttp && urlObject.protocol === "https:") {
    urlObject.protocol = "http:";
  }
  if (options.forceHttps && urlObject.protocol === "http:") {
    urlObject.protocol = "https:";
  }
  if (options.stripAuthentication) {
    urlObject.username = "";
    urlObject.password = "";
  }
  if (options.stripHash) {
    urlObject.hash = "";
  } else if (options.stripTextFragment) {
    urlObject.hash = urlObject.hash.replace(/#?:~:text.*?$/i, "");
  }
  if (urlObject.pathname) {
    const protocolRegex = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
    let lastIndex = 0;
    let result = "";
    for (; ; ) {
      const match = protocolRegex.exec(urlObject.pathname);
      if (!match) {
        break;
      }
      const protocol = match[0];
      const protocolAtIndex = match.index;
      const intermediate = urlObject.pathname.slice(lastIndex, protocolAtIndex);
      result += intermediate.replace(/\/{2,}/g, "/");
      result += protocol;
      lastIndex = protocolAtIndex + protocol.length;
    }
    const remnant = urlObject.pathname.slice(lastIndex, urlObject.pathname.length);
    result += remnant.replace(/\/{2,}/g, "/");
    urlObject.pathname = result;
  }
  if (urlObject.pathname) {
    try {
      urlObject.pathname = decodeURI(urlObject.pathname).replace(/\\/g, "%5C");
    } catch {
    }
  }
  if (options.removeDirectoryIndex === true) {
    options.removeDirectoryIndex = [/^index\.[a-z]+$/];
  }
  if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
    let pathComponents = urlObject.pathname.split("/");
    const lastComponent = pathComponents[pathComponents.length - 1];
    if (testParameter(lastComponent, options.removeDirectoryIndex)) {
      pathComponents = pathComponents.slice(0, -1);
      urlObject.pathname = pathComponents.slice(1).join("/") + "/";
    }
  }
  if (urlObject.hostname) {
    urlObject.hostname = urlObject.hostname.replace(/\.$/, "");
    if (options.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(urlObject.hostname)) {
      urlObject.hostname = urlObject.hostname.replace(/^www\./, "");
    }
  }
  if (Array.isArray(options.removeQueryParameters)) {
    for (const key of [...urlObject.searchParams.keys()]) {
      if (testParameter(key, options.removeQueryParameters)) {
        urlObject.searchParams.delete(key);
      }
    }
  }
  if (!Array.isArray(options.keepQueryParameters) && options.removeQueryParameters === true) {
    urlObject.search = "";
  }
  if (Array.isArray(options.keepQueryParameters) && options.keepQueryParameters.length > 0) {
    for (const key of [...urlObject.searchParams.keys()]) {
      if (!testParameter(key, options.keepQueryParameters)) {
        urlObject.searchParams.delete(key);
      }
    }
  }
  if (options.sortQueryParameters) {
    urlObject.searchParams.sort();
    try {
      urlObject.search = decodeURIComponent(urlObject.search);
    } catch {
    }
  }
  if (options.removeTrailingSlash) {
    urlObject.pathname = urlObject.pathname.replace(/\/$/, "");
  }
  if (options.removeExplicitPort && urlObject.port) {
    urlObject.port = "";
  }
  const oldUrlString = urlString;
  urlString = urlObject.toString();
  if (!options.removeSingleSlash && urlObject.pathname === "/" && !oldUrlString.endsWith("/") && urlObject.hash === "") {
    urlString = urlString.replace(/\/$/, "");
  }
  if ((options.removeTrailingSlash || urlObject.pathname === "/") && urlObject.hash === "" && options.removeSingleSlash) {
    urlString = urlString.replace(/\/$/, "");
  }
  if (hasRelativeProtocol && !options.normalizeProtocol) {
    urlString = urlString.replace(/^http:\/\//, "//");
  }
  if (options.stripProtocol) {
    urlString = urlString.replace(/^(?:https?:)?\/\//, "");
  }
  return urlString;
}

// node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/index.js
init_esm_shims();
import { on } from "events";
import { finished } from "stream/promises";

// node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/stream.js
init_esm_shims();

// node_modules/.pnpm/is-stream@4.0.1/node_modules/is-stream/index.js
init_esm_shims();
function isStream(stream2, { checkOpen = true } = {}) {
  return stream2 !== null && typeof stream2 === "object" && (stream2.writable || stream2.readable || !checkOpen || stream2.writable === void 0 && stream2.readable === void 0) && typeof stream2.pipe === "function";
}
function isReadableStream(stream2, { checkOpen = true } = {}) {
  return isStream(stream2, { checkOpen }) && (stream2.readable || !checkOpen) && typeof stream2.read === "function" && typeof stream2.readable === "boolean" && typeof stream2.readableObjectMode === "boolean" && typeof stream2.destroy === "function" && typeof stream2.destroyed === "boolean";
}

// node_modules/.pnpm/@sec-ant+readable-stream@0.4.1/node_modules/@sec-ant/readable-stream/dist/ponyfill/index.js
init_esm_shims();

// node_modules/.pnpm/@sec-ant+readable-stream@0.4.1/node_modules/@sec-ant/readable-stream/dist/ponyfill/asyncIterator.js
init_esm_shims();
var a = Object.getPrototypeOf(
  Object.getPrototypeOf(
    /* istanbul ignore next */
    async function* () {
    }
  ).prototype
);
var c = class {
  #t;
  #n;
  #r = false;
  #e = void 0;
  constructor(e, t) {
    this.#t = e, this.#n = t;
  }
  next() {
    const e = () => this.#s();
    return this.#e = this.#e ? this.#e.then(e, e) : e(), this.#e;
  }
  return(e) {
    const t = () => this.#i(e);
    return this.#e ? this.#e.then(t, t) : t();
  }
  async #s() {
    if (this.#r)
      return {
        done: true,
        value: void 0
      };
    let e;
    try {
      e = await this.#t.read();
    } catch (t) {
      throw this.#e = void 0, this.#r = true, this.#t.releaseLock(), t;
    }
    return e.done && (this.#e = void 0, this.#r = true, this.#t.releaseLock()), e;
  }
  async #i(e) {
    if (this.#r)
      return {
        done: true,
        value: e
      };
    if (this.#r = true, !this.#n) {
      const t = this.#t.cancel(e);
      return this.#t.releaseLock(), await t, {
        done: true,
        value: e
      };
    }
    return this.#t.releaseLock(), {
      done: true,
      value: e
    };
  }
};
var n = Symbol();
function i() {
  return this[n].next();
}
Object.defineProperty(i, "name", { value: "next" });
function o(r) {
  return this[n].return(r);
}
Object.defineProperty(o, "name", { value: "return" });
var u = Object.create(a, {
  next: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: i
  },
  return: {
    enumerable: true,
    configurable: true,
    writable: true,
    value: o
  }
});
function h({ preventCancel: r = false } = {}) {
  const e = this.getReader(), t = new c(
    e,
    r
  ), s = Object.create(u);
  return s[n] = t, s;
}

// node_modules/.pnpm/@sec-ant+readable-stream@0.4.1/node_modules/@sec-ant/readable-stream/dist/ponyfill/fromAnyIterable.js
init_esm_shims();

// node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/stream.js
var getAsyncIterable = (stream2) => {
  if (isReadableStream(stream2, { checkOpen: false }) && nodeImports.on !== void 0) {
    return getStreamIterable(stream2);
  }
  if (typeof (stream2 == null ? void 0 : stream2[Symbol.asyncIterator]) === "function") {
    return stream2;
  }
  if (toString.call(stream2) === "[object ReadableStream]") {
    return h.call(stream2);
  }
  throw new TypeError("The first argument must be a Readable, a ReadableStream, or an async iterable.");
};
var { toString } = Object.prototype;
var getStreamIterable = async function* (stream2) {
  const controller = new AbortController();
  const state = {};
  handleStreamEnd(stream2, controller, state);
  try {
    for await (const [chunk2] of nodeImports.on(stream2, "data", { signal: controller.signal })) {
      yield chunk2;
    }
  } catch (error) {
    if (state.error !== void 0) {
      throw state.error;
    } else if (!controller.signal.aborted) {
      throw error;
    }
  } finally {
    stream2.destroy();
  }
};
var handleStreamEnd = async (stream2, controller, state) => {
  try {
    await nodeImports.finished(stream2, {
      cleanup: true,
      readable: true,
      writable: false,
      error: false
    });
  } catch (error) {
    state.error = error;
  } finally {
    controller.abort();
  }
};
var nodeImports = {};

// node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/exports.js
init_esm_shims();

// node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/contents.js
init_esm_shims();
var getStreamContents = async (stream2, { init: init2, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, finalize }, { maxBuffer = Number.POSITIVE_INFINITY } = {}) => {
  const asyncIterable = getAsyncIterable(stream2);
  const state = init2();
  state.length = 0;
  try {
    for await (const chunk2 of asyncIterable) {
      const chunkType = getChunkType(chunk2);
      const convertedChunk = convertChunk[chunkType](chunk2, state);
      appendChunk({
        convertedChunk,
        state,
        getSize,
        truncateChunk,
        addChunk,
        maxBuffer
      });
    }
    appendFinalChunk({
      state,
      convertChunk,
      getSize,
      truncateChunk,
      addChunk,
      getFinalChunk,
      maxBuffer
    });
    return finalize(state);
  } catch (error) {
    const normalizedError = typeof error === "object" && error !== null ? error : new Error(error);
    normalizedError.bufferedData = finalize(state);
    throw normalizedError;
  }
};
var appendFinalChunk = ({ state, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer }) => {
  const convertedChunk = getFinalChunk(state);
  if (convertedChunk !== void 0) {
    appendChunk({
      convertedChunk,
      state,
      getSize,
      truncateChunk,
      addChunk,
      maxBuffer
    });
  }
};
var appendChunk = ({ convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer }) => {
  const chunkSize = getSize(convertedChunk);
  const newLength = state.length + chunkSize;
  if (newLength <= maxBuffer) {
    addNewChunk(convertedChunk, state, addChunk, newLength);
    return;
  }
  const truncatedChunk = truncateChunk(convertedChunk, maxBuffer - state.length);
  if (truncatedChunk !== void 0) {
    addNewChunk(truncatedChunk, state, addChunk, maxBuffer);
  }
  throw new MaxBufferError();
};
var addNewChunk = (convertedChunk, state, addChunk, newLength) => {
  state.contents = addChunk(convertedChunk, state, newLength);
  state.length = newLength;
};
var getChunkType = (chunk2) => {
  var _a;
  const typeOfChunk = typeof chunk2;
  if (typeOfChunk === "string") {
    return "string";
  }
  if (typeOfChunk !== "object" || chunk2 === null) {
    return "others";
  }
  if ((_a = globalThis.Buffer) == null ? void 0 : _a.isBuffer(chunk2)) {
    return "buffer";
  }
  const prototypeName = objectToString.call(chunk2);
  if (prototypeName === "[object ArrayBuffer]") {
    return "arrayBuffer";
  }
  if (prototypeName === "[object DataView]") {
    return "dataView";
  }
  if (Number.isInteger(chunk2.byteLength) && Number.isInteger(chunk2.byteOffset) && objectToString.call(chunk2.buffer) === "[object ArrayBuffer]") {
    return "typedArray";
  }
  return "others";
};
var { toString: objectToString } = Object.prototype;
var MaxBufferError = class extends Error {
  name = "MaxBufferError";
  constructor() {
    super("maxBuffer exceeded");
  }
};

// node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/utils.js
init_esm_shims();
var noop = () => void 0;
var throwObjectStream = (chunk2) => {
  throw new Error(`Streams in object mode are not supported: ${String(chunk2)}`);
};
var getLengthProperty = (convertedChunk) => convertedChunk.length;

// node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/array-buffer.js
init_esm_shims();
async function getStreamAsArrayBuffer(stream2, options) {
  return getStreamContents(stream2, arrayBufferMethods, options);
}
var initArrayBuffer = () => ({ contents: new ArrayBuffer(0) });
var useTextEncoder = (chunk2) => textEncoder.encode(chunk2);
var textEncoder = new TextEncoder();
var useUint8Array = (chunk2) => new Uint8Array(chunk2);
var useUint8ArrayWithOffset = (chunk2) => new Uint8Array(chunk2.buffer, chunk2.byteOffset, chunk2.byteLength);
var truncateArrayBufferChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);
var addArrayBufferChunk = (convertedChunk, { contents, length: previousLength }, length) => {
  const newContents = hasArrayBufferResize() ? resizeArrayBuffer(contents, length) : resizeArrayBufferSlow(contents, length);
  new Uint8Array(newContents).set(convertedChunk, previousLength);
  return newContents;
};
var resizeArrayBufferSlow = (contents, length) => {
  if (length <= contents.byteLength) {
    return contents;
  }
  const arrayBuffer = new ArrayBuffer(getNewContentsLength(length));
  new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
  return arrayBuffer;
};
var resizeArrayBuffer = (contents, length) => {
  if (length <= contents.maxByteLength) {
    contents.resize(length);
    return contents;
  }
  const arrayBuffer = new ArrayBuffer(length, { maxByteLength: getNewContentsLength(length) });
  new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
  return arrayBuffer;
};
var getNewContentsLength = (length) => SCALE_FACTOR ** Math.ceil(Math.log(length) / Math.log(SCALE_FACTOR));
var SCALE_FACTOR = 2;
var finalizeArrayBuffer = ({ contents, length }) => hasArrayBufferResize() ? contents : contents.slice(0, length);
var hasArrayBufferResize = () => "resize" in ArrayBuffer.prototype;
var arrayBufferMethods = {
  init: initArrayBuffer,
  convertChunk: {
    string: useTextEncoder,
    buffer: useUint8Array,
    arrayBuffer: useUint8Array,
    dataView: useUint8ArrayWithOffset,
    typedArray: useUint8ArrayWithOffset,
    others: throwObjectStream
  },
  getSize: getLengthProperty,
  truncateChunk: truncateArrayBufferChunk,
  addChunk: addArrayBufferChunk,
  getFinalChunk: noop,
  finalize: finalizeArrayBuffer
};

// node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/buffer.js
init_esm_shims();
async function getStreamAsBuffer(stream2, options) {
  if (!("Buffer" in globalThis)) {
    throw new Error("getStreamAsBuffer() is only supported in Node.js");
  }
  try {
    return arrayBufferToNodeBuffer(await getStreamAsArrayBuffer(stream2, options));
  } catch (error) {
    if (error.bufferedData !== void 0) {
      error.bufferedData = arrayBufferToNodeBuffer(error.bufferedData);
    }
    throw error;
  }
}
var arrayBufferToNodeBuffer = (arrayBuffer) => globalThis.Buffer.from(arrayBuffer);

// node_modules/.pnpm/get-stream@9.0.1/node_modules/get-stream/source/index.js
Object.assign(nodeImports, { on, finished });

// node_modules/.pnpm/cacheable-request@12.0.1/node_modules/cacheable-request/dist/index.js
var import_http_cache_semantics = __toESM(require_http_cache_semantics(), 1);

// node_modules/.pnpm/responselike@3.0.0/node_modules/responselike/index.js
init_esm_shims();
import { Readable as ReadableStream2 } from "stream";

// node_modules/.pnpm/lowercase-keys@3.0.0/node_modules/lowercase-keys/index.js
init_esm_shims();
function lowercaseKeys(object) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key.toLowerCase(), value]));
}

// node_modules/.pnpm/responselike@3.0.0/node_modules/responselike/index.js
var Response = class extends ReadableStream2 {
  statusCode;
  headers;
  body;
  url;
  constructor({ statusCode, headers, body, url }) {
    if (typeof statusCode !== "number") {
      throw new TypeError("Argument `statusCode` should be a number");
    }
    if (typeof headers !== "object") {
      throw new TypeError("Argument `headers` should be an object");
    }
    if (!(body instanceof Uint8Array)) {
      throw new TypeError("Argument `body` should be a buffer");
    }
    if (typeof url !== "string") {
      throw new TypeError("Argument `url` should be a string");
    }
    super({
      read() {
        this.push(body);
        this.push(null);
      }
    });
    this.statusCode = statusCode;
    this.headers = lowercaseKeys(headers);
    this.body = body;
    this.url = url;
  }
};

// node_modules/.pnpm/cacheable-request@12.0.1/node_modules/cacheable-request/dist/index.js
var import_keyv = __toESM(require_src(), 1);

// node_modules/.pnpm/mimic-response@4.0.0/node_modules/mimic-response/index.js
init_esm_shims();
var knownProperties = [
  "aborted",
  "complete",
  "headers",
  "httpVersion",
  "httpVersionMinor",
  "httpVersionMajor",
  "method",
  "rawHeaders",
  "rawTrailers",
  "setTimeout",
  "socket",
  "statusCode",
  "statusMessage",
  "trailers",
  "url"
];
function mimicResponse(fromStream, toStream) {
  if (toStream._readableState.autoDestroy) {
    throw new Error("The second stream must have the `autoDestroy` option set to `false`");
  }
  const fromProperties = /* @__PURE__ */ new Set([...Object.keys(fromStream), ...knownProperties]);
  const properties = {};
  for (const property of fromProperties) {
    if (property in toStream) {
      continue;
    }
    properties[property] = {
      get() {
        const value = fromStream[property];
        const isFunction3 = typeof value === "function";
        return isFunction3 ? value.bind(fromStream) : value;
      },
      set(value) {
        fromStream[property] = value;
      },
      enumerable: true,
      configurable: false
    };
  }
  Object.defineProperties(toStream, properties);
  fromStream.once("aborted", () => {
    toStream.destroy();
    toStream.emit("aborted");
  });
  fromStream.once("close", () => {
    if (fromStream.complete) {
      if (toStream.readable) {
        toStream.once("end", () => {
          toStream.emit("close");
        });
      } else {
        toStream.emit("close");
      }
    } else {
      toStream.emit("close");
    }
  });
  return toStream;
}

// node_modules/.pnpm/cacheable-request@12.0.1/node_modules/cacheable-request/dist/types.js
init_esm_shims();
var RequestError2 = class extends Error {
  constructor(error) {
    super(error.message);
    Object.assign(this, error);
  }
};
var CacheError2 = class extends Error {
  constructor(error) {
    super(error.message);
    Object.assign(this, error);
  }
};

// node_modules/.pnpm/cacheable-request@12.0.1/node_modules/cacheable-request/dist/index.js
var CacheableRequest = class {
  constructor(cacheRequest, cacheAdapter) {
    this.hooks = /* @__PURE__ */ new Map();
    this.request = () => (options, callback) => {
      let url;
      if (typeof options === "string") {
        url = normalizeUrlObject(urlLib.parse(options));
        options = {};
      } else if (options instanceof urlLib.URL) {
        url = normalizeUrlObject(urlLib.parse(options.toString()));
        options = {};
      } else {
        const [pathname, ...searchParts] = (options.path ?? "").split("?");
        const search = searchParts.length > 0 ? `?${searchParts.join("?")}` : "";
        url = normalizeUrlObject({ ...options, pathname, search });
      }
      options = {
        headers: {},
        method: "GET",
        cache: true,
        strictTtl: false,
        automaticFailover: false,
        ...options,
        ...urlObjectToRequestOptions(url)
      };
      options.headers = Object.fromEntries(entries(options.headers).map(([key2, value]) => [key2.toLowerCase(), value]));
      const ee = new EventEmitter();
      const normalizedUrlString = normalizeUrl(urlLib.format(url), {
        stripWWW: false,
        // eslint-disable-line @typescript-eslint/naming-convention
        removeTrailingSlash: false,
        stripAuthentication: false
      });
      let key = `${options.method}:${normalizedUrlString}`;
      if (options.body && options.method !== void 0 && ["POST", "PATCH", "PUT"].includes(options.method)) {
        if (options.body instanceof stream.Readable) {
          options.cache = false;
        } else {
          key += `:${crypto.createHash("md5").update(options.body).digest("hex")}`;
        }
      }
      let revalidate = false;
      let madeRequest = false;
      const makeRequest = (options_) => {
        madeRequest = true;
        let requestErrored = false;
        let requestErrorCallback = () => {
        };
        const requestErrorPromise = new Promise((resolve2) => {
          requestErrorCallback = () => {
            if (!requestErrored) {
              requestErrored = true;
              resolve2();
            }
          };
        });
        const handler = async (response) => {
          if (revalidate) {
            response.status = response.statusCode;
            const revalidatedPolicy = import_http_cache_semantics.default.fromObject(revalidate.cachePolicy).revalidatedPolicy(options_, response);
            if (!revalidatedPolicy.modified) {
              response.resume();
              await new Promise((resolve2) => {
                response.once("end", resolve2);
              });
              const headers = convertHeaders(revalidatedPolicy.policy.responseHeaders());
              response = new Response({
                statusCode: revalidate.statusCode,
                headers,
                body: revalidate.body,
                url: revalidate.url
              });
              response.cachePolicy = revalidatedPolicy.policy;
              response.fromCache = true;
            }
          }
          if (!response.fromCache) {
            response.cachePolicy = new import_http_cache_semantics.default(options_, response, options_);
            response.fromCache = false;
          }
          let clonedResponse;
          if (options_.cache && response.cachePolicy.storable()) {
            clonedResponse = cloneResponse(response);
            (async () => {
              try {
                const bodyPromise = getStreamAsBuffer(response);
                await Promise.race([
                  requestErrorPromise,
                  new Promise((resolve2) => response.once("end", resolve2)),
                  // eslint-disable-line no-promise-executor-return
                  new Promise((resolve2) => response.once("close", resolve2))
                  // eslint-disable-line no-promise-executor-return
                ]);
                const body = await bodyPromise;
                let value = {
                  url: response.url,
                  statusCode: response.fromCache ? revalidate.statusCode : response.statusCode,
                  body,
                  cachePolicy: response.cachePolicy.toObject()
                };
                let ttl2 = options_.strictTtl ? response.cachePolicy.timeToLive() : void 0;
                if (options_.maxTtl) {
                  ttl2 = ttl2 ? Math.min(ttl2, options_.maxTtl) : options_.maxTtl;
                }
                if (this.hooks.size > 0) {
                  for (const key_ of this.hooks.keys()) {
                    value = await this.runHook(key_, value, response);
                  }
                }
                await this.cache.set(key, value, ttl2);
              } catch (error) {
                ee.emit("error", new CacheError2(error));
              }
            })();
          } else if (options_.cache && revalidate) {
            (async () => {
              try {
                await this.cache.delete(key);
              } catch (error) {
                ee.emit("error", new CacheError2(error));
              }
            })();
          }
          ee.emit("response", clonedResponse ?? response);
          if (typeof callback === "function") {
            callback(clonedResponse ?? response);
          }
        };
        try {
          const request_ = this.cacheRequest(options_, handler);
          request_.once("error", requestErrorCallback);
          request_.once("abort", requestErrorCallback);
          request_.once("destroy", requestErrorCallback);
          ee.emit("request", request_);
        } catch (error) {
          ee.emit("error", new RequestError2(error));
        }
      };
      (async () => {
        const get = async (options_) => {
          await Promise.resolve();
          const cacheEntry = options_.cache ? await this.cache.get(key) : void 0;
          if (cacheEntry === void 0 && !options_.forceRefresh) {
            makeRequest(options_);
            return;
          }
          const policy = import_http_cache_semantics.default.fromObject(cacheEntry.cachePolicy);
          if (policy.satisfiesWithoutRevalidation(options_) && !options_.forceRefresh) {
            const headers = convertHeaders(policy.responseHeaders());
            const response = new Response({
              statusCode: cacheEntry.statusCode,
              headers,
              body: cacheEntry.body,
              url: cacheEntry.url
            });
            response.cachePolicy = policy;
            response.fromCache = true;
            ee.emit("response", response);
            if (typeof callback === "function") {
              callback(response);
            }
          } else if (policy.satisfiesWithoutRevalidation(options_) && Date.now() >= policy.timeToLive() && options_.forceRefresh) {
            await this.cache.delete(key);
            options_.headers = policy.revalidationHeaders(options_);
            makeRequest(options_);
          } else {
            revalidate = cacheEntry;
            options_.headers = policy.revalidationHeaders(options_);
            makeRequest(options_);
          }
        };
        const errorHandler = (error) => ee.emit("error", new CacheError2(error));
        if (this.cache instanceof import_keyv.default) {
          const cachek = this.cache;
          cachek.once("error", errorHandler);
          ee.on("error", () => cachek.removeListener("error", errorHandler));
          ee.on("response", () => cachek.removeListener("error", errorHandler));
        }
        try {
          await get(options);
        } catch (error) {
          if (options.automaticFailover && !madeRequest) {
            makeRequest(options);
          }
          ee.emit("error", new CacheError2(error));
        }
      })();
      return ee;
    };
    this.addHook = (name, function_) => {
      if (!this.hooks.has(name)) {
        this.hooks.set(name, function_);
      }
    };
    this.removeHook = (name) => this.hooks.delete(name);
    this.getHook = (name) => this.hooks.get(name);
    this.runHook = async (name, ...arguments_) => {
      var _a;
      return (_a = this.hooks.get(name)) == null ? void 0 : _a(...arguments_);
    };
    if (cacheAdapter instanceof import_keyv.default) {
      this.cache = cacheAdapter;
    } else if (typeof cacheAdapter === "string") {
      this.cache = new import_keyv.default({
        uri: cacheAdapter,
        namespace: "cacheable-request"
      });
    } else {
      this.cache = new import_keyv.default({
        store: cacheAdapter,
        namespace: "cacheable-request"
      });
    }
    this.request = this.request.bind(this);
    this.cacheRequest = cacheRequest;
  }
};
var entries = Object.entries;
var cloneResponse = (response) => {
  const clone = new PassThroughStream({ autoDestroy: false });
  mimicResponse(response, clone);
  return response.pipe(clone);
};
var urlObjectToRequestOptions = (url) => {
  const options = { ...url };
  options.path = `${url.pathname || "/"}${url.search || ""}`;
  delete options.pathname;
  delete options.search;
  return options;
};
var normalizeUrlObject = (url) => (
  // If url was parsed by url.parse or new URL:
  // - hostname will be set
  // - host will be hostname[:port]
  // - port will be set if it was explicit in the parsed string
  // Otherwise, url was from request options:
  // - hostname or host may be set
  // - host shall not have port encoded
  {
    protocol: url.protocol,
    auth: url.auth,
    hostname: url.hostname || url.host || "localhost",
    port: url.port,
    pathname: url.pathname,
    search: url.search
  }
);
var convertHeaders = (headers) => {
  const result = [];
  for (const name of Object.keys(headers)) {
    result[name.toLowerCase()] = headers[name];
  }
  return result;
};
var dist_default = CacheableRequest;

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/index.js
var import_decompress_response = __toESM(require_decompress_response(), 1);

// node_modules/.pnpm/form-data-encoder@4.1.0/node_modules/form-data-encoder/lib/index.js
init_esm_shims();
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var MAX_CHUNK_SIZE = 65536;
function* chunk(value) {
  if (value.byteLength <= MAX_CHUNK_SIZE) {
    yield value;
    return;
  }
  let offset = 0;
  while (offset < value.byteLength) {
    const size = Math.min(value.byteLength - offset, MAX_CHUNK_SIZE);
    const buffer = value.buffer.slice(offset, offset + size);
    offset += buffer.byteLength;
    yield new Uint8Array(buffer);
  }
}
var alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
function createBoundary() {
  let size = 16;
  let res = "";
  while (size--) {
    res += alphabet[Math.random() * alphabet.length << 0];
  }
  return res;
}
var escapeName = (name) => String(name).replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/"/g, "%22");
var isFunction2 = (value) => typeof value === "function";
var isReadableStreamFallback = (value) => !!value && typeof value === "object" && !Array.isArray(value) && isFunction2(value.getReader);
var isAsyncIterable2 = (value) => isFunction2(value[Symbol.asyncIterator]);
async function* readStream(readable) {
  const reader = readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    yield value;
  }
}
async function* chunkStream(stream2) {
  for await (const value of stream2) {
    yield* chunk(value);
  }
}
var getStreamIterator = (source) => {
  if (isAsyncIterable2(source)) {
    return chunkStream(source);
  }
  if (isReadableStreamFallback(source)) {
    return chunkStream(readStream(source));
  }
  throw new TypeError(
    "Unsupported data source: Expected either ReadableStream or async iterable."
  );
};
var isFile = (value) => Boolean(
  value && typeof value === "object" && isFunction2(value.constructor) && value[Symbol.toStringTag] === "File" && isFunction2(value.stream) && value.name != null
);
var isFormData2 = (value) => Boolean(
  value && isFunction2(value.constructor) && value[Symbol.toStringTag] === "FormData" && isFunction2(value.append) && isFunction2(value.getAll) && isFunction2(value.entries) && isFunction2(value[Symbol.iterator])
);
var getType = (value) => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
function isPlainObject2(value) {
  var _a, _b;
  if (getType(value) !== "object") {
    return false;
  }
  const pp = Object.getPrototypeOf(value);
  if (pp === null || pp === void 0) {
    return true;
  }
  return ((_b = (_a = pp.constructor) == null ? void 0 : _a.toString) == null ? void 0 : _b.call(_a)) === Object.toString();
}
var normalizeValue = (value) => String(value).replace(/\r|\n/g, (match, i2, str) => {
  if (match === "\r" && str[i2 + 1] !== "\n" || match === "\n" && str[i2 - 1] !== "\r") {
    return "\r\n";
  }
  return match;
});
function getProperty(target, prop) {
  if (typeof prop === "string") {
    for (const [name, value] of Object.entries(target)) {
      if (prop.toLowerCase() === name.toLowerCase()) {
        return value;
      }
    }
  }
  return void 0;
}
var proxyHeaders = (object) => new Proxy(
  object,
  {
    get: (target, prop) => getProperty(target, prop),
    has: (target, prop) => getProperty(target, prop) !== void 0
  }
);
var defaultOptions = {
  enableAdditionalHeaders: false
};
var readonlyProp = { writable: false, configurable: false };
var _CRLF;
var _CRLF_BYTES;
var _CRLF_BYTES_LENGTH;
var _DASHES;
var _encoder;
var _footer;
var _form;
var _options;
var _FormDataEncoder_instances;
var getFieldHeader_fn;
var getContentLength_fn;
var FormDataEncoder = class {
  constructor(form, boundaryOrOptions, options) {
    __privateAdd(this, _FormDataEncoder_instances);
    __privateAdd(this, _CRLF, "\r\n");
    __privateAdd(this, _CRLF_BYTES);
    __privateAdd(this, _CRLF_BYTES_LENGTH);
    __privateAdd(this, _DASHES, "-".repeat(2));
    __privateAdd(this, _encoder, new TextEncoder());
    __privateAdd(this, _footer);
    __privateAdd(this, _form);
    __privateAdd(this, _options);
    if (!isFormData2(form)) {
      throw new TypeError("Expected first argument to be a FormData instance.");
    }
    let boundary;
    if (isPlainObject2(boundaryOrOptions)) {
      options = boundaryOrOptions;
    } else {
      boundary = boundaryOrOptions;
    }
    if (!boundary) {
      boundary = `form-data-encoder-${createBoundary()}`;
    }
    if (typeof boundary !== "string") {
      throw new TypeError("Expected boundary argument to be a string.");
    }
    if (options && !isPlainObject2(options)) {
      throw new TypeError("Expected options argument to be an object.");
    }
    __privateSet(this, _form, Array.from(form.entries()));
    __privateSet(this, _options, { ...defaultOptions, ...options });
    __privateSet(this, _CRLF_BYTES, __privateGet(this, _encoder).encode(__privateGet(this, _CRLF)));
    __privateSet(this, _CRLF_BYTES_LENGTH, __privateGet(this, _CRLF_BYTES).byteLength);
    this.boundary = boundary;
    this.contentType = `multipart/form-data; boundary=${this.boundary}`;
    __privateSet(this, _footer, __privateGet(this, _encoder).encode(
      `${__privateGet(this, _DASHES)}${this.boundary}${__privateGet(this, _DASHES)}${__privateGet(this, _CRLF).repeat(2)}`
    ));
    const headers = {
      "Content-Type": this.contentType
    };
    const contentLength = __privateMethod(this, _FormDataEncoder_instances, getContentLength_fn).call(this);
    if (contentLength) {
      this.contentLength = contentLength;
      headers["Content-Length"] = contentLength;
    }
    this.headers = proxyHeaders(Object.freeze(headers));
    Object.defineProperties(this, {
      boundary: readonlyProp,
      contentType: readonlyProp,
      contentLength: readonlyProp,
      headers: readonlyProp
    });
  }
  /**
   * Creates an iterator allowing to go through form-data parts (with metadata).
   * This method **will not** read the files and **will not** split values big into smaller chunks.
   *
   * Using this method, you can convert form-data content into Blob:
   *
   * @example
   *
   * ```ts
   * import {Readable} from "stream"
   *
   * import {FormDataEncoder} from "form-data-encoder"
   *
   * import {FormData} from "formdata-polyfill/esm-min.js"
   * import {fileFrom} from "fetch-blob/form.js"
   * import {File} from "fetch-blob/file.js"
   * import {Blob} from "fetch-blob"
   *
   * import fetch from "node-fetch"
   *
   * const form = new FormData()
   *
   * form.set("field", "Just a random string")
   * form.set("file", new File(["Using files is class amazing"]))
   * form.set("fileFromPath", await fileFrom("path/to/a/file.txt"))
   *
   * const encoder = new FormDataEncoder(form)
   *
   * const options = {
   *   method: "post",
   *   body: new Blob(encoder, {type: encoder.contentType})
   * }
   *
   * const response = await fetch("https://httpbin.org/post", options)
   *
   * console.log(await response.json())
   * ```
   */
  *values() {
    for (const [name, raw] of __privateGet(this, _form)) {
      const value = isFile(raw) ? raw : __privateGet(this, _encoder).encode(normalizeValue(raw));
      yield __privateMethod(this, _FormDataEncoder_instances, getFieldHeader_fn).call(this, name, value);
      yield value;
      yield __privateGet(this, _CRLF_BYTES);
    }
    yield __privateGet(this, _footer);
  }
  /**
   * Creates an async iterator allowing to perform the encoding by portions.
   * This method reads through files and splits big values into smaller pieces (65536 bytes per each).
   *
   * @example
   *
   * ```ts
   * import {Readable} from "stream"
   *
   * import {FormData, File, fileFromPath} from "formdata-node"
   * import {FormDataEncoder} from "form-data-encoder"
   *
   * import fetch from "node-fetch"
   *
   * const form = new FormData()
   *
   * form.set("field", "Just a random string")
   * form.set("file", new File(["Using files is class amazing"], "file.txt"))
   * form.set("fileFromPath", await fileFromPath("path/to/a/file.txt"))
   *
   * const encoder = new FormDataEncoder(form)
   *
   * const options = {
   *   method: "post",
   *   headers: encoder.headers,
   *   body: Readable.from(encoder.encode()) // or Readable.from(encoder)
   * }
   *
   * const response = await fetch("https://httpbin.org/post", options)
   *
   * console.log(await response.json())
   * ```
   */
  async *encode() {
    for (const part of this.values()) {
      if (isFile(part)) {
        yield* getStreamIterator(part.stream());
      } else {
        yield* chunk(part);
      }
    }
  }
  /**
   * Creates an iterator allowing to read through the encoder data using for...of loops
   */
  [Symbol.iterator]() {
    return this.values();
  }
  /**
   * Creates an **async** iterator allowing to read through the encoder data using for-await...of loops
   */
  [Symbol.asyncIterator]() {
    return this.encode();
  }
};
_CRLF = /* @__PURE__ */ new WeakMap();
_CRLF_BYTES = /* @__PURE__ */ new WeakMap();
_CRLF_BYTES_LENGTH = /* @__PURE__ */ new WeakMap();
_DASHES = /* @__PURE__ */ new WeakMap();
_encoder = /* @__PURE__ */ new WeakMap();
_footer = /* @__PURE__ */ new WeakMap();
_form = /* @__PURE__ */ new WeakMap();
_options = /* @__PURE__ */ new WeakMap();
_FormDataEncoder_instances = /* @__PURE__ */ new WeakSet();
getFieldHeader_fn = function(name, value) {
  let header = "";
  header += `${__privateGet(this, _DASHES)}${this.boundary}${__privateGet(this, _CRLF)}`;
  header += `Content-Disposition: form-data; name="${escapeName(name)}"`;
  if (isFile(value)) {
    header += `; filename="${escapeName(value.name)}"${__privateGet(this, _CRLF)}`;
    header += `Content-Type: ${value.type || "application/octet-stream"}`;
  }
  if (__privateGet(this, _options).enableAdditionalHeaders === true) {
    const size = isFile(value) ? value.size : value.byteLength;
    if (size != null && !isNaN(size)) {
      header += `${__privateGet(this, _CRLF)}Content-Length: ${size}`;
    }
  }
  return __privateGet(this, _encoder).encode(`${header}${__privateGet(this, _CRLF).repeat(2)}`);
};
getContentLength_fn = function() {
  let length = 0;
  for (const [name, raw] of __privateGet(this, _form)) {
    const value = isFile(raw) ? raw : __privateGet(this, _encoder).encode(normalizeValue(raw));
    const size = isFile(value) ? value.size : value.byteLength;
    if (size == null || isNaN(size)) {
      return void 0;
    }
    length += __privateMethod(this, _FormDataEncoder_instances, getFieldHeader_fn).call(this, name, value).byteLength;
    length += size;
    length += __privateGet(this, _CRLF_BYTES_LENGTH);
  }
  return String(length + __privateGet(this, _footer).byteLength);
};

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/utils/get-body-size.js
init_esm_shims();
import { Buffer as Buffer2 } from "buffer";
import { promisify } from "util";

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/utils/is-form-data.js
init_esm_shims();
function isFormData3(body) {
  return distribution_default.nodeStream(body) && distribution_default.function(body.getBoundary);
}

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/utils/get-body-size.js
async function getBodySize(body, headers) {
  if (headers && "content-length" in headers) {
    return Number(headers["content-length"]);
  }
  if (!body) {
    return 0;
  }
  if (distribution_default.string(body)) {
    return Buffer2.byteLength(body);
  }
  if (distribution_default.buffer(body)) {
    return body.length;
  }
  if (isFormData3(body)) {
    return promisify(body.getLength.bind(body))();
  }
  return void 0;
}

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/utils/proxy-events.js
init_esm_shims();
function proxyEvents(from, to, events) {
  const eventFunctions = {};
  for (const event of events) {
    const eventFunction = (...arguments_) => {
      to.emit(event, ...arguments_);
    };
    eventFunctions[event] = eventFunction;
    from.on(event, eventFunction);
  }
  return () => {
    for (const [event, eventFunction] of Object.entries(eventFunctions)) {
      from.off(event, eventFunction);
    }
  };
}

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/timed-out.js
init_esm_shims();
import net from "net";

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/utils/unhandle.js
init_esm_shims();
function unhandle() {
  const handlers = [];
  return {
    once(origin, event, function_) {
      origin.once(event, function_);
      handlers.push({ origin, event, fn: function_ });
    },
    unhandleAll() {
      for (const handler of handlers) {
        const { origin, event, fn } = handler;
        origin.removeListener(event, fn);
      }
      handlers.length = 0;
    }
  };
}

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/timed-out.js
var reentry = Symbol("reentry");
var noop2 = () => {
};
var TimeoutError2 = class extends Error {
  event;
  code;
  constructor(threshold, event) {
    super(`Timeout awaiting '${event}' for ${threshold}ms`);
    this.event = event;
    this.name = "TimeoutError";
    this.code = "ETIMEDOUT";
  }
};
function timedOut(request, delays, options) {
  if (reentry in request) {
    return noop2;
  }
  request[reentry] = true;
  const cancelers = [];
  const { once, unhandleAll } = unhandle();
  const handled = /* @__PURE__ */ new Map();
  const addTimeout = (delay2, callback, event) => {
    var _a;
    const timeout = setTimeout(callback, delay2, delay2, event);
    (_a = timeout.unref) == null ? void 0 : _a.call(timeout);
    const cancel = () => {
      handled.set(event, true);
      clearTimeout(timeout);
    };
    cancelers.push(cancel);
    return cancel;
  };
  const { host, hostname } = options;
  const timeoutHandler = (delay2, event) => {
    setTimeout(() => {
      if (!handled.has(event)) {
        request.destroy(new TimeoutError2(delay2, event));
      }
    }, 0);
  };
  const cancelTimeouts = () => {
    for (const cancel of cancelers) {
      cancel();
    }
    unhandleAll();
  };
  request.once("error", (error) => {
    cancelTimeouts();
    if (request.listenerCount("error") === 0) {
      throw error;
    }
  });
  if (delays.request !== void 0) {
    const cancelTimeout = addTimeout(delays.request, timeoutHandler, "request");
    once(request, "response", (response) => {
      once(response, "end", cancelTimeout);
    });
  }
  if (delays.socket !== void 0) {
    const { socket } = delays;
    const socketTimeoutHandler = () => {
      timeoutHandler(socket, "socket");
    };
    request.setTimeout(socket, socketTimeoutHandler);
    cancelers.push(() => {
      request.removeListener("timeout", socketTimeoutHandler);
    });
  }
  const hasLookup = delays.lookup !== void 0;
  const hasConnect = delays.connect !== void 0;
  const hasSecureConnect = delays.secureConnect !== void 0;
  const hasSend = delays.send !== void 0;
  if (hasLookup || hasConnect || hasSecureConnect || hasSend) {
    once(request, "socket", (socket) => {
      const { socketPath } = request;
      if (socket.connecting) {
        const hasPath = Boolean(socketPath ?? net.isIP(hostname ?? host ?? "") !== 0);
        if (hasLookup && !hasPath && socket.address().address === void 0) {
          const cancelTimeout = addTimeout(delays.lookup, timeoutHandler, "lookup");
          once(socket, "lookup", cancelTimeout);
        }
        if (hasConnect) {
          const timeConnect = () => addTimeout(delays.connect, timeoutHandler, "connect");
          if (hasPath) {
            once(socket, "connect", timeConnect());
          } else {
            once(socket, "lookup", (error) => {
              if (error === null) {
                once(socket, "connect", timeConnect());
              }
            });
          }
        }
        if (hasSecureConnect && options.protocol === "https:") {
          once(socket, "connect", () => {
            const cancelTimeout = addTimeout(delays.secureConnect, timeoutHandler, "secureConnect");
            once(socket, "secureConnect", cancelTimeout);
          });
        }
      }
      if (hasSend) {
        const timeRequest = () => addTimeout(delays.send, timeoutHandler, "send");
        if (socket.connecting) {
          once(socket, "connect", () => {
            once(request, "upload-complete", timeRequest());
          });
        } else {
          once(request, "upload-complete", timeRequest());
        }
      }
    });
  }
  if (delays.response !== void 0) {
    once(request, "upload-complete", () => {
      const cancelTimeout = addTimeout(delays.response, timeoutHandler, "response");
      once(request, "response", cancelTimeout);
    });
  }
  if (delays.read !== void 0) {
    once(request, "response", (response) => {
      const cancelTimeout = addTimeout(delays.read, timeoutHandler, "read");
      once(response, "end", cancelTimeout);
    });
  }
  return cancelTimeouts;
}

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/utils/url-to-options.js
init_esm_shims();
function urlToOptions(url) {
  url = url;
  const options = {
    protocol: url.protocol,
    hostname: distribution_default.string(url.hostname) && url.hostname.startsWith("[") ? url.hostname.slice(1, -1) : url.hostname,
    host: url.host,
    hash: url.hash,
    search: url.search,
    pathname: url.pathname,
    href: url.href,
    path: `${url.pathname || ""}${url.search || ""}`
  };
  if (distribution_default.string(url.port) && url.port.length > 0) {
    options.port = Number(url.port);
  }
  if (url.username || url.password) {
    options.auth = `${url.username || ""}:${url.password || ""}`;
  }
  return options;
}

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/utils/weakable-map.js
init_esm_shims();
var WeakableMap = class {
  weakMap;
  map;
  constructor() {
    this.weakMap = /* @__PURE__ */ new WeakMap();
    this.map = /* @__PURE__ */ new Map();
  }
  set(key, value) {
    if (typeof key === "object") {
      this.weakMap.set(key, value);
    } else {
      this.map.set(key, value);
    }
  }
  get(key) {
    if (typeof key === "object") {
      return this.weakMap.get(key);
    }
    return this.map.get(key);
  }
  has(key) {
    if (typeof key === "object") {
      return this.weakMap.has(key);
    }
    return this.map.has(key);
  }
};

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/calculate-retry-delay.js
init_esm_shims();
var calculateRetryDelay = ({ attemptCount, retryOptions, error, retryAfter, computedValue }) => {
  if (error.name === "RetryError") {
    return 1;
  }
  if (attemptCount > retryOptions.limit) {
    return 0;
  }
  const hasMethod = retryOptions.methods.includes(error.options.method);
  const hasErrorCode = retryOptions.errorCodes.includes(error.code);
  const hasStatusCode = error.response && retryOptions.statusCodes.includes(error.response.statusCode);
  if (!hasMethod || !hasErrorCode && !hasStatusCode) {
    return 0;
  }
  if (error.response) {
    if (retryAfter) {
      if (retryAfter > computedValue) {
        return 0;
      }
      return retryAfter;
    }
    if (error.response.statusCode === 413) {
      return 0;
    }
  }
  const noise = Math.random() * retryOptions.noise;
  return Math.min(2 ** (attemptCount - 1) * 1e3, retryOptions.backoffLimit) + noise;
};
var calculate_retry_delay_default = calculateRetryDelay;

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/options.js
init_esm_shims();
import process2 from "process";
import { promisify as promisify3, inspect } from "util";
import { checkServerIdentity } from "tls";
import https from "https";
import http from "http";

// node_modules/.pnpm/cacheable-lookup@7.0.0/node_modules/cacheable-lookup/source/index.js
init_esm_shims();
import {
  V4MAPPED,
  ADDRCONFIG,
  ALL,
  promises as dnsPromises,
  lookup as dnsLookup
} from "dns";
import { promisify as promisify2 } from "util";
import os2 from "os";
var { Resolver: AsyncResolver } = dnsPromises;
var kCacheableLookupCreateConnection = Symbol("cacheableLookupCreateConnection");
var kCacheableLookupInstance = Symbol("cacheableLookupInstance");
var kExpires = Symbol("expires");
var supportsALL = typeof ALL === "number";
var verifyAgent = (agent) => {
  if (!(agent && typeof agent.createConnection === "function")) {
    throw new Error("Expected an Agent instance as the first argument");
  }
};
var map4to6 = (entries2) => {
  for (const entry of entries2) {
    if (entry.family === 6) {
      continue;
    }
    entry.address = `::ffff:${entry.address}`;
    entry.family = 6;
  }
};
var getIfaceInfo = () => {
  let has4 = false;
  let has6 = false;
  for (const device of Object.values(os2.networkInterfaces())) {
    for (const iface of device) {
      if (iface.internal) {
        continue;
      }
      if (iface.family === "IPv6") {
        has6 = true;
      } else {
        has4 = true;
      }
      if (has4 && has6) {
        return { has4, has6 };
      }
    }
  }
  return { has4, has6 };
};
var isIterable2 = (map) => {
  return Symbol.iterator in map;
};
var ignoreNoResultErrors = (dnsPromise) => {
  return dnsPromise.catch((error) => {
    if (error.code === "ENODATA" || error.code === "ENOTFOUND" || error.code === "ENOENT") {
      return [];
    }
    throw error;
  });
};
var ttl = { ttl: true };
var all = { all: true };
var all4 = { all: true, family: 4 };
var all6 = { all: true, family: 6 };
var CacheableLookup = class {
  constructor({
    cache = /* @__PURE__ */ new Map(),
    maxTtl = Infinity,
    fallbackDuration = 3600,
    errorTtl = 0.15,
    resolver = new AsyncResolver(),
    lookup = dnsLookup
  } = {}) {
    this.maxTtl = maxTtl;
    this.errorTtl = errorTtl;
    this._cache = cache;
    this._resolver = resolver;
    this._dnsLookup = lookup && promisify2(lookup);
    this.stats = {
      cache: 0,
      query: 0
    };
    if (this._resolver instanceof AsyncResolver) {
      this._resolve4 = this._resolver.resolve4.bind(this._resolver);
      this._resolve6 = this._resolver.resolve6.bind(this._resolver);
    } else {
      this._resolve4 = promisify2(this._resolver.resolve4.bind(this._resolver));
      this._resolve6 = promisify2(this._resolver.resolve6.bind(this._resolver));
    }
    this._iface = getIfaceInfo();
    this._pending = {};
    this._nextRemovalTime = false;
    this._hostnamesToFallback = /* @__PURE__ */ new Set();
    this.fallbackDuration = fallbackDuration;
    if (fallbackDuration > 0) {
      const interval = setInterval(() => {
        this._hostnamesToFallback.clear();
      }, fallbackDuration * 1e3);
      if (interval.unref) {
        interval.unref();
      }
      this._fallbackInterval = interval;
    }
    this.lookup = this.lookup.bind(this);
    this.lookupAsync = this.lookupAsync.bind(this);
  }
  set servers(servers) {
    this.clear();
    this._resolver.setServers(servers);
  }
  get servers() {
    return this._resolver.getServers();
  }
  lookup(hostname, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    } else if (typeof options === "number") {
      options = {
        family: options
      };
    }
    if (!callback) {
      throw new Error("Callback must be a function.");
    }
    this.lookupAsync(hostname, options).then((result) => {
      if (options.all) {
        callback(null, result);
      } else {
        callback(null, result.address, result.family, result.expires, result.ttl, result.source);
      }
    }, callback);
  }
  async lookupAsync(hostname, options = {}) {
    if (typeof options === "number") {
      options = {
        family: options
      };
    }
    let cached = await this.query(hostname);
    if (options.family === 6) {
      const filtered = cached.filter((entry) => entry.family === 6);
      if (options.hints & V4MAPPED) {
        if (supportsALL && options.hints & ALL || filtered.length === 0) {
          map4to6(cached);
        } else {
          cached = filtered;
        }
      } else {
        cached = filtered;
      }
    } else if (options.family === 4) {
      cached = cached.filter((entry) => entry.family === 4);
    }
    if (options.hints & ADDRCONFIG) {
      const { _iface } = this;
      cached = cached.filter((entry) => entry.family === 6 ? _iface.has6 : _iface.has4);
    }
    if (cached.length === 0) {
      const error = new Error(`cacheableLookup ENOTFOUND ${hostname}`);
      error.code = "ENOTFOUND";
      error.hostname = hostname;
      throw error;
    }
    if (options.all) {
      return cached;
    }
    return cached[0];
  }
  async query(hostname) {
    let source = "cache";
    let cached = await this._cache.get(hostname);
    if (cached) {
      this.stats.cache++;
    }
    if (!cached) {
      const pending = this._pending[hostname];
      if (pending) {
        this.stats.cache++;
        cached = await pending;
      } else {
        source = "query";
        const newPromise = this.queryAndCache(hostname);
        this._pending[hostname] = newPromise;
        this.stats.query++;
        try {
          cached = await newPromise;
        } finally {
          delete this._pending[hostname];
        }
      }
    }
    cached = cached.map((entry) => {
      return { ...entry, source };
    });
    return cached;
  }
  async _resolve(hostname) {
    const [A, AAAA] = await Promise.all([
      ignoreNoResultErrors(this._resolve4(hostname, ttl)),
      ignoreNoResultErrors(this._resolve6(hostname, ttl))
    ]);
    let aTtl = 0;
    let aaaaTtl = 0;
    let cacheTtl = 0;
    const now = Date.now();
    for (const entry of A) {
      entry.family = 4;
      entry.expires = now + entry.ttl * 1e3;
      aTtl = Math.max(aTtl, entry.ttl);
    }
    for (const entry of AAAA) {
      entry.family = 6;
      entry.expires = now + entry.ttl * 1e3;
      aaaaTtl = Math.max(aaaaTtl, entry.ttl);
    }
    if (A.length > 0) {
      if (AAAA.length > 0) {
        cacheTtl = Math.min(aTtl, aaaaTtl);
      } else {
        cacheTtl = aTtl;
      }
    } else {
      cacheTtl = aaaaTtl;
    }
    return {
      entries: [
        ...A,
        ...AAAA
      ],
      cacheTtl
    };
  }
  async _lookup(hostname) {
    try {
      const [A, AAAA] = await Promise.all([
        // Passing {all: true} doesn't return all IPv4 and IPv6 entries.
        // See https://github.com/szmarczak/cacheable-lookup/issues/42
        ignoreNoResultErrors(this._dnsLookup(hostname, all4)),
        ignoreNoResultErrors(this._dnsLookup(hostname, all6))
      ]);
      return {
        entries: [
          ...A,
          ...AAAA
        ],
        cacheTtl: 0
      };
    } catch {
      return {
        entries: [],
        cacheTtl: 0
      };
    }
  }
  async _set(hostname, data, cacheTtl) {
    if (this.maxTtl > 0 && cacheTtl > 0) {
      cacheTtl = Math.min(cacheTtl, this.maxTtl) * 1e3;
      data[kExpires] = Date.now() + cacheTtl;
      try {
        await this._cache.set(hostname, data, cacheTtl);
      } catch (error) {
        this.lookupAsync = async () => {
          const cacheError = new Error("Cache Error. Please recreate the CacheableLookup instance.");
          cacheError.cause = error;
          throw cacheError;
        };
      }
      if (isIterable2(this._cache)) {
        this._tick(cacheTtl);
      }
    }
  }
  async queryAndCache(hostname) {
    if (this._hostnamesToFallback.has(hostname)) {
      return this._dnsLookup(hostname, all);
    }
    let query = await this._resolve(hostname);
    if (query.entries.length === 0 && this._dnsLookup) {
      query = await this._lookup(hostname);
      if (query.entries.length !== 0 && this.fallbackDuration > 0) {
        this._hostnamesToFallback.add(hostname);
      }
    }
    const cacheTtl = query.entries.length === 0 ? this.errorTtl : query.cacheTtl;
    await this._set(hostname, query.entries, cacheTtl);
    return query.entries;
  }
  _tick(ms) {
    const nextRemovalTime = this._nextRemovalTime;
    if (!nextRemovalTime || ms < nextRemovalTime) {
      clearTimeout(this._removalTimeout);
      this._nextRemovalTime = ms;
      this._removalTimeout = setTimeout(() => {
        this._nextRemovalTime = false;
        let nextExpiry = Infinity;
        const now = Date.now();
        for (const [hostname, entries2] of this._cache) {
          const expires = entries2[kExpires];
          if (now >= expires) {
            this._cache.delete(hostname);
          } else if (expires < nextExpiry) {
            nextExpiry = expires;
          }
        }
        if (nextExpiry !== Infinity) {
          this._tick(nextExpiry - now);
        }
      }, ms);
      if (this._removalTimeout.unref) {
        this._removalTimeout.unref();
      }
    }
  }
  install(agent) {
    verifyAgent(agent);
    if (kCacheableLookupCreateConnection in agent) {
      throw new Error("CacheableLookup has been already installed");
    }
    agent[kCacheableLookupCreateConnection] = agent.createConnection;
    agent[kCacheableLookupInstance] = this;
    agent.createConnection = (options, callback) => {
      if (!("lookup" in options)) {
        options.lookup = this.lookup;
      }
      return agent[kCacheableLookupCreateConnection](options, callback);
    };
  }
  uninstall(agent) {
    verifyAgent(agent);
    if (agent[kCacheableLookupCreateConnection]) {
      if (agent[kCacheableLookupInstance] !== this) {
        throw new Error("The agent is not owned by this CacheableLookup instance");
      }
      agent.createConnection = agent[kCacheableLookupCreateConnection];
      delete agent[kCacheableLookupCreateConnection];
      delete agent[kCacheableLookupInstance];
    }
  }
  updateInterfaceInfo() {
    const { _iface } = this;
    this._iface = getIfaceInfo();
    if (_iface.has4 && !this._iface.has4 || _iface.has6 && !this._iface.has6) {
      this._cache.clear();
    }
  }
  clear(hostname) {
    if (hostname) {
      this._cache.delete(hostname);
      return;
    }
    this._cache.clear();
  }
};

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/options.js
var import_http2_wrapper = __toESM(require_source2(), 1);

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/parse-link-header.js
init_esm_shims();
function parseLinkHeader(link) {
  const parsed = [];
  const items = link.split(",");
  for (const item of items) {
    const [rawUriReference, ...rawLinkParameters] = item.split(";");
    const trimmedUriReference = rawUriReference.trim();
    if (trimmedUriReference[0] !== "<" || trimmedUriReference.at(-1) !== ">") {
      throw new Error(`Invalid format of the Link header reference: ${trimmedUriReference}`);
    }
    const reference = trimmedUriReference.slice(1, -1);
    const parameters = {};
    if (rawLinkParameters.length === 0) {
      throw new Error(`Unexpected end of Link header parameters: ${rawLinkParameters.join(";")}`);
    }
    for (const rawParameter of rawLinkParameters) {
      const trimmedRawParameter = rawParameter.trim();
      const center = trimmedRawParameter.indexOf("=");
      if (center === -1) {
        throw new Error(`Failed to parse Link header: ${link}`);
      }
      const name = trimmedRawParameter.slice(0, center).trim();
      const value = trimmedRawParameter.slice(center + 1).trim();
      parameters[name] = value;
    }
    parsed.push({
      reference,
      parameters
    });
  }
  return parsed;
}

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/options.js
var [major, minor] = process2.versions.node.split(".").map(Number);
function validateSearchParameters(searchParameters) {
  for (const key in searchParameters) {
    const value = searchParameters[key];
    assert.any([distribution_default.string, distribution_default.number, distribution_default.boolean, distribution_default.null, distribution_default.undefined], value);
  }
}
var globalCache = /* @__PURE__ */ new Map();
var globalDnsCache;
var getGlobalDnsCache = () => {
  if (globalDnsCache) {
    return globalDnsCache;
  }
  globalDnsCache = new CacheableLookup();
  return globalDnsCache;
};
var defaultInternals = {
  request: void 0,
  agent: {
    http: void 0,
    https: void 0,
    http2: void 0
  },
  h2session: void 0,
  decompress: true,
  timeout: {
    connect: void 0,
    lookup: void 0,
    read: void 0,
    request: void 0,
    response: void 0,
    secureConnect: void 0,
    send: void 0,
    socket: void 0
  },
  prefixUrl: "",
  body: void 0,
  form: void 0,
  json: void 0,
  cookieJar: void 0,
  ignoreInvalidCookies: false,
  searchParams: void 0,
  dnsLookup: void 0,
  dnsCache: void 0,
  context: {},
  hooks: {
    init: [],
    beforeRequest: [],
    beforeError: [],
    beforeRedirect: [],
    beforeRetry: [],
    afterResponse: []
  },
  followRedirect: true,
  maxRedirects: 10,
  cache: void 0,
  throwHttpErrors: true,
  username: "",
  password: "",
  http2: false,
  allowGetBody: false,
  headers: {
    "user-agent": "got (https://github.com/sindresorhus/got)"
  },
  methodRewriting: false,
  dnsLookupIpVersion: void 0,
  parseJson: JSON.parse,
  stringifyJson: JSON.stringify,
  retry: {
    limit: 2,
    methods: [
      "GET",
      "PUT",
      "HEAD",
      "DELETE",
      "OPTIONS",
      "TRACE"
    ],
    statusCodes: [
      408,
      413,
      429,
      500,
      502,
      503,
      504,
      521,
      522,
      524
    ],
    errorCodes: [
      "ETIMEDOUT",
      "ECONNRESET",
      "EADDRINUSE",
      "ECONNREFUSED",
      "EPIPE",
      "ENOTFOUND",
      "ENETUNREACH",
      "EAI_AGAIN"
    ],
    maxRetryAfter: void 0,
    calculateDelay: ({ computedValue }) => computedValue,
    backoffLimit: Number.POSITIVE_INFINITY,
    noise: 100
  },
  localAddress: void 0,
  method: "GET",
  createConnection: void 0,
  cacheOptions: {
    shared: void 0,
    cacheHeuristic: void 0,
    immutableMinTimeToLive: void 0,
    ignoreCargoCult: void 0
  },
  https: {
    alpnProtocols: void 0,
    rejectUnauthorized: void 0,
    checkServerIdentity: void 0,
    certificateAuthority: void 0,
    key: void 0,
    certificate: void 0,
    passphrase: void 0,
    pfx: void 0,
    ciphers: void 0,
    honorCipherOrder: void 0,
    minVersion: void 0,
    maxVersion: void 0,
    signatureAlgorithms: void 0,
    tlsSessionLifetime: void 0,
    dhparam: void 0,
    ecdhCurve: void 0,
    certificateRevocationLists: void 0
  },
  encoding: void 0,
  resolveBodyOnly: false,
  isStream: false,
  responseType: "text",
  url: void 0,
  pagination: {
    transform(response) {
      if (response.request.options.responseType === "json") {
        return response.body;
      }
      return JSON.parse(response.body);
    },
    paginate({ response }) {
      const rawLinkHeader = response.headers.link;
      if (typeof rawLinkHeader !== "string" || rawLinkHeader.trim() === "") {
        return false;
      }
      const parsed = parseLinkHeader(rawLinkHeader);
      const next = parsed.find((entry) => entry.parameters.rel === "next" || entry.parameters.rel === '"next"');
      if (next) {
        return {
          url: new URL(next.reference, response.url)
        };
      }
      return false;
    },
    filter: () => true,
    shouldContinue: () => true,
    countLimit: Number.POSITIVE_INFINITY,
    backoff: 0,
    requestLimit: 1e4,
    stackAllItems: false
  },
  setHost: true,
  maxHeaderSize: void 0,
  signal: void 0,
  enableUnixSockets: false
};
var cloneInternals = (internals) => {
  const { hooks, retry } = internals;
  const result = {
    ...internals,
    context: { ...internals.context },
    cacheOptions: { ...internals.cacheOptions },
    https: { ...internals.https },
    agent: { ...internals.agent },
    headers: { ...internals.headers },
    retry: {
      ...retry,
      errorCodes: [...retry.errorCodes],
      methods: [...retry.methods],
      statusCodes: [...retry.statusCodes]
    },
    timeout: { ...internals.timeout },
    hooks: {
      init: [...hooks.init],
      beforeRequest: [...hooks.beforeRequest],
      beforeError: [...hooks.beforeError],
      beforeRedirect: [...hooks.beforeRedirect],
      beforeRetry: [...hooks.beforeRetry],
      afterResponse: [...hooks.afterResponse]
    },
    searchParams: internals.searchParams ? new URLSearchParams(internals.searchParams) : void 0,
    pagination: { ...internals.pagination }
  };
  if (result.url !== void 0) {
    result.prefixUrl = "";
  }
  return result;
};
var cloneRaw = (raw) => {
  const { hooks, retry } = raw;
  const result = { ...raw };
  if (distribution_default.object(raw.context)) {
    result.context = { ...raw.context };
  }
  if (distribution_default.object(raw.cacheOptions)) {
    result.cacheOptions = { ...raw.cacheOptions };
  }
  if (distribution_default.object(raw.https)) {
    result.https = { ...raw.https };
  }
  if (distribution_default.object(raw.cacheOptions)) {
    result.cacheOptions = { ...result.cacheOptions };
  }
  if (distribution_default.object(raw.agent)) {
    result.agent = { ...raw.agent };
  }
  if (distribution_default.object(raw.headers)) {
    result.headers = { ...raw.headers };
  }
  if (distribution_default.object(retry)) {
    result.retry = { ...retry };
    if (distribution_default.array(retry.errorCodes)) {
      result.retry.errorCodes = [...retry.errorCodes];
    }
    if (distribution_default.array(retry.methods)) {
      result.retry.methods = [...retry.methods];
    }
    if (distribution_default.array(retry.statusCodes)) {
      result.retry.statusCodes = [...retry.statusCodes];
    }
  }
  if (distribution_default.object(raw.timeout)) {
    result.timeout = { ...raw.timeout };
  }
  if (distribution_default.object(hooks)) {
    result.hooks = {
      ...hooks
    };
    if (distribution_default.array(hooks.init)) {
      result.hooks.init = [...hooks.init];
    }
    if (distribution_default.array(hooks.beforeRequest)) {
      result.hooks.beforeRequest = [...hooks.beforeRequest];
    }
    if (distribution_default.array(hooks.beforeError)) {
      result.hooks.beforeError = [...hooks.beforeError];
    }
    if (distribution_default.array(hooks.beforeRedirect)) {
      result.hooks.beforeRedirect = [...hooks.beforeRedirect];
    }
    if (distribution_default.array(hooks.beforeRetry)) {
      result.hooks.beforeRetry = [...hooks.beforeRetry];
    }
    if (distribution_default.array(hooks.afterResponse)) {
      result.hooks.afterResponse = [...hooks.afterResponse];
    }
  }
  if (distribution_default.object(raw.pagination)) {
    result.pagination = { ...raw.pagination };
  }
  return result;
};
var getHttp2TimeoutOption = (internals) => {
  const delays = [internals.timeout.socket, internals.timeout.connect, internals.timeout.lookup, internals.timeout.request, internals.timeout.secureConnect].filter((delay2) => typeof delay2 === "number");
  if (delays.length > 0) {
    return Math.min(...delays);
  }
  return void 0;
};
var init = (options, withOptions, self) => {
  var _a;
  const initHooks = (_a = options.hooks) == null ? void 0 : _a.init;
  if (initHooks) {
    for (const hook of initHooks) {
      hook(withOptions, self);
    }
  }
};
var Options = class _Options {
  _unixOptions;
  _internals;
  _merging;
  _init;
  constructor(input, options, defaults2) {
    assert.any([distribution_default.string, distribution_default.urlInstance, distribution_default.object, distribution_default.undefined], input);
    assert.any([distribution_default.object, distribution_default.undefined], options);
    assert.any([distribution_default.object, distribution_default.undefined], defaults2);
    if (input instanceof _Options || options instanceof _Options) {
      throw new TypeError("The defaults must be passed as the third argument");
    }
    this._internals = cloneInternals((defaults2 == null ? void 0 : defaults2._internals) ?? defaults2 ?? defaultInternals);
    this._init = [...(defaults2 == null ? void 0 : defaults2._init) ?? []];
    this._merging = false;
    this._unixOptions = void 0;
    try {
      if (distribution_default.plainObject(input)) {
        try {
          this.merge(input);
          this.merge(options);
        } finally {
          this.url = input.url;
        }
      } else {
        try {
          this.merge(options);
        } finally {
          if ((options == null ? void 0 : options.url) !== void 0) {
            if (input === void 0) {
              this.url = options.url;
            } else {
              throw new TypeError("The `url` option is mutually exclusive with the `input` argument");
            }
          } else if (input !== void 0) {
            this.url = input;
          }
        }
      }
    } catch (error) {
      error.options = this;
      throw error;
    }
  }
  merge(options) {
    if (!options) {
      return;
    }
    if (options instanceof _Options) {
      for (const init2 of options._init) {
        this.merge(init2);
      }
      return;
    }
    options = cloneRaw(options);
    init(this, options, this);
    init(options, options, this);
    this._merging = true;
    if ("isStream" in options) {
      this.isStream = options.isStream;
    }
    try {
      let push = false;
      for (const key in options) {
        if (key === "mutableDefaults" || key === "handlers") {
          continue;
        }
        if (key === "url") {
          continue;
        }
        if (!(key in this)) {
          throw new Error(`Unexpected option: ${key}`);
        }
        const value = options[key];
        if (value === void 0) {
          continue;
        }
        this[key] = value;
        push = true;
      }
      if (push) {
        this._init.push(options);
      }
    } finally {
      this._merging = false;
    }
  }
  /**
      Custom request function.
      The main purpose of this is to [support HTTP2 using a wrapper](https://github.com/szmarczak/http2-wrapper).
  
      @default http.request | https.request
      */
  get request() {
    return this._internals.request;
  }
  set request(value) {
    assert.any([distribution_default.function, distribution_default.undefined], value);
    this._internals.request = value;
  }
  /**
      An object representing `http`, `https` and `http2` keys for [`http.Agent`](https://nodejs.org/api/http.html#http_class_http_agent), [`https.Agent`](https://nodejs.org/api/https.html#https_class_https_agent) and [`http2wrapper.Agent`](https://github.com/szmarczak/http2-wrapper#new-http2agentoptions) instance.
      This is necessary because a request to one protocol might redirect to another.
      In such a scenario, Got will switch over to the right protocol agent for you.
  
      If a key is not present, it will default to a global agent.
  
      @example
      ```
      import got from 'got';
      import HttpAgent from 'agentkeepalive';
  
      const {HttpsAgent} = HttpAgent;
  
      await got('https://sindresorhus.com', {
          agent: {
              http: new HttpAgent(),
              https: new HttpsAgent()
          }
      });
      ```
      */
  get agent() {
    return this._internals.agent;
  }
  set agent(value) {
    assert.plainObject(value);
    for (const key in value) {
      if (!(key in this._internals.agent)) {
        throw new TypeError(`Unexpected agent option: ${key}`);
      }
      assert.any([distribution_default.object, distribution_default.undefined], value[key]);
    }
    if (this._merging) {
      Object.assign(this._internals.agent, value);
    } else {
      this._internals.agent = { ...value };
    }
  }
  get h2session() {
    return this._internals.h2session;
  }
  set h2session(value) {
    this._internals.h2session = value;
  }
  /**
      Decompress the response automatically.
  
      This will set the `accept-encoding` header to `gzip, deflate, br` unless you set it yourself.
  
      If this is disabled, a compressed response is returned as a `Buffer`.
      This may be useful if you want to handle decompression yourself or stream the raw compressed data.
  
      @default true
      */
  get decompress() {
    return this._internals.decompress;
  }
  set decompress(value) {
    assert.boolean(value);
    this._internals.decompress = value;
  }
  /**
      Milliseconds to wait for the server to end the response before aborting the request with `got.TimeoutError` error (a.k.a. `request` property).
      By default, there's no timeout.
  
      This also accepts an `object` with the following fields to constrain the duration of each phase of the request lifecycle:
  
      - `lookup` starts when a socket is assigned and ends when the hostname has been resolved.
          Does not apply when using a Unix domain socket.
      - `connect` starts when `lookup` completes (or when the socket is assigned if lookup does not apply to the request) and ends when the socket is connected.
      - `secureConnect` starts when `connect` completes and ends when the handshaking process completes (HTTPS only).
      - `socket` starts when the socket is connected. See [request.setTimeout](https://nodejs.org/api/http.html#http_request_settimeout_timeout_callback).
      - `response` starts when the request has been written to the socket and ends when the response headers are received.
      - `send` starts when the socket is connected and ends with the request has been written to the socket.
      - `request` starts when the request is initiated and ends when the response's end event fires.
      */
  get timeout() {
    return this._internals.timeout;
  }
  set timeout(value) {
    assert.plainObject(value);
    for (const key in value) {
      if (!(key in this._internals.timeout)) {
        throw new Error(`Unexpected timeout option: ${key}`);
      }
      assert.any([distribution_default.number, distribution_default.undefined], value[key]);
    }
    if (this._merging) {
      Object.assign(this._internals.timeout, value);
    } else {
      this._internals.timeout = { ...value };
    }
  }
  /**
      When specified, `prefixUrl` will be prepended to `url`.
      The prefix can be any valid URL, either relative or absolute.
      A trailing slash `/` is optional - one will be added automatically.
  
      __Note__: `prefixUrl` will be ignored if the `url` argument is a URL instance.
  
      __Note__: Leading slashes in `input` are disallowed when using this option to enforce consistency and avoid confusion.
      For example, when the prefix URL is `https://example.com/foo` and the input is `/bar`, there's ambiguity whether the resulting URL would become `https://example.com/foo/bar` or `https://example.com/bar`.
      The latter is used by browsers.
  
      __Tip__: Useful when used with `got.extend()` to create niche-specific Got instances.
  
      __Tip__: You can change `prefixUrl` using hooks as long as the URL still includes the `prefixUrl`.
      If the URL doesn't include it anymore, it will throw.
  
      @example
      ```
      import got from 'got';
  
      await got('unicorn', {prefixUrl: 'https://cats.com'});
      //=> 'https://cats.com/unicorn'
  
      const instance = got.extend({
          prefixUrl: 'https://google.com'
      });
  
      await instance('unicorn', {
          hooks: {
              beforeRequest: [
                  options => {
                      options.prefixUrl = 'https://cats.com';
                  }
              ]
          }
      });
      //=> 'https://cats.com/unicorn'
      ```
      */
  get prefixUrl() {
    return this._internals.prefixUrl;
  }
  set prefixUrl(value) {
    assert.any([distribution_default.string, distribution_default.urlInstance], value);
    if (value === "") {
      this._internals.prefixUrl = "";
      return;
    }
    value = value.toString();
    if (!value.endsWith("/")) {
      value += "/";
    }
    if (this._internals.prefixUrl && this._internals.url) {
      const { href } = this._internals.url;
      this._internals.url.href = value + href.slice(this._internals.prefixUrl.length);
    }
    this._internals.prefixUrl = value;
  }
  /**
      __Note #1__: The `body` option cannot be used with the `json` or `form` option.
  
      __Note #2__: If you provide this option, `got.stream()` will be read-only.
  
      __Note #3__: If you provide a payload with the `GET` or `HEAD` method, it will throw a `TypeError` unless the method is `GET` and the `allowGetBody` option is set to `true`.
  
      __Note #4__: This option is not enumerable and will not be merged with the instance defaults.
  
      The `content-length` header will be automatically set if `body` is a `string` / `Buffer` / [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) / [`form-data` instance](https://github.com/form-data/form-data), and `content-length` and `transfer-encoding` are not manually set in `options.headers`.
  
      Since Got 12, the `content-length` is not automatically set when `body` is a `fs.createReadStream`.
      */
  get body() {
    return this._internals.body;
  }
  set body(value) {
    assert.any([distribution_default.string, distribution_default.buffer, distribution_default.nodeStream, distribution_default.generator, distribution_default.asyncGenerator, isFormData2, distribution_default.undefined], value);
    if (distribution_default.nodeStream(value)) {
      assert.truthy(value.readable);
    }
    if (value !== void 0) {
      assert.undefined(this._internals.form);
      assert.undefined(this._internals.json);
    }
    this._internals.body = value;
  }
  /**
      The form body is converted to a query string using [`(new URLSearchParams(object)).toString()`](https://nodejs.org/api/url.html#url_constructor_new_urlsearchparams_obj).
  
      If the `Content-Type` header is not present, it will be set to `application/x-www-form-urlencoded`.
  
      __Note #1__: If you provide this option, `got.stream()` will be read-only.
  
      __Note #2__: This option is not enumerable and will not be merged with the instance defaults.
      */
  get form() {
    return this._internals.form;
  }
  set form(value) {
    assert.any([distribution_default.plainObject, distribution_default.undefined], value);
    if (value !== void 0) {
      assert.undefined(this._internals.body);
      assert.undefined(this._internals.json);
    }
    this._internals.form = value;
  }
  /**
      JSON body. If the `Content-Type` header is not set, it will be set to `application/json`.
  
      __Note #1__: If you provide this option, `got.stream()` will be read-only.
  
      __Note #2__: This option is not enumerable and will not be merged with the instance defaults.
      */
  get json() {
    return this._internals.json;
  }
  set json(value) {
    if (value !== void 0) {
      assert.undefined(this._internals.body);
      assert.undefined(this._internals.form);
    }
    this._internals.json = value;
  }
  /**
      The URL to request, as a string, a [`https.request` options object](https://nodejs.org/api/https.html#https_https_request_options_callback), or a [WHATWG `URL`](https://nodejs.org/api/url.html#url_class_url).
  
      Properties from `options` will override properties in the parsed `url`.
  
      If no protocol is specified, it will throw a `TypeError`.
  
      __Note__: The query string is **not** parsed as search params.
  
      @example
      ```
      await got('https://example.com/?query=a b'); //=> https://example.com/?query=a%20b
      await got('https://example.com/', {searchParams: {query: 'a b'}}); //=> https://example.com/?query=a+b
  
      // The query string is overridden by `searchParams`
      await got('https://example.com/?query=a b', {searchParams: {query: 'a b'}}); //=> https://example.com/?query=a+b
      ```
      */
  get url() {
    return this._internals.url;
  }
  set url(value) {
    assert.any([distribution_default.string, distribution_default.urlInstance, distribution_default.undefined], value);
    if (value === void 0) {
      this._internals.url = void 0;
      return;
    }
    if (distribution_default.string(value) && value.startsWith("/")) {
      throw new Error("`url` must not start with a slash");
    }
    const urlString = `${this.prefixUrl}${value.toString()}`;
    const url = new URL(urlString);
    this._internals.url = url;
    if (url.protocol === "unix:") {
      url.href = `http://unix${url.pathname}${url.search}`;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      const error = new Error(`Unsupported protocol: ${url.protocol}`);
      error.code = "ERR_UNSUPPORTED_PROTOCOL";
      throw error;
    }
    if (this._internals.username) {
      url.username = this._internals.username;
      this._internals.username = "";
    }
    if (this._internals.password) {
      url.password = this._internals.password;
      this._internals.password = "";
    }
    if (this._internals.searchParams) {
      url.search = this._internals.searchParams.toString();
      this._internals.searchParams = void 0;
    }
    if (url.hostname === "unix") {
      if (!this._internals.enableUnixSockets) {
        throw new Error("Using UNIX domain sockets but option `enableUnixSockets` is not enabled");
      }
      const matches = /(?<socketPath>.+?):(?<path>.+)/.exec(`${url.pathname}${url.search}`);
      if (matches == null ? void 0 : matches.groups) {
        const { socketPath, path: path6 } = matches.groups;
        this._unixOptions = {
          socketPath,
          path: path6,
          host: ""
        };
      } else {
        this._unixOptions = void 0;
      }
      return;
    }
    this._unixOptions = void 0;
  }
  /**
      Cookie support. You don't have to care about parsing or how to store them.
  
      __Note__: If you provide this option, `options.headers.cookie` will be overridden.
      */
  get cookieJar() {
    return this._internals.cookieJar;
  }
  set cookieJar(value) {
    assert.any([distribution_default.object, distribution_default.undefined], value);
    if (value === void 0) {
      this._internals.cookieJar = void 0;
      return;
    }
    let { setCookie, getCookieString } = value;
    assert.function(setCookie);
    assert.function(getCookieString);
    if (setCookie.length === 4 && getCookieString.length === 0) {
      setCookie = promisify3(setCookie.bind(value));
      getCookieString = promisify3(getCookieString.bind(value));
      this._internals.cookieJar = {
        setCookie,
        getCookieString
      };
    } else {
      this._internals.cookieJar = value;
    }
  }
  /**
      You can abort the `request` using [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
  
      @example
      ```
      import got from 'got';
  
      const abortController = new AbortController();
  
      const request = got('https://httpbin.org/anything', {
          signal: abortController.signal
      });
  
      setTimeout(() => {
          abortController.abort();
      }, 100);
      ```
      */
  get signal() {
    return this._internals.signal;
  }
  set signal(value) {
    assert.object(value);
    this._internals.signal = value;
  }
  /**
      Ignore invalid cookies instead of throwing an error.
      Only useful when the `cookieJar` option has been set. Not recommended.
  
      @default false
      */
  get ignoreInvalidCookies() {
    return this._internals.ignoreInvalidCookies;
  }
  set ignoreInvalidCookies(value) {
    assert.boolean(value);
    this._internals.ignoreInvalidCookies = value;
  }
  /**
      Query string that will be added to the request URL.
      This will override the query string in `url`.
  
      If you need to pass in an array, you can do it using a `URLSearchParams` instance.
  
      @example
      ```
      import got from 'got';
  
      const searchParams = new URLSearchParams([['key', 'a'], ['key', 'b']]);
  
      await got('https://example.com', {searchParams});
  
      console.log(searchParams.toString());
      //=> 'key=a&key=b'
      ```
      */
  get searchParams() {
    if (this._internals.url) {
      return this._internals.url.searchParams;
    }
    if (this._internals.searchParams === void 0) {
      this._internals.searchParams = new URLSearchParams();
    }
    return this._internals.searchParams;
  }
  set searchParams(value) {
    assert.any([distribution_default.string, distribution_default.object, distribution_default.undefined], value);
    const url = this._internals.url;
    if (value === void 0) {
      this._internals.searchParams = void 0;
      if (url) {
        url.search = "";
      }
      return;
    }
    const searchParameters = this.searchParams;
    let updated;
    if (distribution_default.string(value)) {
      updated = new URLSearchParams(value);
    } else if (value instanceof URLSearchParams) {
      updated = value;
    } else {
      validateSearchParameters(value);
      updated = new URLSearchParams();
      for (const key in value) {
        const entry = value[key];
        if (entry === null) {
          updated.append(key, "");
        } else if (entry === void 0) {
          searchParameters.delete(key);
        } else {
          updated.append(key, entry);
        }
      }
    }
    if (this._merging) {
      for (const key of updated.keys()) {
        searchParameters.delete(key);
      }
      for (const [key, value2] of updated) {
        searchParameters.append(key, value2);
      }
    } else if (url) {
      url.search = searchParameters.toString();
    } else {
      this._internals.searchParams = searchParameters;
    }
  }
  get searchParameters() {
    throw new Error("The `searchParameters` option does not exist. Use `searchParams` instead.");
  }
  set searchParameters(_value) {
    throw new Error("The `searchParameters` option does not exist. Use `searchParams` instead.");
  }
  get dnsLookup() {
    return this._internals.dnsLookup;
  }
  set dnsLookup(value) {
    assert.any([distribution_default.function, distribution_default.undefined], value);
    this._internals.dnsLookup = value;
  }
  /**
      An instance of [`CacheableLookup`](https://github.com/szmarczak/cacheable-lookup) used for making DNS lookups.
      Useful when making lots of requests to different *public* hostnames.
  
      `CacheableLookup` uses `dns.resolver4(..)` and `dns.resolver6(...)` under the hood and fall backs to `dns.lookup(...)` when the first two fail, which may lead to additional delay.
  
      __Note__: This should stay disabled when making requests to internal hostnames such as `localhost`, `database.local` etc.
  
      @default false
      */
  get dnsCache() {
    return this._internals.dnsCache;
  }
  set dnsCache(value) {
    assert.any([distribution_default.object, distribution_default.boolean, distribution_default.undefined], value);
    if (value === true) {
      this._internals.dnsCache = getGlobalDnsCache();
    } else if (value === false) {
      this._internals.dnsCache = void 0;
    } else {
      this._internals.dnsCache = value;
    }
  }
  /**
      User data. `context` is shallow merged and enumerable. If it contains non-enumerable properties they will NOT be merged.
  
      @example
      ```
      import got from 'got';
  
      const instance = got.extend({
          hooks: {
              beforeRequest: [
                  options => {
                      if (!options.context || !options.context.token) {
                          throw new Error('Token required');
                      }
  
                      options.headers.token = options.context.token;
                  }
              ]
          }
      });
  
      const context = {
          token: 'secret'
      };
  
      const response = await instance('https://httpbin.org/headers', {context});
  
      // Let's see the headers
      console.log(response.body);
      ```
      */
  get context() {
    return this._internals.context;
  }
  set context(value) {
    assert.object(value);
    if (this._merging) {
      Object.assign(this._internals.context, value);
    } else {
      this._internals.context = { ...value };
    }
  }
  /**
  Hooks allow modifications during the request lifecycle.
  Hook functions may be async and are run serially.
  */
  get hooks() {
    return this._internals.hooks;
  }
  set hooks(value) {
    assert.object(value);
    for (const knownHookEvent in value) {
      if (!(knownHookEvent in this._internals.hooks)) {
        throw new Error(`Unexpected hook event: ${knownHookEvent}`);
      }
      const typedKnownHookEvent = knownHookEvent;
      const hooks = value[typedKnownHookEvent];
      assert.any([distribution_default.array, distribution_default.undefined], hooks);
      if (hooks) {
        for (const hook of hooks) {
          assert.function(hook);
        }
      }
      if (this._merging) {
        if (hooks) {
          this._internals.hooks[typedKnownHookEvent].push(...hooks);
        }
      } else {
        if (!hooks) {
          throw new Error(`Missing hook event: ${knownHookEvent}`);
        }
        this._internals.hooks[knownHookEvent] = [...hooks];
      }
    }
  }
  /**
      Whether redirect responses should be followed automatically.
  
      Optionally, pass a function to dynamically decide based on the response object.
  
      Note that if a `303` is sent by the server in response to any request type (`POST`, `DELETE`, etc.), Got will automatically request the resource pointed to in the location header via `GET`.
      This is in accordance with [the spec](https://tools.ietf.org/html/rfc7231#section-6.4.4). You can optionally turn on this behavior also for other redirect codes - see `methodRewriting`.
  
      @default true
      */
  get followRedirect() {
    return this._internals.followRedirect;
  }
  set followRedirect(value) {
    assert.any([distribution_default.boolean, distribution_default.function], value);
    this._internals.followRedirect = value;
  }
  get followRedirects() {
    throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
  }
  set followRedirects(_value) {
    throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
  }
  /**
      If exceeded, the request will be aborted and a `MaxRedirectsError` will be thrown.
  
      @default 10
      */
  get maxRedirects() {
    return this._internals.maxRedirects;
  }
  set maxRedirects(value) {
    assert.number(value);
    this._internals.maxRedirects = value;
  }
  /**
      A cache adapter instance for storing cached response data.
  
      @default false
      */
  get cache() {
    return this._internals.cache;
  }
  set cache(value) {
    assert.any([distribution_default.object, distribution_default.string, distribution_default.boolean, distribution_default.undefined], value);
    if (value === true) {
      this._internals.cache = globalCache;
    } else if (value === false) {
      this._internals.cache = void 0;
    } else {
      this._internals.cache = value;
    }
  }
  /**
      Determines if a `got.HTTPError` is thrown for unsuccessful responses.
  
      If this is disabled, requests that encounter an error status code will be resolved with the `response` instead of throwing.
      This may be useful if you are checking for resource availability and are expecting error responses.
  
      @default true
      */
  get throwHttpErrors() {
    return this._internals.throwHttpErrors;
  }
  set throwHttpErrors(value) {
    assert.boolean(value);
    this._internals.throwHttpErrors = value;
  }
  get username() {
    const url = this._internals.url;
    const value = url ? url.username : this._internals.username;
    return decodeURIComponent(value);
  }
  set username(value) {
    assert.string(value);
    const url = this._internals.url;
    const fixedValue = encodeURIComponent(value);
    if (url) {
      url.username = fixedValue;
    } else {
      this._internals.username = fixedValue;
    }
  }
  get password() {
    const url = this._internals.url;
    const value = url ? url.password : this._internals.password;
    return decodeURIComponent(value);
  }
  set password(value) {
    assert.string(value);
    const url = this._internals.url;
    const fixedValue = encodeURIComponent(value);
    if (url) {
      url.password = fixedValue;
    } else {
      this._internals.password = fixedValue;
    }
  }
  /**
      If set to `true`, Got will additionally accept HTTP2 requests.
  
      It will choose either HTTP/1.1 or HTTP/2 depending on the ALPN protocol.
  
      __Note__: This option requires Node.js 15.10.0 or newer as HTTP/2 support on older Node.js versions is very buggy.
  
      __Note__: Overriding `options.request` will disable HTTP2 support.
  
      @default false
  
      @example
      ```
      import got from 'got';
  
      const {headers} = await got('https://nghttp2.org/httpbin/anything', {http2: true});
  
      console.log(headers.via);
      //=> '2 nghttpx'
      ```
      */
  get http2() {
    return this._internals.http2;
  }
  set http2(value) {
    assert.boolean(value);
    this._internals.http2 = value;
  }
  /**
      Set this to `true` to allow sending body for the `GET` method.
      However, the [HTTP/2 specification](https://tools.ietf.org/html/rfc7540#section-8.1.3) says that `An HTTP GET request includes request header fields and no payload body`, therefore when using the HTTP/2 protocol this option will have no effect.
      This option is only meant to interact with non-compliant servers when you have no other choice.
  
      __Note__: The [RFC 7231](https://tools.ietf.org/html/rfc7231#section-4.3.1) doesn't specify any particular behavior for the GET method having a payload, therefore __it's considered an [anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern)__.
  
      @default false
      */
  get allowGetBody() {
    return this._internals.allowGetBody;
  }
  set allowGetBody(value) {
    assert.boolean(value);
    this._internals.allowGetBody = value;
  }
  /**
      Request headers.
  
      Existing headers will be overwritten. Headers set to `undefined` will be omitted.
  
      @default {}
      */
  get headers() {
    return this._internals.headers;
  }
  set headers(value) {
    assert.plainObject(value);
    if (this._merging) {
      Object.assign(this._internals.headers, lowercaseKeys(value));
    } else {
      this._internals.headers = lowercaseKeys(value);
    }
  }
  /**
      Specifies if the HTTP request method should be [rewritten as `GET`](https://tools.ietf.org/html/rfc7231#section-6.4) on redirects.
  
      As the [specification](https://tools.ietf.org/html/rfc7231#section-6.4) prefers to rewrite the HTTP method only on `303` responses, this is Got's default behavior.
      Setting `methodRewriting` to `true` will also rewrite `301` and `302` responses, as allowed by the spec. This is the behavior followed by `curl` and browsers.
  
      __Note__: Got never performs method rewriting on `307` and `308` responses, as this is [explicitly prohibited by the specification](https://www.rfc-editor.org/rfc/rfc7231#section-6.4.7).
  
      @default false
      */
  get methodRewriting() {
    return this._internals.methodRewriting;
  }
  set methodRewriting(value) {
    assert.boolean(value);
    this._internals.methodRewriting = value;
  }
  /**
      Indicates which DNS record family to use.
  
      Values:
      - `undefined`: IPv4 (if present) or IPv6
      - `4`: Only IPv4
      - `6`: Only IPv6
  
      @default undefined
      */
  get dnsLookupIpVersion() {
    return this._internals.dnsLookupIpVersion;
  }
  set dnsLookupIpVersion(value) {
    if (value !== void 0 && value !== 4 && value !== 6) {
      throw new TypeError(`Invalid DNS lookup IP version: ${value}`);
    }
    this._internals.dnsLookupIpVersion = value;
  }
  /**
      A function used to parse JSON responses.
  
      @example
      ```
      import got from 'got';
      import Bourne from '@hapi/bourne';
  
      const parsed = await got('https://example.com', {
          parseJson: text => Bourne.parse(text)
      }).json();
  
      console.log(parsed);
      ```
      */
  get parseJson() {
    return this._internals.parseJson;
  }
  set parseJson(value) {
    assert.function(value);
    this._internals.parseJson = value;
  }
  /**
      A function used to stringify the body of JSON requests.
  
      @example
      ```
      import got from 'got';
  
      await got.post('https://example.com', {
          stringifyJson: object => JSON.stringify(object, (key, value) => {
              if (key.startsWith('_')) {
                  return;
              }
  
              return value;
          }),
          json: {
              some: 'payload',
              _ignoreMe: 1234
          }
      });
      ```
  
      @example
      ```
      import got from 'got';
  
      await got.post('https://example.com', {
          stringifyJson: object => JSON.stringify(object, (key, value) => {
              if (typeof value === 'number') {
                  return value.toString();
              }
  
              return value;
          }),
          json: {
              some: 'payload',
              number: 1
          }
      });
      ```
      */
  get stringifyJson() {
    return this._internals.stringifyJson;
  }
  set stringifyJson(value) {
    assert.function(value);
    this._internals.stringifyJson = value;
  }
  /**
      An object representing `limit`, `calculateDelay`, `methods`, `statusCodes`, `maxRetryAfter` and `errorCodes` fields for maximum retry count, retry handler, allowed methods, allowed status codes, maximum [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) time and allowed error codes.
  
      Delays between retries counts with function `1000 * Math.pow(2, retry) + Math.random() * 100`, where `retry` is attempt number (starts from 1).
  
      The `calculateDelay` property is a `function` that receives an object with `attemptCount`, `retryOptions`, `error` and `computedValue` properties for current retry count, the retry options, error and default computed value.
      The function must return a delay in milliseconds (or a Promise resolving with it) (`0` return value cancels retry).
  
      By default, it retries *only* on the specified methods, status codes, and on these network errors:
  
      - `ETIMEDOUT`: One of the [timeout](#timeout) limits were reached.
      - `ECONNRESET`: Connection was forcibly closed by a peer.
      - `EADDRINUSE`: Could not bind to any free port.
      - `ECONNREFUSED`: Connection was refused by the server.
      - `EPIPE`: The remote side of the stream being written has been closed.
      - `ENOTFOUND`: Couldn't resolve the hostname to an IP address.
      - `ENETUNREACH`: No internet connection.
      - `EAI_AGAIN`: DNS lookup timed out.
  
      __Note__: If `maxRetryAfter` is set to `undefined`, it will use `options.timeout`.
      __Note__: If [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header is greater than `maxRetryAfter`, it will cancel the request.
      */
  get retry() {
    return this._internals.retry;
  }
  set retry(value) {
    assert.plainObject(value);
    assert.any([distribution_default.function, distribution_default.undefined], value.calculateDelay);
    assert.any([distribution_default.number, distribution_default.undefined], value.maxRetryAfter);
    assert.any([distribution_default.number, distribution_default.undefined], value.limit);
    assert.any([distribution_default.array, distribution_default.undefined], value.methods);
    assert.any([distribution_default.array, distribution_default.undefined], value.statusCodes);
    assert.any([distribution_default.array, distribution_default.undefined], value.errorCodes);
    assert.any([distribution_default.number, distribution_default.undefined], value.noise);
    if (value.noise && Math.abs(value.noise) > 100) {
      throw new Error(`The maximum acceptable retry noise is +/- 100ms, got ${value.noise}`);
    }
    for (const key in value) {
      if (!(key in this._internals.retry)) {
        throw new Error(`Unexpected retry option: ${key}`);
      }
    }
    if (this._merging) {
      Object.assign(this._internals.retry, value);
    } else {
      this._internals.retry = { ...value };
    }
    const { retry } = this._internals;
    retry.methods = [...new Set(retry.methods.map((method) => method.toUpperCase()))];
    retry.statusCodes = [...new Set(retry.statusCodes)];
    retry.errorCodes = [...new Set(retry.errorCodes)];
  }
  /**
      From `http.RequestOptions`.
  
      The IP address used to send the request from.
      */
  get localAddress() {
    return this._internals.localAddress;
  }
  set localAddress(value) {
    assert.any([distribution_default.string, distribution_default.undefined], value);
    this._internals.localAddress = value;
  }
  /**
      The HTTP method used to make the request.
  
      @default 'GET'
      */
  get method() {
    return this._internals.method;
  }
  set method(value) {
    assert.string(value);
    this._internals.method = value.toUpperCase();
  }
  get createConnection() {
    return this._internals.createConnection;
  }
  set createConnection(value) {
    assert.any([distribution_default.function, distribution_default.undefined], value);
    this._internals.createConnection = value;
  }
  /**
      From `http-cache-semantics`
  
      @default {}
      */
  get cacheOptions() {
    return this._internals.cacheOptions;
  }
  set cacheOptions(value) {
    assert.plainObject(value);
    assert.any([distribution_default.boolean, distribution_default.undefined], value.shared);
    assert.any([distribution_default.number, distribution_default.undefined], value.cacheHeuristic);
    assert.any([distribution_default.number, distribution_default.undefined], value.immutableMinTimeToLive);
    assert.any([distribution_default.boolean, distribution_default.undefined], value.ignoreCargoCult);
    for (const key in value) {
      if (!(key in this._internals.cacheOptions)) {
        throw new Error(`Cache option \`${key}\` does not exist`);
      }
    }
    if (this._merging) {
      Object.assign(this._internals.cacheOptions, value);
    } else {
      this._internals.cacheOptions = { ...value };
    }
  }
  /**
  Options for the advanced HTTPS API.
  */
  get https() {
    return this._internals.https;
  }
  set https(value) {
    assert.plainObject(value);
    assert.any([distribution_default.boolean, distribution_default.undefined], value.rejectUnauthorized);
    assert.any([distribution_default.function, distribution_default.undefined], value.checkServerIdentity);
    assert.any([distribution_default.string, distribution_default.object, distribution_default.array, distribution_default.undefined], value.certificateAuthority);
    assert.any([distribution_default.string, distribution_default.object, distribution_default.array, distribution_default.undefined], value.key);
    assert.any([distribution_default.string, distribution_default.object, distribution_default.array, distribution_default.undefined], value.certificate);
    assert.any([distribution_default.string, distribution_default.undefined], value.passphrase);
    assert.any([distribution_default.string, distribution_default.buffer, distribution_default.array, distribution_default.undefined], value.pfx);
    assert.any([distribution_default.array, distribution_default.undefined], value.alpnProtocols);
    assert.any([distribution_default.string, distribution_default.undefined], value.ciphers);
    assert.any([distribution_default.string, distribution_default.buffer, distribution_default.undefined], value.dhparam);
    assert.any([distribution_default.string, distribution_default.undefined], value.signatureAlgorithms);
    assert.any([distribution_default.string, distribution_default.undefined], value.minVersion);
    assert.any([distribution_default.string, distribution_default.undefined], value.maxVersion);
    assert.any([distribution_default.boolean, distribution_default.undefined], value.honorCipherOrder);
    assert.any([distribution_default.number, distribution_default.undefined], value.tlsSessionLifetime);
    assert.any([distribution_default.string, distribution_default.undefined], value.ecdhCurve);
    assert.any([distribution_default.string, distribution_default.buffer, distribution_default.array, distribution_default.undefined], value.certificateRevocationLists);
    for (const key in value) {
      if (!(key in this._internals.https)) {
        throw new Error(`HTTPS option \`${key}\` does not exist`);
      }
    }
    if (this._merging) {
      Object.assign(this._internals.https, value);
    } else {
      this._internals.https = { ...value };
    }
  }
  /**
      [Encoding](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) to be used on `setEncoding` of the response data.
  
      To get a [`Buffer`](https://nodejs.org/api/buffer.html), you need to set `responseType` to `buffer` instead.
      Don't set this option to `null`.
  
      __Note__: This doesn't affect streams! Instead, you need to do `got.stream(...).setEncoding(encoding)`.
  
      @default 'utf-8'
      */
  get encoding() {
    return this._internals.encoding;
  }
  set encoding(value) {
    if (value === null) {
      throw new TypeError("To get a Buffer, set `options.responseType` to `buffer` instead");
    }
    assert.any([distribution_default.string, distribution_default.undefined], value);
    this._internals.encoding = value;
  }
  /**
      When set to `true` the promise will return the Response body instead of the Response object.
  
      @default false
      */
  get resolveBodyOnly() {
    return this._internals.resolveBodyOnly;
  }
  set resolveBodyOnly(value) {
    assert.boolean(value);
    this._internals.resolveBodyOnly = value;
  }
  /**
      Returns a `Stream` instead of a `Promise`.
      This is equivalent to calling `got.stream(url, options?)`.
  
      @default false
      */
  get isStream() {
    return this._internals.isStream;
  }
  set isStream(value) {
    assert.boolean(value);
    this._internals.isStream = value;
  }
  /**
      The parsing method.
  
      The promise also has `.text()`, `.json()` and `.buffer()` methods which return another Got promise for the parsed body.
  
      It's like setting the options to `{responseType: 'json', resolveBodyOnly: true}` but without affecting the main Got promise.
  
      __Note__: When using streams, this option is ignored.
  
      @example
      ```
      const responsePromise = got(url);
      const bufferPromise = responsePromise.buffer();
      const jsonPromise = responsePromise.json();
  
      const [response, buffer, json] = Promise.all([responsePromise, bufferPromise, jsonPromise]);
      // `response` is an instance of Got Response
      // `buffer` is an instance of Buffer
      // `json` is an object
      ```
  
      @example
      ```
      // This
      const body = await got(url).json();
  
      // is semantically the same as this
      const body = await got(url, {responseType: 'json', resolveBodyOnly: true});
      ```
      */
  get responseType() {
    return this._internals.responseType;
  }
  set responseType(value) {
    if (value === void 0) {
      this._internals.responseType = "text";
      return;
    }
    if (value !== "text" && value !== "buffer" && value !== "json") {
      throw new Error(`Invalid \`responseType\` option: ${value}`);
    }
    this._internals.responseType = value;
  }
  get pagination() {
    return this._internals.pagination;
  }
  set pagination(value) {
    assert.object(value);
    if (this._merging) {
      Object.assign(this._internals.pagination, value);
    } else {
      this._internals.pagination = value;
    }
  }
  get auth() {
    throw new Error("Parameter `auth` is deprecated. Use `username` / `password` instead.");
  }
  set auth(_value) {
    throw new Error("Parameter `auth` is deprecated. Use `username` / `password` instead.");
  }
  get setHost() {
    return this._internals.setHost;
  }
  set setHost(value) {
    assert.boolean(value);
    this._internals.setHost = value;
  }
  get maxHeaderSize() {
    return this._internals.maxHeaderSize;
  }
  set maxHeaderSize(value) {
    assert.any([distribution_default.number, distribution_default.undefined], value);
    this._internals.maxHeaderSize = value;
  }
  get enableUnixSockets() {
    return this._internals.enableUnixSockets;
  }
  set enableUnixSockets(value) {
    assert.boolean(value);
    this._internals.enableUnixSockets = value;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON() {
    return { ...this._internals };
  }
  [Symbol.for("nodejs.util.inspect.custom")](_depth, options) {
    return inspect(this._internals, options);
  }
  createNativeRequestOptions() {
    var _a;
    const internals = this._internals;
    const url = internals.url;
    let agent;
    if (url.protocol === "https:") {
      agent = internals.http2 ? internals.agent : internals.agent.https;
    } else {
      agent = internals.agent.http;
    }
    const { https: https2 } = internals;
    let { pfx } = https2;
    if (distribution_default.array(pfx) && distribution_default.plainObject(pfx[0])) {
      pfx = pfx.map((object) => ({
        buf: object.buffer,
        passphrase: object.passphrase
      }));
    }
    return {
      ...internals.cacheOptions,
      ...this._unixOptions,
      // HTTPS options
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ALPNProtocols: https2.alpnProtocols,
      ca: https2.certificateAuthority,
      cert: https2.certificate,
      key: https2.key,
      passphrase: https2.passphrase,
      pfx: https2.pfx,
      rejectUnauthorized: https2.rejectUnauthorized,
      checkServerIdentity: https2.checkServerIdentity ?? checkServerIdentity,
      ciphers: https2.ciphers,
      honorCipherOrder: https2.honorCipherOrder,
      minVersion: https2.minVersion,
      maxVersion: https2.maxVersion,
      sigalgs: https2.signatureAlgorithms,
      sessionTimeout: https2.tlsSessionLifetime,
      dhparam: https2.dhparam,
      ecdhCurve: https2.ecdhCurve,
      crl: https2.certificateRevocationLists,
      // HTTP options
      lookup: internals.dnsLookup ?? ((_a = internals.dnsCache) == null ? void 0 : _a.lookup),
      family: internals.dnsLookupIpVersion,
      agent,
      setHost: internals.setHost,
      method: internals.method,
      maxHeaderSize: internals.maxHeaderSize,
      localAddress: internals.localAddress,
      headers: internals.headers,
      createConnection: internals.createConnection,
      timeout: internals.http2 ? getHttp2TimeoutOption(internals) : void 0,
      // HTTP/2 options
      h2session: internals.h2session
    };
  }
  getRequestFunction() {
    const url = this._internals.url;
    const { request } = this._internals;
    if (!request && url) {
      return this.getFallbackRequestFunction();
    }
    return request;
  }
  getFallbackRequestFunction() {
    const url = this._internals.url;
    if (!url) {
      return;
    }
    if (url.protocol === "https:") {
      if (this._internals.http2) {
        if (major < 15 || major === 15 && minor < 10) {
          const error = new Error("To use the `http2` option, install Node.js 15.10.0 or above");
          error.code = "EUNSUPPORTED";
          throw error;
        }
        return import_http2_wrapper.default.auto;
      }
      return https.request;
    }
    return http.request;
  }
  freeze() {
    const options = this._internals;
    Object.freeze(options);
    Object.freeze(options.hooks);
    Object.freeze(options.hooks.afterResponse);
    Object.freeze(options.hooks.beforeError);
    Object.freeze(options.hooks.beforeRedirect);
    Object.freeze(options.hooks.beforeRequest);
    Object.freeze(options.hooks.beforeRetry);
    Object.freeze(options.hooks.init);
    Object.freeze(options.https);
    Object.freeze(options.cacheOptions);
    Object.freeze(options.agent);
    Object.freeze(options.headers);
    Object.freeze(options.timeout);
    Object.freeze(options.retry);
    Object.freeze(options.retry.errorCodes);
    Object.freeze(options.retry.methods);
    Object.freeze(options.retry.statusCodes);
  }
};

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/response.js
init_esm_shims();
var isResponseOk = (response) => {
  const { statusCode } = response;
  const { followRedirect } = response.request.options;
  const shouldFollow = typeof followRedirect === "function" ? followRedirect(response) : followRedirect;
  const limitStatusCode = shouldFollow ? 299 : 399;
  return statusCode >= 200 && statusCode <= limitStatusCode || statusCode === 304;
};
var ParseError = class extends RequestError {
  constructor(error, response) {
    const { options } = response.request;
    super(`${error.message} in "${options.url.toString()}"`, error, response.request);
    this.name = "ParseError";
    this.code = "ERR_BODY_PARSE_FAILURE";
  }
};
var parseBody = (response, responseType, parseJson, encoding) => {
  const { rawBody } = response;
  try {
    if (responseType === "text") {
      return rawBody.toString(encoding);
    }
    if (responseType === "json") {
      return rawBody.length === 0 ? "" : parseJson(rawBody.toString(encoding));
    }
    if (responseType === "buffer") {
      return rawBody;
    }
  } catch (error) {
    throw new ParseError(error, response);
  }
  throw new ParseError({
    message: `Unknown body type '${responseType}'`,
    name: "Error"
  }, response);
};

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/utils/is-client-request.js
init_esm_shims();
function isClientRequest(clientRequest) {
  return clientRequest.writable && !clientRequest.writableEnded;
}
var is_client_request_default = isClientRequest;

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/utils/is-unix-socket-url.js
init_esm_shims();
function isUnixSocketURL(url) {
  return url.protocol === "unix:" || url.hostname === "unix";
}

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/core/index.js
var supportsBrotli = distribution_default.string(process3.versions.brotli);
var methodsWithoutBody = /* @__PURE__ */ new Set(["GET", "HEAD"]);
var cacheableStore = new WeakableMap();
var redirectCodes = /* @__PURE__ */ new Set([300, 301, 302, 303, 304, 307, 308]);
var proxiedRequestEvents = [
  "socket",
  "connect",
  "continue",
  "information",
  "upgrade"
];
var noop3 = () => {
};
var Request = class _Request extends Duplex {
  // @ts-expect-error - Ignoring for now.
  ["constructor"];
  _noPipe;
  // @ts-expect-error https://github.com/microsoft/TypeScript/issues/9568
  options;
  response;
  requestUrl;
  redirectUrls;
  retryCount;
  _stopRetry;
  _downloadedSize;
  _uploadedSize;
  _stopReading;
  _pipedServerResponses;
  _request;
  _responseSize;
  _bodySize;
  _unproxyEvents;
  _isFromCache;
  _cannotHaveBody;
  _triggerRead;
  _cancelTimeouts;
  _removeListeners;
  _nativeResponse;
  _flushed;
  _aborted;
  // We need this because `this._request` if `undefined` when using cache
  _requestInitialized;
  constructor(url, options, defaults2) {
    super({
      // Don't destroy immediately, as the error may be emitted on unsuccessful retry
      autoDestroy: false,
      // It needs to be zero because we're just proxying the data to another stream
      highWaterMark: 0
    });
    this._downloadedSize = 0;
    this._uploadedSize = 0;
    this._stopReading = false;
    this._pipedServerResponses = /* @__PURE__ */ new Set();
    this._cannotHaveBody = false;
    this._unproxyEvents = noop3;
    this._triggerRead = false;
    this._cancelTimeouts = noop3;
    this._removeListeners = noop3;
    this._jobs = [];
    this._flushed = false;
    this._requestInitialized = false;
    this._aborted = false;
    this.redirectUrls = [];
    this.retryCount = 0;
    this._stopRetry = noop3;
    this.on("pipe", (source) => {
      if (source == null ? void 0 : source.headers) {
        Object.assign(this.options.headers, source.headers);
      }
    });
    this.on("newListener", (event) => {
      if (event === "retry" && this.listenerCount("retry") > 0) {
        throw new Error("A retry listener has been attached already.");
      }
    });
    try {
      this.options = new Options(url, options, defaults2);
      if (!this.options.url) {
        if (this.options.prefixUrl === "") {
          throw new TypeError("Missing `url` property");
        }
        this.options.url = "";
      }
      this.requestUrl = this.options.url;
    } catch (error) {
      const { options: options2 } = error;
      if (options2) {
        this.options = options2;
      }
      this.flush = async () => {
        this.flush = async () => {
        };
        this.destroy(error);
      };
      return;
    }
    const { body } = this.options;
    if (distribution_default.nodeStream(body)) {
      body.once("error", (error) => {
        if (this._flushed) {
          this._beforeError(new UploadError(error, this));
        } else {
          this.flush = async () => {
            this.flush = async () => {
            };
            this._beforeError(new UploadError(error, this));
          };
        }
      });
    }
    if (this.options.signal) {
      const abort = () => {
        var _a, _b;
        if (((_b = (_a = this.options.signal) == null ? void 0 : _a.reason) == null ? void 0 : _b.name) === "TimeoutError") {
          this.destroy(new TimeoutError(this.options.signal.reason, this.timings, this));
        } else {
          this.destroy(new AbortError(this));
        }
      };
      if (this.options.signal.aborted) {
        abort();
      } else {
        this.options.signal.addEventListener("abort", abort);
        this._removeListeners = () => {
          var _a;
          (_a = this.options.signal) == null ? void 0 : _a.removeEventListener("abort", abort);
        };
      }
    }
  }
  async flush() {
    var _a;
    if (this._flushed) {
      return;
    }
    this._flushed = true;
    try {
      await this._finalizeBody();
      if (this.destroyed) {
        return;
      }
      await this._makeRequest();
      if (this.destroyed) {
        (_a = this._request) == null ? void 0 : _a.destroy();
        return;
      }
      for (const job of this._jobs) {
        job();
      }
      this._jobs.length = 0;
      this._requestInitialized = true;
    } catch (error) {
      this._beforeError(error);
    }
  }
  _beforeError(error) {
    if (this._stopReading) {
      return;
    }
    const { response, options } = this;
    const attemptCount = this.retryCount + (error.name === "RetryError" ? 0 : 1);
    this._stopReading = true;
    if (!(error instanceof RequestError)) {
      error = new RequestError(error.message, error, this);
    }
    const typedError = error;
    void (async () => {
      var _a, _b;
      if ((response == null ? void 0 : response.readable) && !response.rawBody && !((_b = (_a = this._request) == null ? void 0 : _a.socket) == null ? void 0 : _b.destroyed)) {
        response.setEncoding(this.readableEncoding);
        const success = await this._setRawBody(response);
        if (success) {
          response.body = response.rawBody.toString();
        }
      }
      if (this.listenerCount("retry") !== 0) {
        let backoff;
        try {
          let retryAfter;
          if (response && "retry-after" in response.headers) {
            retryAfter = Number(response.headers["retry-after"]);
            if (Number.isNaN(retryAfter)) {
              retryAfter = Date.parse(response.headers["retry-after"]) - Date.now();
              if (retryAfter <= 0) {
                retryAfter = 1;
              }
            } else {
              retryAfter *= 1e3;
            }
          }
          const retryOptions = options.retry;
          backoff = await retryOptions.calculateDelay({
            attemptCount,
            retryOptions,
            error: typedError,
            retryAfter,
            computedValue: calculate_retry_delay_default({
              attemptCount,
              retryOptions,
              error: typedError,
              retryAfter,
              computedValue: retryOptions.maxRetryAfter ?? options.timeout.request ?? Number.POSITIVE_INFINITY
            })
          });
        } catch (error_) {
          void this._error(new RequestError(error_.message, error_, this));
          return;
        }
        if (backoff) {
          await new Promise((resolve2) => {
            const timeout = setTimeout(resolve2, backoff);
            this._stopRetry = () => {
              clearTimeout(timeout);
              resolve2();
            };
          });
          if (this.destroyed) {
            return;
          }
          try {
            for (const hook of this.options.hooks.beforeRetry) {
              await hook(typedError, this.retryCount + 1);
            }
          } catch (error_) {
            void this._error(new RequestError(error_.message, error, this));
            return;
          }
          if (this.destroyed) {
            return;
          }
          this.destroy();
          this.emit("retry", this.retryCount + 1, error, (updatedOptions) => {
            const request = new _Request(options.url, updatedOptions, options);
            request.retryCount = this.retryCount + 1;
            process3.nextTick(() => {
              void request.flush();
            });
            return request;
          });
          return;
        }
      }
      void this._error(typedError);
    })();
  }
  _read() {
    this._triggerRead = true;
    const { response } = this;
    if (response && !this._stopReading) {
      if (response.readableLength) {
        this._triggerRead = false;
      }
      let data;
      while ((data = response.read()) !== null) {
        this._downloadedSize += data.length;
        const progress = this.downloadProgress;
        if (progress.percent < 1) {
          this.emit("downloadProgress", progress);
        }
        this.push(data);
      }
    }
  }
  _write(chunk2, encoding, callback) {
    const write = () => {
      this._writeRequest(chunk2, encoding, callback);
    };
    if (this._requestInitialized) {
      write();
    } else {
      this._jobs.push(write);
    }
  }
  _final(callback) {
    const endRequest = () => {
      if (!this._request || this._request.destroyed) {
        callback();
        return;
      }
      this._request.end((error) => {
        var _a, _b, _c;
        if ((_b = (_a = this._request) == null ? void 0 : _a._writableState) == null ? void 0 : _b.errored) {
          return;
        }
        if (!error) {
          this._bodySize = this._uploadedSize;
          this.emit("uploadProgress", this.uploadProgress);
          (_c = this._request) == null ? void 0 : _c.emit("upload-complete");
        }
        callback(error);
      });
    };
    if (this._requestInitialized) {
      endRequest();
    } else {
      this._jobs.push(endRequest);
    }
  }
  _destroy(error, callback) {
    this._stopReading = true;
    this.flush = async () => {
    };
    this._stopRetry();
    this._cancelTimeouts();
    this._removeListeners();
    if (this.options) {
      const { body } = this.options;
      if (distribution_default.nodeStream(body)) {
        body.destroy();
      }
    }
    if (this._request) {
      this._request.destroy();
    }
    if (error !== null && !distribution_default.undefined(error) && !(error instanceof RequestError)) {
      error = new RequestError(error.message, error, this);
    }
    callback(error);
  }
  pipe(destination, options) {
    if (destination instanceof ServerResponse) {
      this._pipedServerResponses.add(destination);
    }
    return super.pipe(destination, options);
  }
  unpipe(destination) {
    if (destination instanceof ServerResponse) {
      this._pipedServerResponses.delete(destination);
    }
    super.unpipe(destination);
    return this;
  }
  async _finalizeBody() {
    const { options } = this;
    const { headers } = options;
    const isForm = !distribution_default.undefined(options.form);
    const isJSON = !distribution_default.undefined(options.json);
    const isBody = !distribution_default.undefined(options.body);
    const cannotHaveBody = methodsWithoutBody.has(options.method) && !(options.method === "GET" && options.allowGetBody);
    this._cannotHaveBody = cannotHaveBody;
    if (isForm || isJSON || isBody) {
      if (cannotHaveBody) {
        throw new TypeError(`The \`${options.method}\` method cannot be used with a body`);
      }
      const noContentType = !distribution_default.string(headers["content-type"]);
      if (isBody) {
        if (isFormData2(options.body)) {
          const encoder = new FormDataEncoder(options.body);
          if (noContentType) {
            headers["content-type"] = encoder.headers["Content-Type"];
          }
          if ("Content-Length" in encoder.headers) {
            headers["content-length"] = encoder.headers["Content-Length"];
          }
          options.body = encoder.encode();
        }
        if (isFormData3(options.body) && noContentType) {
          headers["content-type"] = `multipart/form-data; boundary=${options.body.getBoundary()}`;
        }
      } else if (isForm) {
        if (noContentType) {
          headers["content-type"] = "application/x-www-form-urlencoded";
        }
        const { form } = options;
        options.form = void 0;
        options.body = new URLSearchParams(form).toString();
      } else {
        if (noContentType) {
          headers["content-type"] = "application/json";
        }
        const { json } = options;
        options.json = void 0;
        options.body = options.stringifyJson(json);
      }
      const uploadBodySize = await getBodySize(options.body, options.headers);
      if (distribution_default.undefined(headers["content-length"]) && distribution_default.undefined(headers["transfer-encoding"]) && !cannotHaveBody && !distribution_default.undefined(uploadBodySize)) {
        headers["content-length"] = String(uploadBodySize);
      }
    }
    if (options.responseType === "json" && !("accept" in options.headers)) {
      options.headers.accept = "application/json";
    }
    this._bodySize = Number(headers["content-length"]) || void 0;
  }
  async _onResponseBase(response) {
    if (this.isAborted) {
      return;
    }
    const { options } = this;
    const { url } = options;
    this._nativeResponse = response;
    if (options.decompress) {
      response = (0, import_decompress_response.default)(response);
    }
    const statusCode = response.statusCode;
    const typedResponse = response;
    typedResponse.statusMessage = typedResponse.statusMessage ?? http2.STATUS_CODES[statusCode];
    typedResponse.url = options.url.toString();
    typedResponse.requestUrl = this.requestUrl;
    typedResponse.redirectUrls = this.redirectUrls;
    typedResponse.request = this;
    typedResponse.isFromCache = this._nativeResponse.fromCache ?? false;
    typedResponse.ip = this.ip;
    typedResponse.retryCount = this.retryCount;
    typedResponse.ok = isResponseOk(typedResponse);
    this._isFromCache = typedResponse.isFromCache;
    this._responseSize = Number(response.headers["content-length"]) || void 0;
    this.response = typedResponse;
    response.once("end", () => {
      this._responseSize = this._downloadedSize;
      this.emit("downloadProgress", this.downloadProgress);
    });
    response.once("error", (error) => {
      this._aborted = true;
      response.destroy();
      this._beforeError(new ReadError(error, this));
    });
    response.once("aborted", () => {
      this._aborted = true;
      this._beforeError(new ReadError({
        name: "Error",
        message: "The server aborted pending request",
        code: "ECONNRESET"
      }, this));
    });
    this.emit("downloadProgress", this.downloadProgress);
    const rawCookies = response.headers["set-cookie"];
    if (distribution_default.object(options.cookieJar) && rawCookies) {
      let promises2 = rawCookies.map(async (rawCookie) => options.cookieJar.setCookie(rawCookie, url.toString()));
      if (options.ignoreInvalidCookies) {
        promises2 = promises2.map(async (promise) => {
          try {
            await promise;
          } catch {
          }
        });
      }
      try {
        await Promise.all(promises2);
      } catch (error) {
        this._beforeError(error);
        return;
      }
    }
    if (this.isAborted) {
      return;
    }
    if (response.headers.location && redirectCodes.has(statusCode)) {
      const shouldFollow = typeof options.followRedirect === "function" ? options.followRedirect(typedResponse) : options.followRedirect;
      if (shouldFollow) {
        response.resume();
        this._cancelTimeouts();
        this._unproxyEvents();
        if (this.redirectUrls.length >= options.maxRedirects) {
          this._beforeError(new MaxRedirectsError(this));
          return;
        }
        this._request = void 0;
        const updatedOptions = new Options(void 0, void 0, this.options);
        const serverRequestedGet = statusCode === 303 && updatedOptions.method !== "GET" && updatedOptions.method !== "HEAD";
        const canRewrite = statusCode !== 307 && statusCode !== 308;
        const userRequestedGet = updatedOptions.methodRewriting && canRewrite;
        if (serverRequestedGet || userRequestedGet) {
          updatedOptions.method = "GET";
          updatedOptions.body = void 0;
          updatedOptions.json = void 0;
          updatedOptions.form = void 0;
          delete updatedOptions.headers["content-length"];
        }
        try {
          const redirectBuffer = Buffer3.from(response.headers.location, "binary").toString();
          const redirectUrl = new URL(redirectBuffer, url);
          if (!isUnixSocketURL(url) && isUnixSocketURL(redirectUrl)) {
            this._beforeError(new RequestError("Cannot redirect to UNIX socket", {}, this));
            return;
          }
          if (redirectUrl.hostname !== url.hostname || redirectUrl.port !== url.port) {
            if ("host" in updatedOptions.headers) {
              delete updatedOptions.headers.host;
            }
            if ("cookie" in updatedOptions.headers) {
              delete updatedOptions.headers.cookie;
            }
            if ("authorization" in updatedOptions.headers) {
              delete updatedOptions.headers.authorization;
            }
            if (updatedOptions.username || updatedOptions.password) {
              updatedOptions.username = "";
              updatedOptions.password = "";
            }
          } else {
            redirectUrl.username = updatedOptions.username;
            redirectUrl.password = updatedOptions.password;
          }
          this.redirectUrls.push(redirectUrl);
          updatedOptions.prefixUrl = "";
          updatedOptions.url = redirectUrl;
          for (const hook of updatedOptions.hooks.beforeRedirect) {
            await hook(updatedOptions, typedResponse);
          }
          this.emit("redirect", updatedOptions, typedResponse);
          this.options = updatedOptions;
          await this._makeRequest();
        } catch (error) {
          this._beforeError(error);
          return;
        }
        return;
      }
    }
    if (options.isStream && options.throwHttpErrors && !isResponseOk(typedResponse)) {
      this._beforeError(new HTTPError(typedResponse));
      return;
    }
    response.on("readable", () => {
      if (this._triggerRead) {
        this._read();
      }
    });
    this.on("resume", () => {
      response.resume();
    });
    this.on("pause", () => {
      response.pause();
    });
    response.once("end", () => {
      this.push(null);
    });
    if (this._noPipe) {
      const success = await this._setRawBody();
      if (success) {
        this.emit("response", response);
      }
      return;
    }
    this.emit("response", response);
    for (const destination of this._pipedServerResponses) {
      if (destination.headersSent) {
        continue;
      }
      for (const key in response.headers) {
        const isAllowed = options.decompress ? key !== "content-encoding" : true;
        const value = response.headers[key];
        if (isAllowed) {
          destination.setHeader(key, value);
        }
      }
      destination.statusCode = statusCode;
    }
  }
  async _setRawBody(from = this) {
    if (from.readableEnded) {
      return false;
    }
    try {
      const fromArray = await from.toArray();
      const rawBody = isBuffer(fromArray.at(0)) ? Buffer3.concat(fromArray) : Buffer3.from(fromArray.join(""));
      if (!this.isAborted) {
        this.response.rawBody = rawBody;
        return true;
      }
    } catch {
    }
    return false;
  }
  async _onResponse(response) {
    try {
      await this._onResponseBase(response);
    } catch (error) {
      this._beforeError(error);
    }
  }
  _onRequest(request) {
    const { options } = this;
    const { timeout, url } = options;
    source_default(request);
    if (this.options.http2) {
      request.setTimeout(0);
    }
    this._cancelTimeouts = timedOut(request, timeout, url);
    const responseEventName = options.cache ? "cacheableResponse" : "response";
    request.once(responseEventName, (response) => {
      void this._onResponse(response);
    });
    request.once("error", (error) => {
      this._aborted = true;
      request.destroy();
      error = error instanceof TimeoutError2 ? new TimeoutError(error, this.timings, this) : new RequestError(error.message, error, this);
      this._beforeError(error);
    });
    this._unproxyEvents = proxyEvents(request, this, proxiedRequestEvents);
    this._request = request;
    this.emit("uploadProgress", this.uploadProgress);
    this._sendBody();
    this.emit("request", request);
  }
  async _asyncWrite(chunk2) {
    return new Promise((resolve2, reject) => {
      super.write(chunk2, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve2();
      });
    });
  }
  _sendBody() {
    const { body } = this.options;
    const currentRequest = this.redirectUrls.length === 0 ? this : this._request ?? this;
    if (distribution_default.nodeStream(body)) {
      body.pipe(currentRequest);
    } else if (distribution_default.generator(body) || distribution_default.asyncGenerator(body)) {
      (async () => {
        try {
          for await (const chunk2 of body) {
            await this._asyncWrite(chunk2);
          }
          super.end();
        } catch (error) {
          this._beforeError(error);
        }
      })();
    } else if (!distribution_default.undefined(body)) {
      this._writeRequest(body, void 0, () => {
      });
      currentRequest.end();
    } else if (this._cannotHaveBody || this._noPipe) {
      currentRequest.end();
    }
  }
  _prepareCache(cache) {
    if (!cacheableStore.has(cache)) {
      const cacheableRequest = new dist_default(((requestOptions, handler) => {
        const result = requestOptions._request(requestOptions, handler);
        if (distribution_default.promise(result)) {
          result.once = (event, handler2) => {
            if (event === "error") {
              (async () => {
                try {
                  await result;
                } catch (error) {
                  handler2(error);
                }
              })();
            } else if (event === "abort" || event === "destroy") {
              (async () => {
                try {
                  const request = await result;
                  request.once(event, handler2);
                } catch {
                }
              })();
            } else {
              throw new Error(`Unknown HTTP2 promise event: ${event}`);
            }
            return result;
          };
        }
        return result;
      }), cache);
      cacheableStore.set(cache, cacheableRequest.request());
    }
  }
  async _createCacheableRequest(url, options) {
    return new Promise((resolve2, reject) => {
      Object.assign(options, urlToOptions(url));
      let request;
      const cacheRequest = cacheableStore.get(options.cache)(options, async (response) => {
        response._readableState.autoDestroy = false;
        if (request) {
          const fix = () => {
            if (response.req) {
              response.complete = response.req.res.complete;
            }
          };
          response.prependOnceListener("end", fix);
          fix();
          (await request).emit("cacheableResponse", response);
        }
        resolve2(response);
      });
      cacheRequest.once("error", reject);
      cacheRequest.once("request", async (requestOrPromise) => {
        request = requestOrPromise;
        resolve2(request);
      });
    });
  }
  async _makeRequest() {
    const { options } = this;
    const { headers, username, password } = options;
    const cookieJar = options.cookieJar;
    for (const key in headers) {
      if (distribution_default.undefined(headers[key])) {
        delete headers[key];
      } else if (distribution_default.null(headers[key])) {
        throw new TypeError(`Use \`undefined\` instead of \`null\` to delete the \`${key}\` header`);
      }
    }
    if (options.decompress && distribution_default.undefined(headers["accept-encoding"])) {
      headers["accept-encoding"] = supportsBrotli ? "gzip, deflate, br" : "gzip, deflate";
    }
    if (username || password) {
      const credentials = Buffer3.from(`${username}:${password}`).toString("base64");
      headers.authorization = `Basic ${credentials}`;
    }
    if (cookieJar) {
      const cookieString = await cookieJar.getCookieString(options.url.toString());
      if (distribution_default.nonEmptyString(cookieString)) {
        headers.cookie = cookieString;
      }
    }
    options.prefixUrl = "";
    let request;
    for (const hook of options.hooks.beforeRequest) {
      const result = await hook(options);
      if (!distribution_default.undefined(result)) {
        request = () => result;
        break;
      }
    }
    request ||= options.getRequestFunction();
    const url = options.url;
    this._requestOptions = options.createNativeRequestOptions();
    if (options.cache) {
      this._requestOptions._request = request;
      this._requestOptions.cache = options.cache;
      this._requestOptions.body = options.body;
      this._prepareCache(options.cache);
    }
    const function_ = options.cache ? this._createCacheableRequest : request;
    try {
      let requestOrResponse = function_(url, this._requestOptions);
      if (distribution_default.promise(requestOrResponse)) {
        requestOrResponse = await requestOrResponse;
      }
      if (distribution_default.undefined(requestOrResponse)) {
        requestOrResponse = options.getFallbackRequestFunction()(url, this._requestOptions);
        if (distribution_default.promise(requestOrResponse)) {
          requestOrResponse = await requestOrResponse;
        }
      }
      if (is_client_request_default(requestOrResponse)) {
        this._onRequest(requestOrResponse);
      } else if (this.writable) {
        this.once("finish", () => {
          void this._onResponse(requestOrResponse);
        });
        this._sendBody();
      } else {
        void this._onResponse(requestOrResponse);
      }
    } catch (error) {
      if (error instanceof CacheError2) {
        throw new CacheError(error, this);
      }
      throw error;
    }
  }
  async _error(error) {
    try {
      if (error instanceof HTTPError && !this.options.throwHttpErrors) {
      } else {
        for (const hook of this.options.hooks.beforeError) {
          error = await hook(error);
        }
      }
    } catch (error_) {
      error = new RequestError(error_.message, error_, this);
    }
    this.destroy(error);
  }
  _writeRequest(chunk2, encoding, callback) {
    if (!this._request || this._request.destroyed) {
      return;
    }
    this._request.write(chunk2, encoding, (error) => {
      if (!error && !this._request.destroyed) {
        this._uploadedSize += Buffer3.byteLength(chunk2, encoding);
        const progress = this.uploadProgress;
        if (progress.percent < 1) {
          this.emit("uploadProgress", progress);
        }
      }
      callback(error);
    });
  }
  /**
  The remote IP address.
  */
  get ip() {
    var _a;
    return (_a = this.socket) == null ? void 0 : _a.remoteAddress;
  }
  /**
  Indicates whether the request has been aborted or not.
  */
  get isAborted() {
    return this._aborted;
  }
  get socket() {
    var _a;
    return ((_a = this._request) == null ? void 0 : _a.socket) ?? void 0;
  }
  /**
  Progress event for downloading (receiving a response).
  */
  get downloadProgress() {
    let percent;
    if (this._responseSize) {
      percent = this._downloadedSize / this._responseSize;
    } else if (this._responseSize === this._downloadedSize) {
      percent = 1;
    } else {
      percent = 0;
    }
    return {
      percent,
      transferred: this._downloadedSize,
      total: this._responseSize
    };
  }
  /**
  Progress event for uploading (sending a request).
  */
  get uploadProgress() {
    let percent;
    if (this._bodySize) {
      percent = this._uploadedSize / this._bodySize;
    } else if (this._bodySize === this._uploadedSize) {
      percent = 1;
    } else {
      percent = 0;
    }
    return {
      percent,
      transferred: this._uploadedSize,
      total: this._bodySize
    };
  }
  /**
      The object contains the following properties:
  
      - `start` - Time when the request started.
      - `socket` - Time when a socket was assigned to the request.
      - `lookup` - Time when the DNS lookup finished.
      - `connect` - Time when the socket successfully connected.
      - `secureConnect` - Time when the socket securely connected.
      - `upload` - Time when the request finished uploading.
      - `response` - Time when the request fired `response` event.
      - `end` - Time when the response fired `end` event.
      - `error` - Time when the request fired `error` event.
      - `abort` - Time when the request fired `abort` event.
      - `phases`
          - `wait` - `timings.socket - timings.start`
          - `dns` - `timings.lookup - timings.socket`
          - `tcp` - `timings.connect - timings.lookup`
          - `tls` - `timings.secureConnect - timings.connect`
          - `request` - `timings.upload - (timings.secureConnect || timings.connect)`
          - `firstByte` - `timings.response - timings.upload`
          - `download` - `timings.end - timings.response`
          - `total` - `(timings.end || timings.error || timings.abort) - timings.start`
  
      If something has not been measured yet, it will be `undefined`.
  
      __Note__: The time is a `number` representing the milliseconds elapsed since the UNIX epoch.
      */
  get timings() {
    var _a;
    return (_a = this._request) == null ? void 0 : _a.timings;
  }
  /**
  Whether the response was retrieved from the cache.
  */
  get isFromCache() {
    return this._isFromCache;
  }
  get reusedSocket() {
    var _a;
    return (_a = this._request) == null ? void 0 : _a.reusedSocket;
  }
};

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/as-promise/types.js
init_esm_shims();
var CancelError2 = class extends RequestError {
  constructor(request) {
    super("Promise was canceled", {}, request);
    this.name = "CancelError";
    this.code = "ERR_CANCELED";
  }
  /**
  Whether the promise is canceled.
  */
  get isCanceled() {
    return true;
  }
};

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/as-promise/index.js
var proxiedRequestEvents2 = [
  "request",
  "response",
  "redirect",
  "uploadProgress",
  "downloadProgress"
];
function asPromise(firstRequest) {
  let globalRequest;
  let globalResponse;
  let normalizedOptions;
  const emitter = new EventEmitter2();
  const promise = new PCancelable((resolve2, reject, onCancel) => {
    onCancel(() => {
      globalRequest.destroy();
    });
    onCancel.shouldReject = false;
    onCancel(() => {
      reject(new CancelError2(globalRequest));
    });
    const makeRequest = (retryCount) => {
      var _a;
      onCancel(() => {
      });
      const request = firstRequest ?? new Request(void 0, void 0, normalizedOptions);
      request.retryCount = retryCount;
      request._noPipe = true;
      globalRequest = request;
      request.once("response", async (response) => {
        const contentEncoding = (response.headers["content-encoding"] ?? "").toLowerCase();
        const isCompressed = contentEncoding === "gzip" || contentEncoding === "deflate" || contentEncoding === "br";
        const { options } = request;
        if (isCompressed && !options.decompress) {
          response.body = response.rawBody;
        } else {
          try {
            response.body = parseBody(response, options.responseType, options.parseJson, options.encoding);
          } catch (error) {
            try {
              response.body = response.rawBody.toString();
            } catch (error2) {
              request._beforeError(new ParseError(error2, response));
              return;
            }
            if (isResponseOk(response)) {
              request._beforeError(error);
              return;
            }
          }
        }
        try {
          const hooks = options.hooks.afterResponse;
          for (const [index, hook] of hooks.entries()) {
            response = await hook(response, async (updatedOptions) => {
              options.merge(updatedOptions);
              options.prefixUrl = "";
              if (updatedOptions.url) {
                options.url = updatedOptions.url;
              }
              options.hooks.afterResponse = options.hooks.afterResponse.slice(0, index);
              throw new RetryError(request);
            });
            if (!(distribution_default.object(response) && distribution_default.number(response.statusCode) && !distribution_default.nullOrUndefined(response.body))) {
              throw new TypeError("The `afterResponse` hook returned an invalid value");
            }
          }
        } catch (error) {
          request._beforeError(error);
          return;
        }
        globalResponse = response;
        if (!isResponseOk(response)) {
          request._beforeError(new HTTPError(response));
          return;
        }
        request.destroy();
        resolve2(request.options.resolveBodyOnly ? response.body : response);
      });
      const onError = (error) => {
        if (promise.isCanceled) {
          return;
        }
        const { options } = request;
        if (error instanceof HTTPError && !options.throwHttpErrors) {
          const { response } = error;
          request.destroy();
          resolve2(request.options.resolveBodyOnly ? response.body : response);
          return;
        }
        reject(error);
      };
      request.once("error", onError);
      const previousBody = (_a = request.options) == null ? void 0 : _a.body;
      request.once("retry", (newRetryCount, error) => {
        firstRequest = void 0;
        const newBody = request.options.body;
        if (previousBody === newBody && distribution_default.nodeStream(newBody)) {
          error.message = "Cannot retry with consumed body stream";
          onError(error);
          return;
        }
        normalizedOptions = request.options;
        makeRequest(newRetryCount);
      });
      proxyEvents(request, emitter, proxiedRequestEvents2);
      if (distribution_default.undefined(firstRequest)) {
        void request.flush();
      }
    };
    makeRequest(0);
  });
  promise.on = (event, function_) => {
    emitter.on(event, function_);
    return promise;
  };
  promise.off = (event, function_) => {
    emitter.off(event, function_);
    return promise;
  };
  const shortcut = (responseType) => {
    const newPromise = (async () => {
      await promise;
      const { options } = globalResponse.request;
      return parseBody(globalResponse, responseType, options.parseJson, options.encoding);
    })();
    Object.defineProperties(newPromise, Object.getOwnPropertyDescriptors(promise));
    return newPromise;
  };
  promise.json = () => {
    if (globalRequest.options) {
      const { headers } = globalRequest.options;
      if (!globalRequest.writableFinished && !("accept" in headers)) {
        headers.accept = "application/json";
      }
    }
    return shortcut("json");
  };
  promise.buffer = () => shortcut("buffer");
  promise.text = () => shortcut("text");
  return promise;
}

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/create.js
var isGotInstance = (value) => distribution_default.function(value);
var aliases = [
  "get",
  "post",
  "put",
  "patch",
  "head",
  "delete"
];
var create = (defaults2) => {
  defaults2 = {
    options: new Options(void 0, void 0, defaults2.options),
    handlers: [...defaults2.handlers],
    mutableDefaults: defaults2.mutableDefaults
  };
  Object.defineProperty(defaults2, "mutableDefaults", {
    enumerable: true,
    configurable: false,
    writable: false
  });
  const got2 = ((url, options, defaultOptions2 = defaults2.options) => {
    const request = new Request(url, options, defaultOptions2);
    let promise;
    const lastHandler = (normalized) => {
      request.options = normalized;
      request._noPipe = !(normalized == null ? void 0 : normalized.isStream);
      void request.flush();
      if (normalized == null ? void 0 : normalized.isStream) {
        return request;
      }
      promise ||= asPromise(request);
      return promise;
    };
    let iteration = 0;
    const iterateHandlers = (newOptions) => {
      var _a;
      const handler = defaults2.handlers[iteration++] ?? lastHandler;
      const result = handler(newOptions, iterateHandlers);
      if (distribution_default.promise(result) && !((_a = request.options) == null ? void 0 : _a.isStream)) {
        promise ||= asPromise(request);
        if (result !== promise) {
          const descriptors = Object.getOwnPropertyDescriptors(promise);
          for (const key in descriptors) {
            if (key in result) {
              delete descriptors[key];
            }
          }
          Object.defineProperties(result, descriptors);
          result.cancel = promise.cancel;
        }
      }
      return result;
    };
    return iterateHandlers(request.options);
  });
  got2.extend = (...instancesOrOptions) => {
    const options = new Options(void 0, void 0, defaults2.options);
    const handlers = [...defaults2.handlers];
    let mutableDefaults;
    for (const value of instancesOrOptions) {
      if (isGotInstance(value)) {
        options.merge(value.defaults.options);
        handlers.push(...value.defaults.handlers);
        mutableDefaults = value.defaults.mutableDefaults;
      } else {
        options.merge(value);
        if (value.handlers) {
          handlers.push(...value.handlers);
        }
        mutableDefaults = value.mutableDefaults;
      }
    }
    return create({
      options,
      handlers,
      mutableDefaults: Boolean(mutableDefaults)
    });
  };
  const paginateEach = (async function* (url, options) {
    let normalizedOptions = new Options(url, options, defaults2.options);
    normalizedOptions.resolveBodyOnly = false;
    const { pagination } = normalizedOptions;
    assert.function(pagination.transform);
    assert.function(pagination.shouldContinue);
    assert.function(pagination.filter);
    assert.function(pagination.paginate);
    assert.number(pagination.countLimit);
    assert.number(pagination.requestLimit);
    assert.number(pagination.backoff);
    const allItems = [];
    let { countLimit } = pagination;
    let numberOfRequests = 0;
    while (numberOfRequests < pagination.requestLimit) {
      if (numberOfRequests !== 0) {
        await delay(pagination.backoff);
      }
      const response = await got2(void 0, void 0, normalizedOptions);
      const parsed = await pagination.transform(response);
      const currentItems = [];
      assert.array(parsed);
      for (const item of parsed) {
        if (pagination.filter({ item, currentItems, allItems })) {
          if (!pagination.shouldContinue({ item, currentItems, allItems })) {
            return;
          }
          yield item;
          if (pagination.stackAllItems) {
            allItems.push(item);
          }
          currentItems.push(item);
          if (--countLimit <= 0) {
            return;
          }
        }
      }
      const optionsToMerge = pagination.paginate({
        response,
        currentItems,
        allItems
      });
      if (optionsToMerge === false) {
        return;
      }
      if (optionsToMerge === response.request.options) {
        normalizedOptions = response.request.options;
      } else {
        normalizedOptions.merge(optionsToMerge);
        assert.any([distribution_default.urlInstance, distribution_default.undefined], optionsToMerge.url);
        if (optionsToMerge.url !== void 0) {
          normalizedOptions.prefixUrl = "";
          normalizedOptions.url = optionsToMerge.url;
        }
      }
      numberOfRequests++;
    }
  });
  got2.paginate = paginateEach;
  got2.paginate.all = (async (url, options) => {
    const results = [];
    for await (const item of paginateEach(url, options)) {
      results.push(item);
    }
    return results;
  });
  got2.paginate.each = paginateEach;
  got2.stream = ((url, options) => got2(url, { ...options, isStream: true }));
  for (const method of aliases) {
    got2[method] = ((url, options) => got2(url, { ...options, method }));
    got2.stream[method] = ((url, options) => got2(url, { ...options, method, isStream: true }));
  }
  if (!defaults2.mutableDefaults) {
    Object.freeze(defaults2.handlers);
    defaults2.options.freeze();
  }
  Object.defineProperty(got2, "defaults", {
    value: defaults2,
    writable: false,
    configurable: false,
    enumerable: true
  });
  return got2;
};
var create_default = create;

// node_modules/.pnpm/got@14.4.7/node_modules/got/dist/source/index.js
var defaults = {
  options: new Options(),
  handlers: [],
  mutableDefaults: false
};
var got = create_default(defaults);
var source_default2 = got;

// src/ip.ts
import { HttpsProxyAgent } from "hpagent";
var InvalidIP = class extends Error {
};
var InvalidProxy = class extends Error {
};
function validIPv4(ip) {
  if (!ip) {
    return false;
  }
  return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);
}
function validIPv6(ip) {
  if (!ip) {
    return false;
  }
  return /^(([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4})$/.test(ip);
}
function validateIP(ip) {
  if (!validIPv4(ip) && !validIPv6(ip)) {
    throw new InvalidIP(`Invalid IP address: ${ip}`);
  }
}
async function publicIP(proxy) {
  const URLS = [
    "https://api.ipify.org",
    "https://checkip.amazonaws.com",
    "https://ipinfo.io/ip",
    "https://icanhazip.com",
    "https://ifconfig.co/ip",
    "https://ipecho.net/plain"
  ];
  for (const url of URLS) {
    try {
      const response = await source_default2.get(url, {
        agent: {
          https: new HttpsProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1e3,
            maxSockets: 256,
            maxFreeSockets: 256,
            scheduling: "lifo",
            proxy
          })
        },
        responseType: "text"
      });
      if (!response.ok) {
        continue;
      }
      const ip = response.body.trim();
      validateIP(ip);
      return ip;
    } catch (error) {
      console.warn(new InvalidProxy(`Failed to connect to proxy: ${proxy}`));
    }
  }
  throw new InvalidIP("Failed to get IP address");
}

// src/locale.ts
init_esm_shims();

// src/warnings.ts
init_esm_shims();
import { join as join3 } from "path";
var WARNINGS_DATA = loadYaml(join3(LOCAL_DATA.toString(), "warnings.yml"));
var LeakWarning = class extends Error {
  constructor(message) {
    super(message);
    this.name = "LeakWarning";
  }
  static warn(warningKey, iKnowWhatImDoing) {
    let warning = WARNINGS_DATA[warningKey];
    if (iKnowWhatImDoing) {
      return;
    }
    if (iKnowWhatImDoing !== void 0) {
      warning += "\nIf this is intentional, pass `iKnowWhatImDoing=true`.";
    }
    const currentModule = __dirname;
    const originalStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack2) => stack2;
    const err = new Error();
    const stack = err.stack;
    Error.prepareStackTrace = originalStackTrace;
    for (const frame of stack) {
      const frameFileName = frame.getFileName();
      if (frameFileName && !frameFileName.startsWith(currentModule)) {
        console.warn(`${warning} at ${frameFileName}:${frame.getLineNumber()}`);
        return;
      }
    }
    console.warn(warning);
  }
};

// src/locale.ts
import tags from "language-tags";
import * as fs2 from "fs";
import * as path3 from "path";
import maxmind from "maxmind";
import xml2js from "xml2js";
var ALLOW_GEOIP = true;
var Locale = class {
  constructor(language, region, script) {
    this.language = language;
    this.region = region;
    this.script = script;
  }
  asString() {
    if (this.region) {
      return `${this.language}-${this.region}`;
    }
    return this.language;
  }
  asConfig() {
    if (!this.region) {
      throw new Error("Region is required for config");
    }
    const data = {
      "locale:region": this.region,
      "locale:language": this.language
    };
    if (this.script) {
      data["locale:script"] = this.script;
    }
    return data;
  }
};
var Geolocation = class {
  constructor(locale, longitude, latitude, timezone, accuracy) {
    this.locale = locale;
    this.longitude = longitude;
    this.latitude = latitude;
    this.timezone = timezone;
    this.accuracy = accuracy;
  }
  asConfig() {
    const data = {
      "geolocation:longitude": this.longitude,
      "geolocation:latitude": this.latitude,
      "timezone": this.timezone,
      ...this.locale.asConfig()
    };
    if (this.accuracy !== void 0) {
      data["geolocation:accuracy"] = this.accuracy;
    }
    return data;
  }
};
function verifyLocale(loc) {
  if (tags.check(loc)) {
    return;
  }
  throw InvalidLocale.invalidInput(loc);
}
function normalizeLocale(locale) {
  var _a, _b;
  verifyLocale(locale);
  const parser = tags(locale);
  if (!parser.region) {
    throw InvalidLocale.invalidInput(locale);
  }
  const record = (_a = parser.language()) == null ? void 0 : _a.data["record"];
  return new Locale(
    record["Subtag"],
    (_b = parser.region()) == null ? void 0 : _b.data["record"]["Subtag"],
    record["Suppress-Script"]
  );
}
function handleLocale(locale, ignoreRegion = false) {
  if (locale.length > 3) {
    return normalizeLocale(locale);
  }
  try {
    return SELECTOR.fromRegion(locale);
  } catch (e) {
    if (e instanceof UnknownTerritory) {
    } else {
      throw e;
    }
  }
  if (ignoreRegion) {
    verifyLocale(locale);
    return new Locale(locale);
  }
  try {
    const language = SELECTOR.fromLanguage(locale);
    LeakWarning.warn("no_region");
    return language;
  } catch (e) {
    if (e instanceof UnknownLanguage) {
    } else {
      throw e;
    }
  }
  throw InvalidLocale.invalidInput(locale);
}
function handleLocales(locales, config) {
  if (typeof locales === "string") {
    locales = locales.split(",").map((loc) => loc.trim());
  }
  const intlLocale = handleLocale(locales[0]).asConfig();
  for (const key in intlLocale) {
    config[key] = intlLocale[key];
  }
  if (locales.length < 2) {
    return;
  }
  config["locale:all"] = joinUnique(locales.map((locale) => handleLocale(locale, true).asString()));
}
function joinUnique(seq) {
  const seen = /* @__PURE__ */ new Set();
  return seq.filter((x) => !seen.has(x) && seen.add(x)).join(", ");
}
var MMDB_FILE = path3.join(INSTALL_DIR.toString(), "GeoLite2-City.mmdb");
var MMDB_REPO = "P3TERX/GeoLite.mmdb";
var MaxMindDownloader = class extends GitHubDownloader {
  checkAsset(asset) {
    if (asset["name"].endsWith("-City.mmdb")) {
      return asset["browser_download_url"];
    }
    return null;
  }
  missingAssetError() {
    throw new MissingRelease("Failed to find GeoIP database release asset");
  }
};
function geoipAllowed() {
  if (!ALLOW_GEOIP) {
    throw new NotInstalledGeoIPExtra(
      "Please install the geoip extra to use this feature: pip install camoufox[geoip]"
    );
  }
}
async function downloadMMDB(mmdb_file = MMDB_FILE) {
  geoipAllowed();
  if (getAsBooleanFromENV("PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD", false)) {
    console.log("Skipping GeoIP database download due to PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD set!");
    return;
  }
  const assetUrl = await new MaxMindDownloader(MMDB_REPO).getAsset();
  const dir = path3.dirname(mmdb_file);
  if (!fs2.existsSync(dir)) {
    fs2.mkdirSync(dir, { recursive: true });
  }
  const fileStream = fs2.createWriteStream(mmdb_file);
  await webdl(assetUrl, "Downloading GeoIP database", true, fileStream);
}
function removeMMDB(mmdb_file = MMDB_FILE) {
  if (!fs2.existsSync(mmdb_file)) {
    console.log("GeoIP database not found.");
    return;
  }
  fs2.unlinkSync(mmdb_file);
  console.log("GeoIP database removed.");
}
async function getGeolocation(ip, mmdb_file = MMDB_FILE) {
  var _a;
  if (!fs2.existsSync(mmdb_file)) {
    await downloadMMDB(mmdb_file);
  }
  validateIP(ip);
  const reader = await maxmind.open(mmdb_file);
  const resp = reader.get(ip);
  const isoCode = (_a = resp.country) == null ? void 0 : _a.iso_code.toUpperCase();
  const location = resp.location;
  if (!(location == null ? void 0 : location.longitude) || !(location == null ? void 0 : location.latitude) || !(location == null ? void 0 : location.time_zone) || !isoCode) {
    throw new UnknownIPLocation(`Unknown IP location: ${ip}`);
  }
  const locale = SELECTOR.fromRegion(isoCode);
  return new Geolocation(
    locale,
    location.longitude,
    location.latitude,
    location.time_zone
  );
}
async function getUnicodeInfo() {
  const data = await fs2.promises.readFile(path3.join(LOCAL_DATA.toString(), "territoryInfo.xml"));
  const parser = new xml2js.Parser();
  return parser.parseStringPromise(data);
}
function asFloat(element, attr) {
  return parseFloat(element[attr] || "0");
}
var StatisticalLocaleSelector = class {
  root;
  constructor() {
    this.loadUnicodeInfo();
  }
  async loadUnicodeInfo() {
    this.root = await getUnicodeInfo();
  }
  loadTerritoryData(isoCode) {
    const territory = this.root.territoryInfo.territory.find((t) => t.$.type === isoCode);
    if (!territory) {
      throw new UnknownTerritory(`Unknown territory: ${isoCode}`);
    }
    const langPopulations = territory.languagePopulation;
    if (!langPopulations) {
      throw new Error(`No language data found for region: ${isoCode}`);
    }
    const languages = langPopulations.map((lang) => lang.$.type);
    const percentages = langPopulations.map((lang) => asFloat(lang.$, "populationPercent"));
    return this.normalizeProbabilities(languages, percentages);
  }
  loadLanguageData(language) {
    const territories = this.root.territory.filter(
      (t) => t.languagePopulation.some((lp) => lp.$.type === language)
    );
    if (!territories.length) {
      throw new UnknownLanguage(`No region data found for language: ${language}`);
    }
    const regions = [];
    const percentages = [];
    for (const terr of territories) {
      const region = terr.$.type;
      const langPop = terr.languagePopulation.find((lp) => lp.$.type === language);
      if (region && langPop) {
        regions.push(region);
        percentages.push(
          asFloat(langPop.$, "populationPercent") * asFloat(terr.$, "literacyPercent") / 1e4 * asFloat(terr.$, "population")
        );
      }
    }
    if (!regions.length) {
      throw new Error(`No valid region data found for language: ${language}`);
    }
    return this.normalizeProbabilities(regions, percentages);
  }
  normalizeProbabilities(languages, freq) {
    const total = freq.reduce((a2, b) => a2 + b, 0);
    return [languages, freq.map((f) => f / total)];
  }
  weightedRandomChoice(items, weights) {
    const cumulativeWeights = weights.map(/* @__PURE__ */ ((sum) => (value) => sum += value)(0));
    const random = Math.random() * cumulativeWeights[cumulativeWeights.length - 1];
    return items[cumulativeWeights.findIndex((weight) => weight > random)];
  }
  fromRegion(region) {
    const [languages, probabilities] = this.loadTerritoryData(region);
    const language = this.weightedRandomChoice(languages, probabilities).replace("_", "-");
    return normalizeLocale(`${language}-${region}`);
  }
  fromLanguage(language) {
    const [regions, probabilities] = this.loadLanguageData(language);
    const region = this.weightedRandomChoice(regions, probabilities);
    return normalizeLocale(`${language}-${region}`);
  }
};
var SELECTOR = new StatisticalLocaleSelector();

// src/webgl/sample.ts
init_esm_shims();
import path4 from "path";
import fs3 from "fs";
import initSqlJs from "sql.js";
var DB_PATH = path4.join(LOCAL_DATA.toString(), "webgl_data.db");
async function sampleWebGL(os3, vendor, renderer) {
  if (!OS_ARCH_MATRIX[os3]) {
    throw new Error(`Invalid OS: ${os3}. Must be one of: ${Object.keys(OS_ARCH_MATRIX).join(", ")}`);
  }
  const SQL = await initSqlJs();
  const dbBuffer = fs3.readFileSync(DB_PATH);
  const db = new SQL.Database(new Uint8Array(dbBuffer));
  try {
    let query = "";
    let params = [];
    if (vendor && renderer) {
      query = `SELECT vendor, renderer, data, ${os3} FROM webgl_fingerprints WHERE vendor = ? AND renderer = ?`;
      params = [vendor, renderer];
    } else {
      query = `SELECT vendor, renderer, data, ${os3} FROM webgl_fingerprints WHERE ${os3} > 0`;
    }
    const stmt = db.prepare(query);
    const rows = [];
    stmt.bind(params);
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    if (rows.length === 0) {
      throw new Error(`No WebGL data found for OS: ${os3}`);
    }
    if (vendor && renderer) {
      const result = rows[0];
      if (result[os3] <= 0) {
        const pairsStmt = db.prepare(`SELECT DISTINCT vendor, renderer FROM webgl_fingerprints WHERE ${os3} > 0`);
        const pairs = [];
        while (pairsStmt.step()) {
          pairs.push(pairsStmt.getAsObject());
        }
        pairsStmt.free();
        throw new Error(`Vendor "${vendor}" and renderer "${renderer}" combination not valid for ${os3}. Possible pairs: ${pairs.map((pair) => `${pair.vendor}, ${pair.renderer}`).join(", ")}`);
      }
      return JSON.parse(result.data);
    } else {
      let weightedRandomChoice = function(weights) {
        const sum = weights.reduce((acc, weight) => acc + weight, 0);
        const threshold = Math.random() * sum;
        let cumulativeSum = 0;
        for (let i2 = 0; i2 < weights.length; i2++) {
          cumulativeSum += weights[i2];
          if (cumulativeSum >= threshold) {
            return i2;
          }
        }
        return weights.length - 1;
      };
      const dataStrs = rows.map((row) => row.data);
      const probs = rows.map((row) => row[os3]);
      const probsArray = probs.map((p) => p / probs.reduce((a2, b) => a2 + b, 0));
      const idx = weightedRandomChoice(probsArray);
      return JSON.parse(dataStrs[idx]);
    }
  } finally {
    db.close();
  }
}

// src/utils.ts
import { readFileSync as readFileSync2 } from "fs";
import { join as join5 } from "path";
import { UAParser } from "ua-parser-js";
var CACHE_PREFS = {
  "browser.sessionhistory.max_entries": 10,
  "browser.sessionhistory.max_total_viewers": -1,
  "browser.cache.memory.enable": true,
  "browser.cache.disk_cache_ssl": true,
  "browser.cache.disk.smart_size.enabled": true
};
function getEnvVars(configMap, userAgentOS) {
  const envVars = {};
  let updatedConfigData;
  try {
    updatedConfigData = new TextEncoder().encode(JSON.stringify(configMap));
  } catch (e) {
    console.error(`Error updating config: ${e}`);
    process.exit(1);
  }
  const chunkSize = OS_NAME === "win" ? 2047 : 32767;
  const configStr = new TextDecoder().decode(updatedConfigData);
  for (let i2 = 0; i2 < configStr.length; i2 += chunkSize) {
    const chunk2 = configStr.slice(i2, i2 + chunkSize);
    const envName = `CAMOU_CONFIG_${Math.floor(i2 / chunkSize) + 1}`;
    try {
      envVars[envName] = chunk2;
    } catch (e) {
      console.error(`Error setting ${envName}: ${e}`);
      process.exit(1);
    }
  }
  if (OS_NAME === "lin") {
    const fontconfigPath = getPath(path5.join("fontconfig", userAgentOS));
    envVars["FONTCONFIG_PATH"] = fontconfigPath;
  }
  return envVars;
}
function getAsBooleanFromENV(name, defaultValue) {
  const value = process.env[name];
  if (value === "false" || value === "0")
    return false;
  if (value)
    return true;
  return !!defaultValue;
}
function loadProperties(filePath) {
  let propFile;
  filePath = filePath == null ? void 0 : filePath.toString();
  if (filePath) {
    propFile = path5.join(path5.dirname(filePath), "properties.json");
  } else {
    propFile = getPath("properties.json");
  }
  const propData = readFileSync2(propFile).toString();
  const propDict = JSON.parse(propData);
  return propDict.reduce((acc, prop) => {
    acc[prop.property] = prop.type;
    return acc;
  }, {});
}
function validateConfig(configMap, path6) {
  const propertyTypes = loadProperties(path6);
  for (const [key, value] of Object.entries(configMap)) {
    const expectedType = propertyTypes[key];
    if (!expectedType) {
      throw new UnknownProperty(`Unknown property ${key} in config`);
    }
    if (!validateType(value, expectedType)) {
      throw new InvalidPropertyType(`Invalid type for property ${key}. Expected ${expectedType}, got ${typeof value}`);
    }
  }
}
function validateType(value, expectedType) {
  switch (expectedType) {
    case "str":
      return typeof value === "string";
    case "int":
      return Number.isInteger(value);
    case "uint":
      return Number.isInteger(value) && value >= 0;
    case "double":
      return typeof value === "number";
    case "bool":
      return typeof value === "boolean";
    case "array":
      return Array.isArray(value);
    case "dict":
      return typeof value === "object" && value !== null && !Array.isArray(value);
    default:
      return false;
  }
}
function getTargetOS(config) {
  if (config["navigator.userAgent"]) {
    return determineUAOS(config["navigator.userAgent"]);
  }
  return OS_NAME;
}
function determineUAOS(userAgent) {
  const parser = new UAParser(userAgent);
  const parsedUA = parser.getOS().name;
  if (!parsedUA) {
    throw new Error("Could not determine OS from user agent");
  }
  if (parsedUA.startsWith("Mac") || parsedUA.startsWith("macOS")) {
    return "mac";
  }
  if (parsedUA.startsWith("Windows")) {
    return "win";
  }
  return "lin";
}
function getScreenCons(headless) {
  if (headless === false) {
    return null;
  }
  return null;
}
function updateFonts(config, targetOS) {
  const fontsPath = join5(LOCAL_DATA.toString(), "fonts.json");
  const fonts = JSON.parse(readFileSync2(fontsPath, "utf-8"))[targetOS];
  if (config.fonts) {
    config.fonts = Array.from(/* @__PURE__ */ new Set([...fonts, ...config.fonts]));
  } else {
    config.fonts = fonts;
  }
}
function checkCustomFingerprint(fingerprint) {
  const parser = new UAParser(fingerprint.navigator.userAgent);
  const browserName = parser.getBrowser().name || "Non-Firefox";
  if (browserName !== "Firefox") {
    throw new NonFirefoxFingerprint(`"${browserName}" fingerprints are not supported in Camoufox. Using fingerprints from a browser other than Firefox WILL lead to detection. If this is intentional, pass i_know_what_im_doing=True.`);
  }
  LeakWarning.warn("custom_fingerprint", false);
}
function checkValidOS(os3) {
  if (Array.isArray(os3)) {
    os3.forEach(checkValidOS);
    return;
  }
  if (!os3.toLowerCase()) {
    throw new InvalidOS(`OS values must be lowercase: '${os3}'`);
  }
}
function mergeInto(target, source) {
  Object.entries(source).forEach(([key, value]) => {
    if (!(key in target)) {
      target[key] = value;
    }
  });
}
function setInto(target, key, value) {
  if (!(key in target)) {
    target[key] = value;
  }
}
function isDomainSet(config, ...properties) {
  return properties.some((prop) => {
    if (prop.endsWith(".") || prop.endsWith(":")) {
      return Object.keys(config).some((key) => key.startsWith(prop));
    }
    return prop in config;
  });
}
function warnManualConfig(config) {
  if (isDomainSet(config, "navigator.language", "navigator.languages", "headers.Accept-Language", "locale:")) {
    LeakWarning.warn("locale", false);
  }
  if (isDomainSet(config, "geolocation:", "timezone")) {
    LeakWarning.warn("geolocation", false);
  }
  if (isDomainSet(config, "headers.User-Agent")) {
    LeakWarning.warn("header-ua", false);
  }
  if (isDomainSet(config, "navigator.")) {
    LeakWarning.warn("navigator", false);
  }
  if (isDomainSet(config, "screen.", "window.", "document.body.")) {
    LeakWarning.warn("viewport", false);
  }
}
function syncAttachVD(browser, virtualDisplay) {
  if (!virtualDisplay) {
    return browser;
  }
  const originalClose = browser.close;
  browser.close = (...args) => {
    originalClose.apply(browser, ...args);
    if (virtualDisplay) {
      virtualDisplay.kill();
    }
  };
  browser._virtualDisplay = virtualDisplay;
  return browser;
}
function getProxyUrl(proxy) {
  if (typeof proxy === "string") {
    return new URL(proxy);
  }
  const { server, username, password } = proxy;
  let url;
  try {
    url = new URL(server);
    if (!url.host || !url.protocol)
      url = new URL("http://" + server);
  } catch (e) {
    url = new URL("http://" + server);
  }
  if (username) url.username = username;
  if (password) url.password = password;
  return url;
}
async function launchOptions({
  config,
  os: os3,
  block_images,
  block_webrtc,
  block_webgl,
  disable_coop,
  webgl_config,
  geoip,
  geoip_file,
  humanize,
  locale,
  addons,
  fonts,
  custom_fonts_only,
  exclude_addons,
  screen,
  window,
  fingerprint,
  ff_version,
  headless,
  main_world_eval,
  executable_path,
  firefox_user_prefs,
  proxy,
  enable_cache,
  args,
  env,
  i_know_what_im_doing,
  debug,
  virtual_display,
  ...launch_options
}) {
  if (!config) {
    config = {};
  }
  if (headless === void 0) {
    headless = false;
  }
  if (!addons) {
    addons = [];
  }
  if (!args) {
    args = [];
  }
  if (!firefox_user_prefs) {
    firefox_user_prefs = {};
  }
  if (custom_fonts_only === void 0) {
    custom_fonts_only = false;
  }
  if (i_know_what_im_doing === void 0) {
    i_know_what_im_doing = false;
  }
  if (!env) {
    env = process.env;
  }
  if (typeof executable_path === "string") {
    executable_path = path5.resolve(executable_path);
  }
  if (virtual_display) {
    env["DISPLAY"] = virtual_display;
  }
  if (!i_know_what_im_doing) {
    warnManualConfig(config);
  }
  if (os3) {
    checkValidOS(os3);
  } else if (webgl_config) {
    throw new Error("OS must be set when using webgl_config");
  }
  addDefaultAddons(addons, exclude_addons);
  if (addons.length > 0) {
    confirmPaths(addons);
    config["addons"] = addons;
  }
  let ff_version_str;
  if (ff_version) {
    ff_version_str = ff_version.toString();
    LeakWarning.warn("ff_version", i_know_what_im_doing);
  } else {
    ff_version_str = installedVerStr().split(".", 1)[0];
  }
  if (!fingerprint) {
    fingerprint = generateFingerprint(
      window,
      {
        screen: screen || getScreenCons(headless || "DISPLAY" in env),
        os: os3
      }
    );
  } else {
    if (!i_know_what_im_doing) {
      checkCustomFingerprint(fingerprint);
    }
  }
  mergeInto(
    config,
    fromBrowserforge(fingerprint, ff_version_str)
  );
  const targetOS = getTargetOS(config);
  setInto(config, "window.history.length", Math.floor(Math.random() * 5) + 1);
  if (fonts) {
    config["fonts"] = fonts;
  }
  if (custom_fonts_only) {
    firefox_user_prefs["gfx.bundled-fonts.activate"] = 0;
    if (fonts) {
      LeakWarning.warn("custom_fonts_only");
    } else {
      throw new Error("No custom fonts were passed, but `custom_fonts_only` is enabled.");
    }
  } else {
    updateFonts(config, targetOS);
  }
  setInto(config, "fonts:spacing_seed", Math.floor(Math.random() * 1073741824));
  const proxyUrl = proxy ? getProxyUrl(proxy) : void 0;
  if (geoip) {
    geoipAllowed();
    geoip = await publicIP(proxyUrl == null ? void 0 : proxyUrl.href);
    if (!block_webrtc) {
      if (validIPv4(geoip)) {
        setInto(config, "webrtc:ipv4", geoip);
        firefox_user_prefs["network.dns.disableIPv6"] = true;
      } else if (validIPv6(geoip)) {
        setInto(config, "webrtc:ipv6", geoip);
      }
    }
    const geolocation = await getGeolocation(geoip, geoip_file);
    config = { ...config, ...geolocation.asConfig() };
  }
  if (proxyUrl && !proxyUrl.hostname.includes("localhost") && !isDomainSet(config, "geolocation:")) {
    LeakWarning.warn("proxy_without_geoip");
  }
  if (locale) {
    handleLocales(locale, config);
  }
  if (humanize) {
    setInto(config, "humanize", true);
    if (typeof humanize === "number") {
      setInto(config, "humanize:maxTime", humanize);
    }
  }
  if (main_world_eval) {
    setInto(config, "allowMainWorld", true);
  }
  if (block_images) {
    LeakWarning.warn("block_images", i_know_what_im_doing);
    firefox_user_prefs["permissions.default.image"] = 2;
  }
  if (block_webrtc) {
    firefox_user_prefs["media.peerconnection.enabled"] = false;
  }
  if (disable_coop) {
    LeakWarning.warn("disable_coop", i_know_what_im_doing);
    firefox_user_prefs["browser.tabs.remote.useCrossOriginOpenerPolicy"] = false;
  }
  if (block_webgl || launch_options.allow_webgl === false) {
    firefox_user_prefs["webgl.disabled"] = true;
    LeakWarning.warn("block_webgl", i_know_what_im_doing);
  } else {
    let webgl_fp;
    if (webgl_config) {
      webgl_fp = sampleWebGL(targetOS, ...webgl_config);
    } else {
      webgl_fp = sampleWebGL(targetOS);
    }
    const enable_webgl2 = webgl_fp.webGl2Enabled ?? false;
    mergeInto(config, webgl_fp);
    mergeInto(
      firefox_user_prefs,
      {
        "webgl.enable-webgl2": enable_webgl2,
        "webgl.force-enabled": true
      }
    );
  }
  mergeInto(
    config,
    {
      "canvas:aaOffset": Math.floor(Math.random() * 101) - 50,
      // nosec
      "canvas:aaCapOffset": true
    }
  );
  if (enable_cache) {
    mergeInto(firefox_user_prefs, CACHE_PREFS);
  }
  if (debug) {
    console.debug("[DEBUG] Config:");
    console.debug(config);
  }
  validateConfig(config, executable_path);
  const env_vars = {
    ...getEnvVars(config, targetOS),
    ...process.env
  };
  if (executable_path) {
    executable_path = executable_path.toString();
  } else {
    executable_path = launchPath();
  }
  const out = {
    "executablePath": executable_path,
    "args": args,
    "env": env_vars,
    "firefoxUserPrefs": firefox_user_prefs,
    "proxy": proxyUrl ? {
      server: proxyUrl.origin,
      username: proxyUrl.username,
      password: proxyUrl.password,
      bypass: typeof proxy === "string" ? void 0 : proxy.bypass
    } : void 0,
    //@ts-ignore
    "headless": headless,
    ...launch_options
  };
  return out;
}

// src/addons.ts
var DefaultAddons2 = {
  /**
   * Default addons to be downloaded
   */
  UBO: "https://addons.mozilla.org/firefox/downloads/latest/ublock-origin/latest.xpi"
};
function confirmPaths(paths) {
  for (const path6 of paths) {
    if (!fs4.existsSync(path6) || !fs4.lstatSync(path6).isDirectory()) {
      throw new InvalidAddonPath(path6);
    }
    if (!fs4.existsSync(join6(path6, "manifest.json"))) {
      throw new InvalidAddonPath(
        "manifest.json is missing. Addon path must be a path to an extracted addon."
      );
    }
  }
}
function addDefaultAddons(addonsList, excludeList = []) {
}
async function downloadAndExtract(url, extractPath, name) {
  const buffer = await webdl(url, `Downloading addon (${name})`, false);
  unzip(buffer, extractPath, `Extracting addon (${name})`, false);
}
function getAddonPath(addonName) {
  return getPath(join6("addons", addonName));
}
function maybeDownloadAddons(addons, addonsList = []) {
  if (getAsBooleanFromENV("PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD", false)) {
    console.log("Skipping addon download due to PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD set!");
    return;
  }
  for (const addonName in addons) {
    const addonPath = getAddonPath(addonName);
    if (fs4.existsSync(addonPath)) {
      addonsList.push(addonPath);
      continue;
    }
    try {
      fs4.mkdirSync(addonPath, { recursive: true });
      downloadAndExtract(addons[addonName], addonPath, addonName);
      addonsList.push(addonPath);
    } catch (e) {
      console.error(`Failed to download and extract ${addonName}: ${e}`);
    }
  }
}

// src/sync_api.ts
init_esm_shims();
import {
  firefox
} from "playwright-core";

// src/virtdisplay.ts
init_esm_shims();
import { execFileSync, spawn } from "child_process";
import { existsSync as existsSync3 } from "fs";
import { tmpdir } from "os";
import { randomInt } from "crypto";
var VirtualDisplay = class _VirtualDisplay {
  debug;
  proc = null;
  _display = null;
  // private _lock = new Lock();
  constructor(debug = false) {
    this.debug = debug;
  }
  get xvfb_args() {
    return [
      "-screen",
      "0",
      "1x1x24",
      "-ac",
      "-nolisten",
      "tcp",
      "-extension",
      "RENDER",
      "+extension",
      "GLX",
      "-extension",
      "COMPOSITE",
      "-extension",
      "XVideo",
      "-extension",
      "XVideo-MotionCompensation",
      "-extension",
      "XINERAMA",
      "-shmem",
      "-fp",
      "built-ins",
      "-nocursor",
      "-br"
    ];
  }
  get xvfb_path() {
    const path6 = execFileSync("which", ["Xvfb"]).toString().trim();
    if (!path6) {
      throw new CannotFindXvfb("Please install Xvfb to use headless mode.");
    }
    if (!existsSync3(path6) || !execFileSync("test", ["-x", path6])) {
      throw new CannotExecuteXvfb(`I do not have permission to execute Xvfb: ${path6}`);
    }
    return path6;
  }
  get xvfb_cmd() {
    return [this.xvfb_path, `:${this.display}`, ...this.xvfb_args];
  }
  execute_xvfb() {
    if (this.debug) {
      console.log("Starting virtual display:", this.xvfb_cmd.join(" "));
    }
    this.proc = spawn(this.xvfb_cmd[0], this.xvfb_cmd.slice(1), {
      stdio: this.debug ? "inherit" : "ignore",
      detached: true
    });
  }
  get() {
    _VirtualDisplay.assert_linux();
    if (!this.proc) {
      this.execute_xvfb();
    } else if (this.debug) {
      console.log(`Using virtual display: ${this.display}`);
    }
    return `:${this.display}`;
  }
  kill() {
    if (this.proc && !this.proc.killed) {
      if (this.debug) {
        console.log("Terminating virtual display:", this.display);
      }
      this.proc.kill();
    }
  }
  static _get_lock_files() {
    const tmpd = process.env.TMPDIR || tmpdir();
    try {
      return [];
    } catch {
      return [];
    }
  }
  static _free_display() {
    const ls = _VirtualDisplay._get_lock_files().map((x) => parseInt(x.split("X")[1].split("-")[0]));
    return ls.length ? Math.max(99, Math.max(...ls) + randomInt(3, 20)) : 99;
  }
  get display() {
    if (this._display === null) {
      this._display = _VirtualDisplay._free_display();
    }
    return this._display;
  }
  static assert_linux() {
    if (OS_NAME !== "lin") {
      throw new VirtualDisplayNotSupported("Virtual display is only supported on Linux.");
    }
  }
};

// src/browser.ts
init_esm_shims();
async function checkBrowser(launch_options) {
  if (launch_options.executable_path) {
    return;
  }
  const exePath = launchPath();
  launch_options.executable_path = exePath;
}

// src/sync_api.ts
async function Camoufox(launch_options) {
  const { headless, ...launchOptions2 } = launch_options;
  await checkBrowser(launchOptions2);
  return NewBrowser(firefox, headless, {}, false, false, launchOptions2);
}
async function NewBrowser(playwright, headless = false, fromOptions = {}, persistentContext = false, debug = false, launch_options = {}) {
  let virtualDisplay = null;
  if (headless === "virtual") {
    virtualDisplay = new VirtualDisplay(debug);
    launch_options["virtual_display"] = virtualDisplay.get();
    launch_options.headless = false;
  } else {
    launch_options.headless ||= headless;
  }
  if (!fromOptions || Object.keys(fromOptions).length === 0) {
    fromOptions = await launchOptions({ debug, ...launch_options });
  }
  if (persistentContext) {
    const context = await playwright.launchPersistentContext("~/.crawlee/persistent-user-data-dir", fromOptions);
    return syncAttachVD(context, virtualDisplay);
  }
  if (launch_options.data_dir) {
    const browser2 = await playwright.launchPersistentContext(launch_options.data_dir, fromOptions);
    return syncAttachVD(browser2, virtualDisplay);
  }
  const browser = await playwright.launch(fromOptions);
  return syncAttachVD(browser, virtualDisplay);
}

export {
  __require,
  init_esm_shims,
  OS_NAME,
  INSTALL_DIR,
  LAUNCH_FILE,
  CamoufoxFetcher,
  installedVerStr,
  camoufoxPath,
  getLaunchPath,
  DefaultAddons2 as DefaultAddons,
  maybeDownloadAddons,
  ALLOW_GEOIP,
  downloadMMDB,
  removeMMDB,
  getAsBooleanFromENV,
  launchOptions,
  Camoufox,
  NewBrowser
};
