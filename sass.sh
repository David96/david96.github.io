#!/bin/sh
while true; do
inotifywait -e modify style.scss
sassc style.scss style.css -t compressed
done;
