/*
demo12.js
This is a simple demo.
*/

// This function should convert array into object full of features:
var cp2ftr = function(cp_a) {
  var features_o     = {}
  features_o.pctlag1 = pctlagn(1,cp_a)
  features_o.pctlag2 = pctlagn(2,cp_a)
  features_o.pctlag4 = pctlagn(4,cp_a)
  features_o.pctlag8 = pctlagn(8,cp_a)
  return features_o
}

// This function should convert array into array of labels:
var cp2label  = function(bndry,cp_a) {
  var pctlead = pctlead1(cp_a)
  var labels  = pctlead.map(function(x){if (x<bndry) return 0; else return 1})
  return labels
}

// This function should create training data from features, labels:
var cr_train_o = function(train_start,train_end,features_o,labels) {
  var train_o = {}
  // I should get inside features_o and slice each feature
  features_o
  for (ky in features_o) {
    train_o[ky] = features_o[ky].slice(train_start,train_end)
  }
  train_o.label = labels.slice(train_start,train_end)
  return train_o
}
// I should create a callback for d3.csv():
var cb1 = function(err, csv_a) {
  if (err) throw err
  // Yahoo gives the data by date descending.
  // I should order it    by date ascending.
  csv_a.reverse()
  var cp_a = csv_a.map(function(row){return +row['Close']})
  // I should define boundries of out-of-sample, train data
  var train_end   = csv_a.length - 253  // 1 yr ago
  var train_size  = 252*20              // 20 yrs
  var train_start = train_end - train_size
  // I should ensure train data and out-of-sample data do not mix:
  var oos_start = train_end +    1
  var oos_end   = csv_a.length - 1
  var oos_size  = oos_end - oos_start
  var pctlead = pctlead1(cp_a)
  var pctlead_train = pctlead.slice(train_start,train_end)
  // Now that I know pctlead_train, I can calc train_median
  var train_median = d3.median(pctlead_train)
  var features_o   = cp2ftr(cp_a)
  var labels       = cp2label(train_median,cp_a)
  var train_o      = cr_train_o(train_start,train_end,features_o,labels);
  'cb1 done'
}

d3.csv("/csv/GSPC.csv", cb1)

'bye'
