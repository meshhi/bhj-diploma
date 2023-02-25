/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const body = document.querySelector('body');

    const handleSidebarToggle = function() {
      body.classList.toggle('sidebar-open');
      body.classList.toggle('sidebar-collapse');
    }

    toggleBtn.addEventListener('click', handleSidebarToggle);
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const loginBtn = document.querySelector('.menu-item_login');
    const registerBtn = document.querySelector('.menu-item_register');
    const logoutBtn = document.querySelector('.menu-item_logout');

    loginBtn.addEventListener('click', function() {
      const loginModal = App.getModal('login');
      loginModal.open();
    })

    registerBtn.addEventListener('click', function() {
      const registerModal = App.getModal('register');
      registerModal.open();
    })

    logoutBtn.addEventListener('click', function() {
      const callback = function() {
        App.setState( 'init' );
      };

      User.logout(callback);
    })
   
    
    // App.setState( 'init' )
  }
}