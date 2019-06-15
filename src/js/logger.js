const server = 'http://localhost:8000/';

const sendLog = (logAsJSON) => {
    const req = new XMLHttpRequest();
    req.open("POST", server + 'logs', true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onreadystatechange = () => {
        if(req.readyState === 4)
        {
            if(req.status === 200 || req.status == 0)
            {
                console.log(req.responseText);
            }
        }
    }
    
    req.send(JSON.stringify(logAsJSON));
}