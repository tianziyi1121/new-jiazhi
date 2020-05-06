const app = getApp()
const api = require('../../../utils/api.js')
const common = require('../../../utils/common.js')
const toolTip = require('../../../utils/toolTip.js')
Page({
  data: {
    height: '',
    url: '',
    currentData: {},
    currentList: [],
    p: 1,
    flag: true,
    loadingFlag: true,
    topFlag: true,
    id: '',
    num: 0,
    index: null,
    indexs: null,
  },
  onLoad: function (options) {
    this.data.id = options.id
    this.load = this.selectComponent("#load")
    this.videoContextPrev = wx.createVideoContext('video')
    this.setData({
      height: common.windowHeight()
    })
    this.getData()
  },
  // video data
  getData() {
    api.requestServerData("/api/video/content", "get", {
      id: this.data.id,
      p: this.data.p
    }, this.data.flag).then((res) => {
      let data = res.data.data
      if(res.data.status == 1){
        if(this.data.p == 1){
          this.data.num < 10 ? this.load.change() : ''
          this.setData({
            currentData: data.info,
            ['currentList[0]']: data.list_recommend
          })
          this.videoContextPrev.play()
        }else{
          let pn = this.data.p - 1
          this.setData({
            ['currentList['+ pn +']']: data.list_recommend
          })
        }
      }
      this.domHeight()
      this.data.listFag = true
      this.data.num = data.list_recommend.length
      if (this.data.topFlag) {
        app.postpone()
        this.data.topFlag = false
      }
    })
  },
  lower() {
    if (this.data.listFag){
      this.data.listFag = false
    }else{
      return false
    }
    let flag = true
    if (this.data.num < 10) {
      this.load.change();
      flag = false
    }
    this.data.flag = false
    setTimeout(() => {
      this.setData({
        loadingFlag: false
      })
    }, 100)
    
    if (flag) {
      this.data.p += 1
      this.getData()
    }
  },
  // bind on the data list
  bindList(e){
    let data = e.currentTarget.dataset
    if (this.data.indexs !== data.indexs || this.data.index !== data.index){
      this.videoContextPrev.pause()
      this.data.index = data.index
      this.data.indexs = data.indexs
      this.setData({
        id: this.data.currentList[data.index][data.indexs].id,
        currentData: this.data.currentList[data.index][data.indexs]
      })
      // this.videoContextPrev.play()
    }
  },
  // 视频
  videoErrorCallback: function (e) {},
  domHeight() {
    let query = wx.createSelectorQuery()
    query.select('.viewList').boundingClientRect(rect => {
      this.setData({
        domHeight: rect.height * 2
      })
    }).exec()
    
  }
})