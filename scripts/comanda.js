

let dataController= (function(){

    return{


    }



})();


let UIController = (function(){
    
    return {
         // II.Order page
         populateOrderPage:function(storedData,table){
            
 
            for(let i = 0; i < storedData.length;i++){
                let item = table.insertRow();
                item.innerHTML = `
                <td><img src="${storedData[i][0].img}" alt="" class='img-item-order'></td>
                    <td class='name-order'>${storedData[i][0].title}</td>
                    <td class='quantity-order'>
                        <ion-icon name="add-circle-outline" class='icon-q plus-q'></ion-icon>
                        <input class='quantity-real' value='${storedData[i][0].quantity}'>
                        <ion-icon name="remove-circle-outline" class='icon-q minus-q'></ion-icon>
                        
                    </td>
                    <td class='price-order'>${storedData[i][0].price} lei
                    <span><ion-icon name="close-circle-outline" class='order-close'></ion-icon></span>
                    </td>
                    `
                    
                item.className = 'each-item-order font-text';   
            }     

        },

        calcTotalPriceCart:function(storedData){
            let totalEl = document.querySelector('.total-order-price');
            if(storedData.length >= 1){ 
              let rule = (a,b) => a + b;
              let total = storedData.map(item => item[0].quantity * item[0].price).reduce(rule);
              totalEl.textContent = `Total:  ${total} lei`; 
            }  
        },

        plusQuantity:function(storedData,quantity,title){
           for(let i = 0; i < storedData.length; i++){
               if(storedData[i][0].title === title){
                   storedData[i][0].quantity += 1;
                   quantity.value= storedData[i][0].quantity;
               }
           }
        },

        minusQuantity:function(storedData,quantity,title){
            for(let i = 0; i < storedData.length; i++){
                if(storedData[i][0].quantity > 0 &&  storedData[i][0].title === title ){
                    storedData[i][0].quantity --;
                    quantity.value= storedData[i][0].quantity;
                }else if(storedData[i][0].quantity === 0){
                    UIController.removeItem(storedData,title);
                }
            }
         },

         removeItem:function(){
                   console.log(e.target);
            
            
         }




    }

})();


let appController = (function(){
    const itemsOrder = JSON.parse(localStorage.getItem('itemsOrder'));
    const table = document.querySelector('.table-content tbody');
    
    // Add quantity at when + sign is clicked
    table.addEventListener('click',function(e){

                // Increase quantity item when plus is clicked
            if(e.target.classList.contains('plus-q') && itemsOrder.length > 0){
               let itemRow = e.target.parentNode.parentNode;
               let quantity = itemRow.querySelector('.quantity-real');
               let title = itemRow.querySelector('.name-order').textContent;
               UIController.plusQuantity(itemsOrder,quantity,title);
                // Decrease quantity item when minus is clicked
            } else if(e.target.classList.contains('minus-q') && itemsOrder.length > 0){
               let itemRow = e.target.parentNode.parentNode;
               let quantity = itemRow.querySelector('.quantity-real');
               let title = itemRow.querySelector('.name-order').textContent;
               UIController.minusQuantity(itemsOrder,quantity,title);

                // Remove item when is delete clicked
            } else if(e.target.classList.contains('order-close')){
                
            }

            UIController.calcTotalPriceCart(itemsOrder);   
    });

    

     
    
    
    
    UIController.populateOrderPage(itemsOrder,table);
    UIController.calcTotalPriceCart(itemsOrder);
})();