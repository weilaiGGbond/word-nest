# 使用官方 Node.js 镜像
FROM node:18

# 设置工作目录
WORKDIR /app


# 复制项目文件
COPY . .

#暴露目录
VOLUME [ "/app/logs" ]

# 暴露端口
EXPOSE 8989

# 启动应用
CMD ["npm", "run", "start:prod"]
