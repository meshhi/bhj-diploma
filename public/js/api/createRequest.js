/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

// здесь перечислены все возможные параметры для функции
// createRequest({
//   url: 'https://example.com', // адрес
//   data: { // произвольные данные, могут отсутствовать
//     email: 'ivan@poselok.ru',
//     password: 'odinodin'
//   },
//   method: 'GET', // метод запроса
//   /*
//     Функция, которая сработает после запроса.
//     Если в процессе запроса произойдёт ошибка, её объект
//     должен быть в параметре err.
//     Если в запросе есть данные, они должны быть переданы в response.
//   */
//   callback: (err, response) => {
//     console.log( 'Ошибка, если есть', err );
//     console.log( 'Данные, если нет ошибки', response );
//   }
// });

const createRequest = (options = {}) => {
  try{
    const url = options.url;
    const data = options.data;
    const method = options.method;
    const callback = options.callback;
  
    const xhr = new XMLHttpRequest();
    
    const loadHandler = () => {
      if (xhr.status === 200) {
        callback(null, xhr.response);
      } else {
        callback(xhr.response);
      };
    };

    if (method === 'GET') {
      if (data) {
        let params = '';
        let id = ''
        for (let key in data) {
          if (url === '/transaction') {
            params += key + '=' + encodeURIComponent(data[key]) + '&';
          }
          
          if (url === '/account') {
            id = data[key]
          }
        }

        if (url === '/transaction') {
          params = params.slice(0, params.length - 1);
          xhr.open(method, url + '?' + params, true);
        }

        if (url === '/account') {
          xhr.open(method, url + '/' + id, true);
        }
      } else {
        xhr.open(method, url, true);
      }

    } else {
      xhr.open(method, url, true);
    }
  
    xhr.addEventListener('load', loadHandler);
    xhr.responseType = 'json';
  
    if (method === 'GET') {
      xhr.send();
    } else if (method === 'DELETE') {
      if (url === '/transaction') {
        const formData = new FormData();
        formData.append('id', data);
        xhr.open(method, url, true);
        xhr.send(formData);
      }

      if (url === '/account') {
        const formData = new FormData();
        formData.append('id', data);
        xhr.open(method, url, true);
        xhr.send(formData);
      }
    } else {
      if (data) {
        const formData = new FormData();
        for (let key in data) {
          formData.append(key, data[key]);
        }
        xhr.send(formData);
      } else {
        xhr.send();
      }
    }
  } catch (error) {
    callback(error);
  }
};
