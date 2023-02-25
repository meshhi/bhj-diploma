/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    const callback = () => {
      App.setState( 'user-logged' );
      App.getModal('register').close();
      App.getForm('register').clearForm();
    };
    User.register(data, callback);
  }
}