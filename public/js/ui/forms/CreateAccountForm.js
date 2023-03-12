/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    const callback = (err, response) => {
      if (!err) {
        App.getModal('createAccount').close();
        App.getForm('createAccount').clearForm();
        App.update();
      }
    };


    Account.create(data, callback);
  }
}