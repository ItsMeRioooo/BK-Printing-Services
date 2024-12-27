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

function filterOrders() {
    document.getElementById('searchBar').addEventListener('input', () => {
        const searchInput = document.getElementById('searchBar').value.toLowerCase();
        console.log('Search Input:', searchInput);
    
        fetch(`/searchOrders?q=${encodeURIComponent(searchInput)}`) 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                return response.json();
            })
            .then(orders => {
                const ordersContainer = document.getElementById('ordersContainer');
                ordersContainer.innerHTML = '';
    
                if (orders.length === 0) {
                    ordersContainer.innerHTML = '<p id="notFound">No orders found.</p>';
                    return;
                }
    
                orders.forEach(order => {
                    const orderElement = document.createElement('div');
                    orderElement.classList.add('orders');
                    orderElement.setAttribute('onclick', `openOrderModal(${order.order_id})`);
                    orderElement.innerHTML = `
                        <div><h3>#${order.order_id}</h3></div>
                        <div><p>${order.order_name}</p></div>
                        <div><p>${order.order_date}</p></div>
                        <div><p>${order.order_mode}</p></div>
                    `;
                    ordersContainer.appendChild(orderElement);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                const ordersContainer = document.getElementById('ordersContainer');
                ordersContainer.innerHTML = '<p>Failed to load orders. Please try again later.</p>';
            });
    });
}
