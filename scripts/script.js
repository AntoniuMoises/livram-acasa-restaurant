// Data controler 
let dataController = (function() {

    let storeAllItemCart = [];
    let storeInfoProduct = [];

  return {

    addItemInCart: function(e){

        // variables
           let containerProduct = e.target.parentElement.parentElement;
           let titleEl = containerProduct.querySelector('.title-recipe').textContent;
           let titleItem = titleEl.slice(0,titleEl.length-1);
           let priceEl = containerProduct.querySelector('.price-recipe').textContent;
           let priceItem = priceEl.slice(0,priceEl.length-3);
           let imageItem = containerProduct.querySelector('.img-recipe img').src;
           storeInfoProduct = [{title:titleItem, price:priceItem, quantity:1,img:imageItem}];
           
        //Check if item is already in array
           let result = storeAllItemCart.map(obj => {
            return obj[0].title.includes(storeInfoProduct[0].title);
           });

          // a) if item exist increase quantity with 1
          if(result.indexOf(true) !== -1){
              let updateQuantity = storeAllItemCart[result.indexOf(true)][0].quantity+= 1;
              UIController.increaseQuantity(updateQuantity,titleItem);
              UIController.updateCountCart(storeAllItemCart);
              UIController.calcTotalPriceCart(storeAllItemCart);
              
            // b) if item doesn't exist add item to array
          }else{
            storeAllItemCart.push(storeInfoProduct);
            UIController.showItemsInCart(storeInfoProduct);
            UIController.updateCountCart(storeAllItemCart);
            UIController.calcTotalPriceCart(storeAllItemCart);
          }
 
    },

    remoteItemFromArray:function(e){
        let item = e.target.parentElement;
        let title = item.querySelector('.title-item-cart').textContent;
        // find item in array
        let rule = obj => Object.values(obj[0]).includes(title);
        let indexItem = storeAllItemCart.findIndex(rule);
        let newArr = storeAllItemCart.splice(indexItem,1);

        UIController.calcTotalPriceCart(storeAllItemCart);
        UIController.updateCountCart(storeAllItemCart);
    },
    // II. Order page
    // Save array of items in local storage
    saveData:function(){
        localStorage.setItem('itemsOrder',JSON.stringify(storeAllItemCart));
    }

  };  
}) ();



 // UI controller
