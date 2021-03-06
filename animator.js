
var animator = (function () {
    
    'use strict';

    var BoxController = controller.BoxController;

    function Animator(htmlElem) {
        this._boxController = new BoxController(htmlElem);
        this._millisElapsed = null;
        this.realTimeAnimate();
    }

    Animator.prototype.manualAdvance = function(deltaMillis) {
        this.stop();
        this._boxController.advance(deltaMillis);
    };

    Animator.prototype.realTimeAnimate = function() {

        this._animationId = window.requestAnimationFrame(step);

        var self = this;

        function step(highResTimeStamp) {
            if (self._millisElapsed !== null) {
                var deltaMillis = highResTimeStamp - self._millisElapsed;
                self._boxController.advance(deltaMillis);
            }
            self._millisElapsed = highResTimeStamp;
            self._animationId = window.requestAnimationFrame(step);
        }
    };

    Animator.prototype.stop = function() {
        if (this._animationId) {
            this._millisElapsed = null;
            window.cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }
    };

    return {
        Animator: Animator
    };

})();