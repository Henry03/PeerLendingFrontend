getProfile();

function getProfile() {
    const token = localStorage.getItem('token');

    fetch('/ApiMstUser/Profile/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
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

        $('#name').text(data.data.name);
        $('#role').text(data.data.role);
        $('#balance').text(formatToRupiah(data.data.balance));
    })
    .catch(error => {
        toastr.error("An error occurred: " + (error.message || "Please try again."));
    })
}

function handleResponse(response) {
    if (response.status === 401 || response.status === 403) {
        console.log(response)
        localStorage.removeItem('token')
        window.location.href = '/';
        return false;
    }
    return true;
}

function logout() {
    if (!localStorage.getItem("token")) {
        window.location.href = "/Login";
    }

    localStorage.removeItem("token");
    window.location.href = "/Login";
}

function formatToRupiah(value) {
    const numberValue = parseFloat(value);

    if (isNaN(numberValue)) {
        return "Invalid value"; 
    }

    return numberValue.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
}

function formatToDateTime(isoString) {
    const date = new Date(isoString);

    const formattedDate = date.toLocaleDateString('en-CA'); 

    const formattedTime = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return `${formattedDate} ${formattedTime}`;
}

function statusFormat(status) {
    switch (status) {
        case 'Requested':
            return `<div class="badge badge-warning">${status}</div>`
        case 'Funded':
            return `<div class="badge badge-info">${status}</div>`
        case 'Repaid':
            return `<div class="badge badge-success">${status}</div>`
        default:
            return;
    }
}

function statusRepaymentFormat(status) {
    switch (status) {
        case 'On Repay':
            return `<div class="badge badge-info">${status}</div>`
        case 'Done':
            return `<div class="badge badge-success">${status}</div>`
        default:
            return;
    }
}

function updateSteps(userStatus) {
    const steps = document.querySelectorAll('.step');

    steps.forEach(step => step.classList.remove('step-primary'));

    switch (userStatus) {
        case 'Requested':
            steps[0].classList.add('step-primary');
            break;
        case 'Funded':
            steps[0].classList.add('step-primary');
            steps[1].classList.add('step-primary');
            break;
        case 'Repaid':
            steps[0].classList.add('step-primary');
            steps[1].classList.add('step-primary');
            steps[2].classList.add('step-primary');
            break;
        default:
            break;
    }
}
