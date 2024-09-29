var idLoan;
var page = 1;
var selectedInstallments = [];

async function fetchData(event) {
    if (event) {
        event.preventDefault();
    }
    const token = localStorage.getItem('token');

    const body = {
        search: $('#search').val(),
        sortby: $('#filter').val(),
        ascending: document.getElementById('toggleSwitch').checked,
        pageNumber: page
    };

    const response = await fetch('/ApiBorrower/History', {
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
                    <td>${formatToDateTime(item.createdAt)}</td>
                    <td>${formatToRupiah(item.amount)}</td>
                    <td>${item.interestRate + '%'}</td>
                    <td>${item.duration + ' Month'}</td>
                    <td>${statusFormat(item.status)}</td>
                    <td>
                        <button class="btn btn-outline btn-warning btn-sm">Detail</button>
                    </td>
                </tr>
            `;
            userTableBody.appendChild(row);

            row.querySelector('button').addEventListener('click', () => openLoanDetailModal(item));
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

function openRequestFundModal() {
    document.getElementById('requestFundModal').showModal();
}

function closeRequestFundModal() {
    $('#requestAmount').val('');
    $('#requestInterestRate').val('');
    document.getElementById('requestFundModal').close();
}

function addLoan() {
    const token = localStorage.getItem('token');

    const user = {
        amount: $('#requestAmount').val(),
        interestRate: $('#requestInterestRate').val()
    };

    fetch('/ApiBorrower/Loan', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
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
        closeRequestFundModal();
        fetchData();
    })
    .catch(error => {

        var fields = {
            name: 'addName',
            email: 'addEmail',
            role: 'addRole',
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
            console.log(error)
            closeAddUserModal();
        }
    })
}

function openLoanDetailModal(item) {
    idLoan = item.loanId;
    $('#detailAmount').text(formatToRupiah(item.amount));
    $('#detailStatus').html(statusFormat(item.status));
    $('#detailRate').text(item.interestRate + '%');
    $('#detailDuration').text(item.duration + ' Month');
    $('#detailCreatedAt').text('Requested At : ' + formatToDateTime(item.createdAt));
    updateSteps(item.status);
    if (item.status == "Funded" || item.status == "Repaid") {
        getInstallment();
    }
    if (item.status == "Repaid") {
        getRepayment();
    }
    document.getElementById('loanDetailModal').showModal();
}

function closeLoanDetailModal() {
    $('#installment').html('')
    $('#installmentContainer').html('')
    $('#installmentFooter').html('')
    $('#repaidContainer').html('')
    $('#repaymentAlert').addClass('hidden');
    document.getElementById('loanDetailModal').close();
}

function getInstallment() {
    const token = localStorage.getItem('token');

    fetch('/ApiBorrower/Installment?id=' + idLoan, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
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
        if (data.data) {
            $('#installmentContainer').append(`
                <hr class="mt-3"/>
                <h4 class="py-2 font-bold">Repayment</h4>
            `)
            
            $('#installmentFooter').append(`
                <div role="alert" class="alert alert-error hidden my-2" id="repaymentAlert">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Insufficient balance.</span>
                </div>
                <button class="btn btn-primary w-full hidden" id="payNowButton" onclick="payNow()">Pay Now</button>
            `)


            data.data.forEach(item => {
                let paidAtContent = '';
                let checkboxContent = '';

                if (item.paidAt !== '0001-01-01T00:00:00') {
                    paidAtContent = `<p>Paid at : ${formatToDateTime(item.paidAt)}</p>`;
                } else {
                    checkboxContent = `<input type="checkbox" defaultChecked class="checkbox checkbox-primary installment-checkbox" data-id="${item.id}"/>`;
                }

                $('#installment').append(`
                    <div class="flex flex-row p-5 my-1 card card-bordered gap-3 disabled">
                        ${checkboxContent}
                        <div class="grid grid-flow-col justify-between w-full">
                    <div>
                        <p class="font-bold">Issue ${item.issue}</p>
                        ${paidAtContent}
                    </div>
                    <p class="font-bold">${formatToRupiah(item.amount)}</p>
                `)
            })

            $('.installment-checkbox').on('change', function () {
                const installmentId = $(this).data('id');

                if ($(this).is(':checked')) {
                    selectedInstallments.push(installmentId);
                } else {
                    selectedInstallments = selectedInstallments.filter(id => id !== installmentId);
                }

                let anyChecked = selectedInstallments.length > 0;
                if (anyChecked) {
                    $('#payNowButton').removeClass('hidden');
                } else {
                    $('#payNowButton').addClass('hidden');
                }
            });
        } else {
            toastr.warning('No installments found');
        }
    })
    .catch(error => {
            toastr.warning(error.message);
    })
}

function payNow() {
    if (selectedInstallments.length == 0) {
        toast.warning('Please select at least')
        return;
    }

    const token = localStorage.getItem('token');

    const content = {
        id: selectedInstallments,
        loanId: idLoan
    }

    fetch('/ApiBorrower/Installment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(content)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Failed to process payment');
                });
            }
            return response.json();
        })
        .then(data => {
            toastr.success('Payment processed successfully!');
            selectedInstallments = [];
            closeLoanDetailModal();
            fetchData();
            getProfile();
        })
        .catch(error => {
            if (error.message == "Insufficient balance.") {
                $('#repaymentAlert').removeClass('hidden');
                return;
            }
            toastr.error(error.message || 'An error occurred');
        });
}

function getRepayment() {
    const token = localStorage.getItem('token');

    fetch('/ApiBorrower/RepaidDetail?id=' + idLoan, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
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
        if (data.data) {
            $('#repaidContainer').append(`
                <hr/>
                <div>
                    <div>Repaid Amount</div>
                    <div class="text-lg font-bold" id="detailAmount">${formatToRupiah(data.data.amount)}</div>
                </div>
                <p>Repaid At : ${formatToDateTime(data.data.paidDate)}</p>
            `)
        } else {
            toastr.warning('No installments found');
        }
    })
    .catch(error => {
        toastr.warning(error.message);
    })
}