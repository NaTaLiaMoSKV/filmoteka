const modal = document.querySelector('[data-modal]');
const modalOpenList = document.querySelectorAll('[data-modal-open-btn]');
const modalClose = document.querySelector('[data-modal-close]');
modalOpenList.forEach(item => {
    item.addEventListener('click', toggleModal);
});

modalClose.addEventListener('click', toggleModal);

function toggleModal() {
    modal.classList.toggle('is-hidden');
}