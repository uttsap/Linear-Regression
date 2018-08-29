#!/bin/bash

a=10
for i in */; do
  new=$(printf "%03d" "$a")
  mv -i -- "$i" "$new"
  let a=a+1
done
