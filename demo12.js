/*
demo12.js
This is a simple demo,
but it takes a L O O O N G time to run.
*/

// I should get prices I want to learn from:
d3.csv("/csv/GSPC.csv", cb1)

// I should create a callback for d3.csv():
function cb1(err, csv_a) {
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
  // Now that I know pctlead_train, I can calculate train_median
  var train_median = d3.median(pctlead_train)
  var features_o   = cp2ftr(cp_a)
  var labels_a     = cp2label(train_median,cp_a)
  var train_o      = cr_train_o(train_start,train_end,features_o,labels_a);
  // I should use train_o to create and train a new magicNet
  cr_mn(train_o)
}

// This function should create training data from features, labels:
function cr_train_o(train_start,train_end,features_o,labels_a) {
  var train_o = {}
  // I should get inside features_o and slice each feature
  for (ky in features_o) {
    train_o[ky] = features_o[ky].slice(train_start,train_end)
  }
  // To train, I should get label too:
  train_o.label = labels_a.slice(train_start,train_end)
  return train_o
}

// This function should use train_o to create and train a new magicNet.
function cr_mn(train_o) {
  // The MagicNet class performs fully-automatic prediction on your data.
  // options struct:
  var opts = {} 
  /* what portion of data goes to train, 
  in train/validation fold splits. Here, 0.7 means 70% */
  opts.train_ratio = 0.7 
  // number of folds to evaluate per candidate:
  opts.num_folds = 4
  // number of candidates to evaluate in parallel:
  opts.num_candidates = 9
  // number of epochs to make through data per fold
  opts.num_epochs = 33
  /* how many nets to average in the end for prediction? 
  likely higher = better but slower: */
  opts.ensemble_size = 9
  // I should start work on obsv_v which is a volume of observations
  var fnum = -1
  // I need to know obsv_v size before I create it
  for (ky in train_o) {fnum +=1}
  // I know its size now.
  // I should create train_data which eventually should be array of vols I feed to MN:
  var train_data = []
  for(i =0;i<train_o[ky].length;i++){
    var widx   = 0
    var obsv_v = new convnetjs.Vol(1,1,fnum)
    // I should match a vol to a feature
    for (ky in train_o) {
      if (ky != 'label') {
        obsv_v.w[widx] = train_o[ky][i]
        widx += 1
      }
    }
    train_data.push(obsv_v)
  }

  var chk = (train_data.length == train_o.label.length) // should be true

  var magicNet = new convnetjs.MagicNet(train_data, train_o.label, opts)

  // On finish, I should call finishedBatch()
  magicNet.onFinishBatch(finishedBatch)
   
  /* start training MagicNet. 
  Every call trains all candidates in current batch on one example: */
  setInterval(function(){ magicNet.step() })
  function finishedBatch() {
    // Now that I am done, I should remove spinner:
    d3.select('#a_spinner').remove()
    mnjson = magicNet.toJSON()
    var mnjson_s = 'var magicNet11json = '+JSON.stringify(mnjson)
    var putjson_here = d3.select('#json1')
    putjson_here.html(mnjson_s)
  }
}

'end'
