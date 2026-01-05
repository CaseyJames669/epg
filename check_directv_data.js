const axios = require('axios');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

async function run() {
    const url = "https://www.directv.com/json/channelschedule?channels=362&startTime=" + dayjs.utc().format() + "&hours=1&chId=362";
    console.log("Fetching: " + url);
    try {
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 60000
        });
        if (res.data && res.data.schedule && res.data.schedule[0]) {
            const schedules = res.data.schedule[0].schedules;
            if (schedules && schedules.length > 0) {
                console.log("Keys available:", Object.keys(schedules[0]));
                console.log("Sample Descr:", schedules[0].description);
                console.log("Sample ShortDesc:", schedules[0].shortDescription);
            } else {
                console.log("No schedules found in payload.");
            }
        } else {
            console.log("Invalid response structure.");
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}
run();
