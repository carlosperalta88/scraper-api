import CourtsService from '../services/courts'
import logger from '../config/winston'

exports.addCourts = async (req, res) => {
  try {
    const courts = await CourtsService.add(req.body.courts)
    return res.status(201).json(courts)
  } catch (error) {
    logger.error(error)
    return res.status(500).send(error)
  }
}

exports.getCourts = async (req, res) => {
  try {
    const court = await CourtsService.search(req.body.query)
    return res.status(200).json(court)
  } catch (error) {
    logger.error(error)
    return res.status(500).send(error)
  }
}