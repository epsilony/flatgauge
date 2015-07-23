'use strict';
import 'snapsvg';
/* globals Snap, mina */
import $ from 'jquery';
import template from './template.html!text';
import 'lato-font/css/lato-font.min.css!';
import math from 'mathjs';
import _ from 'lodash';
import colorParse from 'color-parser';

var snapTemplate = new Snap($(template)[0]);

export var valueMapperFactories = {
  toFixed: num => (v => v.toFixed(num))
};

class MathExpressesColorMapper {
  constructor(colorMappers) {
    this._datas = [];
    for (let cm of colorMappers) {
      let express = cm.express;
      this._datas.push({
        compiled: math.compile(express),
        express: express,
        color: cm.color
      });
    }
  }

  mapColor(x) {
    for (let d of this._datas) {
      let result = d.compiled.eval({
        x: x
      });
      if (result) {
        return d.color;
      }
    }
    return null;
  }
}

export var colorMapperFactories = {
  expresses: (colorMappers) => {
    var cm = new MathExpressesColorMapper(colorMappers);
    return x => cm.mapColor(x);
  }
};

export var defaultConfig = {
  initValue: 0,
  min: 0,
  max: 1000,
  unit: "千克",
  valueMapper: valueMapperFactories.toFixed(2),
  colorMapper: colorMapperFactories.expresses([{
    express: 'x>800',
    color: '#ff0000'
  }, {
    express: 'x<200',
    color: 'olive'
  }]),
  color: "#04a646",
  animateDuration: 400,
};

export class FlatGauge {

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
    this._snap = snapTemplate.clone();
    this._titleElem = this._snap.select("text.flat-gauge-title");
    this._subtitleElem = this._snap.select("text.flat-gauge-subtitle");
    this._valueElem = this._snap.select("text.flat-gauge-value");
    this._valuePathElem = this._snap.select("path.flat-gauge-value-path");
    this._unitElem = this._snap.select("text.flat-gauge-unit");

    this._anim = null;

    this._snap.appendTo(this._dom);
    this.draw();
  }

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

  _animateSetter(v) {
    this._valueElem.attr("text", this.config.valueMapper(v));

    let color = null;
    if (this.config.colorMapper) {
      color = this.config.colorMapper(v);
    }
    color = color || this.config.color;
    let colorParm = colorParse(color);
    this._valuePathElem.attr("stroke", Snap.format('rgb({r},{g},{b})', colorParm));
    this._valuePathElem.attr("opacity", colorParm.a);


    let min = this.config.min,
      max = this.config.max;
    let t = (v - min) / (max - min);
    if (t < 0) {
      t = 0;
    } else if (t > 0.999) {
      t = 0.999;
    }
    let alphaV = (1 - t) * 0.75 * Math.PI + t * 2.25 * Math.PI;

    let lg = t >= 2 / 3 ? 1 : 0;
    let xv = 95 * Math.cos(alphaV) + 100;
    let yv = 95 * Math.sin(alphaV) + 100;
    let sw = t >= 0 ? 1 : 0;
    let pathValue = {
      lg: lg,
      xv: xv,
      yv: yv,
      sw: sw
    };
    this._valuePathElem.attr("d", Snap.format("M32.824855787278 167.17514421272 A 95 95 0 {lg} {sw} {xv} {yv}", pathValue));
    this._valueElem.attr("text", this.config.valueMapper(v));
    this._adjustUnit();
  }

  _adjustUnit() {
    var vb = this._valueElem.getBBox();
    this._unitElem.transform("t" + vb.w / 2 + " 0");
  }


  set title(title) {
    this._titleElem.attr("text", title);
  }

  get title() {
    return this._titleElem.attr("text");
  }

  set subtitle(subtitle) {
    this._subtitleElem.attr("text", subtitle);
  }

  get subtitle() {
    return this._subtitleElem.attr("text");
  }

  set unit(unit) {
    this._unitElem.attr("text", unit);
  }

  get unit() {
    return this._unitElem.attr("text");
  }

  set value(value) {
    this._value = value;
    this.draw();
  }

  get value() {
    return this._value;
  }
}
