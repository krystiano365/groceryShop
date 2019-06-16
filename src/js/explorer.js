// const server = 'http://localhost:8000/';

const requestLogs = () => {
    const query = document.getElementById('query').value;
    const req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open("GET", server + 'logs', true);
    req.setRequestHeader('query', query);
    req.onreadystatechange = () => {
        if(req.readyState === 4)
        {
            if(req.status === 200 || req.status == 0)
            {
                populateDOM(req.response);
            }
        }
    }
    req.send(null);
}

const populateDOM = (results) => {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    results.forEach(result => {
        const row = document.createElement('tr');
        const innerHTML = `
        <td>${result.from}</td>
        <td>${result.to}</td>
        <td>${result.productName}</td>
        <td>${result.productPrice}</td>
        <td>${result.transactionTime}</td>
        `;
        row.innerHTML = innerHTML;
        searchResults.append(row);
    });
}