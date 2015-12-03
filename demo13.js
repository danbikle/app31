// demo13.js

// I should get prices I want to predict:
d3.csv("/csv/GSPC.csv", cb2);

// This function should make predictions and return results.
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
}

