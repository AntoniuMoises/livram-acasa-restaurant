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
                        <input type='tel' class='quantity-real'  value='${storedData[i][0].quantity}' readonly>
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
              totalEl.textContent = `Total: ${total} lei`; 
            }if(storedData.length === 0){
                totalEl.textContent = `Coșul este gol`; 
            }
        },

        plusQuantity:function(storedData,quantity,title){
           for(let i = 0; i < storedData.length; i++){
               if(storedData[i][0].title === title.textContent){
                   storedData[i][0].quantity += 1;
                   quantity.value= storedData[i][0].quantity;
               }
           }
        },

        removeItem:function(storedData,title){
            // Remove from array
            let rule = obj => Object.values(obj[0]).includes(title.textContent);
            let indexItem = storedData.findIndex(rule);
            let newArr = storedData.splice(indexItem,1);
            // Remove from DOM
            title.parentElement.remove();
            
         },

        minusQuantity:function(storedData,quantity,title){
            for(let i = 0; i < storedData.length; i++){
                if(storedData[i][0].quantity > 1 &&  storedData[i][0].title === title.textContent ){
                    storedData[i][0].quantity --;
                    quantity.value= storedData[i][0].quantity;
                }else if(storedData[i][0].title === title.textContent) {
                    UIController.removeItem(storedData,title);
                    console.log('remove item');
                }
            }
         },

         checkRequired:function(inputArr){
            inputArr.forEach(input =>{
                if(input.value.trim() === ''){
                    UIController.showError(input,`${input.placeholder} obligatoriu`);
                }else{
                    UIController.showSuccess(input);
                }
            });
         },

         showError: function(input,message){
             const formRow = input.parentElement;
             formRow.className = 'control-field error';
             const small = formRow.querySelector('small');
             small.textContent = message;
         },

         showSuccess:function(input){
            const formRow = input.parentElement;
            formRow.className = 'control-field success';
         },
 
         checkEmail:function(input){
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(re.test(input.value)){
                this.showSuccess(input);
            }else{
                this.showError(input,'Introdu un email valid');
            }
         },

         checkLength:function(input,min,max){
             if(input.value.length < min){
                this.showError(input,`Minim ${min} litere`);
             }else if(input.value.length > max){
                this.showError(input,`Maxim ${max} litere`);
             }
         },

         checkBox:function(input){
             if(city.checked){
                 this.showSuccess(input);
             }else{
                 this.showError(input,'Livrare doar în Cluj-Napoca');
             }
         },

         checkPassword:function(input1,input2){
             if (input1.value !== input2.value){
                 this.showError(input2,'Parolele trebuie sa fie la fel');
             }
         },

         takeInfoAccount:function(dataUser,username,pass1,pass2,email){
            dataUser.push({user:username.value,password:pass1.value,password2:pass2.value,email:email.value})
        },

        hideRegisterForm:function(msg,form){
            form.classList.remove('hide');
            msg.classList.add('hide');
            setTimeout(function () {
                msg.classList.remove('hide');
            }, 3000);
        },

        uncheckBox:function(box){
            box.checked = false;
        },

        toggleModal:function(modal){
            modal.classList.toggle('show-modal');     
        },

        windowClose:function(modal){
            modal.classList.toggle('show-modal');
            window.location.href = "index.html";
        },

        closeOnTime:function(time,box,change){
            setTimeout(function () {
                box.classList.remove(`${change}`);
                window.location.href = "index.html";
            }, time);
        },

        countDown:function(msg,time){  
            function MyTimer(callback, val) {
                val = val || 10; 
                var timer=setInterval(function() { 
                    callback(val);
                    if(val-- <= 0) { 
                        clearInterval(timer); 
                    }
                }, 950);
            }
            new MyTimer(function(val) {
                msg.textContent = `Pagina se va inchide automat în ${val} secunde`;
            });         
        },
        displayAddress:function(input,address){
            address.style.display = 'block';
            address.textContent = `Cluj-Napoca, ${input}`;
        }
    }

})();


