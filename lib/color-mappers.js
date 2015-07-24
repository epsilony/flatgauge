'use strict';
import math from 'mathjs';
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

export var colorMappers = {
  expresses: (colorMappers) => {
    var cm = new MathExpressesColorMapper(colorMappers);
    return x => cm.mapColor(x);
  }
};

export default colorMappers;
