/* demo11.js

This script should help me run MagicNet from demo11.html and perhaps other files.

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
// I should use cpasc_a to store dates,prices,pct-deltas
var cpasc_a  = []
d3.csv("/csv/GSPC.csv", function(error, csv_a) {
  if (error) throw error
  // Yahoo gives the data by date descending.
  // I should order it    by date ascending.
  csv_a.reverse()
  // I should use two integers to specify my training data:
  var train_end   = csv_a.length - 252  // 1 yr ago
  var train_size  = 252*30              // 30 yrs
  var train_start = train_end - train_size
  // I should ensure train data and out-of-sample data do not mix:
  var oos_start = train_end +    1
  var oos_end   = csv_a.length - 1
  var oos_size  = oos_end - oos_start

  // I should get array of closing prices:
  var cp_a = csv_a.map(function(row){return +row['Close']})
  // I should create some features from prices
  var pctlag1 = pctlagn(1,cp_a)
  var pctlag2 = pctlagn(2,cp_a)
  var pctlag4 = pctlagn(4,cp_a)
  var pctlag8 = pctlagn(8,cp_a)
  var fnum    = 4 // Above, I see 4 features now
  // I get my labels from pctlead later
  var pctlead = pctlead1(cp_a)

  // I should separate the training data from out-of-sample data.
  // Arbitrarily I set the boundry between the two at 1 year ago which is 252 observations.
  var pctlag1train  = pctlag1.slice(train_start,train_end)
  var pctlag2train  = pctlag2.slice(train_start,train_end)
  var pctlag4train  = pctlag4.slice(train_start,train_end)
  var pctlag8train  = pctlag8.slice(train_start,train_end)
  var pctlead_train = pctlead.slice(train_start,train_end)

  // I should find the median of pctlead in my training data
  train_median = d3.median(pctlead_train)
  // I should create an array of 2 labels from train_median
  var labels = pctlead.map(function(x){if (x<train_median) return 0; else return 1})
  var labels_train = labels.slice(train_start,train_end)

  // I should get out-of-sample data ready for later.
  var pctlag1oos  = pctlag1.slice(oos_start,oos_end)
  var pctlag2oos  = pctlag2.slice(oos_start,oos_end)
  var pctlag4oos  = pctlag4.slice(oos_start,oos_end)
  var pctlag8oos  = pctlag8.slice(oos_start,oos_end)
  var pctlead_oos = pctlead.slice(oos_start,oos_end)
  var labels_oos  = labels.slice( oos_start,oos_end)

  var chk = (labels_oos.length == oos_size) // should be true

  // The MagicNet class performs fully-automatic prediction on your data. 

  // I should load magicNet from JSON
  var magicNet = new convnetjs.MagicNet();
  // I should get magicNet10json from json/magicNet10.json
  magicNet.fromJSON(magicNet10json);

  var putjson_here = d3.select('#json1')
  var mnjson_s = JSON.stringify(magicNet10json)
  putjson_here.html(mnjson_s)

  // I should predict out-of-sample data
  var predictions = []
  for (i=0;i<oos_size;i++){
    var tstv  = new convnetjs.Vol(1,1,fnum)
    tstv.w[0] = pctlag1oos[i]
    tstv.w[1] = pctlag2oos[i]
    tstv.w[2] = pctlag4oos[i]
    tstv.w[3] = pctlag8oos[i]
    predictions.push(magicNet.predict(tstv))
  }

  // I should see:
  predictions

  // I should fill confusion matrix
  chk = (predictions.length == labels_oos.length) // should be true
  var truepos = 0; falsepos = 0; trueneg = 0; falseneg = 0;

  for (i=0;i<oos_size;i++){
    if ((predictions[i] == 1) && (labels_oos[i] == 1))
      truepos += 1;

    if ((predictions[i] == 1) && (labels_oos[i] == 0))
      falsepos += 1;

    if ((predictions[i] == 0) && (labels_oos[i] == 0))
      trueneg += 1;

    if ((predictions[i] == 0) && (labels_oos[i] == 1))
      falseneg += 1;
  }
  // should be true:
  chk = ((truepos+trueneg+falsepos+falseneg) == oos_size)
  // I should see
  truepos
  falsepos
  trueneg
  falseneg
  var pos_accuracy = 100.0 * truepos / (truepos + falsepos)
  var neg_accuracy = 100.0 * trueneg / (trueneg + falseneg)
  var     accuracy = 100.0 * (truepos + trueneg) / oos_size

  // I should study pctlead dependence on predictions
  var trueg_a = []; falseg_a = [];
  for (i=0;i<oos_size;i++){
    if (predictions[i] == 1)
      trueg_a.push(pctlead_oos[i])
    else
      falseg_a.push(pctlead_oos[i])
  }
  chk = ((trueg_a.length + falseg_a.length) == oos_size) // should be true
  var true_avg  = d3.mean(trueg_a)
  var false_avg = d3.mean(falseg_a)
  chk = (true_avg > false_avg) // should be true
  'd3.csv done'
})
