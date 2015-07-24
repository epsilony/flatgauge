'use strict';
import 'snapsvg';
/* globals Snap, mina */
import $ from 'jquery';
import _ from 'lodash';
import valueMappers from './value-mappers';
import colorMappers from './color-mappers';

export var defaultConfig = {
  initValue: 0,
  min: 0,
  max: 1000,
  unit: "千克",
  valueMapper: valueMappers.toFixed(2),
  colorMapper: colorMappers.expresses([{
    express: 'x>800',
    color: '#ff0000'
  }, {
    express: 'x<200',
    color: 'olive'
  }]),
  color: "#04a646",
  animateDuration: 400,
};

export class AbstractGauge {

  // this._snap should be constructed ahead
  constructor(selection, config = null) {
    config = _.defaults(config || {}, defaultConfig);
    this.config = config;

    let selects = $(selection);
    if (!selects || !selects.length) {
      console.error("cannot find selection: " + selection);
    }
    if (selects.length > 1) {
      console.error("selection is not unique: " + selection);
    }

    this._value = config.initValue;

    this._dom = selects[0];

    this._snap=this._genSnap();

    this._titleElem = this._snap.select("text.flat-gauge-title");
    this._subtitleElem = this._snap.select("text.flat-gauge-subtitle");
    this._valueElem = this._snap.select("text.flat-gauge-value");
    this._valueGeomElem = this._snap.select(".flat-gauge-value-geom");
    this._unitElem = this._snap.select("text.flat-gauge-unit");

    this._anim = null;

    this._snap.appendTo(this._dom);
    this.draw();
  }

  /*
  abstract _animateSetter(v){};
  abstract _genSnap();
  */

  draw() {
    this._animate();
  }

  _animate() {
    let _anim = this._anim;
    let start = 0;
    if (_anim) {
      if (_anim.end === this._value) {
        return;
      } else {
        _anim.stop();
        let s = _anim.status();
        start = _anim.start * (1 - s) + _anim.end * s;
        if (start < this.config.min) {
          start = this.config.min;
        } else if (start > this.config.max) {
          start = this.config.max;
        }
      }
    }
    this._anim = Snap.animate(start, this._value, v => this._animateSetter(v), this.config.animateDuration, mina.easeinout);
  }

  _adjustUnit() {
    var vb = this._valueElem.getBBox();
    this._unitElem.transform("t" + vb.w / 2 + " 0");
  }

  set value(value) {
    this._value = value;
    this.draw();
  }

  get value() {
    return this._value;
  }
}


for (let name of "title subtitle unit".split(/\s+/)) {
  let elemName = '_' + name + 'Elem';

  Object.defineProperty(AbstractGauge.prototype, name, {
    configurable: true,
    enumerable: false,
    get: function() {
      return this[elemName].attr("text");
    },
    set: function(value) {
      this[elemName].attr("text", value);
    }
  });
}

for (let name of "value title subtitle unit".split(/\s+/)) {
  let elemName = '_' + name + 'Elem';
  Object.defineProperty(AbstractGauge.prototype, name + 'Color', {
    configurable: true,
    enumerable: false,
    get: function() {
      return this[elemName].attr("fill");
    },
    set: function(value) {
      this[elemName].attr("fill", value);
    }
  });
}

export default AbstractGauge;
