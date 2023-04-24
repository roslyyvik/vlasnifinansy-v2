function CalculateFinanceCharge(fieldType) {
    amountFinancedField = document.getElementById("txtAmountFinanced" + fieldType);
    interestRateField = document.getElementById("txtInterestRate" + fieldType);
    financeChargeField = document.getElementById("txtFinanceCharge" + fieldType);

    amountFinanced = amountFinancedField.value;
    interestRate = interestRateField.value;
    if (isNaN(amountFinanced) || amountFinanced == "") amountFinanced = 0;
    if (isNaN(interestRate) || interestRate == "") interestRate = 0;

    financeCharge = amountFinanced * interestRate / 100;
    financeChargeField.value = financeCharge;

    CalculateTotalCost(fieldType);
}

function CalculateTotalCost(fieldType) {
    amountFinancedField = document.getElementById("txtAmountFinanced" + fieldType);
    financeChargeField = document.getElementById("txtFinanceCharge" + fieldType);
    feeField = document.getElementById("txtFee" + fieldType);
    totalCostField = document.getElementById("txtTotalCost" + fieldType);

    amountFinanced = amountFinancedField.value;
    financeCharge = financeChargeField.value;
    fee = feeField.value;
    if (isNaN(amountFinanced) || amountFinanced == "") amountFinanced = 0;
    if (isNaN(financeCharge) || financeCharge == "") financeCharge = 0;
    if (isNaN(fee) || fee == "") fee = 0;

    totalCostField.value = parseFloat(amountFinanced) + parseFloat(financeCharge) + parseFloat(fee);

}