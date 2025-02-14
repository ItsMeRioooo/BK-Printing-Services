document.addEventListener('DOMContentLoaded', function() {
    const scheduleFileDropArea = document.getElementById('scheduleFileDropArea');
    const scheduleFileInput = document.getElementById('scheduleFile');
    const scheduleFileList = document.getElementById('scheduleFileList');
    const printFileDropArea = document.getElementById('printFileDropArea');
    const printFileInput = document.getElementById('printFile');
    const printFileList = document.getElementById('printFileList');

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        e.currentTarget.classList.add('highlight');
    }

    function unhighlight(e) {
        e.currentTarget.classList.remove('highlight');
    }

    function handleDrop(e, input, fileList) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 1) {
            alert('Please upload only one file.');
            return;
        }
        input.files = files;
        updateFileList(files, fileList);
    }

    function updateFileList(files, fileList) {
        fileList.innerHTML = '';
        if (files.length > 0) {
            const file = files[0];
            const fileItem = document.createElement('p');
            fileItem.textContent = file.name;
            fileList.appendChild(fileItem);
        }
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        scheduleFileDropArea.addEventListener(eventName, preventDefaults, false);
        printFileDropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        scheduleFileDropArea.addEventListener(eventName, highlight, false);
        printFileDropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        scheduleFileDropArea.addEventListener(eventName, unhighlight, false);
        printFileDropArea.addEventListener(eventName, unhighlight, false);
    });

    scheduleFileDropArea.addEventListener('drop', e => handleDrop(e, scheduleFileInput, scheduleFileList), false);
    printFileDropArea.addEventListener('drop', e => handleDrop(e, printFileInput, printFileList), false);

    scheduleFileDropArea.addEventListener('click', () => scheduleFileInput.click());
    printFileDropArea.addEventListener('click', () => printFileInput.click());

    scheduleFileInput.addEventListener('change', () => updateFileList(scheduleFileInput.files, scheduleFileList));
    printFileInput.addEventListener('change', () => updateFileList(printFileInput.files, printFileList));
});

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

function openPrintModal() {
    document.getElementById('printModal').style.display = 'block';
    document.getElementById('serviceModal').style.display = 'none';
}

function closePrintModal() {
    document.getElementById('printModal').style.display = 'none';
    document.getElementById('serviceModal').style.display = 'block';
}

function scheduleReceiptModal() {
    document.getElementById('scheduleModal').style.display = 'none';
    document.getElementById('scheduleReceiptModal').style.display = 'block';
}

function closeScheduleReceipt() {
    document.getElementById('scheduleReceiptModal').style.display = 'none';
    location.reload();
}

function openPrintReceipt() {
    document.getElementById('printReceiptModal').style.display = 'block';
    document.getElementById('printModal').style.display = 'none';
}

function closePrintReceipt() {
    document.getElementById('printReceiptModal').style.display = 'none';
    location.reload();
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeServiceModal();
        if (document.getElementById('scheduleModal').style.display == 'block') {
            closeScheduleModal();
        }
        if (document.getElementById('scheduleReceiptModal').style.display == 'block') {
            closeScheduleReceipt();
        }
        if (document.getElementById('printReceiptModal').style.display == 'block') {
            closePrintReceipt();
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
        const orderId = data.modifiedFileName; 
        console.log('Modified File Name:', orderId);
        fetch(`/order/${orderId}`)
            .then(response => response.json())
            .then(order => {
                console.log('Order:', order);
                document.getElementById('receiptOrderId').innerText = order.order_id;
                document.getElementById('receiptServiceName').innerText = order.order_name;
                document.getElementById('receiptCustomerName').innerText = order.customer_name;
                document.getElementById('receiptEmailOrNumber').innerText = order.customer_contact;
                document.getElementById('receiptDate').innerText = order.order_date;
            });
        scheduleReceiptModal();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function printService(event) {
    event.preventDefault();

    const serviceId = document.getElementById('modalServiceId').innerText;
    const name = document.getElementById('printName').value;
    const fileInput = document.getElementById('printFile');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('serviceId', serviceId);
    formData.append('name', name);
    formData.append('file', file);

    fetch('/print', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const orderId = data.modifiedFileName;
        console.log('Modified File Name:', orderId);
        fetch(`/order/${orderId}`)
            .then(response => response.json())
            .then(order => {
                console.log('Order:', order);
                document.getElementById('printReceiptOrderId').innerText = order.order_id;
                document.getElementById('printReceiptServiceName').innerText = order.order_name;
                document.getElementById('printReceiptCustomerName').innerText = order.customer_name;
                document.getElementById('printReceiptDate').innerText = order.order_date;
            });
        openPrintReceipt();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}