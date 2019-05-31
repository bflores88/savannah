// ACTION DEFINTION
export const LOAD_ITEMS = 'LOAD_ITEMS';

export const GRAB_ITEM_IMAGE = 'GRAB_ITEM_IMAGE';
export const LOAD_SPECIFIC_ITEM = 'LOAD_SPECIFIC_ITEM';

export const GRAB_ITEM_IMAGES = 'GRAB_ITEM_IMAGE';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// ACTION CREATOR
export const loadItems = () => {
  return (dispatch) => {
    return fetch('/api/items')
      .then((response) => {
        return response.json();
      })
      .then((items) => {
        console.log(items);
        return dispatch({
          type: LOAD_ITEMS,
          payload: items,
        });
      })
      .catch((err) => console.log('Cant access website' + err));
  };
};

export const loadSpecificItem = (id) => {
  return (dispatch) => {
    return fetch(`/api/items/${id}`)
      .then((response) => {
        console.log('1231231231231232', response);
        return response.json();
      })
      .then((item) => {
        return dispatch({
          type: LOAD_SPECIFIC_ITEM,
          payload: item,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const grabItemImages = () => {
  return (dispatch) => {
    return fetch(`/api/images/items`)
      .then((response) => {
        return response.json();
      })
      .then((items) => {
        console.log(items);
        return dispatch({
          type: GRAB_ITEM_IMAGES,
          payload: items,
        });
      })
      .catch((err) => console.log('Cant access website' + err));
  };
};

export const login = (credentials) => {
  return (dispatch) => {
    // console.log('Actions login()');
    return fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        // console.log('http response ', response);
        if (response.status === 401) {
          return null;
        } else {
          return response.json();
        }
      })
      .then((user) => {
        // console.log('Actions login() user', user);
        let userJSON = JSON.stringify(user);
        // console.log('USERJSON', userJSON);
        let userObj = {
          username: user.username,
          id: user.id,
          active: user.active,
          role_id: user.role_id,
          theme_id: user.theme_id,
          name: user.name,
          profileImageUrl: user.profileImageUrl,
          email: user.email,
        };
        console.log('USEROBJ', userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        return dispatch({
          type: LOGIN,
          payload: userObj,
        });
      })
      .catch((error) => {
        console.log('Error in login: ', error);
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    // console.log('Actions logout()');
    return fetch('/api/auth/logout', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        // console.log('http response ', response);
        return response.json();
      })
      .then((body) => {
        // console.log('Actions login() user', user);
        localStorage.removeItem('user');
        return dispatch({
          type: LOGOUT,
          payload: body,
        });
      })
      .catch((error) => {
        console.log('Error in logout: ', error);
      });
  };
};
