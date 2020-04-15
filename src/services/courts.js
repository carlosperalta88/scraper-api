import Courts from '../models/Courts'

class CourtsService {
  constructor(Courts) {
    this.courts = Courts
  }

  async add(courts) {
    return await this.courts.add(courts)
  }

  async search(query) {
    return await this.courts.search(query)
  }
}

module.exports = new CourtsService(Courts)