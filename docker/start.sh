#!/bin/bash
set -e

# /config.jsonがあるか確認をする

if [ ! -e /config.json ];then
    echo "config.jsonファイルが /config.json にマウントされていません"
    exit 1
fi

git clone https://github.com/KuronekoServer/kuronekobot.git
cp /config.json /kuronekobot/config.json
cd kuronekobot

# ここで起動
npm start