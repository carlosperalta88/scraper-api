exports.APIKey = (req, res, next) => {
  try {
    if (req.header('API-Key') === process.env.API_KEY) {
      return next()
    }
    return res.status(401).json({message: 'Unauthorized'})
  } catch (error) {
    return res.json(error).status(500)
  }
}
