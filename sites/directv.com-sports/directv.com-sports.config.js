const axios = require('axios')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

module.exports = {
  site: 'directv.com-sports',
  days: 2,
  request: {
    cache: {
      ttl: 60 * 60 * 1000 // 1 hour
    },
    headers: {
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: 60000 // Increase timeout to 60s
  },
  url({ date, channel }) {
    const [channelId, childId] = channel.site_id.split('#')
    return `https://www.directv.com/json/channelschedule?channels=${channelId}&startTime=${date.format()}&hours=24&chId=${childId}`
  },
  async parser({ content, channel }) {
    const programs = []
    const items = parseItems(content, channel)
    for (let item of items) {
      if (item.programID === '-1') continue
      const detail = await loadProgramDetail(item.programID)

      const start = parseStart(item)
      const stop = start.add(item.duration, 'm')
      programs.push({
        title: item.title,
        sub_title: item.episodeTitle,
        description: parseDescription(detail),
        rating: parseRating(item),
        date: parseYear(detail),
        category: item.subcategoryList,
        season: item.seasonNumber,
        episode: item.episodeNumber,
        image: parseImage(item),
        start,
        stop
      })
    }

    return programs
  },
  async channels() {
    return [
    {
        'lang': 'en',
        'site_id': '659#5659',
        'name': 'AT&T SportsNet Pittsburgh HD'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '640#5620',
        'name': 'MASN HD'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '628#5628',
        'name': 'NESN HD'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '639#5639',
        'name': 'SportsNet New York HD'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '618#5618',
        'name': 'FOX Sports 2 HD'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '219#8242',
        'name': 'FOX Sports 1 HD'
    },
    {
        'lang': 'en',
        'site_id': '665#5665',
        'name': 'NBC Sports Chicago HD'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '691#6655',
        'name': 'Spectrum SportsNet HD (Alternate)'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '690#807',
        'name': 'Spectrum SportsNet LA HD'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '694#8956',
        'name': 'Bally Sports San Diego'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'es',
        'site_id': '469#5451',
        'name': 'TyC Sports'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '642#5643',
        'name': 'NBC Sports Washington HD (Alternate)'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '674#5674',
        'name': 'AT&T SportsNet Southwest HD'
    },
    {
        'lang': 'en',
        'site_id': '2034#4528',
        'name': 'S Channel'
    },
    {
        'lang': 'en',
        'site_id': '684#2658',
        'name': 'AT&T SportsNet Rocky Mountain West'
    }
]
  }
}

function parseDescription(detail) {
  return detail ? detail.description : null
}
function parseYear(detail) {
  return detail ? detail.releaseYear : null
}
function parseRating(item) {
  return item.rating
    ? {
      system: 'MPA',
      value: item.rating
    }
    : null
}
function parseImage(item) {
  return item.primaryImageUrl ? `https://www.directv.com${item.primaryImageUrl}` : null
}
function loadProgramDetail(programID) {
  return axios
    .get(`https://www.directv.com/json/program/flip/${programID}`)
    .then(r => r.data)
    .then(d => d.programDetail)
    .catch(console.err)
}

function parseStart(item) {
  return dayjs.utc(item.airTime)
}

function parseItems(content, channel) {
  const data = JSON.parse(content)
  if (!data) return []
  if (!Array.isArray(data.schedule)) return []

  const [, childId] = channel.site_id.split('#')
  const channelData = data.schedule.find(i => i.chId == childId)
  return channelData.schedules && Array.isArray(channelData.schedules) ? channelData.schedules : []
}
