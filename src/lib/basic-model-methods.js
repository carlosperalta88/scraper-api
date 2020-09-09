module.exports = function basicMethods(schema, options) {
  schema.statics.search = function(query, pagination = {page: 1, limit: 20}) {
    return this.find(query)
        .limit(pagination.limit)
        .skip((pagination.page - 1) * pagination.limit)
        .exec()
  }

  schema.statics.getId = function(query) {
    return this.find(query).select('_id')
  }

  schema.statics.update = function(query, edit) {
    return this.findOneAndUpdate(query, {$set: edit}, {new: true})
  }

  schema.statics.upsert = function(query, edit) {
    return this.update(query, edit, {upsert: true})
  }

  // edit = { propertyName: { $each: [array to insert] } }
  schema.statics.updateArray = function(query, edit) {
    return this.findOneAndUpdate(query, {$push: edit}, {new: true})
  }

  schema.statics.create = function(items) {
    return this.insertMany([].concat(items))
  }
}
