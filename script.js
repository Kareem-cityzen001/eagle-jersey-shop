// script.js

let totalCost = 0;

function addToCart(price) {
    totalCost += price;
    document.getElementById("total").innerText = totalCost;
}