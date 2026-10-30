/* ZZ Games: offline stand-in for the Poki SDK. The game used to wait on poki.com for ads;
   this answers every call instantly so it starts without any outside sites. */
(function () {
  var done = function () { return Promise.resolve(); };
  var api = {
    init: done, commercialBreak: done, rewardedBreak: function () { return Promise.resolve(false); },
    setDebug: function () {}, gameLoadingStart: function () {}, gameLoadingProgress: function () {}, gameLoadingFinished: function () {},
    gameplayStart: function () {}, gameplayStop: function () {}, happyTime: function () {}, roundStart: function () {}, roundEnd: function () {},
    setPlayerAge: function () {}, togglePlayerAdvertisingConsent: function () {}, enableEventTracking: function () {}, customEvent: function () {},
    captureError: function () {}, sendHighscore: function () {}, measure: function () {}, setLogging: function () {},
    getURLParam: function () { return ""; }, shareableURL: function () { return Promise.resolve(""); }, getLanguage: function () { return "en"; },
    isAdBlocked: function () { return false; }, displayAd: function () {}, destroyAd: function () {}
  };
  window.PokiSDK = new Proxy(api, { get: function (t, k) { return k in t ? t[k] : function () { return Promise.resolve(); }; } });
})();
