import AsyncStorage from '@react-native-async-storage/async-storage';

//export const SIGNUP = 'SIGNUP';
//export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
      dispatch(setLogoutTimer(expiryTime));
      dispatch({  type: AUTHENTICATE, userId: userId, token: token });
    }; 
};

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBZZKet713TNeRVNDMNfJZPjQERrz8YF_U',
            {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json' 
               },
               body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
               })
            }
         );
         if (!response.ok) {
            const errorResData = await response.json();
            //console.log(errorResData);

            const errorId = errorResData.error.message;
            let message = 'Something wen wrong';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already';
            } 
              throw new Error(message); 
       }
        
         const resData = await  response.json();
         //console.log(resData);
         //dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
         dispatch(authenticate(
           resData.localId, 
           resData.idToken, 
           parseInt(resData.expiresIn) * 1000
           )
          );
         const expirationDate = new Date(
           new Date().getTime() + parseInt(resData.expiresIn) * 1000
          );
         saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};


export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBZZKet713TNeRVNDMNfJZPjQERrz8YF_U',
            {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json' 
               },
               body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
               })
            }
         );
         if (!response.ok) {
              const errorResData = await response.json();
              const errorId = errorResData.error.message;
              let message = 'Something wen wrong';

              if (errorId === 'EMAIL_NOT_FOUND') {
                  message = 'This email could not be found';
              } else if (errorId === 'INVALID_PASSWORD') {
                  message = 'Invalid password';
              }
                throw new Error(message); 
         }
        
         const resData = await  response.json();
         //console.log(resData);
         //dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
         dispatch(
            authenticate(
              resData.localId, 
              resData.idToken, 
              parseInt(resData.expiresIn) * 1000
            )
          );
         const expirationDate = new Date(
           new Date().getTime() + parseInt(resData.expiresIn) * 1000
           );
         saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return  { type: LOGOUT };
};

const setLogoutTimer = expirationTime => {
  return dispatch  => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime); /// 1000
  };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const saveDataToStorage = (token, userId, expirationDate) => {
      AsyncStorage.setItem(
        'userData', 
        JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString()
      })
      );
};