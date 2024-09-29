function openTopUpModal() {
    document.getElementById('topUpModal').showModal();
}

function closeTopUpModal() {
    $('#topUpMoney').val('');
    $('#topUpMoney').removeClass('input-error');
    $('#topUpMoneyError').addClass('hidden');
    document.getElementById('topUpModal').close();
}

function topup() {
    const token = localStorage.getItem('token');

    const content = {
        balance: $('#topUpMoney').val() || 0
    };

    fetch('/ApiMstUser/Topup/', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    })
    .then(response => {
        handleResponse(response)
        if (!response.ok) {
            return response.json().then(err => {
                throw err;
            });
        }
        return response.json();
    })
    .then(data => {
        getProfile();
        closeTopUpModal();
        toastr.success(data.message);
    })
    .catch(error => {
        var fields = {
            balance: 'topUpMoney',
        };

        if (error && error.data) {
            Object.keys(fields).forEach(fieldKey => {
                var element = $('#' + fields[fieldKey]);
                var validationElement = $('#' + fields[fieldKey] + 'Error');
                console.log(fieldKey)
                var errorItem = error.data ? error.data.find(item => item.field.toLowerCase() === fieldKey) : null;

                if (errorItem) {
                    var messages = errorItem.messages;
                    element.addClass("input-error");
                    validationElement.removeClass('hidden').text(messages);
                } else {
                    element.removeClass("input-error");
                    validationElement.addClass('hidden').text('');
                }
            });
        } else {
            toastr.error("An error occurred: " + (error.message || "Please try again."));
            closeTopUpModal();
        }
    })
}