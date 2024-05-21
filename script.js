document.addEventListener('DOMContentLoaded', () => {
    const productCard = document.querySelector('.product-card');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image');
    const upArrow = document.querySelector('.up');
    const downArrow = document.querySelector('.down');
    const unitButtons = document.querySelectorAll('.unit-button');
    const priceElement = document.querySelector('.price');
    const quantityInputSquare = document.querySelector('.quantity-input.square');
    const quantityInputPack = document.querySelector('.quantity-input.pack');
    const totalPriceElement = document.querySelector('.total-price'); 
    const discountBadge = document.querySelector('.discount-badge'); 
    
    let activeThumbnailIndex = 0;
    const squarePerPack = parseFloat(productCard.dataset.squarePerPack);
    const pricePerSquareMeter = parseFloat(productCard.dataset.pricePerSquareMeter);
    const pricePerPack = parseFloat(productCard.dataset.pricePerPack);
    const discount = parseFloat(productCard.dataset.discount);
    let unit = 'm2';

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
        let total = quantitySquare * pricePerSquareMeter;
        let discountedPrice = total * (1 - discount);
        totalPriceElement.textContent = `${Math.round(discountedPrice)} ₽`;

        // вся стоимость без скидки
        const discountBlockOldPriceElement = document.querySelector('.discount-block .old-price');
        discountBlockOldPriceElement.textContent = `${Math.round(total)} ₽`;
    }

    unitButtons.forEach(button => {
        button.addEventListener('click', function() {
            unitButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            unit = this.dataset.unit;
            priceElement.textContent = unit === 'm2' ? `${pricePerSquareMeter} ₽` : `${pricePerPack} ₽`;

            const totalTextElement = document.querySelector('.total-text-2');
            totalTextElement.textContent = unit === 'm2' ? 'Цена ₽/ м²' : 'Цена ₽/ уп.';
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

    document.querySelector('.quantity-minus.square').addEventListener('click', () => updateQuantity('square', 'minus'));
    document.querySelector('.quantity-plus.square').addEventListener('click', () => updateQuantity('square', 'plus'));

    document.querySelector('.quantity-minus.pack').addEventListener('click', () => updateQuantity('pack', 'minus'));
    document.querySelector('.quantity-plus.pack').addEventListener('click', () => updateQuantity('pack', 'plus'));

    calculateTotalPrice();
});
