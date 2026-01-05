const axios = require('axios');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

async function run() {
    try {
        const date = dayjs.utc();
        const start = date.format();
        const url = `https://www.directv.com/json/channelschedule?channels=362&startTime=${start}&hours=1&chId=362`; // Channel 362 (Weather)

        console.log(`Fetching schedule: ${url}`);
        const res = await axios.get(url);
        const data = res.data;

        if (data && data.schedule && data.schedule[0] && data.schedule[0].schedules) {
            const item = data.schedule[0].schedules[0];
            console.log("--- First Program Item Keys ---");
            console.log(Object.keys(item));
            console.log("--- Item Content ---");
            console.log(JSON.stringify(item, null, 2));
        } else {
            console.log("No schedule data found OR structure changed.");
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error(e);
    }
}

run();
