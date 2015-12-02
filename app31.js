/* app31.js

This script should help me run MagicNet from app31 repository.

*/

var lagn = function(n,my_a) {
  // This function should return array which lags my_a by n.
  // I should get first n members:
  var front_a = my_a.slice(0,n)
  // I should remove last n members:
  var back_a = my_a.slice(0,my_a.length-n) 
  var lagn_a = front_a.concat(back_a)
  return lagn_a
}
var lead1 = function(my_a) {
  // This function should return array which leads my_a by 1.
  return my_a.slice(1).concat(my_a[my_a.length-1])
}
var pctlagn = function(n,my_a) {
  var pctlagn_a = []
  var lagn_a    = lagn(n,my_a)
  for (i=0; i<my_a.length;i++) {
    pctlagn_a.push(100.0*(my_a[i]-lagn_a[i])/lagn_a[i])
  }
  return pctlagn_a
}
var pctlead1 = function(my_a) {
  var pctlead_a = []
  var lead_a    = lead1(my_a)
  for (i=0; i<my_a.length;i++) {
    pctlead_a.push(100.0*(lead_a[i]-my_a[i])/my_a[i])
  }
  return pctlead_a
}
