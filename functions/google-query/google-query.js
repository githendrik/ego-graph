const fetch = require('node-fetch');
const xml2js = require('xml2js');

const MAX_DEPTH = 5;

exports.handler = async function(event, context) {
    const keyword =
        typeof event.body === 'string' && event.body && event.body.length > 0 ?
        event.body :
        'docker';

    try {
        const termsList = [];
        const initialVsTerms = await fetchVsTerms(keyword);

        // Depth = 1
        initialVsTerms.forEach((term, index) => {
            termsList.push(
                createMapEntry({
                    from: keyword,
                    to: term,
                    weight: MAX_DEPTH - index,
                })
            );
        });

        // Depth = 2
        const children = termsList.map(async(parent) => {
            const parentTerm = parent.to;
            const childTerms = await fetchVsTerms(parentTerm);

            const childList = [];
            childTerms.forEach((childTerm, index) => {
                childList.push(
                    createMapEntry({
                        from: parentTerm,
                        to: childTerm,
                        weight: MAX_DEPTH - index,
                    })
                );
            });

            return childList;
        });

        const allChildren = await Promise.all(children);
        allChildren.forEach((childs) => {
            childs.forEach((child) => {
                termsList.push(child);
            });
        });

        console.log(termsList);

        return {
            statusCode: 200,
            body: JSON.stringify(termsList),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify(err),
        };
    }
};

function extractVsTerms(parsedResponse, inputKeyword) {
    return parsedResponse.toplevel.CompleteSuggestion.map(
            (item) => item.suggestion[0]['$']['data']
        )
        .map((item) => item.replace(`${inputKeyword} vs `, ''))
        .filter((item) => !item.includes(' vs '))
        .filter((item) => !item.includes(inputKeyword))
        .slice(0, MAX_DEPTH);
}

async function fetchVsTerms(keyword) {
    console.log(`fetching suggestions for: ${keyword}`);
    const rawResponse = await fetch(
        `http://suggestqueries.google.com/complete/search?&output=toolbar&gl=us&hl=en&q=${keyword}%20vs`
    ).then((res) => res.text());
    const parsed = await xml2js.parseStringPromise(rawResponse);
    vsTerms = extractVsTerms(parsed, keyword);

    return vsTerms;
}

function createMapEntry({ from, to, weight }) {
    return {
        from,
        to,
        weight,
    };
}