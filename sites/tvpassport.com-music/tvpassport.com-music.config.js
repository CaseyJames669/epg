const axios = require('axios')
const dayjs = require('dayjs')
const cheerio = require('cheerio')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

module.exports = {
  site: 'tvpassport.com-music',
  days: 3,
  url({ channel, date }) {
    return `https://www.tvpassport.com/tv-listings/stations/${channel.site_id}/${date.format(
      'YYYY-MM-DD'
    )}`
  },
  async request() {
    return {
      timeout: 30000,
      headers: {
        Cookie: await getCookie()
      }
    }
  },
  parser: function ({ content }) {
    let programs = []
    const items = parseItems(content)
    for (let item of items) {
      const $item = cheerio.load(item)
      const start = parseStart($item)
      const duration = parseDuration($item)
      const stop = start.add(duration, 'm')
      let title = parseTitle($item)
      let subtitle = parseSubTitle($item)
      if (title === 'Movie' || title === 'Cinéma') {
        title = subtitle
        subtitle = null
      }

      programs.push({
        title,
        subtitle,
        description: parseDescription($item),
        image: parseImage($item),
        category: parseCategory($item),
        rating: parseRating($item),
        actors: parseActors($item),
        guest: parseGuest($item),
        director: parseDirector($item),
        year: parseYear($item),
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
        'site_id': 'estv/14987',
        'name': 'ES.TV'
    },
    {
        'lang': 'en',
        'site_id': 'ace-tv/35750',
        'name': 'Ace TV'
    },
    {
        'lang': 'en',
        'site_id': '360-tunebox/32664',
        'name': '360 Tunebox'
    },
    {
        'lang': 'en',
        'site_id': 'stingray-remember-the-80s/2804',
        'name': 'Stingray: Remember the 80s'
    },
    {
        'lang': 'en',
        'site_id': 'music-channel/33341',
        'name': 'Music Channel'
    },
    {
        'lang': 'en',
        'site_id': 'stingray-pop-adult/2794',
        'name': 'Stingray: Pop Adult'
    },
    {
        'lang': 'en',
        'site_id': 'cmt-music/2288',
        'name': 'CMT Music'
    },
    {
        'lang': 'en',
        'site_id': 'mtv-hits-uk/16071',
        'name': 'MTV Hits UK'
    },
    {
        'lang': 'en',
        'site_id': 'stingray-classic-rock/2785',
        'name': 'Stingray: Classic Rock'
    },
    {
        'lang': 'en',
        'site_id': 'channel-i-bangladesh/14202',
        'name': 'Channel i (Bangladesh)'
    },
    {
        'lang': 'en',
        'site_id': 'channel-i-bangladesh/14202',
        'name': 'Channel i (Bangladesh)'
    },
    {
        'lang': 'en',
        'site_id': 'stingray-alternative/2885',
        'name': 'Stingray: Alternative'
    },
    {
        'lang': 'en',
        'site_id': 'atn--b4u-music/2867',
        'name': 'ATN - B4U Music'
    },
    {
        'lang': 'en',
        'site_id': 'ace-tv/35750',
        'name': 'Ace TV'
    },
    {
        'lang': 'en',
        'site_id': 'stingray-hot-country/5953',
        'name': 'Stingray: Hot Country'
    },
    {
        'lang': 'en',
        'site_id': 'channel-i-bangladesh/14202',
        'name': 'Channel i (Bangladesh)'
    },
    {
        'lang': 'en',
        'site_id': 'channel-i-bangladesh/14202',
        'name': 'Channel i (Bangladesh)'
    }
]
  }
}

async function getCookie() {
  const res = await axios.get('https://www.tvpassport.com/tv-listings')
  const setCookie = res.headers['set-cookie']
  if (!setCookie || setCookie.length === 0) return ''
  const cookies = setCookie.map(cookie => cookie.split(';')[0])
  return cookies.join('; ')
}

function parseDescription($item) {
  return $item('*').data('description')
}

function parseImage($item) {
  const showpicture = $item('*').data('showpicture')
  const url = new URL(showpicture, 'https://cdn.tvpassport.com/image/show/960x540/')

  return url.href
}

function parseTitle($item) {
  return $item('*').data('showname').toString()
}

function parseSubTitle($item) {
  return $item('*').data('episodetitle').toString() || null
}

function parseYear($item) {
  return $item('*').data('year').toString() || null
}

function parseCategory($item) {
  const showtype = $item('*').data('showtype')

  return showtype ? showtype.split(', ') : []
}

function parseActors($item) {
  const cast = $item('*').data('cast')

  return cast ? cast.split(', ') : []
}

function parseDirector($item) {
  const director = $item('*').data('director')

  return director ? director.split(', ') : []
}

function parseGuest($item) {
  const guest = $item('*').data('guest')

  return guest ? guest.split(', ') : []
}

function parseRating($item) {
  const rating = $item('*').data('rating')

  return rating
    ? {
        system: 'MPA',
        value: rating.replace(/^TV/, 'TV-')
      }
    : null
}

function parseStart($item) {
  const time = $item('*').data('st')

  return dayjs.tz(time, 'YYYY-MM-DD HH:mm:ss', 'America/New_York')
}

function parseDuration($item) {
  const duration = $item('*').data('duration')

  return parseInt(duration)
}

function parseItems(content) {
  if (!content) return []
  const $ = cheerio.load(content)

  return $('.station-listings .list-group-item').toArray()
}
