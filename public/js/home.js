function openServiceModal(serviceId) {
    document.getElementById('modalServiceId').innerText = serviceId;
	document.getElementById('serviceModal').style.display = 'block';
	fetch(`/service/${serviceId}`)
		.then(response => response.json())
		.then(data => {
			document.getElementById('modalServiceName').innerText = data.service_name;
			document.getElementById('modalServiceDescription').innerText = data.service_description;
			document.getElementById('modalServiceImage').src = data.service_img;
			document.getElementById('modalServicePrice').innerText = data.service_price + " PHP";
		});
}
function closeServiceModal() {
    document.getElementById('serviceModal').style.display = 'none';
}


function openScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'block';
    document.getElementById('serviceModal').style.display = 'none';
}
function closeScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'none';
    document.getElementById('serviceModal').style.display = 'block';
}

function receiptModal() {
    document.getElementById('scheduleModal').style.display = 'none';
    document.getElementById('receiptModal').style.display = 'block';
}
function closereceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeServiceModal();
        if (document.getElementById('scheduleModal').style.display == 'block') {
            closeScheduleModal();
        }
    }
});


function scheduleService(event) {
    event.preventDefault();

    const serviceId = document.getElementById('modalServiceId').innerText;
    const name = document.getElementById('scheduleName').value;
    const emailOrNumber = document.getElementById('scheduleEmailOrNumber').value;
    const date = document.getElementById('scheduleDate').value;
    const message = document.getElementById('scheduleMessage').value;
    const fileInput = document.getElementById('scheduleFile');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('serviceId', serviceId);
    formData.append('name', name);
    formData.append('emailOrNumber', emailOrNumber);
    formData.append('date', date);
    formData.append('message', message);
    formData.append('file', file);

    fetch('/schedule', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const orderId = data.orderId; // Assuming the server returns the orderId
        console.log('Order ID:', orderId);
        fetch(`/order/${orderId}`)
            .then(response => response.json())
            .then(order => {
                document.getElementById('receiptOrderId').innerText = order.order_id;
                document.getElementById('receiptServiceName').innerText = order.order_name;
                document.getElementById('receiptCustomerName').innerText = order.customer_name;
                document.getElementById('receiptEmailOrNumber').innerText = order.customer_contact;
            });
        receiptModal();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function closereceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
}