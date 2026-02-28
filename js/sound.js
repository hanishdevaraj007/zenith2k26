/**
 * SOUND SYSTEM - DISABLED
 * All sound methods are no-ops
 */

window.SoundSystem = (function() {
  return {
    enabled: false,
    toggle: function() { return false; },
    playLoaderProgress: function() {},
    playLoaderComplete: function() {},
    playHeroLetterTick: function() {},
    playNavWipe: function() {},
    playPanelOpen: function() {},
    playPanelClose: function() {},
    playPortalCross: function() {},
    playButtonActivate: function() {},
    playZapBurst: function() {},
    playElectricCrackle: function() {},
    playFooterAmbient: function() {}
  };
})();
