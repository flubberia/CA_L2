function isPalindrome(str) {
    return str === str.split('').reverse().join('');
}

function getPalindromes(text) {
    var palindromes = [];
    for (var N = 4; N <= 10; N++)
        for (var i = 0; i < text.length - N; i++)
            if (isPalindrome(text.substr(i, N)) && palindromes.indexOf(text.substr(i, N)) == -1)
                palindromes.push(text.substr(i, N));
    return palindromes;
}

var text, state = 'work', workerNumber, palindromes = '<none>';
self.postMessage("Started");
while (state != 'exit') {
    var requestGET = new XMLHttpRequest();
    requestGET.open("GET", "/workerData", false);
    requestGET.send();

    var whatWeGot = JSON.parse(requestGET.responseText);
    text = whatWeGot['text'];
    state = whatWeGot['state'];
    workerNumber = whatWeGot['worker_number'];

    if (state == 'work') {
        palindromes = getPalindromes(text);

        var requestPOST = new XMLHttpRequest();
        requestPOST.open("POST", "/workerData", true);
        requestPOST.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        requestPOST.send("worker_number=" + workerNumber + "&palindromes=" + palindromes);

        postMessage('Working.<br>Last found palindromes: ' + palindromes);
    }
    else if (state == 'pause')
        postMessage('Paused.<br>Last found palindromes: ' + palindromes);
    else if (state == 'stop')
        postMessage('Finished.<br>Last found palindromes: ' + palindromes);
    else
        postMessage('Waiting for task.');
}
	
