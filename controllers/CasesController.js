const Cases = require('../models/Cases')
const Courts = require('../models/Courts')
const logger = require('../config/winston')

const requestCase = async (role) => {
  const requestedCase = await Cases.find({ role: role })
  return requestedCase
}

const formatScraperResponse = (scraperResponse) => {
  try {
    const modelKeys = ['court','cover','role','document_status','receptor','pending_docs','cause_history','exhorts']
    const newObject = new Object()
    const objectBuilder = modelKeys.map((el, elIndex) => {
      if(elIndex < 3) {
        newObject[el] = scraperResponse['role_search'][0][el].trim()
        return
      }

      if(elIndex === 3) {
        newObject[el] = scraperResponse['status']
        return
      }

      newObject[el] = scraperResponse[el]
    })
    return newObject
  } catch (error) {
    logger.info(error)
  }
}

const compareCases = (storedVersion, scraperResponse) => {
  const scraperResponseFormatted = formatScraperResponse(scraperResponse)
  const comparisson = Object.keys(scraperResponseFormatted).map((el) => {
    if(!storedVersion.hasOwnProperty(el)) return false

    if(typeof scraperResponseFormatted[el] == 'object') {
      return (scraperResponseFormatted[el].length === storedVersion[el].length)
    }
    if(el === 'document_status') {
      return (scraperResponseFormatted[el].trim() === storedVersion[el].trim())
    }
    if(el === 'court') {
      return (scraperResponseFormatted[el] === storedVersion[el]['name'])
    }
  }).reduce((acc, cv) => acc === cv)
  return comparisson
}

const caseCreator = async (role, court_id) => {
  let court
  try {
    court = await Courts.find({ external_id: court_id })
  } catch (error) {
    logger.info(error)
    throw new Error(error)
  }
  return new Cases({
    role: role,
    court: court[0],
    is_active: true
  })
}

exports.addCase = async (req, res) => {
  try {
    const newCase = await caseCreator(req.body.role, req.body.court_id)
    await newCase.save()
    res.status(201).json(newCase)
  } catch (error) {
    logger.info(error)
    res.status(500).send(error)
  }
}

exports.addCases = async (req, res) => {
  Promise.all(req.body.cases.map(async item => caseCreator(item.role, item.court_id)))
    .then(async (items) => {  
      await Cases.insertMany(items)
      res.status(201).json(items)
    }).catch((e) => res.status(500).send({ error: e.name, message: e.message }))
}

exports.getCaseByRole = async (req, res) => {
  try {
    const reqCase = await requestCase(req.params.role)
    res.json(reqCase)
  } catch (error) {
    logger.info(error)
    res.status(500).send(error)
  }
}

exports.deleteCaseByRole = async (req, res) => {
  try {
    const query = await Cases.updateOne({ role: req.params.role }, { is_active: false })
    res.json(query)
  } catch (error) {
    logger.info(error)
    res.send(error)
  }
}

exports.update = async (req, res) => {
  try {
    let [storedVersion] = await requestCase(req.params.role)
    const isUpdated = compareCases(storedVersion, req.body)
    if(isUpdated) {
      storedVersion['cover'] = req.body['role_search'][0]['cover']
      role_date = req.body['role_search'][0]['date'].split('/')
      storedVersion['date'] = new Date(role_date[2], role_date[1], role_date[0]).toISOString().split('T')[0]
      storedVersion['document_status'] = req.body['status']
      storedVersion['receptor'] = req.body['receptor']
      storedVersion['pending_docs'] = req.body['pending_docs']
      storedVersion['cause_history'] = req.body['cause_history']
      storedVersion['exhorts'] = req.body['exhorts']
      storedVersion['is_active'] = true
      try {
        await storedVersion.save()
        logger.info(`${req.params.role} saved`)
        return res.status(204).send(`saved ${req.params.role}`)
      } catch (error) {
        logger.info(`failed saving the cause ${error}`)
        return res.status(500).send(error)
      }
    }
    logger.info(`no need to update ${req.params.role}`)
    return res.status(200).send(`Nothing to update, entity ${req.params.role} has not changed`)
  } catch (error) {
    logger.error(`failed formatting the cause ${error}`)
    res.status(500).send(error)
  }
}