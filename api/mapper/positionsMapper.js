const baseMapper = require('./baseMapper');

const mapper = (entity) => {
    return {
        id: entity._id,
        name: entity.name
    }
}

function transformListToResponseModel(eventsFromDb) {
    return baseMapper.transformList(eventsFromDb, mapper);
}

function transformObjectToResponseModel(entity) {
    return baseMapper.transformObject(mapper(entity))
}

module.exports = {
    transformObject: transformObjectToResponseModel,
    transformList: transformListToResponseModel
}