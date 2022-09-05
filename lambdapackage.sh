echo Starting package
echo Removing old package directory

rm -rf ./package
rm -f ./dbl-update-calendar-json.zip
mkdir ./package
cp -R ./dist/** ./package
cp package.json ./package
cd ./package

#skip the dev dependencies 
yarn install --production=true

zip -rq dbl-update-calendar-json.zip .

mv dbl-update-calendar-json.zip ..
cd ..
