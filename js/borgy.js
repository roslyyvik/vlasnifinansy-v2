function CalculateFinanceCharge(fieldType) {
    balanceField = document.getElementById("txtBalance" + fieldType);
    interestRateField = document.getElementById("txtInterestRate" + fieldType);
    financeChargeField = document.getElementById("txtFinanceCharge" + fieldType);

    balance = balanceField.value;
    interestRate = interestRateField.value / 12 / 100;
    if (isNaN(balance) || balance === "") balance = 0;
    if (isNaN(interestRate) || interestRate === "") interestRate = 0;

    financeCharge = balance * interestRate;

    financeChargeField.value = financeCharge.toFixed(2);

    CalculateNewBalance(fieldType);
}

function CalculateNewBalance(fieldType) {
    balanceField = document.getElementById("txtBalance" + fieldType);
    financeChargeField = document.getElementById("txtFinanceCharge" + fieldType);
    paymentField = document.getElementById("txtPayment" + fieldType);
    newBalanceField = document.getElementById("txtNewBalance" + fieldType);

    balance = balanceField.value;
    financeCharge = financeChargeField.value;
    payment = paymentField.value;
    if (isNaN(balance) || balance === "") balance = 0;
    if (isNaN(financeCharge) || financeCharge === "") financeCharge = 0;
    if (isNaN(payment) || payment === "") payment = 0;

    newBalance = parseFloat(balance) + parseFloat(financeCharge) - parseFloat(payment);
    newBalanceField.value = newBalance;

    CalculateTotals();
}

function CalculateTotals() {
    totalBalance = 0;
    totalFinanceCharge = 0;
    totalPayment = 0;
    totalNewBalance = 0;
    for (var x = 1; x <= 10; x++) {
        balanceField = document.getElementById("txtBalance" + x);
        financeChargeField = document.getElementById("txtFinanceCharge" + x);
        paymentField = document.getElementById("txtPayment" + x);
        newBalanceField = document.getElementById("txtNewBalance" + x);

        balance = balanceField.value;
        financeCharge = financeChargeField.value;
        payment = paymentField.value;
        newBalance = newBalanceField.value;
        if (isNaN(balance) || balance === "") balance = 0;
        if (isNaN(financeCharge) || financeCharge === "") financeCharge = 0;
        if (isNaN(payment) || payment === "") payment = 0;
        if (isNaN(newBalance) || newBalance === "") newBalance = 0;

        totalBalance = parseFloat(totalBalance) + parseFloat(balance);
        totalFinanceCharge = parseFloat(totalFinanceCharge) + parseFloat(financeCharge);
        totalPayment = parseFloat(totalPayment) + parseFloat(payment);
        totalNewBalance = parseFloat(totalNewBalance) + parseFloat(newBalance);
    }

    document.getElementById("txtTotalBalance").value = " " + totalBalance;
    document.getElementById("txtTotalFinanceCharge").value = " " + totalFinanceCharge;
    document.getElementById("txtTotalPayment").value = " " + totalPayment;
    document.getElementById("txtTotalNewBalance").value = " " + totalNewBalance;

}