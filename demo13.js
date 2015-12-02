/* demo13.js

This script should help me run a MagicNet model I created.
*/

'hello'

// This function should return array which leads my_a by 1:
function lead1(my_a) {
  return my_a.slice(1).concat(my_a[my_a.length-1])
}
// This function should transform array into array of pctleads:
function pctlead1(my_a) {
  var pctlead_a = []
  var lead_a    = lead1(my_a)
  for (i=0; i<my_a.length;i++) {
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
function cp2label(bndry,cp_a) {
  var pctlead  = pctlead1(cp_a)
  var labels_a = pctlead.map(function(x){if (x<bndry) return 0; else return 1})
  return labels_a
}


// I should see a MN object I got from JSON:
magicNet11json

// I should get prices I want to predict:
d3.csv("/csv/GSPC.csv", cb2);

function cb2(error, csv_a) {
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
  var train_median = d3.median(pctlead_train_a)
  var features_o   = cp2ftr(cp_a)
  var labels_a     = cp2label(train_median,cp_a)

  'end cb2'
}

'bye'
