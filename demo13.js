/* demo13.js

This script should help me run a MagicNet model I created.
*/

'hello'

// I should see a MN object I got from JSON:
magicNet11json

// I should get prices I want to predict:
d3.csv("/csv/GSPC.csv", cb2);

function cb2(error, csv_a) {
  if (error) throw error
  // I should see some prices:
  csv_a
  'end cb2'
}

'bye'
