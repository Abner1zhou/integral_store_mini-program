 # 微信小程序-积分商城


> 📚 **Welcomes to provide your valuable comments or suggestions by 'Issues' or my contact information**    
>> ✨ 欢迎通过”issues“或我的联系方式，为我提供宝贵意见   
>  
> 👨🏻‍💻 **Powered by Abner Zhou**   

## 目录
> - [安装](#install)
> - [介绍](#desc)
> - [版本](#versions)
> - [展示](#show)
> - [云开发环境配置](#cloud)

---


## 安装
```
git clone https://gitee.com/its_onion/integral_store_mini-program.git
```


## 介绍

公司要加大公司文化建设力度，所以想了这么一个方法：参加活动有积分，积分可以兑换礼品。所以我就做了这么一个小程序。

- 包含后台管理
- 已发布上线
- 前端采用原生小程序框架开发 
- 后端采用小程序云开发

### 待完成功能

- 活动签到
- 积分导入

## 版本
- v0.1.0 积分商城初步完成

  > 根据这段代码修改完成 https://github.com/Voyzz/Fruit-store-mp  
  >
  > 原来是一个水果商店的小程序，我在上面做的修改
  >
  > 目前已经完成了基本的积分兑换流程，但是积分需要后台手动维护。接下来会完成积分的导入。
  >
- v0.5.0 积分商城初步完成
  > 活动模块已经完成，可以发布活动、审批、加入活动
  >
  > 已经满足一期需求，后期计划把二维码签到做一下



## 展示


## 云开发环境配置

需要修改的配置文件：

app.js  :

```
    this.globalData = {
      cloudRoot : "7069-04113058/",  //你的云环境地址
      carts:[],  //购物车
      tmpNum: 0,
      tempFilePaths: "",
      admin:["Abner Zhou"],
      openId: null,
      appid: 'wx0dd8c5c9ebe90a78',   //你的appid
      mch_id: '1519277861',
      apikey: 'James487493259359826923695832443',
    }
```
### 数据库


|集合名称|字段名称|数据类型|描述|
|:--|:--|:--|:--|
|customer_inf|openid|String||
||balance|Int|积分余额|
||name|String|员工姓名|
||group|String|部门|
||phone|String|手机号|
|fruit-board||||
||detail|String|商品描述|
||fruitId|String|商品ID|
||imgUrl|String|商品图片|
||name| String |商品名称|
||onShow| Boolean |是否展示|
||price| String |商品价格|
||unit| String |单位|
|order_master||||
|| payTime |String|支付时间|
|| fruitList |Array|商品信息列表|
|| ||[{ "支付测试",1,"0.01"},...]|
|| total |String|总价格|
|| _openid |String|用户ID|
|| out_trade_no |String|订单号|
|| name |String|用户姓名|
|| phone |String|手机号码|
|| group |String|部门|
|| orderTime |String|订单生成时间|
|| orderSuccess | Boolean |订单生成成功|
|| finished | Boolean |已收货|
|| finishedTime |String|送达时间|
***

### 存储
![云存储](https://i.loli.net/2020/10/20/twg8r5DpknGbe4S.jpg)

>  imgSwiper中放首页滚动图片
> 
> fruitSwiper 中存放货物图片
>
> activity_images 存放活动相关图片


