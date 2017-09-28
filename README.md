##README

直接安装即可用。

```
sr install sp-es6
```

### 已包含插件

```
babel-preset-env
```

默认配置
```
{
  "presets":[
    ["env", { "targets": {"browsers": ["last 2 versions"]}}]
  ]
}
```

### 可选配置：

```
silky-plugin: {
  "sp-es6":{
    ..... #参考 https://babeljs.io/docs/usage/api/#options
  }
}
```

常见配置：

```
      "plugins": ["transform-es2015-modules-amd"],
      "sourceMaps":"inline"
```
