(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-21321fb2"],{3786:function(e,t,n){"use strict";n.d(t,"e",function(){return o}),n.d(t,"b",function(){return r}),n.d(t,"h",function(){return s}),n.d(t,"j",function(){return u}),n.d(t,"f",function(){return c}),n.d(t,"i",function(){return l}),n.d(t,"c",function(){return i}),n.d(t,"g",function(){return d}),n.d(t,"k",function(){return p}),n.d(t,"d",function(){return f}),n.d(t,"a",function(){return g});var a=n("b775");function o(){return Object(a["a"])({url:"/auth/purchases",method:"get"})}function r(e){return Object(a["a"])({url:"/auth/purchases",method:"delete",data:e})}function s(e){return Object(a["a"])({url:"/auth/purchases",method:"post",data:e})}function u(e){return Object(a["a"])({url:"/auth/stop_purchases",method:"post",data:e})}function c(){return Object(a["a"])({url:"/auth/sales",method:"get"})}function l(e){return Object(a["a"])({url:"/auth/sale",method:"post",data:e})}function i(e){return Object(a["a"])({url:"/auth/sale",method:"delete",data:e})}function d(e){return Object(a["a"])({url:"/auth/trades",method:"get",params:e})}function p(e){return Object(a["a"])({url:"/auth/trade",method:"post",data:e})}function f(){return Object(a["a"])({url:"/auth/cooperation",method:"get"})}function g(e){return Object(a["a"])({url:"/auth/cooperation",method:"delete",data:{id:e}})}},"4d2d":function(e,t,n){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var o=n("85f2"),r=n.n(o);function s(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),r()(e,a.key,a)}}function u(e,t,n){return t&&s(e.prototype,t),n&&s(e,n),e}var c=n("b775");n.d(t,"a",function(){return l});var l=function(){function e(){a(this,e)}return u(e,null,[{key:"getProvinces",value:function(){return Object(c["a"])({url:"/config/provinces",method:"get"})}},{key:"getCities",value:function(e){return Object(c["a"])({url:"/config/cities?provinceCode=".concat(e),method:"get"})}},{key:"getAreas",value:function(e){return Object(c["a"])({url:"/config/areas?cityCode=".concat(e),method:"get"})}},{key:"getGsTypes",value:function(){return Object(c["a"])({url:"/config/gs_types",method:"get"})}},{key:"getTaxTypes",value:function(){return Object(c["a"])({url:"/config/tax_types",method:"get"})}},{key:"getTzTypes",value:function(){return Object(c["a"])({url:"/config/tz_types",method:"get"})}},{key:"getOperatingYears",value:function(){return Object(c["a"])({url:"/config/operating_years",method:"get"})}},{key:"getGsZiben",value:function(){return Object(c["a"])({url:"/config/gs_ziben",method:"get"})}},{key:"getSupportQQ",value:function(){return Object(c["a"])({url:"/config/support_qq",method:"get"})}}]),e}()},ab4d:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticStyle:{padding:"15px",width:"100%"}},[n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.list,border:""}},[n("el-table-column",{attrs:{prop:"gsType",label:"类型",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-select",{attrs:{placeholder:"请选择"},model:{value:t.row.gsType,callback:function(n){e.$set(t.row,"gsType",n)},expression:"scope.row.gsType"}},e._l(e.gsTypes,function(e){return n("el-option",{key:e.value,attrs:{label:e.name,value:e.value}})}),1)]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"gsOperatingYears",label:"年限",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-select",{attrs:{placeholder:"请选择"},model:{value:t.row.gsOperatingYears,callback:function(n){e.$set(t.row,"gsOperatingYears",n)},expression:"scope.row.gsOperatingYears"}},e._l(e.gsOperatingYears,function(e){return n("el-option",{key:e.value,attrs:{label:e.name,value:e.value}})}),1)]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"gsZiben",label:"资本",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-select",{attrs:{placeholder:"请选择"},model:{value:t.row.gsZiben,callback:function(n){e.$set(t.row,"gsZiben",n)},expression:"scope.row.gsZiben"}},e._l(e.gsZibens,function(e){return n("el-option",{key:e.value,attrs:{label:e.name,value:e.value}})}),1)]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"swType",label:"税务类型",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-select",{attrs:{placeholder:"请选择"},model:{value:t.row.swType,callback:function(n){e.$set(t.row,"swType",n)},expression:"scope.row.swType"}},e._l(e.swTypes,function(e){return n("el-option",{key:e.value,attrs:{label:e.name,value:e.value}})}),1)]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"phone",label:"电话",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-input",{model:{value:t.row.phone,callback:function(n){e.$set(t.row,"phone",n)},expression:"scope.row.phone"}})]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"showPhone",label:"显示电话",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-input",{model:{value:t.row.showPhone,callback:function(n){e.$set(t.row,"showPhone",n)},expression:"scope.row.showPhone"}})]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"note",label:"留言"}}),e._v(" "),n("el-table-column",{attrs:{prop:"status",label:"状态",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[0==t.row.status?n("el-tag",[e._v("未审核")]):e._e(),e._v(" "),1==t.row.status?n("el-tag",[e._v("发布中")]):e._e(),e._v(" "),2==t.row.status?n("el-tag",[e._v("已终止")]):e._e()]}}])}),e._v(" "),n("el-table-column",{attrs:{fixed:"right",label:"操作",width:"300"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-button",{attrs:{type:"warning",size:"small"},on:{click:function(n){return e.handleDel(t.row)}}},[e._v("删除")]),e._v(" "),n("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(n){return e.handlePublish(t.row)}}},[e._v("发布")]),e._v(" "),n("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(n){return e.handleStop(t.row)}}},[e._v("终止")])]}}])})],1)],1)},o=[],r=n("4d2d"),s=n("3786"),u={name:"PurchaseList",data:function(){return{provinces:[],cities:[],areas:[],citiesLoading:!1,areasLoading:!1,gsTypes:[],gsOperatingYears:[],gsZibens:[],swTypes:[],list:[{gsType:"",gsOperatingYears:"",gsZiben:"",swType:"",phone:"",note:"",status:"待审核",showPhone:""}],currentPage:1,limit:100}},mounted:function(){this.loadData()},methods:{loadData:function(){var e=this;r["a"].getProvinces().then(function(t){0===t.code?e.provinces=t.data:e.$message({message:"获取地区数据失败！code:".concat(t.code),type:"error"})}),r["a"].getGsTypes().then(function(t){0===t.code?e.gsTypes=t.data:e.$message({message:"获取公司类型数据失败！code:".concat(t.code),type:"error"})}),r["a"].getTaxTypes().then(function(t){0===t.code?e.swTypes=t.data:e.$message({message:"获取税务类型数据失败！code:".concat(t.code),type:"error"})}),r["a"].getOperatingYears().then(function(t){0===t.code?e.gsOperatingYears=t.data:e.$message({message:"获取经营年限数据失败！code:".concat(t.code),type:"error"})}),r["a"].getGsZiben().then(function(t){0===t.code?e.gsZibens=t.data:e.$message({message:"获取经营年限数据失败！code:".concat(t.code),type:"error"})}),Object(s["e"])().then(function(t){0===t.code?e.list=t.data:e.$message({message:t.message,type:"error"})})},handleDel:function(e){var t=this;Object(s["b"])({id:e.id}).then(function(n){0===n.code?(t.$message({message:"成功",type:"success"}),t.list=t.list.filter(function(t){return t.id!==e.id})):t.$message({message:n.message,type:"error"})})},handlePublish:function(e){var t=this;Object(s["h"])(e).then(function(n){0===n.code?(t.$message({message:"成功",type:"success"}),e.status=n.data):t.$message({message:n.message,type:"error"})})},handleStop:function(e){var t=this;Object(s["j"])(e).then(function(n){0===n.code?(t.$message({message:"成功",type:"success"}),e.status=n.data):t.$message({message:n.message,type:"error"})})}}},c=u,l=n("2877"),i=Object(l["a"])(c,a,o,!1,null,"04915d3a",null);t["default"]=i.exports}}]);