
#!/usr/bin/env bash
# ---------------------------------------------------------------
# File          : install.sh
# Authors       : ccmywish <ccmywish@qq.com>
#                 aifuxi   <aifuxi.js@gmail.com>
# Created on    : <2021-01-06>
# Last modified : <2024-06-10>
#
# install:
#
#   This file installs nvm and change Node.JS source on your linux
#
# ----------
# Changelog:
#
# Note that, the '@user' represents the user id of Gitee
#
# ~> v0.1.0
# <2023-07-20> Gitee追踪的仓库被删除，暂时启用我们的备用仓库 by @ccmywish
# <2023-05-09> Check Git first and add CI on Gitee by @ccmywish
# <2023-05-01> Update nvm repo source by @ccmywish
# <2022-11-14> Update Node.JS mirror source by @aifuxi
# <2021-01-06> Create file by @ccmywish
# ---------------------------------------------------------------

# Exit on error
set -e

if ! [ $(command -v "git") ]; then
  echo "=> 请您首先安装Git"
  exit 127
fi

export NVM_DIR="$HOME/.nvm" && (
  echo "=> Git clone nvm"
  git clone https://gitee.com/RubyMetric/nvm-official "$NVM_DIR" # 备用仓库
  # git clone https://gitee.com/mirrors_nvm-sh/nvm "$NVM_DIR"  # Gitee提供的追踪上游仓库
  cd "$NVM_DIR"
  git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" $(git rev-list --tags --max-count=1)`
) && \. "$NVM_DIR/nvm.sh"


echo "=> 添加nvm环境变量(Bash,Zsh)"
echo -e "\n# nvm config" >> ~/.bashrc
echo -e "\n# nvm config" >> ~/.zshrc

echo "export NVM_DIR=\"\$HOME/.nvm\"" >> ~/.bashrc
echo "export NVM_DIR=\"\$HOME/.nvm\"" >> ~/.zshrc
echo "[ -s \"\$NVM_DIR/nvm.sh\" ] && \\. \"\$NVM_DIR/nvm.sh\" # This loads nvm"  >> ~/.bashrc
echo "[ -s \"\$NVM_DIR/nvm.sh\" ] && \\. \"\$NVM_DIR/nvm.sh\" # This loads nvm"  >> ~/.zshrc


echo "=> 使用淘宝镜像"
echo "export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node" >> ~/.bashrc
echo "export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node" >> ~/.zshrc

echo "=> 安装nvm-update,升级更新请使用该命令"
curl -fsSL https://gitee.com/RubyMetric/nvm-cn/raw/main/nvm-update.sh -o nvm-update.sh
chmod +x ./nvm-update.sh

if ! [ -v NVM_CN_IN_CI ];then
  sudo mv ./nvm-update.sh /usr/local/bin/nvm-update
fi

echo "=> 安装完成! 请重启终端生效"
echo "=> 推荐您使用 https://gitee.com/RubyMetric/chsrc 全平台多语言/OS/软件自动换源"
echo "=> chsrc set npm"
echo