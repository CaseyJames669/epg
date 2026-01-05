const axios = require('axios')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

module.exports = {
    site: 'directv.com-music',
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
                'lang': 'en',
                'site_id': '869#2265',
                'name': 'Music Choice Toddler Tunes'
            },
            {
                'lang': 'en',
                'site_id': '2034#4528',
                'name': 'S Channel'
            },
            {
                'lang': 'en',
                'site_id': '871#8333',
                'name': 'Music Choice Pop Latino'
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
                'lang': 'en',
                'site_id': '2034#4528',
                'name': 'S Channel'
            },
            {
                'lang': 'en',
                'site_id': '874#8012',
                'name': 'Music Choice Tropicales'
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
                'lang': 'en',
                'site_id': '2034#4528',
                'name': 'S Channel'
            },
            {
                'lang': 'en',
                'site_id': '841#2270',
                'name': 'Music Choice Rock'
            },
            {
                'lang': 'en',
                'site_id': '2034#4528',
                'name': 'S Channel'
            },
            {
                'lang': 'en',
                'site_id': '849#1938',
                'name': 'Music Choice Soft Rock'
            },
            {
                'lang': 'en',
                'site_id': '2034#4528',
                'name': 'S Channel'
            },
            {
                'lang': 'en',
                'site_id': '831#2228',
                'name': 'Music Choice Indie'
            },
            {
                'lang': 'en',
                'site_id': '867#2261',
                'name': 'Music Choice Teen Beats'
            },
            {
                'lang': 'en',
                'site_id': '2034#4528',
                'name': 'S Channel'
            },
            {
                'lang': 'en',
                'site_id': '848#8017',
                'name': 'Music Choice Throwback Jamz'
            },
            {
                'lang': 'en',
                'site_id': '821#2218',
                'name': 'Music Choice Pop Hits'
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
                'lang': 'en',
                'site_id': '817#2214',
                'name': 'Music Choice Y2K'
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
                'lang': 'en',
                'site_id': '806#2205',
                'name': 'Music Choice \'90s'
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
                'lang': 'en',
                'site_id': '2034#4528',
                'name': 'S Channel'
            },
            {
                'lang': 'en',
                'site_id': '2034#4528',
                'name': 'S Channel'
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
