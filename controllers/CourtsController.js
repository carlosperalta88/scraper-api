const Courts = require('../models/Courts')
const logger = require('../config/winston')

exports.addCourt = async (req, res) => {
  const court = new Courts({ name: req.body.name, external_id: req.body.external_id })
  try {
    await court.save()
    return res.status(201).json(court) 
  } catch (error) {
    logger.error(error)
    return res.status(500).send(error)
  }
}

exports.addCourts = async (req, res) => {
  const courts = req.body.map((el) => new Courts({ name: el.name, external_id: el.external_id }))
  try {
    await Courts.insertMany(courts)
    return res.status(201).json(courts)
  } catch (error) {
    logger.error(error)
    return res.status(500).send(error)
  }
}

exports.getCourt = async (req, res) => {
  try {
    const court = await Courts.find({ external_id: req.params.id }, {})
    return res.status(200).json(court)
  } catch (error) {
    logger.error(error)
    return res.status(500).send(error)
  }
}