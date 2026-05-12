// REGISTER

function register(){

    const name =
    document.getElementById("name")?.value;

    const email =
    document.getElementById("email")?.value;

    const password =
    document.getElementById("password")?.value;

    fetch("http://localhost:5000/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            email,
            password
        })

    })

    .then((response) => response.json())

    .then((data) => {

        alert(data.message);

        if(data.success){

            window.location.href = "login.html";

        }

    });

}



// LOGIN

function login(){

    const email =
    document.getElementById("login-email")?.value;

    const password =
    document.getElementById("login-password")?.value;

    fetch("http://localhost:5000/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    })

    .then((response) => response.json())

    .then((data) => {

        alert(data.message);

        if(data.success){

            window.location.href = "home.html";

        }

    });

}



// PRODUCTS

const productsContainer =
document.getElementById("products");

let allProducts = [];

if(productsContainer){

    fetch("http://localhost:5000/products")

    .then((response) => response.json())

    .then((products) => {

        allProducts = products;

        displayProducts(products);

    });

}


function displayProducts(products){

    productsContainer.innerHTML = "";

    products.forEach((product) => {

        const card =
        document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `

        <img src="${product.image}">

        <div class="card-content">

            <h2>${product.name}</h2>

            <p>₹${product.price}</p>

            <button onclick='viewProduct(${JSON.stringify(product)})'>
                View Details
            </button>

            <br><br>

            <button onclick='addToCart(${JSON.stringify(product)})'>
                Add To Cart
            </button>

        </div>

        `;

        productsContainer.appendChild(card);

    });

}



// CATEGORY FILTER

function filterProducts(category){

    if(category === "all"){

        displayProducts(allProducts);

    }

    else{

        const filtered =
        allProducts.filter((product) =>

            product.category === category

        );

        displayProducts(filtered);

    }

}



// SEARCH PRODUCTS

function searchProducts(){

    const searchValue =

    document.getElementById("search")
    .value
    .toLowerCase();

    const filtered =
    allProducts.filter((product) =>

        product.name
        .toLowerCase()
        .includes(searchValue)

    );

    displayProducts(filtered);

}



// ADD TO CART

function addToCart(product){

    let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Product Added To Cart");

}



// CART PAGE

const cartProducts =
document.getElementById("cart-products");

if(cartProducts){

    const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach((product, index) => {

        const card =
        document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `

        <img src="${product.image}">

        <div class="card-content">

            <h2>${product.name}</h2>

            <p>₹${product.price}</p>

            <div class="qty-box">

                <button onclick="decreaseQty(${index})">
                    -
                </button>

                <span>
                    ${product.quantity || 1}
                </span>

                <button onclick="increaseQty(${index})">
                    +
                </button>

            </div>

            <br>

            <button
            onclick="removeItem(${index})"
            class="remove-btn">

                Remove

            </button>

        </div>

        `;

        cartProducts.appendChild(card);

    });

}



// REMOVE ITEM

function removeItem(index){

    let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();

}



// INCREASE QUANTITY

function increaseQty(index){

    let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].quantity =
    (cart[index].quantity || 1) + 1;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();

}



// DECREASE QUANTITY

function decreaseQty(index){

    let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

    if((cart[index].quantity || 1) > 1){

        cart[index].quantity--;

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();

}



// PRODUCT DETAILS PAGE

function viewProduct(product){

    localStorage.setItem(
        "selectedProduct",
        JSON.stringify(product)
    );

    window.location.href =
    "product.html";

}


const productDetails =
document.getElementById("product-details");

if(productDetails){

    const product =
    JSON.parse(
        localStorage.getItem("selectedProduct")
    );

    productDetails.innerHTML = `

    <div class="details-card">

        <img src="${product.image}">

        <div>

            <h1>${product.name}</h1>

            <br>

            <h2>₹${product.price}</h2>

            <br>

            <p>
                Premium Quality Product
            </p>

            <br>

            <button
            onclick='addToCart(${JSON.stringify(product)})'>

                Add To Cart

            </button>

        </div>

    </div>

    `;
}



// CHECKOUT PAGE

function goToCheckout(){

    window.location.href =
    "checkout.html";

}



// DARK MODE

function toggleDarkMode(){

    document.body.classList.toggle("dark");

}
function placeOrder(){

    const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach((product) => {

        total +=
        product.price *
        (product.quantity || 1);

    });

    fetch("http://localhost:5000/place-order", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            products: cart,

            total: total

        })

    })

    .then((response) => response.json())

    .then((data) => {

        alert(data.message);

        if(data.success){

            localStorage.removeItem("cart");

            window.location.href =
            "checkout.html";

        }

    });

}