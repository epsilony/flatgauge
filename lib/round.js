'use strict';
import 'snapsvg';
/* globals Snap, mina */
import $ from 'jquery';
import round_tmp from './round_tmp.html!text';
import 'lato-font/css/lato-font.min.css!';
import AbstractGauge from './abstract';

let snapTemplate = new Snap($(round_tmp)[0]);

export class RoundGauge extends AbstractGauge {

  constructor(selection, config = null) {
    super(selection, config);
  }

  _genSnap() {
    return snapTemplate.clone();
  }

  _animateSetter(v) {
    this._valueElem.attr("text", this.config.valueMapper(v));

    let color = null;
    if (this.config.colorMapper) {
      color = this.config.colorMapper(v);
    }
    color = color || this.config.color;
    this._valueGeomElem.attr("stroke", color);

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
    this._valueGeomElem.attr("d", Snap.format("M32.824855787278 167.17514421272 A 95 95 0 {lg} {sw} {xv} {yv}", pathValue));
    this._valueElem.attr("text", this.config.valueMapper(v));
    this._adjustUnit();
  }
}

export default RoundGauge;
