import axios from '../axios-mvps';

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

export const makeId = length => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

export const storeMvps = (mvps, isPremium) => {
  if (isPremium) {
    //store at db
  } else {
    localStorage.setItem("mvps", JSON.stringify(mvps));
  }
};
