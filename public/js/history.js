function openHistoryModal(order_id) {
    document.getElementById('historyModal').style.display = 'block';
    fetch(`/history/${order_id}`)
    .then(response => response.json())
    .then(data => {
        console.log('History data:', data);
        document.getElementById('historyReferenceId').innerText = '#' + data.order_id;
        document.getElementById('historyName').innerText = data.order_name;
        document.getElementById('historyOrderDate').innerText = data.order_date;
        document.getElementById('historyCustomerName').innerText = data.customer_name;
        document.getElementById('historyCustomerContact').innerText = data.customer_contact;
        document.getElementById('historyOrderMode').innerText = data.order_mode;
        document.getElementById('historyOrderFile').innerHTML = `<a href="${data.order_file}" target="_blank">Open File</a>`;
        document.getElementById('historyOrderMessage').innerText = data.customer_message;
    });
}

function closeHistoryModal() {
    document.getElementById('historyModal').style.display = 'none';
}