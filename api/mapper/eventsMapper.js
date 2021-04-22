const baseMapper = require('./baseMapper');

const mapper = (entity) => {
    return {
        id: entity._id,
        link: entity.link,
        name: entity.number,
        description: entity.description,
        date: entity.date,
        image: entity.image
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