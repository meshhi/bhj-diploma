/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element) {
      throw new Error('Empty element');
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    document.querySelectorAll('.remove-account').forEach(el => el.addEventListener('click', () => {
      this.removeAccount(el.dataset.id);
    }));

    document.querySelectorAll('.transaction__remove').forEach(el => el.addEventListener('click', () => {
      this.removeTransaction(el.dataset.id);
    }));
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount(id) {
    if(this.lastOptions) {
      if (confirm('Вы действительно хотите удалить счет?')) {
        const callback = (err, response) => {
          if (!err) {
            App.updateWidgets();
            App.updateForms();
          }
        }

        Account.remove(id, callback)
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      const callback = (err, response) => {
        if (!err) {
          App.update();
        }
      };

      Transaction.remove(id, callback);
    }

  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(options) {
      this.lastOptions = options;

      const accountCallback = (err, response) => {
        if (!err) {
          this.renderTitle(response.data.name);
        }
      }

      const transactionCallback = (err, response) => {
        if (!err) {
          this.renderTransactions(response.data);
          this.registerEvents();
        }
      }

      Account.get(options.account_id, accountCallback);
      Transaction.list({account_id: options.account_id}, transactionCallback);
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions();
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector('.content-title').innerHTML = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    class DateConverter{
      constructor(date) {
        this.date = new Date(date);
        this.monthDict = {
          '1': 'января',
          '2': 'февраля',
          '3': 'марта',
          '4': 'апреля',
          '5': 'мая',
          '6': 'июня',
          '7': 'июля',
          '8': 'августа',
          '9': 'сентября',
          '10': 'октября',
          '11': 'ноября',
          '12': 'декабря',
        }
      }
    
      dateToStr() {     
        const dayNumber = this.date.getUTCDate();
        const monthNumber = this.date.getUTCMonth() + 1;
        const yearNumber = this.date.getUTCFullYear();
        const hours = this.date.getHours();
        const minutes = this.date.getMinutes();
      
        return `${dayNumber} ${this.monthDict[monthNumber]} ${yearNumber} в ${hours}:${minutes}`
      }
    }

    const dateInstance = new DateConverter(date);
    return dateInstance.dateToStr();
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `
      <!-- либо transaction_expense, либо transaction_income -->
      <div class="transaction transaction_${item.type} row">
          <div class="col-md-7 transaction__details">
            <div class="transaction__icon">
                <span class="fa fa-money fa-2x"></span>
            </div>
            <div class="transaction__info">
                <h4 class="transaction__title">${item.name}</h4>
                <!-- дата -->
                <div class="transaction__date">${this.formatDate(item.created_at)}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="transaction__summ">
            <!--  сумма -->
                ${item.sum} <span class="currency">₽</span>
            </div>
          </div>
          <div class="col-md-2 transaction__controls">
              <!-- в data-id нужно поместить id -->
              <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                  <i class="fa fa-trash"></i>  
              </button>
          </div>
      </div>
    `
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    if (data.length) {
      for (let item of data) {
        document.querySelector('.content').innerHTML += this.getTransactionHTML(item);
      }
    }
  }
}