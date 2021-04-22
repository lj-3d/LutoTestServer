function transformListToResponseModel(eventsFromDb, entityMapFunction) {
    const mappedArray = [];
    eventsFromDb.forEach(entity => {
        mappedArray.push(transformObjectToResponseModel(entityMapFunction(entity)));
    });
    return mappedArray;
}

function transformObjectToResponseModel(entityMapFunction) {
    return entityMapFunction;
}

module.exports = {
    transformList: transformListToResponseModel,
    transformObject: transformObjectToResponseModel
}