const request = require('request-promise')

exports.do = async (payload) => {
  try {
    const results = await request(payload)
    if (results.code === 500) {
      throw new Error(results.error)
    }
    return results
  } catch (error) {
    throw new Error(error)
  }
}
