document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image');
    const upArrow = document.querySelector('.up');
    const downArrow = document.querySelector('.down');
    const unitButtons = document.querySelectorAll('.unit-button');
    const priceElement = document.querySelector('.price'); // Элемент для цены за единицу
    const quantityInputSquare = document.querySelector('.quantity-input.square');
    const quantityInputPack = document.querySelector('.quantity-input.pack');
    const totalPriceElement = document.querySelector('.total-price'); // Элемент для отображения общей стоимости
    const oldPriceElement = document.querySelector('.old-price'); // Элемент для отображения старой цены до скидки
    const discountBadge = document.querySelector('.discount-badge'); // Элемент для отображения скидки
    let activeThumbnailIndex = 0;
    let squarePerPack = 2.16; // Количество м² в одной упаковке
    let pricePerSquareMeter = 1200; // Цена за м²
    let pricePerPack = 2700; // Цена за упаковку
    let unit = 'm2'; // Текущая выбранная единица измерения
    let discount = 0.04; // Скидка 4%

    // Обновляем активное изображение
    function setActiveThumbnail(index) {
        thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
        thumbnails[index].classList.add('active');
        mainImage.src = thumbnails[index].src;
        activeThumbnailIndex = index;
    }

    // Стрелки переключения изображений
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

    // Обработчик кликов по миниатюрам
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => setActiveThumbnail(index));
    });

    // Функция для расчета и отображения общей стоимости
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

        // Общая стоимость со скидкой
        let discountedPrice = total * (1 - discount);
        totalPriceElement.textContent = `${discountedPrice.toFixed(2)} ₽`;

        // Общая стоимость без скидки, обновляем элемент внутри блока `discount-block`
        const discountBlockOldPriceElement = document.querySelector('.discount-block .old-price');
        discountBlockOldPriceElement.textContent = `${total.toFixed(2)} ₽`;
    }

    // Обработчики для единиц измерения
    unitButtons.forEach(button => {
        button.addEventListener('click', function() {
            unitButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            unit = this.dataset.unit;
            priceElement.textContent = unit === 'm2' ? `${pricePerSquareMeter} ₽/м²` : `${pricePerPack} ₽/уп`;
            calculateTotalPrice();
        });
    });

    // Обработчики для изменения количества м² и упаковок
    function updateQuantity(type, operation) {
        let quantitySquare = parseFloat(quantityInputSquare.value);
        let quantityPack = parseInt(quantityInputPack.value);

        if (type === 'square') {
            if (operation === 'plus') {
                quantitySquare += squarePerPack;
            } else if (operation === 'minus' && quantitySquare > squarePerPack) {
                quantitySquare -= squarePerPack;
            }
            quantityInputSquare.value = quantitySquare.toFixed(2);
            quantityPack = Math.ceil(quantitySquare / squarePerPack);
        } else if (type === 'pack') {
            if (operation === 'plus') {
                quantityPack += 1;
            } else if (operation === 'minus' && quantityPack > 1) {
                quantityPack -= 1;
            }
            quantitySquare = quantityPack * squarePerPack;
            quantityInputSquare.value = quantitySquare.toFixed(2);
        }

        quantityInputPack.value = quantityPack.toString();
        calculateTotalPrice();
    }

    // Кнопки управления количеством м²
    document.querySelector('.quantity-minus.square').addEventListener('click', () => updateQuantity('square', 'minus'));
    document.querySelector('.quantity-plus.square').addEventListener('click', () => updateQuantity('square', 'plus'));

    // Кнопки управления количеством упаковок
    document.querySelector('.quantity-minus.pack').addEventListener('click', () => updateQuantity('pack', 'minus'));
    document.querySelector('.quantity-plus.pack').addEventListener('click', () => updateQuantity('pack', 'plus'));

    // Вызываем функцию calculateTotalPrice при инициализации для установления начальных значений
    calculateTotalPrice();

    // Инициализация при загрузке
    calculateTotalPrice(); // Инициализация общей цены при загрузке
});
