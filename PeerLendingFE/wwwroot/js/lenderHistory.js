var idLoan;
var page = 1;

async function fetchData(event) {
    if (event) {
        event.preventDefault();
    }
    const token = localStorage.getItem('token');
    var status = $('#status').val();

    const body = {
        search: $('#search').val(),
        sortby: $('#filter').val(),
        ascending: document.getElementById('toggleSwitch').checked,
        pageNumber: page
    };

    const response = await fetch('/ApiLender/History', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    handleResponse(response)
    if (!response.ok)
    {
        toastr.error(response.statusText);
        return;
    }
    const jsonData = await response.json();
    if (jsonData.success) {
        populateUserTable(jsonData.data.data)
        renderPagination(jsonData.data)
    } else {
        toastr.warning('User not found');
    }
}

function populateUserTable(data) {
    const userTableBody = document.querySelector('#userTable tbody');
    userTableBody.innerHTML = '';

    let number = (page-1) * 10 + 1;

    if (data.length > 0) {
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <tr class="hover">
                    <td>${number++}</td>
                    <td>${formatToDateTime(item.fundedAt)}</td>
                    <td>${item.borrowerName}</td>
                    <td>${formatToRupiah(item.amount)}</td>
                    <td>${formatToRupiah(item.repaidAmount)}</td>
                    <td>${formatToRupiah(item.balanceAmount)}</td>
                    <td>${statusRepaymentFormat(item.repaidStatus)}</td>
                </tr>
            `;
            userTableBody.appendChild(row);
        });
    }
    else {
        const row = document.createElement('tr');
        row.innerHTML = `
                <tr class="hover">
                    <td colspan="6" style="text-align:center">No Data</td>
                </tr>
            `;
        userTableBody.appendChild(row);
    }
}

window.onload = fetchData();

function openFundingModal(item) {
    idLoan = item.loanId;
    $('#fundingAmount').text(formatToRupiah(item.amount));
    $('#fundingInterestRate').text(item.interestRate + '%');
    $('#fundingDuration').text(item.duration + ' Month');
    $('#fundingName').text(item.borrowerName);
    document.getElementById('fundingModal').showModal();
}

function closeFundingModal() {
    document.getElementById('fundingModal').close();
    $('#fundingBalanceError').addClass('hidden');
}

function funding() {
    const token = localStorage.getItem('token');

    const content = {
        loanId: idLoan
    };

    console.log(content)

    fetch('/ApiLender/Funding', {
        method: 'POST',
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
        toastr.success(data.message);
        closeFundingModal();
        getProfile();
        fetchData();
    })
    .catch(error => {

        var fields = {
            balance: 'fundingBalanceError'
        };

        if (error && error.data) {
            Object.keys(fields).forEach(fieldKey => {
                var element = $('#' + fields[fieldKey]);
                var validationElement = $('#' + fields[fieldKey] + ' span'); 
                var errorItem = error.data ? error.data.find(item => item.field.toLowerCase() === fieldKey) : null;

                if (errorItem) {
                    var messages = errorItem.message;
                    element.removeClass("hidden"); 
                    validationElement.text(messages); 
                } else {
                    element.addClass('hidden'); 
                    validationElement.text('');
                }
            });
        } else {
            toastr.error("An error occurred: " + (error.message || "Please try again."));
            closeFundingModal();
        }
    })
}
function editUser(id) {
    const token = localStorage.getItem('token');

    fetch('ApiMstUser/GetUserById?id=' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            const user = data.data;

            $('#name').val(user.name);
            $('#role').val(user.role);
            $('#balance').val(user.balance);
            idUser = id;

            document.getElementById('editUserModal').showModal();
        }
        else {
            alert('User not found.');
        }
    })
    .catch(error => {
        alert('Error fetching user data : ' + error.message);
    })
}

function saveEditUser() {
    const token = localStorage.getItem('token');

    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const balance = document.getElementById('balance').value;

    const user = {
        name: name,
        role: role,
        balance: parseFloat(balance)
    };

    fetch('ApiMstUser/UpdateUser/'+ idUser, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            toastr.warning(response.message)
            throw new Error('Failed to update user');
        }
        return response.json();
    })
    .then(data => {
        toastr.success(data.message);
        document.getElementById('editUserModal').close();
        fetchData();
    })
    .catch(error => {
        toastr.error(error.message)
        alert('Error updating user data : ' + error.message);
    })
}

function openDeleteModal(id) {
    idUser = id
    document.getElementById('deleteUserModal').showModal();
}

function closeDeleteModal() {
    document.getElementById('deleteUserModal').close();
}
function deleteUser() {
    const token = localStorage.getItem('token');

    fetch('ApiMstUser/User/'+ idUser, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
    .then(response => {
        if (!response.ok) {
            toastr.warning(response.message)
            closeDeleteModal();
            throw new Error('Failed to delete user');
        }
        return response.json();
    })
    .then(data => {
        toastr.success(data.message);
        closeDeleteModal();
        fetchData();
    })
    .catch(error => {
        toastr.error(error.message)
        closeDeleteModal();
        alert('Error deleting user data : ' + error.message);
    })
}