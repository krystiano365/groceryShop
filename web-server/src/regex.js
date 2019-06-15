const _ = require('lodash');

module.exports = (str, query) => {
    const regex = /^\$%(.*?)%\$$/gm;
    const logs = new Array;
    let regexRes;
    while ((regexRes = regex.exec(str)) !== null) {
        if (regexRes.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        logs.push(JSON.parse(regexRes[1]));
        regexRes = [];
    }

    const searchResults = new Array;
    let exactResIndex = -1;
    const queryAsString = query.toString().toLowerCase();
    logs.forEach((log, i) => {
        const from = log.from.toString().toLowerCase();
        const to = log.to.toString().toLowerCase();
        const transactionTime = log.transactionTime.toString().toLowerCase();
        const productName = log.productName.toString().toLowerCase();
        const productPrice = log.productPrice.toString().toLowerCase();
        const filteredLog = _.pick(log, ['from', 'to', 'transactionTime', 'productName', 'productPrice']);
        if((from === queryAsString) || (to === queryAsString) || (transactionTime === queryAsString) || (productName === queryAsString) || (productPrice === queryAsString)) {
            searchResults.push(filteredLog);
            exactResIndex = searchResults.length - 1;
        } else if((from.includes(queryAsString) || to.includes(queryAsString) || transactionTime.includes(queryAsString) || productName.includes(queryAsString) || productPrice.includes(queryAsString)) && (queryAsString.length > 2)) {
            searchResults.push(filteredLog);
        }
    })
    
    if(exactResIndex > 0 && searchResults.length > 0) {
        let temp = searchResults[0];
        searchResults[0] = searchResults[exactResIndex];
        searchResults[exactResIndex] = temp;
    }

    return searchResults;
}