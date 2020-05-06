const app = getApp()
const api = require('../../utils/api.js')
const toolTip = require('../../utils/toolTip.js')
Page({
  data: {
    active: 1,// 菜单的样式
    currentList: [],// current data list
    num: 0,
    p: 1,// data paging
    loadingFlag: true,// loading the judgment
    flag: true
  },
  onLoad: function () {
    this.noData = this.selectComponent("#noData")
    this.getData()
  },
  // current data list
  getData(){
    api.requestServerData("/api/video/index", "get", {
      p: this.data.p,
      is_self: this.data.active
    }, this.data.flag).then((res) => {
      if(res.data.status == 1){
        let pn = this.data.p - 1
        this.data.currentList[pn] = []
        this.data.num = res.data.data.length
        this.data.num < 10 && this.data.p > 1 ? this.load.change() : (this.data.num < 10 && this.data.p === 1 ? this.data.loadingFlag = true : '')
        this.setData({
          ['currentList['+ pn +']']: res.data.data,
          loadingFlag: this.data.loadingFlag
        })
        
        this.noData.noDataTrue()
      }else{
        if(this.data.p > 1){
          this.data.num = 0
          this.noData.noDataTrue()
        }else{
          this.setData({
            currentList: []
          })
          this.noData.noData()
          this.setData({
            loadingFlag: true
          })
        }
      }
    })
  },
  // Pull on loading
  onReady() {
    this.load = this.selectComponent("#load")
  },
  onReachBottom() {
    let flag = true
    if (this.data.num < 10) {
      this.load.change();
      flag = false
    }
    setTimeout(() => {
      this.setData({
        loadingFlag: false
      })
    }, 100)
    if (flag) {
      this.data.flag = false
      this.data.p += 1
      this.getData()
    }
  },
  //  菜单
  bindTitle(e) {
    let active = e.currentTarget.dataset.active
    this.setData({
      active: active
    })
    this.data.p = 1
    this.data.currentList = []
    this.getData()
  },
  // 点击列表
  bindVideo(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'view/view?id='+ id
    })
  }
})