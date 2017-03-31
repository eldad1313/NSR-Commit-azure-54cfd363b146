./init.sh

echo
echo "Build Winner PPC"
echo

npm run build -- --base-href=/static/dist/
npm run build-css-path

