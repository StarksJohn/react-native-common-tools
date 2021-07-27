/**
 * 不同 业务逻辑的 数据放不同的 model里,最终组成最大的State
 * Put the states of different business logics into different models to form the largest state
 */
import _ from 'lodash';
import modelTools from './modelTools';

export default function (modelList = []) {
  const modelContainer = {};

  _.forEach(modelList, (it) => {
    console.log('models.ts forEach it=', it);

    const nameSpace = _.isString(it) ? it : it.namespace;
    console.log('models.ts nameSpace=', nameSpace);

    let modelObj = modelTools.createDefault({
      nameSpace,
      attributesToBeCached: it.attributesToBeCached,
    });
    if (!_.isString(it)) {
      modelObj = _.merge(modelObj, it);
    }
    modelContainer[nameSpace] = modelObj;
  });
  const models = _.values(modelContainer);
  console.log('models.js 最终models=', models);
  return models;
}
