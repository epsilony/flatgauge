'use strict';

export var valueMapperFactories = {
  toFixed: num => (v => v.toFixed(num))
};

export default valueMapperFactories;
