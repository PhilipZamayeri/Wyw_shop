let cart = JSON.parse(localStorage.getItem("cart"))
if (cart == null) {
    cart = new Array() 
}
console.log(typeof(cart))
  

function getProductToIndex(){
    fetch('https://webacademy.se/fakestore/')
    .then(response => response.json())
    .then(data => createTable(data))
    .catch(err => console.error(err));
  
  const createTable = (data) =>{  
        data.forEach(element => {
          var row = `
          <div id="products" class="card border-secondary  mb-3 col-md-6 col-sd-1">
            <div id="title" class="card-header">${element.title}</div>
                <div class="card-body">
                    <img id="pic" style="max-width: 10rem" class="img-thumbnail" src="${element.image}" alt="En sköning till bild">
                    <p class="card-text">${element.description}</p><br>
                    <div id="btn">
                        <p>Pris: ${(element.price*10).toFixed(2)} SEK
                        <button id="buy" class="btn btn-secondary" onclick="addToCart(${element.id})">Add to cart</button></p></div>
                    </div>
                </div
        </div>`
          $("#table").append(row)
        });
      }
}

function productsToCart(){
    const products = $("#cartProducts")
    fetch('https://webacademy.se/fakestore/')
    .then(response => response.json())
    .then(data => createTable(data))
    .catch(err => console.error(err));

    const createTable = (data) =>{
        let sum = 0;
        data.forEach(element =>{
            cart.forEach(ele =>{
                if (element.id == ele.id){
                    var row = `
                    <tr class="cartProduct table-active">
                        <td>${element.title}</td>
                        <td><input id="${ele.id}" class="amount" type="number" value="${ele.amount}"></td>
                        <td id="price"><span>${(element.price * 10).toFixed(2)}</span> SEK</td>
                        <td><button id="${ele.id}" type="button" class="xBtn btn btn-secondary">Remove</button></td>
                    </tr>`
                        products.append(row)
                        sum += (element.price * ele.amount)
                        console.log(sum)
                }
            })
        })
        $(".xBtn").click(removeProduct)
        $(".amount").keyup(updateCartAfterBtn)

        var row = `
        <tr class="table-active">
            <td>Total price: </td>
            <td></td>
            <td><span id="total">${(sum * 10).toFixed(2)}</span> SEK</td>
            <td></td>
        </tr>`
        products.append(row)
        form()
    }
}

function updateCartAfterBtn(){
    let amount = this.value
    if (amount != "") {
        updateCartTotal(this, amount)
    }
}

function updateCartTotal(element, amount){
    
    let price = Number($(element).parent().parent().children("#price").children("span").text())
    console.log(price)
        
   let total = Number($("#total").text());
   console.log(total)
   let dif = 0;
   let startAmount = cart.find(item => item.id == element.id).amount
   
    if (startAmount > amount) {
        dif = startAmount - amount
        total -= price * dif
    }
    else{
        dif = amount - startAmount
        total += price * dif
    }
    console.log(total)
    cart.find(item => item.id == element.id).amount = amount
    $("#total").text(total.toFixed(2))
    saveCart()
}

function removeProductFromCartArray(id){
    for (let i = 0; i < cart.length; i++) {
        if (id == cart[i].id) {
        cart.splice(i,1)
        }
}
saveCart()
}

function removeProduct(){
    updateCartTotal(this, 0)
    $(this).parent().parent().remove();
    removeProductFromCartArray(this.id);
};

function getProduct(id){
    var returnElement
    cart.forEach(element => {
        if (element.id == id) {
            returnElement = element
        }
    });
    return returnElement
}

function addToCart(id){
    var product = getProduct(id)
    if (product == undefined) {
        cart.push({"id":id, "amount":1})
    }
    else
    product.amount += 1
    
    console.log(cart)
    saveCart();
}

function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart))
}

function openCart(){
    cart = JSON.parse(localStorage.getItem("cart"))
}

function clearCart(){
    cart = new Array()
    saveCart()
    removeOrder()
}

function form(){
        $("#orderBtn").click(function(){
            let name = $("#name")
            let adress = $("#adress")
            let mail = $("#mail")
            let number = $("#number")

            if (name.val() == "" || adress.val() == ""  || mail.val() == ""  || number.val() == "" ) {
                alert("Fill in every field correct.")
            }
            else{
                alert("Thank you for your order!")
                clearForm(name, adress, mail, number)
            }
           
        
        })
}

function clearForm(name, adress, mail, number){
    name.val("")
    adress.val("")
    mail.val("")
    number.val("")
    clearCart()
}

function removeOrder(){
$(".cartProduct").empty()
$("#total").text(0.00.toFixed(2))
}