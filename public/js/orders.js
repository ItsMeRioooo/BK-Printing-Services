function openOrderModal(orderId) {
    document.getElementById('orderModal').style.display = 'block';
    fetch(`/order/${orderId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Order data:', data);
            document.getElementById('modalOrderReferenceId').innerText = '#' + data.order_id;
            document.getElementById('modalOrderName').innerText = data.order_name;
            document.getElementById('modalOrderDate').innerText = data.order_date;
            document.getElementById('modalCustomerNamne').innerText = data.customer_name;
            document.getElementById('modalCustomerContact').innerText = data.customer_contact;
            // document.getElementById('modalStatus').innerText = data.message;
            // document.getElementById('orderDetailsFile').innerText = data.file;
            // document.getElementById('modalOrderMode').innerText = data.status;
        });
}
function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function deleteOrder() {
    const orderId = document.getElementById('modalOrderReferenceId').innerText.slice(1);
    fetch(`/deleteOrder/${orderId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order deleted:', data);
        closeOrderModal();
        location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeOrderModal();
        if (document.getElementById('printOrderModal').style.display === 'block') {
            closePrintOrderModal();
        }
    }
});

function printOrder() {
    const orderId = document.getElementById('modalOrderReferenceId').innerText.slice(1);
    document.getElementById('printOrderModal').style.display = 'block';
    fetch(`/order/${orderId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Order data:', data);
            document.getElementById('printOrderReferenceId').innerText = '#' + data.order_id;
            document.getElementById('printOrderName').innerText = data.order_name;
            document.getElementById('printOrderDate').innerText = data.order_date;
            document.getElementById('printCustomerName').innerText = data.customer_name;
            document.getElementById('printCustomerContact').innerText = data.customer_contact;
            document.getElementById('printOrderMode').innerText = data.order_mode;
            document.getElementById('printOrderStatus').innerText = data.order_status;
            document.getElementById('printOrderFile').innerHTML = `<a href="${data.order_file}" target="_blank">Open File</a>`;
            document.getElementById('printOrderMessage').innerText = data.customer_message;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    closeOrderModal();
}

function confirmPrint() {
    const orderId = document.getElementById('printOrderReferenceId').innerText.slice(1);
    fetch(`/confirmPrint/${orderId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order moved to history:', data);
        closePrintOrderModal();
        location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function closePrintOrderModal() {
    document.getElementById('printOrderModal').style.display = 'none';
    document.getElementById('orderModal').style.display = 'block';
}
