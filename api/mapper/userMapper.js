const baseMapper = require('./baseMapper');

const mapper = (entity) => {
    return {
        id: entity._id,
        phoneNumber: entity.phoneNumber,
        name: entity.name,
        card: entity.card,
        lastName: entity.lastName,
        dateOfBirth: entity.dateOfBirth || 0,
        dateOfStart: entity.dateOfStart || 0,
        position: entity.position,
        teamLead: entity.teamLead || false,
        avatar: entity.avatar
    }
}

function transformObjectToResponseModel(entity) {
    return baseMapper.transformObject(mapper(entity))
}

module.exports = {
    transformObject: transformObjectToResponseModel
}