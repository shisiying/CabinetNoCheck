# CabinetNoCheck
[CabinetNoCheck](https://github.com/shisiying/CabinetNoCheck)
柜号快查--一个方便查询快递在收发室对应货柜号的小程序

![](https://github.com/shisiying/CabinetNoCheck/blob/master/index.png)

![](https://github.com/shisiying/CabinetNoCheck/blob/master/detail.png)

# 功能模块
![](https://github.com/shisiying/CabinetNoCheck/blob/master/ming.png)
- 模拟登陆集团api，拿到加密的数据并进行解析
- 搭建后端服务，根据名字查询具体的货柜号
- 使用小程序搭建交互页面
- 限制一天只能查三次，分享可以获得查询一次

# 技术

- flask-rest搭建后端服务
- selnium+chromedriver headless搭建爬虫爬取数据
- 微信小程序显示界面
- 使用redis存储数据
