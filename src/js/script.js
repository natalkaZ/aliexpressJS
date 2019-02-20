window.addEventListener('DOMContentLoaded', () => {

    const loadContent = async (url, callback) => {
        await fetch(url)
        .then(response => response.json())
        .then(json => createElement(json.goods));
    
        callback();
    };
    
    function createElement(arr){
        const goodsWrapper = document.querySelector('.goods__wrapper');
    
        arr.forEach(function(item){
            let card = document.createElement('div');
            card.classList.add('goods__item');
            card.innerHTML = `
                <img class="goods__img" src="${item.url}" alt="phone">
                <div class="goods__colors">Доступно цветов: 4</div>
                <div class="goods__title">
                   ${item.title}
                </div>
                <div class="goods__price">
                    <span>${item.price}</span> руб/шт
                </div>
                <button class="goods__btn">Добавить в корзину</button>
            `;
            goodsWrapper.appendChild(card);
        });
    }
    
    loadContent('js/db.json', () => {
        const cartWrapper = document.querySelector('.cart__wrapper'),
            cart = document.querySelector('.cart'),
            close = document.querySelector('.cart__close'),
            open = document.querySelector('#cart'),
            goodsBtn = document.querySelectorAll('.goods__btn'),
            products = document.querySelectorAll('.goods__item'),
            confirm = document.querySelector('.confirm'),
            badge = document.querySelector('.nav__badge'),
            totalCost = document.querySelector('.cart__total > span'),
            titles = document.querySelectorAll('.goods__title');
    
        function openCart() {
            cart.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    
        function closeCart() {
            cart.style.display = 'none';
            document.body.style.overflow = '';
        }
    
        open.addEventListener('click', openCart);
        close.addEventListener('click', closeCart);
    
        goodsBtn.forEach(function (btn, i) {
            btn.addEventListener('click', () => {
                let item = products[i].cloneNode(true),
                    trigger = item.querySelector('button'),
                    removeBtn = document.createElement('div'),
                    empty = cartWrapper.querySelector('.empty');
    
                trigger.remove();
    
                showConfirn();
                calcGoods(1);
    
                removeBtn.classList.add('goods__item-remove');
                removeBtn.innerHTML = '&times';
                item.appendChild(removeBtn);
    
                if (empty) {
                    empty.remove();
                }
    
                cartWrapper.appendChild(item);
    
                calcTotal();
                removeFromCart();
    
            });
        });
    
        function sliceTitle(){
            titles.forEach(function(item) {
                if(item.textContent.length < 70){
                    return;
                } else {
                    const str = item.textContent.slice(0, 71) + '...';
                    item.textContent = str;
                }
            });
        }
    
        sliceTitle();    
    
        function showConfirn(){
            confirm.style.display = 'block';
            let counter = 100;
            const id = setInterval(frame, 10);
    
            const cartCoords = open.getBoundingClientRect();
            const confirmCoords = confirm.getBoundingClientRect();
    
            let translateY = cartCoords.top;
            let translateX = cartCoords.left;
    
            let confirmTop = confirmCoords.top;
            let confirmLeft = confirmCoords.left;
    
            function frame(){
                if(counter == 10) {
                    clearInterval(id);
                    confirm.style.display = 'none';
                    confirm.style.top = confirmTop + 'px';
                    confirm.style.left = confirmLeft + 'px'; 
                    confirm.style.transform = 'scale(1)';  
                    confirm.style.opacity = '1';      
    
                } else {
                    counter --;
                    // confirm.style.transform = `translateY(-${counter}px)`;
                    confirm.style.opacity = '.' + counter;
    
                    confirm.style.top = translateY - 38 + 'px';
                    confirm.style.left = translateX - 20 + 'px';
                    confirm.style.transform = 'scale(.3)';
                    confirm.style.transition = 'all 1s';                
                }
            }
        }
    
        function calcGoods(i){
            const items = cartWrapper.querySelectorAll('.goods__item');
            badge.textContent = i + items.length;
        }
    
        function calcTotal(){
            const prices = document.querySelectorAll('.cart__wrapper > .goods__item > .goods__price > span');
            let total = 0;
    
            prices.forEach(function(item){
                total += +item.textContent;
            });
    
            totalCost.textContent = total;
    
            empty = document.createElement('div');
            empty.innerHTML = 'Ваша корзина пока пуста';
            empty.classList.add('empty');
    
            if(total == 0) {
                cartWrapper.appendChild(empty);
            } else {
                empty.remove();
            }
    
        }
    
        function removeFromCart(){
            const removeBtn = cartWrapper.querySelectorAll('.goods__item-remove');
    
            removeBtn.forEach(function(btn){
                btn.addEventListener('click', () => {
                    btn.parentElement.remove();
                    calcGoods(0);
                    calcTotal();
                });
            });
        }
    });
});