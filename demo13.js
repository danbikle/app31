/* demo13.js

This script should help me run a MagicNet model I created.
*/

'hello'

// This function should return array which lags my_a by n.
function lagn(n,my_a) {
  // I should get first n members:
  var front_a = my_a.slice(0,n)
  // I should remove last n members:
  var back_a = my_a.slice(0,my_a.length-n) 
  var lagn_a = front_a.concat(back_a)
  return lagn_a
}
// This function should return array full of percentages built from lagn_a:
function pctlagn(n,my_a) {
  var pctlagn_a = []
  var lagn_a    = lagn(n,my_a)
  for (i=0; i<my_a.length;i++) {
    pctlagn_a.push(100.0*(my_a[i]-lagn_a[i])/lagn_a[i])
  }
  return pctlagn_a
}
// This function should return array which leads my_a by 1:
function lead1(my_a){
  return my_a.slice(1).concat(my_a[my_a.length-1])
}
// This function should transform array into array of pctleads:
function pctlead1(my_a){
  var pctlead_a = []
  var lead_a    = lead1(my_a)
  for (i=0; i<my_a.length;i++){
    pctlead_a.push(100.0*(lead_a[i]-my_a[i])/my_a[i])
  }
  return pctlead_a
}
// This function should convert array into object full of features:
function cp2ftr(cp_a){
  var features_o     = {}
  features_o.pctlag1 = pctlagn(1,cp_a)
  features_o.pctlag2 = pctlagn(2,cp_a)
  features_o.pctlag4 = pctlagn(4,cp_a)
  features_o.pctlag8 = pctlagn(8,cp_a)
  return features_o
}
// This function should convert array into array of labels:
function cp2label(bndry,cp_a){
  var pctlead  = pctlead1(cp_a)
  var labels_a = pctlead.map(function(x){if (x<bndry) return 0; else return 1})
  return labels_a
}
function calc_results(predictions_a,labels_oos_a,pctlead_oos_a){
  // I should fill confusion matrix.
  var chk = (predictions_a.length == labels_oos_a.length) 
  //  chk should be true
  var truepos = 0; falsepos = 0; trueneg = 0; falseneg = 0;
  for (i=0;i<oos_size;i++){
    if ((predictions_a[i] == 1) && (labels_oos_a[i] == 1))
      truepos += 1;
    if ((predictions_a[i] == 1) && (labels_oos_a[i] == 0))
      falsepos += 1;
    if ((predictions_a[i] == 0) && (labels_oos_a[i] == 0))
      trueneg += 1;
    if ((predictions_a[i] == 0) && (labels_oos_a[i] == 1))
      falseneg += 1;
  }
  // should be true:
  chk = ((truepos+trueneg+falsepos+falseneg) == oos_size)
  var pos_accuracy = 100.0 * truepos / (truepos + falsepos)
  var neg_accuracy = 100.0 * trueneg / (trueneg + falseneg)
  var     accuracy = 100.0 * (truepos + trueneg) / oos_size
  // I should study pctlead dependence on predictions_a
  var trueg_a = []; falseg_a = [];
  for (i=0;i<oos_size;i++){
    if (predictions_a[i] == 1)
      trueg_a.push(pctlead_oos_a[i])
    else
      falseg_a.push(pctlead_oos_a[i])
  }
  chk = ((trueg_a.length + falseg_a.length) == oos_size) // should be true
  var true_avg  = d3.mean(trueg_a)
  var false_avg = d3.mean(falseg_a)
  chk = (true_avg > false_avg) // should be true
  var results_o          = {}
  results_o.truepos      = truepos
  results_o.falsepos     = falsepos
  results_o.trueneg      = trueneg
  results_o.falseneg     = falseneg
  results_o.pos_accuracy = pos_accuracy
  results_o.neg_accuracy = neg_accuracy
  results_o.accuracy     = accuracy
  results_o.true_avg     = true_avg
  results_o.false_avg    = false_avg
  if (true_avg > false_avg)
    results_o.opinion    = 'good'
  else
    results_o.opinion    = 'bad'
  return results_o
}
// This function should help me display results_o
function vwr(results_o){
  var tr  = '<tr>'
  var td  = '<td>'
  var tdc = '</td>'
  var trc = '</tr>'
  var cell00 = 'Opinion'; cell01 = results_o.opinion
  var row0   = tr+td+cell00+tdc+td+cell01+tdc+trc
  var rows   = row0
  d3.select('#myresults .results_o').html(rows)

}
// This function should return array full of predictions:
function mn_predict(mymn, oos_o){
  // I should start work on obsv_v which is a volume of observations
  var fnum = 0; oos_size = 0
  // I need to know obsv_v size before I create it.
  // I need to know size of oos data:
  for (ky in oos_o){fnum +=1; oos_size = oos_o[ky].length}
  // I know its size now: fnum
  var predictions_a = []
  // Each observation should get a vol:
  for (i=0;i<oos_size;i++){
    var obsv_v = new convnetjs.Vol(1,1,fnum)
    var widx = 0
    // I should match each vol to some features
    for (ky in oos_o){
      obsv_v.w[widx] = oos_o[ky][i]
      widx += 1
    }
    predictions_a.push(mymn.predict(obsv_v))
  }
  return  predictions_a
}
// This function should return a subset of data from features_o:
function cr_oos_o(oos_start,oos_end,features_o){
  oos_o = {}
  for (ky in features_o){
    oos_o[ky] = features_o[ky].slice(oos_start,oos_end)
  }
  return oos_o
}

// I should get prices I want to predict:
d3.csv("/csv/GSPC.csv", cb2);

function cb2(error, csv_a){
  if (error) throw error
  // Yahoo gives the data by date descending.
  // I should order it    by date ascending.
  csv_a.reverse()
  var cp_a = csv_a.map(function(row){return +row['Close']})
  // I should define boundries of out-of-sample, train data:
  var train_end   = csv_a.length - 253  // 1 yr ago
  var train_size  = 252*20              // 20 yrs
  var train_start = train_end - train_size
  // I should ensure train data and out-of-sample data do not mix:
  var oos_start       = train_end +    1
  var oos_end         = csv_a.length - 1
  var oos_size        = oos_end - oos_start
  var pctlead_a       = pctlead1(cp_a)
  var pctlead_train_a = pctlead_a.slice(train_start,train_end)
  // Now that I know pctlead_train_a, I can calculate train_median
  var train_median  = d3.median(pctlead_train_a)
  var features_o    = cp2ftr(cp_a)
  // I should get out-of-sample data ready:
  var oos_o         = cr_oos_o(oos_start,oos_end,features_o)
  // I should see a MN object I got from JSON:
  var mymn          = new convnetjs.MagicNet();
  // mymn should be able to predict:
  mymn.fromJSON(magicNet11json);
  // I should predict oos_o using mymn:
  var predictions_a = mn_predict(mymn, oos_o)
  // I should compare predictions_a to both labels_oos_a and pctlead_oos_a
  var labels_a      = cp2label(train_median,cp_a)
  var labels_oos_a  = labels_a.slice(oos_start,oos_end)
  var pctlead_oos_a = pctlead_a.slice(oos_start,oos_end)
  var results_o     = calc_results(predictions_a,labels_oos_a,pctlead_oos_a)

  // I should see results_o:
  vwr(results_o)
  
  // I should show the JSON I use to build mymn:
  d3.select('#json1').html('var magicNet11json = '+JSON.stringify(magicNet11json))
  'end cb2'
}

'bye'
