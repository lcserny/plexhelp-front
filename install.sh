#!/bin/bash

DEST_DIR="/usr/share/nginx/html/front"
REFRESH="y"

choose_dest_dir () {
    echo "Enter front destination directory or leave blank to use default:"
    echo "Default: $DEST_DIR"

    read USER_INPUT

    if test "$USER_INPUT" 
    then
        DEST_DIR="$USER_INPUT"
    fi
}

choose_dest_dir

refresh_modules () {
    echo "Do you want to refresh node modules install? Y/n"

    read USER_INPUT

    if test "$USER_INPUT" 
    then
        REFRESH="$USER_INPUT"
    fi

    if [ "$REFRESH" = "y" ] || [ "$REFRESH" = "Y" ]; then
        npm install
    fi
}

refresh_modules

echo ""
echo "Generating types from OpenAPI spec"
npm run specgen
if [ $? -ne 0 ]; then
  exit 1
fi

echo ""
echo "Building front for release"
ng build
if [ $? -ne 0 ]; then
  exit 1
fi

echo ""
echo "Cleaning current prod front"
rm -rf "$DEST_DIR/*"
if [ $? -ne 0 ]; then
  exit 1
fi

echo "Installing new front"
cp -R dist/front/* "$DEST_DIR"
if [ $? -ne 0 ]; then
  exit 1
fi

echo ""
echo "Done!"