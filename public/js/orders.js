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