let appController = (function(){
    ///////// I. Variables for each event handler
    const itemsOrder = JSON.parse(localStorage.getItem('itemsOrder'));
    const table = document.querySelector('.table-content tbody');

    // Delivery variables
    const delName = document.querySelector('#name');
    const delFirstName = document.querySelector('#first-name');
    const delAddress = document.querySelector('#address');
    const delPhone = document.querySelector('#phone');
    const city = document.querySelector('#city');
    const orderBtn = document.querySelector('#order-btn');
    
    // Account info
    const checkForAccount = document.querySelector('#show-register-box');
    const createAccountForm = document.querySelector('.register-info-box');
    const registerBtn = document.querySelector('#register-acc-btn');
    const username = document.querySelector('#username');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const password2 = document.querySelector('#password2');
    const thankMsg = document.querySelector('.thanks-msg');
    const dataUser =[];

    // Modal variables
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.close-modal');
    const classModal = 'show-modal';
    const countDown = document.querySelector('.close-msg');
    const addressDOM = document.querySelector('.deliveryAddress');


    ////////////// II: Event listeners
    
    // Add quantity at when + sign is clicked
    table.addEventListener('click',function(e){
                // Increase quantity item when plus is clicked
            if(e.target.classList.contains('plus-q') && itemsOrder.length > 0){
               let itemRow = e.target.parentNode.parentNode;
               let quantity = itemRow.querySelector('.quantity-real');
               let title = itemRow.querySelector('.name-order');
               UIController.plusQuantity(itemsOrder,quantity,title);

                // Decrease quantity item when minus is clicked
            } else if(e.target.classList.contains('minus-q') && itemsOrder.length > 0){
               let itemRow = e.target.parentNode.parentNode;
               let quantity = itemRow.querySelector('.quantity-real');
               let title = itemRow.querySelector('.name-order');
               UIController.minusQuantity(itemsOrder,quantity,title);

                // Remove item when delete is clicked
            } else if(e.target.classList.contains('order-close')){
                let row = e.target.parentNode.parentNode.parentNode;
                let title = row.querySelector('.name-order');
                UIController.removeItem(itemsOrder,title);
            }
            UIController.calcTotalPriceCart(itemsOrder);   
    });

    // Delivery form event &&  Modal control
    orderBtn.addEventListener('click',function(){
        UIController.checkRequired([delName,delFirstName,delPhone,delAddress]);
        UIController.checkLength(delName,3,20);
        UIController.checkLength(delFirstName,3,20);
        UIController.checkLength(delAddress,10,30);
        UIController.checkBox(city);
        let test = [delName,delFirstName,delPhone,delAddress].every(input => input.parentElement.classList.contains('success'));
        // Modal control: show modal when validations is ok
        if(test){
            // Show modal
            UIController.toggleModal(modal);
            // Close in 10 secs modal
            UIController.closeOnTime(10000,modal,classModal);
            // Show the countdown 
            UIController.countDown(countDown,10);
             // Display user adress on modal
             UIController.displayAddress(delAddress.value,addressDOM);
            
            
        }     
    });

    // Display register account form
    checkForAccount.addEventListener('click',function(){
        createAccountForm.classList.toggle('hide');  
    });

    // Register account
    registerBtn.addEventListener('click',function(e){
        e.preventDefault();
        UIController.checkRequired([username,email,password,password2]);
        UIController.checkLength(username,3,20);
        UIController.checkLength(password,8,20);
        UIController.checkLength(password2,8,20);
        UIController.checkEmail(email);
        UIController.checkPassword(password,password2);

        // Show complete message when validations is ok
        let test = [username,password,password2,email].every(input => input.parentElement.classList.contains('success'));
        if(test){
            UIController.takeInfoAccount(dataUser,username,password,password2,email);
            UIController.hideRegisterForm(thankMsg,createAccountForm);
            UIController.uncheckBox(checkForAccount);      
        }else{
            console.log('not working')
        } 
    });

    // Close modal when click outside and close btn
    window.addEventListener('click',function(e){
        if(e.target === modal){
            UIController.windowClose(modal);
        }
    });
    closeModal.addEventListener('click',function(){
        UIController.toggleModal(modal);
        window.location.href = "index.html";
    });

    UIController.populateOrderPage(itemsOrder,table);
    UIController.calcTotalPriceCart(itemsOrder);
})();