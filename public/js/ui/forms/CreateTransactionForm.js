/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.accountsSelect = document.querySelectorAll('.accounts-select');
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const callback = (err, response) => {
      if (!err) {
        for (let item of this.accountsSelect) {
          item.innerHTML = '';
          for (let i = 0; i < response.data.length; i++) {
            item.innerHTML += `<option value="${response.data[i].id}">${response.data[i].name}</option>`
          }
        }
      }
    };

    Account.list(null, callback)

    // this.accountsSelectList;
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    const callback = (err, response) => {
      if (!err) {
        App.getModal('newIncome').close();
        App.getForm('createIncome').clearForm();
        App.getModal('newExpense').close();
        App.getForm('createExpense').clearForm();
        App.update();
      }
    };

    // const formData = new FormData(data);

    Transaction.create(data, callback);
  }
}