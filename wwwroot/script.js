// basic function to show a particular type of alert on base page
function showAlert(name) {
    $("#readyAlert").collapse((name === 'ready' ? 'show' : 'hide'));
    $("#errorAlert").collapse((name === 'error' ? 'show' : 'hide'));
    $("#processingAlert").collapse((name === 'processing' ? 'show' : 'hide'));
    $("#incorrectFileAlert").collapse((name === 'incorrectFile' ? 'show' : 'hide'));
}
//function to hide all alerts
function hideAlerts() {
    $("#readyAlert").collapse('hide');
    $("#errorAlert").collapse('hide');
    $("#processingAlert").collapse('hide');
    $("#incorrectFileAlert").collapse('hide');
    console.log("Hiding all alerts");
}

function showDownloadAlerts(link) {
    updateDownloadLinks(link);
    showAlert('ready');
    $("#modalReadyAlert").collapse('show');
}

function updateDownloadLinks(link) {
    $("#downloadLink").prop('href', link);
    $("#modalDownloadLink").prop('href', link);;
}

function requestStatusFromServer(val) {
    $.ajax("api/ReviewBuilder/IsReady/" + val, {
        method: 'GET',
        dataType: 'json'
    }
    ).done(function (data) {
        if (data.isReady) {
            showDownloadAlerts("api/ReviewBuilder/GetFiles/" + val);
            return;
        }
        showAlert('processing');
    }
    ).fail(function () { showAlert('error'); });
}


// **** MODAL window part **** //

// timer for modal window
var timerId = undefined;
// global tokenId for modal window
var tokenId = undefined;

$("#loadSuccessModal").on('shown.bs.modal', function () {
    startWaitingTimer();
});

$("#loadSuccessModal").on('hidden.bs.modal', function () {
    tokenId = undefined;
    stopWaitingTimer();
});

function showModal(token) {
    $("#acquiredToken").text(token);
    tokenId = token;
    console.log("Новый токен пришел: " + tokenId);
    $("#modalReadyAlert").collapse('hide');
    $("#loadSuccessModal").modal();
}



function checkReadyModal() {
    if (tokenId === undefined) {
        console.log("Something went wrong. Token id is not defined");
        return;
    }
    $.ajax("api/ReviewBuilder/IsReady/" + tokenId, {
        method: 'GET',
        dataType: 'json'
    }
    ).done(function (data) {
        if (data.isReady) {
            let dLink = "api/ReviewBuilder/GetFiles/" + tokenId;
            console.log('Data is ready, showing link ' + dLink)
            showDownloadAlerts(dLink);
            stopWaitingTimer();
            return;
        }
        console.log("file is not yet ready");
    }
    ).fail(function () {
        console.log("fatal error occurred");
        showAlert('error'); stopWatchingTimer(); $("#loadSuccessModal").modal('hide');
    });
}

function startWaitingTimer() {
    if (timerId === undefined) {
        timerId = setInterval(checkReadyModal, 4000);
        console.log("Starting timer " + timerId);
        return;
    }
    console.log("Timer already started");
}
function stopWaitingTimer() {
    if (timerId !== undefined) {
        clearInterval(timerId);
        timerId = undefined;
        console.log("Timer stopped ...");
        return;
    }
    console.log("No timer to stop...");
}


$("#fileSubmitForm").on('submit', function (ev) {
    ev.preventDefault();

    var data = new FormData();
    data.append("files", $("#files")[0].files[0]);

    $.ajax("api/ReviewBuilder/UploadFiles",
        {
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            dataType: 'json'
        }
    ).done(function (data) { showAlert('processing'); showModal(data.id); }
    ).fail(function () { showAlert('incorrectFile'); });


});
$("#tokenSubmitForm").on('submit', function (ev) {
    status = requestStatusFromServer($("#inputToken").val());
    ev.preventDefault();
});