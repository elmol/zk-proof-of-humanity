#!bin/bash
cd ../widget
yarn version patch
cd -
yarn build:widget
timestamp=$(date +%s)
rm -f ../widget/package-*
mv ../widget/package.tgz ../widget/package-$timestamp.tgz
yarn remove zkpoh-button
yarn add ../widget/package-$timestamp.tgz
