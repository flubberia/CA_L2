$(document).ready(function(){
    startWorker();
});

function startWorker() {
    var worker = new Worker("/js/worker.js");
    alert("Worker was created" + worker)
    worker.onmessage = function (event) {
        $('#info').html = event.data;
    };
}