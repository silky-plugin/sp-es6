'use strict';
const _url = require('url');
const _path = require('path');
const _fs = require('fs');
const _babel = require('babel-core');
//根据实际路径获取文件内容
const getCompileContent = (cli, realFilePath, data, options, cb)=>{
  if(!_fs.existsSync(realFilePath)){
    return cb(null, null)
  }
  let fileContent = _fs.readFileSync(realFilePath, {encoding: 'utf8'})
  try{
    var result = _babel.transform(fileContent, options);
    data.status = 200
    cb(null, result.code)
  }catch(e){
    cb(e)
  }
}

exports.registerPlugin = function(cli, options){
  if(options && options.presets && JSON.stringify(options.presets).indexOf("es")!=-1){
    console.log(`sp-es6已经升级，你的sp-es6配置不兼容，请更新。 浏览器兼容配置请参考 https://github.com/babel/babel-preset-env `.red)
  }
  let defOptions = {
      "presets":[
        ["env", { "targets": {"browsers": ["last 2 versions"]}}]
      ]
    }
  //继承
  if(options){
    Object.keys(options).forEach(function(key){
      defOptions[key] = options[key]
    })
  }

  cli.registerHook('route:didRequest', (req, data, content, cb)=>{
    //如果不需要编译
    if(!/\.js$/.test(req.path)){
      return cb(null, content)
    }
    let fakeFilePath = _path.join(cli.cwd(), req.path);
    //替换路径为less
    let realFilePath = fakeFilePath.replace(/(js)$/,'es6')
    getCompileContent(cli, realFilePath, data, defOptions, (error, compileContent)=>{
      if(error){return cb(error)};
      //交给下一个处理器
      if(compileContent){
        content = compileContent
      }
      cb(null, content)
    })
  })

  cli.registerHook('build:doCompile', (buildConfig, data, content, cb)=>{
    let inputFilePath = data.inputFilePath;
    if(!/(\.es6)$/.test(inputFilePath)){
      return cb(null, content)
    }

    getCompileContent(cli, inputFilePath, data, defOptions, (error, content)=>{
      if(error){return cb(error)};
      if(data.status == 200){
        data.outputFilePath = data.outputFilePath.replace(/(\.es6)$/, ".js");
        data.outputFileRelativePath = data.outputFileRelativePath.replace(/(\.es6)$/, ".js")
      }
      cb(null, content);
    })
  })
}