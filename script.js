document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image');
    const upArrow = document.querySelector('.up');
    const downArrow = document.querySelector('.down');
    const unitButtons = document.querySelectorAll('.unit-button');
    const priceElement = document.querySelector('.price');
    const quantityInputSquare = document.querySelector('.quantity-input.square');
    const quantityInputPack = document.querySelector('.quantity-input.pack');
    const totalPriceElement = document.querySelector('.total-price'); 
    const oldPriceElement = document.querySelector('.old-price'); 
    const discountBadge = document.querySelector('.discount-badge'); 
    let activeThumbnailIndex = 0;
    let squarePerPack = 2.16;
    let pricePerSquareMeter = 1200; 
    let pricePerPack = 2700; 
    let unit = 'm2'; 
    let discount = 0.04;

    // активная пикча
    function setActiveThumbnail(index) {
        thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
        thumbnails[index].classList.add('active');
        mainImage.src = thumbnails[index].src;
        activeThumbnailIndex = index;
    }

    // стрелки
    upArrow.addEventListener('click', () => {
        if (activeThumbnailIndex > 0) {
            setActiveThumbnail(activeThumbnailIndex - 1);
        }
    });

    downArrow.addEventListener('click', () => {
        if (activeThumbnailIndex < thumbnails.length - 1) {
            setActiveThumbnail(activeThumbnailIndex + 1);
        }
    });

    // клики
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => setActiveThumbnail(index));
    });

    // вся стоимость расчет
    function calculateTotalPrice() {
        let quantitySquare = parseFloat(quantityInputSquare.value);
        let quantityPack = parseInt(quantityInputPack.value);
        let total = 0;
        let basePrice = 0;
        if (unit === 'm2') {
            basePrice = pricePerSquareMeter;
            total = quantitySquare * basePrice;
        } else {
            basePrice = pricePerPack;
            total = quantityPack * basePrice;
        }

        // вся стоимость скидка
        let discountedPrice = total * (1 - discount);
        totalPriceElement.textContent = `${discountedPrice.toFixed(2)} ₽`;

        // вся стоимость без скидки
        const discountBlockOldPriceElement = document.querySelector('.discount-block .old-price');
        discountBlockOldPriceElement.textContent = `${total.toFixed(2)} ₽`;
    }

    unitButtons.forEach(button => {
        button.addEventListener('click', function() {
            unitButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            unit = this.dataset.unit;
            priceElement.textContent = unit === 'm2' ? `${pricePerSquareMeter} ₽/м²` : `${pricePerPack} ₽/уп`;
            calculateTotalPrice();
        });
    });

    function updateQuantity(type, operation) {
        let quantitySquare = parseFloat(quantityInputSquare.value);
        let quantityPack = parseInt(quantityInputPack.value.replace(' уп', ''));
        
        if (type === 'square') {
            if (operation === 'plus') {
                quantitySquare += squarePerPack;
            } else if (operation === 'minus' && quantitySquare > squarePerPack) {
                quantitySquare -= squarePerPack;
            }
            quantityInputSquare.value = quantitySquare.toFixed(2) + ' м²';
            quantityPack = Math.ceil(quantitySquare / squarePerPack);
        } else if (type === 'pack') {
            if (operation === 'plus') {
                quantityPack += 1;
            } else if (operation === 'minus' && quantityPack > 1) {
                quantityPack -= 1;
            }
            quantitySquare = quantityPack * squarePerPack;
            quantityInputSquare.value = quantitySquare.toFixed(2) + ' м²';
        }
    
        quantityInputPack.value = quantityPack + ' уп';
        calculateTotalPrice();
    }

    unitButtons.forEach(button => {
        button.addEventListener('click', function() {
            unitButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            unit = this.dataset.unit;
    
            priceElement.textContent = unit === 'm2' ? `${pricePerSquareMeter} ₽/м²` : `${pricePerPack} ₽/уп`;
    
            const totalTextElement = document.querySelector('.total-text-2');
            totalTextElement.textContent = unit === 'm2' ? 'Цена ₽/ м²' : 'Цена ₽/ уп.';
    
            calculateTotalPrice();
        });
    });

    document.querySelector('.quantity-minus.square').addEventListener('click', () => updateQuantity('square', 'minus'));
    document.querySelector('.quantity-plus.square').addEventListener('click', () => updateQuantity('square', 'plus'));

    document.querySelector('.quantity-minus.pack').addEventListener('click', () => updateQuantity('pack', 'minus'));
    document.querySelector('.quantity-plus.pack').addEventListener('click', () => updateQuantity('pack', 'plus'));

    calculateTotalPrice();

    calculateTotalPrice(); 
});
