//jshint esversion:8
/* global console , $ , document */
/*  eslint-disable no-console */
const axios=require("axios");
const Noty=require("noty");
console.log("Good");
var buttons = document.getElementsByClassName("Add");
var b=document.getElementsByClassName("editable");
console.log(buttons);
function ok(x){
  axios.post('/update-cart',x).then(res => {
     console.log(res);
  });
  new Noty({
    type:"success",
    text:"Hello"
  }).show();
}
buttons.forEach((btn)=>{
  console.log("Good");
  btn.addEventListener('click',(e) => {
    let x="btn.innerHTML";
     ok(x);
  });
});
