const baseMapper = require('./baseMapper');

const mapper = (entity) => {
    return {
        id: entity._id,
        name: entity.name,
        description: entity.description,
        image: entity.image,
        link: entity.link,
        discount: entity.discount,
        lat: entity.lat,
        lon: entity.lon
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