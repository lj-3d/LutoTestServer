const baseMapper = require('./baseMapper');

const listMapper = (entity) => {
    return {
        id: entity._id,
        name: entity.name,
        lastName: entity.lastName,
        dateOfStart: entity.dateOfStart || 0,
        position: entity.position,
        avatar: entity.avatar
    }
}

const objectMapper = (entity) => {
    return {
        id: entity._id,
        phoneNumber: entity.phoneNumber,
        name: entity.name,
        lastName: entity.lastName,
        dateOfBirth: entity.dateOfBirth || 0,
        dateOfStart: entity.dateOfStart || 0,
        position: entity.position,
        teamLead: entity.teamLead || false,
        avatar: entity.avatar
    }
}

function transformListToResponseModel(eventsFromDb) {
    return baseMapper.transformList(eventsFromDb, listMapper);
}

function transformObjectToResponseModel(entity) {
    return baseMapper.transformObject(objectMapper(entity))
}

module.exports = {
    transformObject: transformObjectToResponseModel,
    transformList: transformListToResponseModel
}