let UIController = (function(){

     //Private functions
     let displayElement = function(){
        document.querySelector('.login_box').classList.toggle('hideElement');
     }

    // Display element on click
      // a) Variables
       let itemBox = document.querySelectorAll('.style-box');
       let resultFilter = document.querySelector('.mesaj-filter');
       let eachItem = document.querySelectorAll('.each-box');
       let cartBoxContainer = document.querySelector('.cart-box');
       let cartBoxForItems = document.querySelector('.cart-box-container'); 
       let cartOpenBtn = document.querySelector('.cos');
       let numberItemsCart = document.querySelector('#small-quantity');

    return {

        publicMethod: function(){
            displayElement();
        },

        filterItems: function(id){
            for(let i = 0; i < itemBox.length; i++){
                let titleItem = itemBox[i].querySelector('h4').textContent.toLowerCase();
               if(itemBox[i].classList.contains(id)){
                   itemBox[i].style.display = 'flex';
                   itemBox[i].classList.add('active');
                   resultFilter.textContent = `Există ${itemBox[i].querySelectorAll('.each-box').length} produse din categoria ${titleItem}`;
               }else{
                   itemBox[i].style.display = 'none';
               }
            }
        },

        showAllItem: function(){
            let itemBox = document.querySelectorAll('.style-box');

            for(let i = 0; i < itemBox.length;i++){
                itemBox[i].style.display = 'flex';
                resultFilter.textContent = `Arată toate cele ${eachItem.length} de produse`;
            }
            
        },

        displayCartBox:function(e){
            if(cartBoxContainer.style.display === 'none'){
                cartBoxContainer.style.display ='block';
                
            }else{
                cartBoxContainer.style.display ='none';
            }
        },
        
        updateCountCart:function(storeItems){
            //Display cart btn if there is more than 0 items in the cart and update count of items from cart
            if(storeItems.length > 0){
                cartOpenBtn.style.display = 'inline-block';
                let rule = (a,b) => a + b;
                let count = storeItems.map(item => item[0].quantity).reduce(rule);
                numberItemsCart.textContent= count; 
                 
            }else{
                cartOpenBtn.style.display = 'none';
            }
        },

        showItemsInCart:function(currentItem){
            let newItem = document.createElement('div');
            newItem.innerHTML = `
            <div class="title-item-cart">${currentItem[0].title}</div>
            <div class="quantity-item-cart">${currentItem[0].quantity}</div>
            <div class="price-item-cart">${currentItem[0].price} lei</div>
            <ion-icon name="close-circle-outline" class='cart-box-delete-itm'></ion-icon>`;
            newItem.className = 'each-item-cart';
            cartBoxForItems.appendChild(newItem);    
             
        },

        removeItemFromCart:function(e){
            let item = e.target.parentElement;
            item.remove();
        },

        increaseQuantity:function(amount,title){
            let titles = cartBoxForItems.querySelectorAll('.title-item-cart');
            let quantity = cartBoxForItems.querySelectorAll('.quantity-item-cart');
            
            for(let i = 0; i < titles.length;i++){
                if(title === titles[i].textContent){
                    quantity[i].textContent = amount; 
                }
            }
        },

        calcTotalPriceCart:function(storeItems){
            let totalEl = document.querySelector('.total-price-cart');
            if(storeItems.length >= 1){ 
              let rule = (a,b) => a + b;
              let total = storeItems.map(item => item[0].quantity * item[0].price).reduce(rule);
              totalEl.textContent = `Total: ${total} lei`; 
            }else{
                storeItems = [];
                total = '';
                this.displayCartBox();
            }   
        }

       
    };
        
})();

//  App Controller 
let appController = (function(dataCtrl, UICtrl){

    // Variables: 
    let loginBox = document.querySelector('#login_box');
    let loginBtn = document.querySelector('#login');
    let menuContainer = document.querySelector('.menu-section');
    let cartBoxBtn = document.querySelector('#cos');

   //1) Show/Hide Login Box
   loginBtn.addEventListener('click',function(e){
    UIController.publicMethod();
    e.preventDefault();
   });

   //2) Close login box window when click outside 
   window.addEventListener('click',function(e){
       if(e.target !== loginBtn && e.target.parentNode !== loginBox && e.target !== loginBox){
           loginBox.classList.add('hideElement');   
       }
       if(!e.target.classList.contains('btns-filter') && !e.target.classList.contains('add-btn')){
          UIController.showAllItem();
       }
       
   });

   //3) Filter btns
   document.querySelector('.menu-btns-filter').addEventListener('click',function(e){
      if(e.target.classList.contains('btns-filter')){
        UIController.filterItems(e.target.id);
      }else{
          UIController.showAllItem();
      }
   });

   // 4) Show cart in top nav when there is at least 1 product in it && add item
   menuContainer.addEventListener('click',function(e){
     if(e.target.classList.contains('add-btn')){
        dataController.addItemInCart(e);
     }
       
   });

   // 5) Display cart box
   cartBoxBtn.addEventListener('click',function(e){
       UIController.displayCartBox(e);
   });

   // 6) Remove item from list
   document.querySelector('.cart-box-container').addEventListener('click',function(e){
      if(e.target.classList.contains('cart-box-delete-itm')){
        dataController.remoteItemFromArray(e);
        UIController.removeItemFromCart(e);
      } 
   });

//    II. Order page
   document.querySelector('#cart-btn').addEventListener('click',function(){
    dataController.saveData();

   });
   
      
   UIController.showAllItem();
})(dataController,UIController);












