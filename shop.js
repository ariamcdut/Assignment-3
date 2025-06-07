let cart = JSON.parse(localStorage.getItem('shoppingCart')) || {};

//Save cart function: saves the cart after every action so the customer can go to different pages and the progress is saved.

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCountDisplay(); 
}

// Stores the product Ids and the corresponding details in the cart. 

function addToCart(productId, name, price, imageUrl) {
    if (cart[productId]) {
        cart[productId].quantity++;
    } else {
        cart[productId] = { 
            name: name,
            price: price,
            imageUrl: imageUrl,
            quantity: 1
        };
    }
    saveCart();
    console.log(`${name} added to cart. Current cart:`, cart);
    alert(`${name} added to cart!`);
}

// Changes the quantity of an item in the cart.  

function updateQuantity(productId, change) {
    if (cart[productId]) {
        cart[productId].quantity += change;
        if (cart[productId].quantity <= 0) {
            delete cart[productId]; 
        }
        saveCart();

        if (document.getElementById('cart-items-container')) { 
            window.renderCartPage(); 
        }
    location.reload()
    }
}

// Removes an item from the cart. 

function removeFromCart(productId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        delete cart[productId];
        saveCart();
        location.reload()

        if (document.getElementById('cart-items-container')) {
            window.renderCartPage(); 
            location.reload()
        }
    } 
    location.reload()
}

// Removes all items from the cart. 

function emptyCart() {
    if (confirm('Are you sure you want to empty your entire cart?')) {
        cart = {}; 
        saveCart();
        
        if (document.getElementById('cart-items-container')) {
            window.renderCartPage(); 
        }
    location.reload()
    }
}

// Removes all items from the cart. 

function completeCart() {
        cart = {}; 
        saveCart();

}

// Updates the cart section where it shows how many items have been added.

function updateCartCountDisplay() {
    const cartCountElement = document.getElementById('cart-count'); 
    if (cartCountElement) {
        let totalItems = 0;
        for (const id in cart) {
            totalItems += cart[id].quantity;
        }
        cartCountElement.textContent = totalItems;
    }
}

// This function creates the actual cart page.

window.renderCartPage = function() {

    // Defining constants
    
    const cartItemsContainer = document.getElementById('cart-items-container'); 
    const cartTotalItems = document.getElementById('totalitems');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message'); 
    const emptyCartBtn = document.getElementById('empty-cart-btn'); 
    const checkoutBtn = document.getElementById('checkoutbutton'); 

    // Debugging using console

    if (!cartItemsContainer || !cartTotalItems || !cartTotalPrice || !emptyCartMessage || !emptyCartBtn || !checkoutBtn) {
        console.error("Critical: One or more required cart page elements not found. Please check your HTML IDs in cart.html.");
        if (!cartItemsContainer) console.error("Missing ID: 'cart-items-container'");
        if (!cartTotalItems) console.error("Missing ID: 'totalitems'");
        if (!cartTotalPrice) console.error("Missing ID: 'cart-total-price'");
        if (!emptyCartMessage) console.error("Missing ID: 'empty-cart-message'");
        if (!emptyCartBtn) console.error("Missing ID: 'empty-cart-btn'");
        if (!checkoutBtn) console.error("Missing ID: 'checkoutbutton'");
        return; 
    }

    // Initial display of the page (based on if the cart has 0 or + items in it)

    cartItemsContainer.innerHTML = ''; 
    let totalItems = 0;
    let totalPrice = 0;

    if (Object.keys(cart).length === 0) {
        emptyCartMessage.style.display = 'block';
        cartItemsContainer.style.display = 'none'; 
        cartTotalItems.textContent = '0';
        cartTotalPrice.textContent = '$0.00';
        emptyCartBtn.style.display = 'none';
        checkoutBtn.style.display = 'none';
        return; 
    } else {
        emptyCartMessage.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        emptyCartBtn.style.display = 'inline-block';
        checkoutBtn.style.display = 'inline-block';
    }

    // Creating the display table. 

    const cartTable = document.createElement('table');
    cartTable.classList.add('cart-table');
    cartTable.innerHTML = `
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    // Working out the values based on the data from the product Id and displaying it appropriately 

    const cartTableBody = cartTable.querySelector('tbody');

    for (const productId in cart) {
        const item = cart[productId];
        const itemSubtotal = item.price * item.quantity;
        totalItems += item.quantity; 
        totalPrice += itemSubtotal; 

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="cart-item-info">
                    <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button class="quantity-btn minus-btn" data-product-id="${productId}">-</button>
                <span class="item-quantity">${item.quantity}</span> <button class="quantity-btn plus-btn" data-product-id="${productId}">+</button>
            </td>
            <td>$${itemSubtotal.toFixed(2)}</td> <td><button class="remove-btn" data-product-id="${productId}"><i class="fa-solid fa-dumpster"></i></button></td> `;
        cartTableBody.appendChild(row);
    }

    // Appends the created table to the cart items container (which is initially empty to start with.) 

    cartItemsContainer.appendChild(cartTable); 

    cartTotalItems.textContent = totalItems; 
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;

    // Event listeners to trigger any other functions in the event that they are clicked (and then update the cart) 

    cartItemsContainer.querySelectorAll('.quantity-btn.minus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.productId, -1));
    });
    cartItemsContainer.querySelectorAll('.quantity-btn.plus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.productId, 1));
    });
    cartItemsContainer.querySelectorAll('.remove-btn').forEach(btn => { 
        btn.addEventListener('click', (e) => removeFromCart(e.target.dataset.productId));
    });

    // Checkout button (proceed to the next step)

    checkoutBtn.onclick = () => { 
        if (Object.keys(cart).length > 0) {
            alert('Proceeding to checkout!');
        } else {
            alert('Your cart is empty. Please add items before checking out.');
        }
    };
};

document.addEventListener('DOMContentLoaded', updateCartCountDisplay);