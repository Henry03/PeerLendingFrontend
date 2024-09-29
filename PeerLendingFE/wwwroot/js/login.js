async function submitLogin(event) {
    event.preventDefault();
    
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/ApiLogin/Login', {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.data.token);
            switch (result.data.role) {
                case 'admin':
                    window.location.href = 'MstUser/Index'
                    break;
                case 'lender':
                    window.location.href = 'Lender/Index'
                    break;
                case 'borrower':
                    window.location.href = 'Borrower/Index'
                    break;
                default:
                    break;
            }
        } else {
            $('#loginAlert span').text(result.message || 'Login failed. Please try again');
            $('#loginAlert').removeClass('hidden');
        }
    }
    catch (error) {
        $('#loginAlert span').text(result.message || 'Login failed. Please try again');
        $('#loginAlert').removeClass('hidden');
    }
}