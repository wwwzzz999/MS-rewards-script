// ==UserScript==
// @name         积分脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  任务积分，搜索积分脚本。页面随机延时，搜索关键词来源微博，抖音。
// @author       wwwzzz999
// @match        https://rewards.bing.com/
// @match        https://rewards.bing.com/?form=dash_2
// @match        https://microsoftedgewelcome.microsoft.com/*
// @match        https://cn.bing.com/*
// @match        https://www4.bing.com/*
// @match        https://www.microsoft.com/*
// @connect      tenapi.cn
// @icon         https:www.google.com/s2/favicons?sz=64&domain=bing.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// ==/UserScript==

var slist = [];
const querys = ["weibohot", "douyinhot"];
// const query= "weibohot";
// 初始化字典
function setDic(query) {
    if (query == 1) {
        GM_setValue('query', 0);
    } else {
        GM_setValue('query', 1);
    }
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "get",
            url: 'https://tenapi.cn/v2/' + querys[query],
            onload: function (res) {
                // console.log(res.response.data);
                let data = JSON.parse(res.response);
                // console.log(data.data.length);
                data = data.data;
                for (let i = 0; i < data.length; i++) {
                    slist.push(data[i].name);
                }
                GM_setValue("slist", slist);
                resolve();
            }
        });
    })

}




(async function () {
    'use strict';
    // const randomNumber = Math.floor(Math.random() * (10000 - 3000 + 1)) + 1000;
    const randomNumber = Math.floor(Math.random() * (4000 - 500 + 1)) + 500;
    // console.log(randomNumber);

    var snum = 0;
    // snum = localStorage.getItem('snum');
    snum = GM_getValue("snum", snum);
    snum = parseInt(snum, 10);
    const timestamp = new Date().getTime();

    //初始化数据
    // GM_deleteValue("slist");
    // var list = [];
    // GM_setValue('slist',list);
    // console.log(GM_getValue("slist"));
    let islist = GM_getValue('slist');
    // 判断字典
    if (islist == null || islist.length == 0) {
        let query = GM_getValue('query') == null ? 0 : 1;
        await setDic(query);
        console.log(slist);
    } else {
        slist = islist;
        console.log(slist.length);
        // console.log(slist.shift());
    }

    if (!isNaN(snum) && snum > 0) {
        setTimeout(function () {
            snum = snum - 1;
            // localStorage.setItem('snum',snum);
            GM_setValue("snum", snum);
            const url = "https://cn.bing.com/search?q=" + slist.shift(); // 目标网页的地址
            GM_setValue('slist', slist);
            window.open(url, "_self"); // 在当前页面中打    开目标网页
        }, randomNumber);


    }



    // 执行任务积分
    var list_ = GM_getValue("li_href");
    var list = [];
    let len_href = 0
    if (list_ != null) {
        list = list_;
        len_href = list.length;
        // console.log(list.pop());
        setTimeout(function () {
            window.open(list.pop(), "_self"); // 在当前页面中打    开目标网页
            GM_setValue('li_href', list);
        }, randomNumber);

    }


    // 创建一个按钮元素
    var div = document.createElement('div');
    var button = document.createElement('button');
    var button_ = document.createElement('button');
    var stopb = document.createElement('button');
    div.appendChild(button);
    div.appendChild(button_);
    div.appendChild(stopb);

    // 设置按钮文本
    button.innerHTML = "搜索脚本:" + snum;
    button_.innerHTML = '任务脚本' + len_href;
    stopb.innerHTML = "停止";

    // 添加 CSS 样式
    div.style.position = 'fixed';
    div.style.bottom = '20px';
    div.style.right = '20px';




    button.addEventListener('click', function () {
        const n = window.prompt('输入搜索次数:');
        var num = parseInt(n, 10);
        if (!isNaN(num) && num != 0) {
            const url = "https://cn.bing.com/search?q=" + slist.shift(); // 目标网页的地址
            GM_setValue('slist', slist);
            window.open(url, "_self"); // 在当前页面中打开目标网页
            // localStorage.setItem("snum",num-1);
            GM_setValue('snum', num - 1);
        }
    })

    // 任务积分
    button_.addEventListener('click', function () {
        //页面判断
        let cu_href = window.location.href;
        console.log(cu_href);
        if (cu_href != "https://rewards.bing.com/") {
            // window.alert("页面错误");
            if (confirm("是否跳转")) {
                window.open("https://rewards.bing.com/", "_self");
            }
        }
        // window.location.href = "https://rewards.bing.com/";
        // 获取链接
        let li_href = new Array();
        var items = document.getElementsByClassName('ds-card-sec');
        for (let i = 0; i < items.length; i++) {
            li_href.push(items[i].href);
        }

        setTimeout(function () {
            window.open(li_href.pop(), "_self");
            GM_setValue("li_href", li_href);
        }, randomNumber);

        // let newtab = window.open("https://www.baidu.com","_self")
    })


    stopb.addEventListener('click', function () {
        // localStorage.setItem('snum',0);
        snum = 0;
        GM_setValue("snum", snum);
        list = [];
        GM_setValue("li_href", list);
        window.alert("已经停止");
        // return;
    })




    // 将按钮添加到页面中
    document.body.appendChild(div);
})();
