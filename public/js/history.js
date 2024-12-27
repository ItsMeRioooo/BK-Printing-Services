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

function filterHistory() {
    document.getElementById('searchBar').addEventListener('input', () => {
        const searchInput = document.getElementById('searchBar').value.toLowerCase();
        console.log('Search Input:', searchInput);
    
        fetch(`/searchHistory?q=${encodeURIComponent(searchInput)}`) 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch history');
                }
                return response.json();
            })
            .then(history => {
                const historyContainer = document.getElementById('historyContainer');
                historyContainer.innerHTML = '';
    
                if (history.length === 0) {
                    historyContainer.innerHTML = `<p id="notFound">No results found for "${searchInput}".</p>`;
                    return;
                }
    
                history.forEach(order => {
                    const orderElement = document.createElement('div');
                    orderElement.classList.add('orders');
                    orderElement.setAttribute('onclick', `openHistoryModal(${order.order_id})`);
                    orderElement.innerHTML = `
                        <div><h3>#${order.order_id}</h3></div>
                        <div><p>${order.order_name}</p></div>
                        <div><p>${order.order_date}</p></div>
                        <div><p>${order.order_mode}</p></div>
                    `;
                    historyContainer.appendChild(orderElement);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                const historyContainer = document.getElementById('historyContainer');
                historyContainer.innerHTML = '<p id="notFound">Failed to load history. Please try again later.</p>';
            });
    });
}