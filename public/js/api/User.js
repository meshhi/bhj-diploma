/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  // static URL = Entity.URL + '/user';
  static URL = '/user';
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
    
    document.cookie = `id=${user.id}`;
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    const user = localStorage.getItem('user');
  
    try {
      return JSON.parse(user);
    } catch {
      return undefined;
    }
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    const callbackInner = (err, response) => {
      if (response && response.success) {
        this.setCurrent(response.user);
      } else if (response && !response.success) {
        this.unsetCurrent();
      } else {
        console.log('Error: ' + err);
      }
      callback(err, response);
    };

    createRequest({
      url: this.URL + '/current',
      method: 'GET',
      callback: callbackInner,
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    const callbackInner = (err, response) => {
      if (response && response.success) {
        this.setCurrent(response.user);
        callback(err, response);
      } else {
        console.log(err);
      }
    };

    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      data,
      callback: callbackInner,
    })
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    const callbackInner = (err, response) => {
      if (response && response.success) {
        this.setCurrent(response.user);
        callback(err, response);
      } else {
        console.log(err);
      }
    };

    createRequest({
      url: this.URL + '/register',
      method: 'POST',
      data,
      callback: callbackInner,
    })
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    const callbackInner = (err, response) => {
      if (response && response.success) {
        this.unsetCurrent();
        callback();
      } else {
        console.log(err);
      }
    };

    createRequest({
      url: this.URL + '/logout',
      method: 'POST',
      callback: callbackInner,
    })
  }
}
