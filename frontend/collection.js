var search = document.getElementById("search");

search.addEventListener("keyup", function (event) {
    var enteredValue = event.target.value.toUpperCase();

    var productlist = document.querySelectorAll(".product-card");

    productlist.forEach(card => {
        var productname = card.querySelector("h3").textContent.toUpperCase();

        if (productname.indexOf(enteredValue) < 0) {
            card.style.display = "none";
        } else {
            card.style.display = "block";
        }
    });
});
