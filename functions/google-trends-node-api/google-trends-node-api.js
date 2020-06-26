const trendsApi = require('google-trends-api')

async function getInterestOverTime(request) {
    const body = JSON.parse(request.body);

    const keyword = body.keyword;
    const rawStartDate = body.startDate.split('.');
    const rawEndDate = body.endDate.split('.');

    const startTime = new Date(Date.parse(`${rawStartDate[2]}-${rawStartDate[1]}-${rawStartDate[0]}`));
    const endTime = new Date(Date.parse(`${rawEndDate[2]}-${rawEndDate[1]}-${rawEndDate[0]}`));

    const trendsResponse = await trendsApi.interestOverTime({ keyword, startTime, endTime, geo: 'US' });
    const trendsObject = JSON.parse(trendsResponse).default.timelineData.map((t) => ({ date: t.formattedTime, value: t.value[0] }));

    return trendsObject;
}

exports.handler = async function(event, context) {
    try {
        const interest = await getInterestOverTime(event);
        return {
            statusCode: 200,
            body: JSON.stringify(interest)
        }
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        }
    }
}