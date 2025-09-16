#!/bin/bash

echo "开始构建项目..."
npm run build:prod

echo "复制index.html为404.html解决路由问题..."
cp dist/index.html dist/404.html

echo "构建完成！"