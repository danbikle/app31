#!/bin/bash

# ~/app31/ngetGSPC.bash

# This script should use NodeJS to get GSPC prices from Yahoo.

. ~/app31/app31env.bash

cd ~/app31/

node ngetGSPC.js

# I should see new GSPC prices in ~/app31/csv/GSPC.csv

exit

